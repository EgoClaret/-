import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';
import { works, poets, imageryList, allusions } from '@/data/poetry-data';

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

const CONTINUE_PROMPT = `请继续完成上面的回答。直接继续输出内容，不要重复已经说过的内容，不要说"继续"之类的过渡语。`;

export async function POST(request: NextRequest) {
  try {
    const { question, existingContent } = await request.json();
    
    if (!question) {
      return NextResponse.json({ error: '请提供问题' }, { status: 400 });
    }

    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    // 如果有已有内容，构建继续生成的消息
    let messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
    
    if (existingContent && existingContent.trim()) {
      // 继续生成模式
      messages = [
        { role: 'system' as const, content: SYSTEM_PROMPT },
        { role: 'user' as const, content: question },
        { role: 'assistant' as const, content: existingContent },
        { role: 'user' as const, content: CONTINUE_PROMPT }
      ];
    } else {
      // 新问题模式
      messages = [
        { role: 'system' as const, content: SYSTEM_PROMPT },
        { role: 'user' as const, content: question }
      ];
    }

    // 创建流式响应
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const llmStream = client.stream(messages, {
            model: 'doubao-seed-1-8-251228',
            temperature: 0.7
          });

          for await (const chunk of llmStream) {
            if (chunk.content) {
              const text = chunk.content.toString();
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`));
            }
          }

          // 搜索相关内容并发送
          const relatedWorks = searchRelatedWorks(question);
          const relatedPoets = searchRelatedPoets(question);
          const relatedImagery = searchRelatedImagery(question);

          if (relatedWorks.length > 0 || relatedPoets.length > 0 || relatedImagery.length > 0) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
              type: 'related',
              works: relatedWorks.slice(0, 3),
              poets: relatedPoets.slice(0, 2),
              imagery: relatedImagery.slice(0, 3)
            })}\n\n`));
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: '生成失败' })}\n\n`));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
  } catch (error) {
    console.error('Stream API Error:', error);
    return NextResponse.json({ error: '服务错误' }, { status: 500 });
  }
}

function searchRelatedWorks(question: string) {
  const keywords = extractKeywords(question);
  return works.filter(work => {
    const text = `${work.title} ${work.author} ${work.content.join(' ')} ${work.theme?.join(' ') || ''} ${work.emotion?.join(' ') || ''}`;
    return keywords.some(keyword => text.includes(keyword));
  });
}

function searchRelatedPoets(question: string) {
  const keywords = extractKeywords(question);
  return poets.filter(poet => {
    const text = `${poet.name} ${poet.dynasty} ${poet.style || ''}`;
    return keywords.some(keyword => text.includes(keyword));
  });
}

function searchRelatedImagery(question: string) {
  const keywords = extractKeywords(question);
  return imageryList.filter(imagery => {
    const text = `${imagery.name} ${imagery.meaning}`;
    return keywords.some(keyword => text.includes(keyword));
  });
}

function extractKeywords(question: string): string[] {
  const poetNames = poets.map(p => p.name);
  const imageryNames = imageryList.map(i => i.name);
  const allKeywords = [...poetNames, ...imageryNames, '诗', '词', '月', '酒', '离别', '思乡'];
  return allKeywords.filter(keyword => question.includes(keyword));
}
