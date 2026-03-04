'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, User, MapPin, Calendar } from 'lucide-react';
import type { Work, Poet } from '@/types';

interface PoetryCardProps {
  work: Work;
  poet?: Poet;
  onClick?: () => void;
}

export function PoetryCard({ work, poet, onClick }: PoetryCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow bg-card/80"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="font-serif text-lg text-foreground">
              《{work.title}》
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {work.author} · {work.dynasty}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="font-poetry text-foreground/90 leading-relaxed space-y-1">
          {work.content.slice(0, 4).map((line, i) => (
            <p key={i}>{line}</p>
          ))}
          {work.content.length > 4 && (
            <p className="text-muted-foreground text-sm">...</p>
          )}
        </div>
        <div className="flex flex-wrap gap-1 mt-3">
          {work.emotion?.slice(0, 2).map((e, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {e}
            </Badge>
          ))}
          {work.theme?.slice(0, 2).map((t, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {t}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function PoetryDetail({ work, poet }: { work: Work; poet?: Poet }) {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="font-serif text-2xl">《{work.title}》</CardTitle>
        <div className="flex items-center gap-4 text-muted-foreground text-sm">
          <span className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {work.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {work.dynasty}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 原文 */}
        <div className="font-poetry text-lg leading-loose text-foreground bg-muted/30 rounded-lg p-4">
          {work.content.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2">
          {work.theme && (
            <div>
              <span className="text-xs text-muted-foreground mr-1">题材:</span>
              {work.theme.map((t, i) => (
                <Badge key={i} variant="outline" className="mr-1">
                  {t}
                </Badge>
              ))}
            </div>
          )}
          {work.emotion && (
            <div>
              <span className="text-xs text-muted-foreground mr-1">情感:</span>
              {work.emotion.map((e, i) => (
                <Badge key={i} variant="secondary" className="mr-1">
                  {e}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* 意象 */}
        {work.imagery && work.imagery.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              意象
            </h4>
            <div className="flex flex-wrap gap-2">
              {work.imagery.map((img, i) => (
                <Badge key={i} variant="default" className="text-xs">
                  {img}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 赏析 */}
        {work.appreciation && (
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              赏析
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {work.appreciation}
            </p>
          </div>
        )}

        {/* 诗人信息 */}
        {poet && (
          <div className="border-t border-border pt-4 mt-4">
            <h4 className="text-sm font-medium text-foreground mb-2">
              关于作者
            </h4>
            <div className="text-sm text-muted-foreground space-y-1">
              {poet.years && <p>生卒年：{poet.years}</p>}
              {poet.courtesyName && <p>字：{poet.courtesyName}</p>}
              {poet.pseudonym && <p>号：{poet.pseudonym}</p>}
              {poet.style && <p>风格：{poet.style}</p>}
              {poet.achievements && <p>{poet.achievements}</p>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function PoetryList() {
  const [works, setWorks] = useState<Work[]>([]);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [poet, setPoet] = useState<Poet | undefined>();
  const [loading, setLoading] = useState(true);
  const [dynasty, setDynasty] = useState<string>('');

  useEffect(() => {
    fetch(`/api/poems${dynasty ? `?dynasty=${dynasty}` : ''}`)
      .then(res => res.json())
      .then(data => {
        setWorks(data.works || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [dynasty]);

  const handleSelectWork = async (work: Work) => {
    setSelectedWork(work);
    // 获取诗人详情
    try {
      const res = await fetch(`/api/poems?author=${work.author}`);
      const data = await res.json();
      setPoet(data.poet);
    } catch {
      setPoet(undefined);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="h-48 animate-pulse bg-muted" />
        ))}
      </div>
    );
  }

  if (selectedWork) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => setSelectedWork(null)}>
          ← 返回列表
        </Button>
        <PoetryDetail work={selectedWork} poet={poet} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs value={dynasty} onValueChange={setDynasty}>
        <TabsList>
          <TabsTrigger value="">全部</TabsTrigger>
          <TabsTrigger value="唐">唐诗</TabsTrigger>
          <TabsTrigger value="宋">宋词</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {works.map(work => (
          <PoetryCard
            key={work.id}
            work={work}
            onClick={() => handleSelectWork(work)}
          />
        ))}
      </div>
    </div>
  );
}
