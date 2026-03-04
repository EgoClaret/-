import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '古诗文问答系统 | 基于语义匹配',
    template: '%s | 古诗文问答系统',
  },
  description: '基于语义匹配的古诗文智能问答系统，融合知识图谱与深度学习技术，提供诗词问答、意象解读、典故查询等功能。',
  keywords: [
    '古诗文',
    '知识图谱',
    '语义匹配',
    '智能问答',
    '唐诗',
    '宋词',
    '诗词欣赏',
    '古典文学',
  ],
  authors: [{ name: '古诗文问答系统' }],
  openGraph: {
    title: '古诗文问答系统 | 基于语义匹配',
    description: '探索中华诗词之美，智能问答让古典文学触手可及',
    type: 'website',
    locale: 'zh_CN',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased min-h-screen bg-background">
        {children}
      </body>
    </html>
  );
}
