import { NextRequest, NextResponse } from 'next/server';
import { works, poets, getWorkById, getPoetByName } from '@/data/poetry-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const author = searchParams.get('author');
    const dynasty = searchParams.get('dynasty');

    if (id) {
      const work = getWorkById(id);
      if (!work) {
        return NextResponse.json({ error: '未找到该作品' }, { status: 404 });
      }
      const poet = getPoetByName(work.author);
      return NextResponse.json({ work, poet });
    }

    let filteredWorks = works;

    if (author) {
      filteredWorks = filteredWorks.filter(w => w.author.includes(author));
    }

    if (dynasty) {
      filteredWorks = filteredWorks.filter(w => w.dynasty === dynasty);
    }

    return NextResponse.json({ 
      works: filteredWorks,
      total: filteredWorks.length 
    });
  } catch (error) {
    console.error('Poems API Error:', error);
    return NextResponse.json({ error: '获取诗词失败' }, { status: 500 });
  }
}
