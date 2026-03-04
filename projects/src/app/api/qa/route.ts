import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';
import { works, poets, imageryList, allusions } from '@/data/poetry-data';
import type { Work, Poet, Imagery, Allusion } from '@/types';

// 系统提示词 - 古诗文专家
const SYSTEM_PROMPT = `你是一位精通中国古典文学的专家，专长于古诗文的研究、解读和问答。

你拥有以下知识库：
1. 《全唐诗》《全宋词》等经典诗词集
2. 诗词中的意象解读（如：明月代表思乡、杨柳代表离别、酒代表豪情等）
3. 典故的来源与寓意（如：庄周梦蝶、望帝化鹃等）
4. 诗人生平与创作风格
5. 诗词的创作背景与艺术赏析

回答要求：
1. 准确解读用户问题，结合诗词知识给出专业解答
2. 引用诗词时要注明作者、出处
3. 解读意象和典故时，说明其文化内涵
4. 语言雅致，富有文学气息
5. 如问题涉及知识图谱中的内容，可关联推荐相关诗词

知识图谱数据参考：
- 著名诗人：李白、杜甫、白居易、王维、苏轼、辛弃疾、李清照、柳永等
- 经典意象：明月（思乡）、柳（离别）、酒（豪情）、雁（思乡）、黄河（壮阔）、白发（时光）、梧桐（孤寂）、杜鹃（悲苦）
- 常见典故：庄周梦蝶（物我两忘）、望帝化鹃（悲苦哀怨）、周瑜赤壁（英雄豪杰）、廉颇老矣（建功立业）`;

interface QAResponse {
  answer: string;
  relatedWorks?: Work[];
  relatedPoets?: Poet[];
  relatedImagery?: Imagery[];
  relatedAllusions?: Allusion[];
}

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();
    
    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: '请提供有效的问题' },
        { status: 400 }
      );
    }

    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    // 构建消息
    const messages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      { role: 'user' as const, content: question }
    ];

    // 调用LLM获取回答
    const response = await client.invoke(messages, {
      model: 'doubao-seed-1-8-251228',
      temperature: 0.7
    });

    // 根据问题搜索相关的诗词、诗人、意象、典故
    const relatedWorks = searchRelatedWorks(question);
    const relatedPoets = searchRelatedPoets(question);
    const relatedImagery = searchRelatedImagery(question);
    const relatedAllusions = searchRelatedAllusions(question);

    const result: QAResponse = {
      answer: response.content,
      relatedWorks: relatedWorks.length > 0 ? relatedWorks.slice(0, 3) : undefined,
      relatedPoets: relatedPoets.length > 0 ? relatedPoets.slice(0, 2) : undefined,
      relatedImagery: relatedImagery.length > 0 ? relatedImagery.slice(0, 3) : undefined,
      relatedAllusions: relatedAllusions.length > 0 ? relatedAllusions.slice(0, 2) : undefined
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('QA API Error:', error);
    return NextResponse.json(
      { error: '回答生成失败，请稍后重试' },
      { status: 500 }
    );
  }
}

// 搜索相关作品
function searchRelatedWorks(question: string): Work[] {
  const keywords = extractKeywords(question);
  return works.filter(work => {
    const text = `${work.title} ${work.author} ${work.content.join(' ')} ${work.theme?.join(' ') || ''} ${work.emotion?.join(' ') || ''} ${work.imagery?.join(' ') || ''}`;
    return keywords.some(keyword => text.includes(keyword));
  });
}

// 搜索相关诗人
function searchRelatedPoets(question: string): Poet[] {
  const keywords = extractKeywords(question);
  return poets.filter(poet => {
    const text = `${poet.name} ${poet.dynasty} ${poet.style || ''} ${poet.pseudonym || ''} ${poet.courtesyName || ''}`;
    return keywords.some(keyword => text.includes(keyword));
  });
}

// 搜索相关意象
function searchRelatedImagery(question: string): Imagery[] {
  const keywords = extractKeywords(question);
  return imageryList.filter(imagery => {
    const text = `${imagery.name} ${imagery.meaning} ${imagery.examples.join(' ')}`;
    return keywords.some(keyword => text.includes(keyword));
  });
}

// 搜索相关典故
function searchRelatedAllusions(question: string): Allusion[] {
  const keywords = extractKeywords(question);
  return allusions.filter(allusion => {
    const text = `${allusion.name} ${allusion.story} ${allusion.meaning}`;
    return keywords.some(keyword => text.includes(keyword));
  });
}

// 提取关键词
function extractKeywords(question: string): string[] {
  // 诗人名
  const poetNames = poets.map(p => p.name);
  // 意象名
  const imageryNames = imageryList.map(i => i.name);
  // 典故名
  const allusionNames = allusions.map(a => a.name);
  // 常见诗词关键词
  const poetryKeywords = ['诗', '词', '唐诗', '宋词', '月亮', '酒', '离别', '思乡', '边塞', '山水', '田园', '爱情', '咏史', '怀古', '春', '秋', '月', '花', '雪', '风', '雨'];
  
  const allKeywords = [...poetNames, ...imageryNames, ...allusionNames, ...poetryKeywords];
  
  return allKeywords.filter(keyword => question.includes(keyword));
}
