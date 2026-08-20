'use client';
import React from 'react';
import Link from 'next/link';

export default function RenshuuPage() {
  return (
    <div id="app">
      {/* Navbar */}
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
        <div className="view active" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Link href="/" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Kembali
            </Link>
          </div>
          
          <div style={{ textAlign: 'center', marginBottom: '16px', marginTop: '100px' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '8px', fontWeight: 800 }}>Renshuu</h2>
            <div style={{ 
              display: 'inline-block',
              padding: '8px 24px', 
              background: 'rgba(168, 85, 247, 0.1)', 
              color: 'var(--color-primary)', 
              borderRadius: '30px',
              fontSize: '1.2rem',
              fontWeight: 600,
              marginTop: '16px',
              border: '1px solid rgba(168, 85, 247, 0.2)'
            }}>
              Coming Soon
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
