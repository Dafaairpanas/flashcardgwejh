import { NextResponse } from 'next/server';
import { fetchAllCards, getChaptersFromCards } from '../../lib/serverData';

export const dynamic = 'force-static';

export async function GET() {
  try {
    const allCards = await fetchAllCards();
    const chapters = getChaptersFromCards(allCards);
    
    // Add pre-calculated search string to avoid heavy computation on client
    const searchableCards = allCards.map(c => {
      const k = (c.kanji || '').toLowerCase().replace(/[\s~〜\-]/g, '');
      const h = (c.hiragana || '').toLowerCase().replace(/[\s~〜\-]/g, '');
      const r = (c.romaji || '').toLowerCase().replace(/[\s~〜\-]/g, '');
      const m = (c.meaning || '').toLowerCase();
      return { ...c, _searchString: `${k} ${h} ${r} ${m}` };
    });

    return NextResponse.json({ cards: searchableCards, chapters });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch kotoba data' }, { status: 500 });
  }
}
