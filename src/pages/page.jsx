import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div id="app-container">
      {/* Basic Navbar for SEO page */}
      <nav className="navbar" id="navbar">
        <Link to="/" className="navbar-brand" style={{ textDecoration: 'none' }}>
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
        <div className="view page-view active" id="home-view">
          <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="page-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
              {/* <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, var(--accent-violet), var(--accent-rose))', borderRadius: '16px', padding: '12px', boxShadow: '0 8px 32px rgba(168, 85, 247, 0.4)' }}>
                  <rect x="3" y="3" width="18" height="18" rx="5"></rect>
                  <text x="50%" y="54%" fontFamily="sans-serif" fontWeight="800" fontSize="12" fill="#fff" stroke="none" textAnchor="middle" dominantBaseline="middle">日</text>
                </svg>
              </div> */}
              {/* <h2 className="page-title" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>AditFlashcard</h2> */}
              <h2 className="page-subtitle" style={{ fontSize: '1.1rem', fontWeight: 400 }}>Pilih menu untuk mulai belajar</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              
              <Link to="/study/setup" className="bento-card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', gap: '16px', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.6)' }}>
                <div style={{ color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '64px', fontSize: '40px', fontWeight: '400', fontFamily: 'var(--font-jp)', letterSpacing: '2px' }}>
                  日本語
                </div>
                <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 600 }}>Flashcard</h3>
              </Link>

              <Link to="/kanji" className="bento-card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', gap: '16px', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '64px', fontSize: '40px', fontWeight: '400', fontFamily: 'var(--font-jp)', letterSpacing: '2px' }}>
                  漢字
                </div>
                <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 600 }}>Kanji Tunggal</h3>
              </Link>

              <Link to="/kotoba" className="bento-card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', gap: '16px', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '64px', fontSize: '40px', fontWeight: '400', fontFamily: 'var(--font-jp)', letterSpacing: '2px' }}>
                  言葉
                </div>
                <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 600 }}>List Kotoba</h3>
              </Link>

              <Link to="/bunpou" className="bento-card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', gap: '16px', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '64px', fontSize: '40px', fontWeight: '400', fontFamily: 'var(--font-jp)', letterSpacing: '2px' }}>
                  文法
                </div>
                <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 600 }}>Bunpou</h3>
              </Link>

              <Link to="/renshuu" className="bento-card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', gap: '16px', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '64px', fontSize: '40px', fontWeight: '400', fontFamily: 'var(--font-jp)', letterSpacing: '2px' }}>
                  練習
                </div>
                <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 600 }}>Renshuu</h3>
              </Link>

              <Link to="/settings" className="bento-card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', gap: '16px', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '64px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '40px', height: '40px' }}><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                </div>
                <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 600 }}>Settings</h3>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
