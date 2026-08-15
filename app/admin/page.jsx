import Link from 'next/link';

export const metadata = {
  title: 'Admin Panel - AditFlashcard',
  description: 'Kelola data flashcard langsung via GitHub.',
};

export default function AdminPage() {
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
          <h1 className="nav-title" id="nav-menu-btn">Admin Panel</h1>
        </Link>
      </nav>
      
      <main className="main-content">
        <div className="view page-view active">
          <div className="page-container" style={{paddingTop: '40px', maxWidth: '700px', margin: '0 auto'}}>
            <div className="page-header" style={{ textAlign: 'center' }}>
              <h2 className="page-title">GitHub CMS</h2>
              <p className="page-subtitle">Kelola data flashcard langsung di GitHub — gratis selamanya</p>
            </div>

            {/* How-to Guide */}
            <div className="bento-card" style={{ padding: '28px', marginBottom: '20px' }}>
              <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-violet)" strokeWidth="2" style={{width:'20px', height:'20px'}}>
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Cara Edit Data
              </h3>
              <ol style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '20px', margin: 0 }}>
                <li>Buka <strong style={{color: '#fff'}}>repository GitHub</strong> project ini</li>
                <li>Navigasi ke folder <code style={{background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px'}}>src/data/</code></li>
                <li>Pilih sumber: <code>minna/</code> atau <code>irodori/</code></li>
                <li>Klik file <code>bab-XX.json</code> yang ingin diedit</li>
                <li>Klik ikon <strong style={{color: '#fff'}}>pensil ✏️</strong> (Edit this file)</li>
                <li>Edit JSON sesuai format, lalu klik <strong style={{color: '#fff'}}>Commit changes</strong></li>
                <li>Vercel akan otomatis rebuild dalam ~30 detik 🚀</li>
              </ol>
            </div>

            {/* Data Structure */}
            <div className="bento-card" style={{ padding: '28px', marginBottom: '20px' }}>
              <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2" style={{width:'20px', height:'20px'}}>
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
                Struktur Data
              </h3>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{color: '#fff'}}>Minna no Nihongo</strong> — 50 bab
                  <br />
                  <code style={{fontSize: '0.85rem'}}>src/data/minna/bab-01.json … bab-50.json</code>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{color: '#fff'}}>Irodori</strong> — A1, A2-1, A2-2 (masing-masing 18 bab)
                  <br />
                  <code style={{fontSize: '0.85rem'}}>src/data/irodori/a1/bab-01.json … bab-18.json</code>
                  <br />
                  <code style={{fontSize: '0.85rem'}}>src/data/irodori/a2-1/bab-01.json … bab-18.json</code>
                  <br />
                  <code style={{fontSize: '0.85rem'}}>src/data/irodori/a2-2/bab-01.json … bab-18.json</code>
                </div>
                <div>
                  <strong style={{color: '#fff'}}>Kanji</strong> — per level JLPT
                  <br />
                  <code style={{fontSize: '0.85rem'}}>src/data/kanji/n5.json … n1.json</code>
                </div>
              </div>
            </div>

            {/* JSON Format Example */}
            <div className="bento-card" style={{ padding: '28px', marginBottom: '20px' }}>
              <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-learning)" strokeWidth="2" style={{width:'20px', height:'20px'}}>
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
                Format JSON
              </h3>
              <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', overflow: 'auto', fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.7 }}>
{`[
  {
    "id": "mn-01-001",
    "kanji": "食べる",
    "hiragana": "たべる",
    "romaji": "taberu",
    "meaning": "Makan",
    "level": "N5",
    "importinity": 1
  }
]`}
              </pre>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '12px', marginBottom: 0 }}>
                <strong>importinity:</strong> 1 = Wajib, 2 = Extra, 3 = Tidak berguna
              </p>
            </div>

            <div style={{ textAlign: 'center', paddingBottom: '40px' }}>
              <Link href="/" className="btn btn-primary">
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
