import { NextRequest, NextResponse } from 'next/server';
import { getAllData } from '@/data/poetry-data';
import type { KGNode, KGEdge, KGVisualization } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const centerId = searchParams.get('center'); // 以某个实体为中心展开
    const depth = parseInt(searchParams.get('depth') || '2');

    const { poets, works, imageryList, allusions } = getAllData();

    const nodes: KGNode[] = [];
    const edges: KGEdge[] = [];

    if (centerId) {
      // 以指定实体为中心构建子图
      const subGraph = buildSubGraph(centerId, depth, poets, works, imageryList, allusions);
      return NextResponse.json(subGraph);
    }

    // 构建完整的知识图谱可视化数据
    // 添加诗人节点
    poets.forEach(poet => {
      nodes.push({
        id: `poet-${poet.id}`,
        label: poet.name,
        type: 'poet',
        properties: {
          dynasty: poet.dynasty,
          style: poet.style,
          pseudonym: poet.pseudonym
        }
      });
    });

    // 添加作品节点
    works.forEach(work => {
      nodes.push({
        id: `work-${work.id}`,
        label: work.title,
        type: 'work',
        properties: {
          author: work.author,
          dynasty: work.dynasty,
          emotion: work.emotion,
          theme: work.theme
        }
      });

      // 添加创作关系
      const poet = poets.find(p => p.name === work.author);
      if (poet) {
        edges.push({
          source: `poet-${poet.id}`,
          target: `work-${work.id}`,
          relation: '创作'
        });
      }
    });

    // 添加意象节点
    imageryList.forEach(imagery => {
      nodes.push({
        id: `imagery-${imagery.id}`,
        label: imagery.name,
        type: 'imagery',
        properties: {
          category: imagery.category,
          meaning: imagery.meaning,
          emotion: imagery.emotion
        }
      });

      // 添加作品-意象关系
      works.forEach(work => {
        if (work.imagery?.includes(imagery.name)) {
          edges.push({
            source: `work-${work.id}`,
            target: `imagery-${imagery.id}`,
            relation: '包含'
          });
        }
      });
    });

    // 添加典故节点
    allusions.forEach(allusion => {
      nodes.push({
        id: `allusion-${allusion.id}`,
        label: allusion.name,
        type: 'allusion',
        properties: {
          source: allusion.source,
          meaning: allusion.meaning
        }
      });

      // 添加作品-典故关系
      works.forEach(work => {
        if (work.allusions?.includes(allusion.name)) {
          edges.push({
            source: `work-${work.id}`,
            target: `allusion-${allusion.id}`,
            relation: '引用'
          });
        }
      });
    });

    // 添加朝代节点
    const dynasties = [...new Set(poets.map(p => p.dynasty))];
    dynasties.forEach((dynasty, index) => {
      nodes.push({
        id: `dynasty-${index}`,
        label: dynasty,
        type: 'dynasty',
        properties: {}
      });

      // 添加诗人-朝代关系
      poets.filter(p => p.dynasty === dynasty).forEach(poet => {
        edges.push({
          source: `poet-${poet.id}`,
          target: `dynasty-${index}`,
          relation: '属于'
        });
      });
    });

    const result: KGVisualization = { nodes, edges };
    return NextResponse.json(result);
  } catch (error) {
    console.error('Knowledge Graph API Error:', error);
    return NextResponse.json({ error: '获取知识图谱失败' }, { status: 500 });
  }
}

