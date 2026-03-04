'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { KGNode, KGEdge } from '@/types';

interface KnowledgeGraphProps {
  centerId?: string;
  height?: number;
}

export function KnowledgeGraph({ centerId, height = 500 }: KnowledgeGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<KGNode[]>([]);
  const [edges, setEdges] = useState<KGEdge[]>([]);
  const [hoveredNode, setHoveredNode] = useState<KGNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<KGNode | null>(null);
  const [loading, setLoading] = useState(true);

  // 节点位置（用于布局）
  const nodePositions = useRef<Map<string, { x: number; y: number; vx: number; vy: number }>>(new Map());

  useEffect(() => {
    const url = centerId ? `/api/knowledge-graph?center=${centerId}` : '/api/knowledge-graph';
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
        setLoading(false);

        // 初始化节点位置
        data.nodes?.forEach((node: KGNode, i: number) => {
          const angle = (2 * Math.PI * i) / data.nodes.length;
          const radius = 150;
          nodePositions.current.set(node.id, {
            x: Math.cos(angle) * radius + height / 2,
            y: Math.sin(angle) * radius + height / 2,
            vx: 0,
            vy: 0,
          });
        });
      })
      .catch(() => setLoading(false));
  }, [centerId, height]);

  // 简单力导向布局
  useEffect(() => {
    if (nodes.length === 0) return;

    const animate = () => {
      const positions = nodePositions.current;

      // 节点之间的斥力
      nodes.forEach(n1 => {
        nodes.forEach(n2 => {
          if (n1.id === n2.id) return;
          const p1 = positions.get(n1.id);
          const p2 = positions.get(n2.id);
          if (!p1 || !p2) return;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = 1000 / (dist * dist);

          p1.vx += (dx / dist) * force;
          p1.vy += (dy / dist) * force;
        });
      });

      // 边的引力
      edges.forEach(edge => {
        const p1 = positions.get(edge.source);
        const p2 = positions.get(edge.target);
        if (!p1 || !p2) return;

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (dist - 100) * 0.01;

        p1.vx += (dx / dist) * force;
        p1.vy += (dy / dist) * force;
        p2.vx -= (dx / dist) * force;
        p2.vy -= (dy / dist) * force;
      });

      // 向中心的引力
      positions.forEach(p => {
        p.vx += (height / 2 - p.x) * 0.001;
        p.vy += (height / 2 - p.y) * 0.001;
      });

      // 更新位置
      positions.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.9;
        p.vy *= 0.9;

        // 边界约束
        p.x = Math.max(50, Math.min(height - 50, p.x));
        p.y = Math.max(50, Math.min(height - 50, p.y));
      });
    };

    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, [nodes, edges, height]);

  // 绘制图形
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || nodes.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, height);

      const positions = nodePositions.current;

      // 绘制边
      edges.forEach(edge => {
        const p1 = positions.get(edge.source);
        const p2 = positions.get(edge.target);
        if (!p1 || !p2) return;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = 'rgba(var(--muted-foreground) / 0.3)';
        ctx.strokeStyle = '#d1d5db';
        ctx.lineWidth = 1;
        ctx.stroke();

        // 绘制关系标签
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        ctx.fillStyle = '#9ca3af';
        ctx.font = '10px sans-serif';
        ctx.fillText(edge.relation, midX, midY);
      });

      // 绘制节点
      nodes.forEach(node => {
        const pos = positions.get(node.id);
        if (!pos) return;

        const isHovered = hoveredNode?.id === node.id;
        const isSelected = selectedNode?.id === node.id;
        const radius = isHovered || isSelected ? 25 : 20;

        // 节点颜色
        const colors: Record<string, string> = {
          poet: '#b5495b',
          work: '#5d7a7b',
          imagery: '#8b6914',
          allusion: '#6b4423',
          dynasty: '#4a6d7c',
        };

        // 绘制节点圆
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = colors[node.type] || '#6b7280';
        ctx.fill();
        if (isHovered || isSelected) {
          ctx.strokeStyle = '#1f2937';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // 绘制标签
        ctx.fillStyle = '#ffffff';
        ctx.font = `${isHovered ? 'bold ' : ''}12px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label.slice(0, 4), pos.x, pos.y);
      });
    };

    draw();
  }, [nodes, edges, hoveredNode, selectedNode, height]);

  // 鼠标交互
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let found = false;
    nodes.forEach(node => {
      const pos = nodePositions.current.get(node.id);
      if (!pos) return;

      const dx = x - pos.x;
      const dy = y - pos.y;
      if (dx * dx + dy * dy < 400) {
        setHoveredNode(node);
        found = true;
        canvas.style.cursor = 'pointer';
      }
    });

    if (!found) {
      setHoveredNode(null);
      canvas.style.cursor = 'default';
    }
  };

  const handleClick = () => {
    if (hoveredNode) {
      setSelectedNode(hoveredNode);
    }
  };

  if (loading) {
    return (
      <div
        className="bg-muted/30 rounded-lg flex items-center justify-center"
        style={{ height }}
      >
        <p className="text-muted-foreground">加载知识图谱...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <canvas
          ref={canvasRef}
          className="w-full bg-muted/10 rounded-lg"
          style={{ height }}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
        />
      </div>
      <div>
        {selectedNode ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge
                  style={{
                    backgroundColor:
                      {
                        poet: '#b5495b',
                        work: '#5d7a7b',
                        imagery: '#8b6914',
                        allusion: '#6b4423',
                        dynasty: '#4a6d7c',
                      }[selectedNode.type] || '#6b7280',
                  }}
                >
                  {selectedNode.type}
                </Badge>
                {selectedNode.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {Object.entries(selectedNode.properties).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <span className="text-muted-foreground capitalize">{key}:</span>
                    <span className="text-foreground">
                      {Array.isArray(value) ? value.join(', ') : String(value)}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                className="w-full mt-4"
                size="sm"
                onClick={() => {
                  window.location.href = `/?center=${selectedNode.id}`;
                }}
              >
                以此节点为中心展开
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <p>点击节点查看详情</p>
              <p className="text-xs mt-2">节点颜色代表不同类型</p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                <Badge style={{ backgroundColor: '#b5495b' }}>诗人</Badge>
                <Badge style={{ backgroundColor: '#5d7a7b' }}>作品</Badge>
                <Badge style={{ backgroundColor: '#8b6914' }}>意象</Badge>
                <Badge style={{ backgroundColor: '#6b4423' }}>典故</Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
