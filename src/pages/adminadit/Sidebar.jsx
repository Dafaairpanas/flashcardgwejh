import React, { useState } from 'react';

export default function Sidebar({ fileTree, onSelectFile, currentFile, onLogout, isOpen }) {
  const [expandedFolders, setExpandedFolders] = useState({ bunpou: true, minna: true, irodori: true, kanji: true, renshuu: true });

  const toggleFolder = (folder) => {
    setExpandedFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
  };

  return (
    <div className={`admin-sidebar ${isOpen ? 'admin-sidebar-open' : ''}`}>
      <div className="admin-sidebar-header">
        <div className="admin-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="28" height="28" style={{ flexShrink: 0 }}>
            <rect x="3" y="3" width="18" height="18" rx="5"></rect>
            <text x="50%" y="54%" fontFamily="sans-serif" fontWeight="800" fontSize="12" fill="currentColor" stroke="none" textAnchor="middle" dominantBaseline="middle">日</text>
          </svg>
          <h2 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>Portify CMS</h2>
        </div>
      </div>

      <div className="admin-sidebar-profile">
        <div className="admin-profile-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" style={{ flexShrink: 0 }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </div>
        <div className="admin-profile-info">
          <div className="admin-profile-name">Admin</div>
          <div className="admin-profile-role">GitHub Authenticated</div>
        </div>
        <button className="admin-btn-icon" onClick={onLogout} title="Logout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        </button>
      </div>

      <div className="admin-sidebar-menu">
        <div className="admin-menu-label">Data Repository</div>

        <button 
          className={`admin-folder-btn ${currentFile === 'SEARCH' ? 'active' : ''}`}
          onClick={() => onSelectFile('SEARCH')}
          style={{ background: currentFile === 'SEARCH' ? 'rgba(168, 85, 247, 0.15)' : 'transparent', color: currentFile === 'SEARCH' ? 'var(--accent-violet)' : 'inherit', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <span style={{ fontWeight: currentFile === 'SEARCH' ? 600 : 400 }}>Universal Search</span>
        </button>
        
        {Object.keys(fileTree).sort().map(folder => (
          <div key={folder} className="admin-folder">
            <button className="admin-folder-btn" onClick={() => toggleFolder(folder)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: expandedFolders[folder] ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} width="16" height="16"><polyline points="9 18 15 12 9 6"></polyline></svg>
              <span>{folder}</span>
            </button>
            {expandedFolders[folder] && (
              <div className="admin-folder-contents">
                {fileTree[folder].map(file => (
                  <button 
                    key={file.path} 
                    className={`admin-file-btn ${currentFile === file.path ? 'active' : ''}`}
                    onClick={() => onSelectFile(file.path)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                    <span>{file.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