// 构建以某实体为中心的子图
function buildSubGraph(
  centerId: string,
  depth: number,
  poets: typeof import('@/data/poetry-data').poets,
  works: typeof import('@/data/poetry-data').works,
  imageryList: typeof import('@/data/poetry-data').imageryList,
  allusions: typeof import('@/data/poetry-data').allusions
): KGVisualization {
  const nodes: KGNode[] = [];
  const edges: KGEdge[] = [];
  const visitedNodes = new Set<string>();

  // 解析中心节点类型和ID
  const [type, id] = centerId.split('-');

  function addNode(node: KGNode) {
    if (!visitedNodes.has(node.id)) {
      visitedNodes.add(node.id);
      nodes.push(node);
    }
  }

  function addEdge(edge: KGEdge) {
    edges.push(edge);
  }

  // 根据中心节点类型构建子图
  if (type === 'poet') {
    const poet = poets.find(p => p.id === id);
    if (poet) {
      addNode({
        id: `poet-${poet.id}`,
        label: poet.name,
        type: 'poet',
        properties: { dynasty: poet.dynasty, style: poet.style }
      });

      // 添加该诗人的作品
      works.filter(w => w.author === poet.name).forEach(work => {
        addNode({
          id: `work-${work.id}`,
          label: work.title,
          type: 'work',
          properties: { emotion: work.emotion, theme: work.theme }
        });
        addEdge({
          source: `poet-${poet.id}`,
          target: `work-${work.id}`,
          relation: '创作'
        });

        // 添加作品关联的意象
        work.imagery?.forEach(imgName => {
          const img = imageryList.find(i => i.name === imgName);
          if (img) {
            addNode({
              id: `imagery-${img.id}`,
              label: img.name,
              type: 'imagery',
              properties: { meaning: img.meaning }
            });
            addEdge({
              source: `work-${work.id}`,
              target: `imagery-${img.id}`,
              relation: '包含'
            });
          }
        });
      });
    }
  } else if (type === 'work') {
    const work = works.find(w => w.id === id);
    if (work) {
      addNode({
        id: `work-${work.id}`,
        label: work.title,
        type: 'work',
        properties: { author: work.author, emotion: work.emotion }
      });

      // 添加作者
      const poet = poets.find(p => p.name === work.author);
      if (poet) {
        addNode({
          id: `poet-${poet.id}`,
          label: poet.name,
          type: 'poet',
          properties: { dynasty: poet.dynasty }
        });
        addEdge({
          source: `poet-${poet.id}`,
          target: `work-${work.id}`,
          relation: '创作'
        });
      }

      // 添加意象
      work.imagery?.forEach(imgName => {
        const img = imageryList.find(i => i.name === imgName);
        if (img) {
          addNode({
            id: `imagery-${img.id}`,
            label: img.name,
            type: 'imagery',
            properties: { meaning: img.meaning }
          });
          addEdge({
            source: `work-${work.id}`,
            target: `imagery-${img.id}`,
            relation: '包含'
          });
        }
      });

      // 添加典故
      work.allusions?.forEach(allName => {
        const all = allusions.find(a => a.name === allName);
        if (all) {
          addNode({
            id: `allusion-${all.id}`,
            label: all.name,
            type: 'allusion',
            properties: { meaning: all.meaning }
          });
          addEdge({
            source: `work-${work.id}`,
            target: `allusion-${all.id}`,
            relation: '引用'
          });
        }
      });
    }
  } else if (type === 'imagery') {
    const imagery = imageryList.find(i => i.id === id);
    if (imagery) {
      addNode({
        id: `imagery-${imagery.id}`,
        label: imagery.name,
        type: 'imagery',
        properties: { meaning: imagery.meaning, emotion: imagery.emotion }
      });

      // 添加包含该意象的作品
      works.filter(w => w.imagery?.includes(imagery.name)).forEach(work => {
        addNode({
          id: `work-${work.id}`,
          label: work.title,
          type: 'work',
          properties: { author: work.author }
        });
        addEdge({
          source: `work-${work.id}`,
          target: `imagery-${imagery.id}`,
          relation: '包含'
        });

        // 添加作者
        const poet = poets.find(p => p.name === work.author);
        if (poet && depth > 1) {
          addNode({
            id: `poet-${poet.id}`,
            label: poet.name,
            type: 'poet',
            properties: { dynasty: poet.dynasty }
          });
          addEdge({
            source: `poet-${poet.id}`,
            target: `work-${work.id}`,
            relation: '创作'
          });
        }
      });
    }
  }

  return { nodes, edges };
}
