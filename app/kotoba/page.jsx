import KotobaClient from './KotobaClient';
import Link from 'next/link';

export const metadata = {
  title: 'List Kotoba - AditFlashcard',
  description: 'Daftar kosakata per bab dari Irodori dan Minna no Nihongo.',
};

export default function KotobaPage() {
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
        <KotobaClient />
      </main>
    </div>
  );
}
