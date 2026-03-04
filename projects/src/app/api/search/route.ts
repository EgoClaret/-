import { NextRequest, NextResponse } from 'next/server';
import { searchByKeyword, getWorksByAuthor, getWorksByEmotion, getWorksByImagery } from '@/data/poetry-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('q');
    const type = searchParams.get('type'); // 'keyword', 'author', 'emotion', 'imagery'

    if (!keyword) {
      return NextResponse.json({ error: '请提供搜索关键词' }, { status: 400 });
    }

    let result;

    switch (type) {
      case 'author':
        result = { works: getWorksByAuthor(keyword), poets: [], imagery: [] };
        break;
      case 'emotion':
        result = { works: getWorksByEmotion(keyword), poets: [], imagery: [] };
        break;
      case 'imagery':
        result = { works: getWorksByImagery(keyword), poets: [], imagery: [] };
        break;
      default:
        result = searchByKeyword(keyword);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({ error: '搜索失败' }, { status: 500 });
  }
}
