'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QASection } from '@/components/qa-section';
import { PoetryList } from '@/components/poetry-card';
import { KnowledgeGraph } from '@/components/knowledge-graph';
import { MessageSquare, BookOpen, Network, Feather, Sparkles } from 'lucide-react';
import { works } from '@/data/poetry-data';

export default function Home() {
  const [activeTab, setActiveTab] = useState('qa');
  const [currentPoem, setCurrentPoem] = useState(0);

  // 轮播诗句
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPoem(prev => (prev + 1) % Math.min(works.length, 5));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const featuredPoems = works.slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航 */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Feather className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-serif font-medium text-foreground">
                古诗文问答系统
              </h1>
              <p className="text-xs text-muted-foreground">基于语义匹配</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            <Button
              variant={activeTab === 'qa' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('qa')}
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              智能问答
            </Button>
            <Button
              variant={activeTab === 'poems' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('poems')}
            >
              <BookOpen className="w-4 h-4 mr-1" />
              诗词浏览
            </Button>
            <Button
              variant={activeTab === 'graph' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('graph')}
            >
              <Network className="w-4 h-4 mr-1" />
              知识图谱
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero 区域 */}
      <section className="relative overflow-hidden bg-gradient-to-b from-muted/30 to-background">
        <div className="absolute inset-0 ink-wash" />
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            {/* 诗句展示 */}
            <div className="min-h-[120px] flex items-center justify-center">
              <div key={currentPoem} className="animate-fade-in">
                <p className="font-poetry text-xl md:text-2xl text-foreground leading-relaxed">
                  {featuredPoems[currentPoem].content[0]}
                </p>
                <p className="text-muted-foreground mt-2 text-sm">
                  —— {featuredPoems[currentPoem].author}《{featuredPoems[currentPoem].title}》
                </p>
              </div>
            </div>

            {/* 快捷入口 */}
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setActiveTab('qa')}
              >
                <Sparkles className="w-4 h-4" />
                开始问答
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setActiveTab('poems')}
              >
                <BookOpen className="w-4 h-4" />
                浏览诗词
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setActiveTab('graph')}
              >
                <Network className="w-4 h-4" />
                知识图谱
              </Button>
            </div>
          </div>
        </div>

        {/* 装饰元素 */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>
      </section>

      {/* 主内容区 */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="qa" className="mt-0">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-serif font-medium text-foreground mb-2">
                  语义匹配问答
                </h2>
                <p className="text-muted-foreground">
                  融合知识图谱与深度学习，精准理解您的问题
                </p>
              </div>
              <Card className="border-border/50 shadow-lg">
                <CardContent className="p-0">
                  <QASection />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="poems" className="mt-0">
            <div className="max-w-6xl mx-auto">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-serif font-medium text-foreground mb-2">
                  诗词典藏
                </h2>
                <p className="text-muted-foreground">
                  收录唐宋经典诗词，探索中华文学之美
                </p>
              </div>
              <PoetryList />
            </div>
          </TabsContent>

          <TabsContent value="graph" className="mt-0">
            <div className="max-w-6xl mx-auto">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-serif font-medium text-foreground mb-2">
                  知识图谱
                </h2>
                <p className="text-muted-foreground">
                  可视化呈现诗人、作品、意象、典故的关联网络
                </p>
              </div>
              <KnowledgeGraph />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* 功能特点 */}
      <section className="border-t border-border bg-muted/20 py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-xl font-serif text-center text-foreground mb-8">
            核心功能
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-card/50">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-medium text-foreground mb-2">语义匹配问答</h4>
                <p className="text-sm text-muted-foreground">
                  基于预训练语言模型，理解问题的深层语义，给出精准答案
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Network className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-medium text-foreground mb-2">知识图谱关联</h4>
                <p className="text-sm text-muted-foreground">
                  构建五元本体知识图谱，实现多维度知识关联与推理
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Feather className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-medium text-foreground mb-2">意象典故解读</h4>
                <p className="text-sm text-muted-foreground">
                  解析诗词中的意象内涵与典故渊源，深入理解作品
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="border-t border-border py-6 bg-card/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            基于语义匹配的古诗文问答系统 · 融合知识图谱与深度学习
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            数据来源：《全唐诗》《全宋词》
          </p>
        </div>
      </footer>

      {/* 移动端底部导航 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border z-50">
        <div className="flex justify-around py-2">
          <Button
            variant="ghost"
            size="sm"
            className={`flex-col gap-1 h-auto py-2 ${activeTab === 'qa' ? 'text-primary' : ''}`}
            onClick={() => setActiveTab('qa')}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs">问答</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex-col gap-1 h-auto py-2 ${activeTab === 'poems' ? 'text-primary' : ''}`}
            onClick={() => setActiveTab('poems')}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-xs">诗词</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex-col gap-1 h-auto py-2 ${activeTab === 'graph' ? 'text-primary' : ''}`}
            onClick={() => setActiveTab('graph')}
          >
            <Network className="w-5 h-5" />
            <span className="text-xs">图谱</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}
