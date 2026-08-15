import { NextResponse } from 'next/server';
import { fetchKanjiByLevel } from '../../lib/serverData';

export const dynamic = 'force-static';

export async function GET() {
  try {
    const rawKanjiList = await fetchKanjiByLevel();
    
    const kanjiList = rawKanjiList.map(k => ({
      kanji: k.kanji,
      jlpt: parseInt((k.level || '').replace('N', ''), 10) || null,
      meanings: k.meaning ? k.meaning.split(',').map(s => s.trim()) : [],
      on_readings: k.onyomi ? k.onyomi.split(',').map(s => s.trim()) : [],
      kun_readings: k.kunyomi ? k.kunyomi.split(',').map(s => s.trim()) : [],
      heisig_en: '', 
      grade: null, 
      name_readings: [],
    }));

    return NextResponse.json(kanjiList);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch kanji data' }, { status: 500 });
  }
}
