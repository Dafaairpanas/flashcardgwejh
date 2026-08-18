import { NextResponse } from 'next/server';
import { fetchAllSearchData } from '../../lib/serverData';

export const dynamic = 'force-static';

export async function GET() {
  try {
    const data = await fetchAllSearchData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch all cards' }, { status: 500 });
  }
}
