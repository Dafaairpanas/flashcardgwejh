import { fetchKanjiByLevel } from '../lib/serverData';
import KanjiClient from './KanjiClient';
import Link from 'next/link';

export const metadata = {
  title: 'Kanji JLPT - AditFlashcard',
  description: 'Daftar Kanji JLPT N5 hingga N1 lengkap dengan arti dan bacaan.',
};

export default async function KanjiPage() {
  const rawKanjiList = await fetchKanjiByLevel();
  
  // Map the new kanji format (n5.json, etc.) to the legacy format expected by KanjiClient
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

  return (
    <div id="app-container">
      <nav className="navbar" id="navbar">
        <Link href="/" className="navbar-brand" style={{ textDecoration: 'none' }}>
          <span className="nav-logo" id="nav-home-btn">
            <svg className="logo-svg" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <rect x="3" y="3" width="18" height="18" rx="5"></rect>
              <text x="50%" y="54%" fontFamily="sans-serif" fontWeight="800" fontSize="12" fill="#fff" stroke="none" textAnchor="middle" dominantBaseline="middle">日</text>
            </svg>
          </span>
          <h1 className="nav-title" id="nav-menu-btn">AditFlashcard</h1>
        </Link>
      </nav>
      
      <main className="main-content">
        <KanjiClient initialKanjiList={kanjiList} />
      </main>
    </div>
  );
}
