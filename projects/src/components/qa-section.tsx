'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Sparkles, BookOpen, Feather, Pause, Play, Square, RotateCcw } from 'lucide-react';
import type { Work, Poet, Imagery } from '@/types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  question?: string; // 保存原始问题，用于重新生成
  relatedWorks?: Work[];
  relatedPoets?: Poet[];
  relatedImagery?: Imagery[];
  isPaused?: boolean;
  isComplete?: boolean;
}

// 简单的Markdown渲染
function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentParagraph: string[] = [];
  let listItems: string[] = [];
  let key = 0;

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      elements.push(
        <p key={key++} className="mb-3 last:mb-0 leading-relaxed break-words">
          {currentParagraph.join('')}
        </p>
      );
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key++} className="list-disc list-inside mb-3 space-y-1">
          {listItems.map((item, i) => (
            <li key={i} className="leading-relaxed break-words">{item}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.trim() === '') {
      flushParagraph();
      flushList();
      continue;
    }

    if (line.startsWith('### ')) {
      flushParagraph();
      flushList();
      elements.push(
        <h4 key={key++} className="font-medium text-foreground mt-4 mb-2 first:mt-0 break-words">
          {line.slice(4)}
        </h4>
      );
      continue;
    }
    
    if (line.startsWith('## ')) {
      flushParagraph();
      flushList();
      elements.push(
        <h3 key={key++} className="font-semibold text-foreground mt-4 mb-2 first:mt-0 break-words">
          {line.slice(3)}
        </h3>
      );
      continue;
    }
    
    if (line.startsWith('# ')) {
      flushParagraph();
      flushList();
      elements.push(
        <h2 key={key++} className="font-bold text-lg text-foreground mt-4 mb-2 first:mt-0 break-words">
          {line.slice(2)}
        </h2>
      );
      continue;
    }

    if (line.startsWith('- ') || line.startsWith('* ')) {
      flushParagraph();
      listItems.push(line.slice(2));
      continue;
    }
    
    const numMatch = line.match(/^(\d+)\.\s+/);
    if (numMatch) {
      flushParagraph();
      listItems.push(line.slice(numMatch[0].length));
      continue;
    }

    flushList();
    let processedLine = line;
    processedLine = processedLine.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    processedLine = processedLine.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    currentParagraph.push(processedLine);
  }

  flushParagraph();
  flushList();

  return elements;
}

