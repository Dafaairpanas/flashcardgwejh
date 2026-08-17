'use client';

import React, { useState, useEffect } from 'react';
import { Octokit } from '@octokit/rest';
import Sidebar from './Sidebar';
import DataGrid from './DataGrid';
import SearchClient from '../search/SearchClient';

export default function AdminClient({ allData }) {
  const [authConfig, setAuthConfig] = useState(null);
  const [octokit, setOctokit] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileTree, setFileTree] = useState({});
  const [currentFile, setCurrentFile] = useState(null);
  
  const [repoOwner, setRepoOwner] = useState('Dafaairpanas');
  const [token, setToken] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Mobile sidebar state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('gw_admin_auth');
    if (saved) {
      try {
        const config = JSON.parse(saved);
        setAuthConfig(config);
        const okit = new Octokit({ auth: config.token });
        setOctokit(okit);
        fetchRepoTree(okit, config);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      const okit = new Octokit({ auth: token });
      const config = { owner: repoOwner, repo: 'flashcardgwejh', branch: 'main', token };
      
      // Test auth by fetching repo
      await okit.rest.repos.get({ owner: config.owner, repo: config.repo });
      
      localStorage.setItem('gw_admin_auth', JSON.stringify(config));
      setAuthConfig(config);
      setOctokit(okit);
      
      await fetchRepoTree(okit, config);
    } catch (err) {
      setErrorMsg('Autentikasi gagal. Periksa kembali Owner dan Token Anda.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('gw_admin_auth');
    setAuthConfig(null);
    setOctokit(null);
    setFileTree({});
    setCurrentFile(null);
  };

  const fetchRepoTree = async (okit, config) => {
    try {
      // Get branch commit sha to get the tree
      const { data: refData } = await okit.rest.git.getRef({
        owner: config.owner,
        repo: config.repo,
        ref: `heads/${config.branch}`,
      });
      const commitSha = refData.object.sha;
      
      const { data: commitData } = await okit.rest.git.getCommit({
        owner: config.owner,
        repo: config.repo,
        commit_sha: commitSha,
      });
      
      const treeSha = commitData.tree.sha;
      
      // Get tree recursive
      const { data: treeData } = await okit.rest.git.getTree({
        owner: config.owner,
        repo: config.repo,
        tree_sha: treeSha,
        recursive: '1',
      });
      
      // Filter only JSON files in src/data
      const dataFiles = treeData.tree.filter(item => 
        item.path.startsWith('src/data/') && item.path.endsWith('.json') && item.type === 'blob'
      );
      
      // Group by folder
      const tree = {};
      dataFiles.forEach(file => {
        // e.g. "src/data/minna/bab-01.json" -> folder: "minna", name: "bab-01.json"
        // e.g. "src/data/bunpou/minna/bab01.json" -> folder: "bunpou/minna", name: "bab01.json"
        const parts = file.path.replace('src/data/', '').split('/');
        const name = parts.pop();
        const folder = parts.join('/');
        
        if (!tree[folder]) tree[folder] = [];
        tree[folder].push({ name, path: file.path, sha: file.sha });
      });
      
      setFileTree(tree);
    } catch (err) {
      console.error("Gagal memuat tree:", err);
      setErrorMsg('Gagal memuat struktur folder. Pastikan repo memiliki folder src/data.');
    }
  };

  if (!authConfig) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-box">
          <div className="admin-logo" style={{justifyContent: 'center', marginBottom: '24px'}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:'32px', height:'32px'}}>
              <rect x="3" y="3" width="18" height="18" rx="5"></rect>
              <text x="50%" y="54%" fontFamily="sans-serif" fontWeight="800" fontSize="12" fill="currentColor" stroke="none" textAnchor="middle" dominantBaseline="middle">日</text>
            </svg>
            <h2>Portify CMS</h2>
          </div>
          
          <form onSubmit={handleLogin} className="admin-form">
            <div className="form-group">
              <label>Repo Owner (Username)</label>
              <input type="text" value={repoOwner} onChange={e => setRepoOwner(e.target.value)} required placeholder="Misal: Dafaairpanas" />
            </div>
            <div className="form-group">
              <label>GitHub Personal Access Token (PAT)</label>
              <input type="password" value={token} onChange={e => setToken(e.target.value)} required placeholder="ghp_xxxxxxxxxxxx" />
              <div style={{fontSize:'0.75rem', color:'var(--text-muted)', marginTop:'4px'}}>Membutuhkan akses scope `repo`. Disimpan aman di browser Anda.</div>
            </div>
            
            {errorMsg && <div className="admin-alert admin-alert-error">{errorMsg}</div>}
            
            <button type="submit" className="admin-btn admin-btn-primary" disabled={isLoading} style={{width:'100%', marginTop:'12px'}}>
              {isLoading ? 'Menghubungkan...' : 'Connect to GitHub'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {isMobileSidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setIsMobileSidebarOpen(false)}></div>
      )}
      
      <Sidebar 
        fileTree={fileTree} 
        onSelectFile={(path) => {
          setCurrentFile(path);
          setIsMobileSidebarOpen(false); // auto close on mobile
        }} 
        currentFile={currentFile} 
        onLogout={handleLogout}
        isOpen={isMobileSidebarOpen}
      />
      
      <main className="admin-main">
        <div className="admin-topbar">
          <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
            <button className="admin-btn-icon admin-mobile-toggle" onClick={() => setIsMobileSidebarOpen(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <h2 className="admin-page-title">
              {currentFile === 'SEARCH' ? 'Universal Search' : currentFile ? currentFile.replace('src/data/', '') : 'Dashboard'}
            </h2>
          </div>
          <div className="admin-topbar-actions">
            <button className="admin-btn-icon" onClick={() => window.location.href = '/'} title="Back to App">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </button>
          </div>
        </div>
        
        <div className="admin-content">
          {currentFile === 'SEARCH' ? (
            <SearchClient allData={allData} />
          ) : currentFile ? (
            <DataGrid 
              filePath={currentFile} 
              octokit={octokit} 
              authConfig={authConfig} 
            />
          ) : (
            <div className="admin-empty-state">
              <div className="admin-empty-icon">📊</div>
              <h3>Pilih file data</h3>
              <p>Pilih file JSON dari sidebar di sebelah kiri untuk mulai mengelola kosakata atau tata bahasa (bunpou).</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