export function QASection() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const currentContentRef = useRef<string>('');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const generateId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const processStream = useCallback(async (
    question: string, 
    existingContent: string = '',
    targetMessageId?: string
  ) => {
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    try {
      const response = await fetch('/api/qa/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question, 
          existingContent: existingContent || undefined 
        }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error('请求失败');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = existingContent;
      let relatedData: { works?: Work[]; poets?: Poet[]; imagery?: Imagery[] } = {};

      currentContentRef.current = existingContent;

      while (reader) {
        // 检查是否已暂停
        if (abortControllerRef.current === null) {
          // 用户暂停了，保存当前状态
          setMessages(prev => {
            const newMessages = [...prev];
            const targetMsg = targetMessageId 
              ? newMessages.find(m => m.id === targetMessageId)
              : newMessages[newMessages.length - 1];
            if (targetMsg && targetMsg.role === 'assistant') {
              targetMsg.content = assistantContent;
              targetMsg.isPaused = true;
              targetMsg.isComplete = false;
            }
            return newMessages;
          });
          return;
        }

        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                assistantContent += parsed.content;
                currentContentRef.current = assistantContent;
                setMessages(prev => {
                  const newMessages = [...prev];
                  const targetMsg = targetMessageId 
                    ? newMessages.find(m => m.id === targetMessageId)
                    : newMessages[newMessages.length - 1];
                  if (targetMsg && targetMsg.role === 'assistant') {
                    targetMsg.content = assistantContent;
                  }
                  return newMessages;
                });
              }
              if (parsed.type === 'related') {
                relatedData = {
                  works: parsed.works,
                  poets: parsed.poets,
                  imagery: parsed.imagery,
                };
              }
            } catch {
              // 忽略解析错误
            }
          }
        }
      }

      // 完成
      setMessages(prev => {
        const newMessages = [...prev];
        const targetMsg = targetMessageId 
          ? newMessages.find(m => m.id === targetMessageId)
          : newMessages[newMessages.length - 1];
        if (targetMsg && targetMsg.role === 'assistant') {
          targetMsg.content = assistantContent;
          targetMsg.relatedWorks = relatedData.works;
          targetMsg.relatedPoets = relatedData.poets;
          targetMsg.relatedImagery = relatedData.imagery;
          targetMsg.isComplete = true;
          targetMsg.isPaused = false;
        }
        return newMessages;
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // 用户主动取消，不算错误
        console.log('Request aborted by user');
      } else {
        console.error('Error:', error);
        setMessages(prev => {
          const newMessages = [...prev];
          const targetMsg = newMessages[newMessages.length - 1];
          if (targetMsg && targetMsg.role === 'assistant') {
            targetMsg.content = existingContent || '抱歉，回答生成失败，请稍后重试。';
            targetMsg.isComplete = true;
          }
          return newMessages;
        });
      }
    } finally {
      setIsLoading(false);
      setIsPaused(false);
      abortControllerRef.current = null;
    }
  }, []);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const userMessageId = generateId();
    const assistantMessageId = generateId();
    
    setInput('');
    
    setMessages(prev => [
      ...prev, 
      { id: userMessageId, role: 'user', content: userMessage },
      { id: assistantMessageId, role: 'assistant', content: '', question: userMessage, isComplete: false }
    ]);
    
    setIsLoading(true);
    setIsPaused(false);
    
    await processStream(userMessage, '', assistantMessageId);
  };

  const handlePause = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsPaused(true);
      setIsLoading(false);
    }
  };

  const handleResume = async (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (!message) return;
    
    const existingContent = message.content || '';
    
    setIsLoading(true);
    setIsPaused(false);
    
    // 更新消息状态为继续生成中
    setMessages(prev => {
      const newMessages = [...prev];
      const targetMsg = newMessages.find(m => m.id === messageId);
      if (targetMsg) {
        targetMsg.isPaused = false;
      }
      return newMessages;
    });
    
    await processStream(message.question || '', existingContent, messageId);
  };

  const handleStop = (messageId: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    setIsLoading(false);
    setIsPaused(false);
    
    // 标记消息为已完成
    setMessages(prev => {
      const newMessages = [...prev];
      const targetMsg = newMessages.find(m => m.id === messageId);
      if (targetMsg) {
        targetMsg.isComplete = true;
        targetMsg.isPaused = false;
      }
      return newMessages;
    });
  };

  const handleRegenerate = async (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (!message || !message.question) return;
    
    setIsLoading(true);
    setIsPaused(false);
    
    // 重置消息内容
    setMessages(prev => {
      const newMessages = [...prev];
      const targetMsg = newMessages.find(m => m.id === messageId);
      if (targetMsg) {
        targetMsg.content = '';
        targetMsg.isComplete = false;
        targetMsg.isPaused = false;
        targetMsg.relatedWorks = undefined;
        targetMsg.relatedPoets = undefined;
        targetMsg.relatedImagery = undefined;
      }
      return newMessages;
    });
    
    await processStream(message.question, '', messageId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const quickQuestions = [
    '李白的诗有什么特点？',
    '明月意象代表什么？',
    '推荐几首思乡的诗',
    '庄周梦蝶是什么典故？',
  ];

  // 获取最后一条AI消息
  const lastAIMessage = messages.filter(m => m.role === 'assistant').pop();
  const isGenerating = isLoading && !isPaused;

  return (
    <div className="flex flex-col h-[600px] max-w-4xl mx-auto">
      {/* 消息列表 */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-12">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Feather className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-medium text-foreground mb-2">
                探索古诗文之美
              </h3>
              <p className="text-muted-foreground text-sm max-w-md">
                询问诗词、意象、典故，或探索诗人之间的关联
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {quickQuestions.map((q, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    setInput(q);
                    inputRef.current?.focus();
                  }}
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 pb-4 max-w-full overflow-hidden">
            {messages.map((msg) => (
              <div key={msg.id}>
                <div
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`rounded-lg p-4 break-words ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground max-w-[70%]'
                        : 'bg-card border border-border max-w-[90%]'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="space-y-3 min-w-0 overflow-hidden">
                        {/* Markdown渲染的回答内容 */}
                        <div className="text-sm text-foreground overflow-hidden">
                          {renderMarkdown(msg.content)}
                          {msg.isPaused && !msg.isComplete && (
                            <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />
                          )}
                        </div>
                        
                        {/* 相关作品 */}
                        {msg.relatedWorks && msg.relatedWorks.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-border">
                            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              相关诗词
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {msg.relatedWorks.map((work, j) => (
                                <div
                                  key={j}
                                  className="px-3 py-1.5 rounded-md bg-muted/50 text-sm"
                                >
                                  <span className="font-medium text-foreground">
                                    《{work.title}》
                                  </span>
                                  <span className="text-muted-foreground ml-1">
                                    - {work.author}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* 相关意象 */}
                        {msg.relatedImagery && msg.relatedImagery.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {msg.relatedImagery.map((img, j) => (
                              <Badge key={j} variant="secondary" className="text-xs">
                                {img.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* AI消息的控制按钮 - 始终显示在消息下方 */}
                {msg.role === 'assistant' && (
                  <div className="flex justify-start mt-2 ml-4 gap-2">
                    {isGenerating && lastAIMessage?.id === msg.id && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePause}
                          className="h-7 text-xs gap-1"
                        >
                          <Pause className="w-3 h-3" />
                          暂停
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStop(msg.id)}
                          className="h-7 text-xs gap-1 text-muted-foreground"
                        >
                          <Square className="w-3 h-3" />
                          停止
                        </Button>
                      </>
                    )}
                    
                    {msg.isPaused && !msg.isComplete && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleResume(msg.id)}
                          className="h-7 text-xs gap-1"
                        >
                          <Play className="w-3 h-3" />
                          继续生成
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStop(msg.id)}
                          className="h-7 text-xs gap-1 text-muted-foreground"
                        >
                          <Square className="w-3 h-3" />
                          停止
                        </Button>
                      </>
                    )}
                    
                    {msg.isComplete && msg.content && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResume(msg.id)}
                          className="h-7 text-xs gap-1"
                        >
                          <Play className="w-3 h-3" />
                          继续生成
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRegenerate(msg.id)}
                          className="h-7 text-xs gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          重新生成
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {/* 加载中提示 */}
            {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
              <div className="flex justify-start">
                <div className="bg-card border border-border rounded-lg p-4 max-w-[90%]">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span className="text-sm">正在思考...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* 输入区域 */}
      <div className="border-t border-border p-4 bg-card">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入您的问题，如：李白的《将进酒》表达了什么情感？"
            className="flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[44px] max-h-[120px]"
            rows={1}
            disabled={isLoading}
          />
          <Button 
            onClick={handleSubmit} 
            disabled={!input.trim() || isLoading} 
            className="shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
