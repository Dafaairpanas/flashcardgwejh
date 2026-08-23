
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
  
  // Bulk import state
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState('');
  const [importCategory, setImportCategory] = useState('minna');
  
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
              <div className="admin-dashboard-home" style={{padding: '24px', maxWidth: '800px', margin: '0 auto', overflowY: 'auto', height: '100%', width: '100%'}}>
              <div style={{marginBottom: '32px', textAlign: 'center'}}>
                <div className="admin-empty-icon" style={{fontSize: '48px', marginBottom: '16px'}}>📊</div>
                <h2 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '8px'}}>Selamat Datang di Portify CMS</h2>
                <p style={{color: 'var(--text-muted)'}}>Pilih file JSON dari sidebar di sebelah kiri untuk mulai mengelola kosakata atau tata bahasa (bunpou).</p>
              </div>
              
              <div className="admin-card" style={{padding: '24px', backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '24px'}}>
                <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Bulk Export Data (.txt)
                </h3>
                <p style={{color: 'var(--text-muted)', marginBottom: '24px', fontSize: '14px'}}>
                  Export semua data dari satu kategori menjadi satu file text besar. Data akan digabungkan dari semua bab. Pemisah antar kolom menggunakan tanda titik koma (<code>;</code>).
                </p>
                <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
                  {['minna', 'irodori', 'kanji', 'bunpou', 'renshuu'].map(category => (
                    <button 
                      key={category}
                      className="admin-btn admin-btn-outline" 
                      onClick={() => {
                        const data = allData?.[category];
                        if (!data || data.length === 0) {
                          alert(`Tidak ada data untuk kategori ${category}.`);
                          return;
                        }
                        
                        let content = '';
                        if (category === 'bunpou') {
                          // Format: id;title;romajiTitle;formula;meaning;chapter
                          content = ['id;title;romajiTitle;formula;meaning;chapter'].concat(
                            data.map(d => `${d.id || ''};${d.title || ''};${d.romajiTitle || ''};${d.formula || ''};${d.meaning || ''};${d.chapter || ''}`)
                          ).join('\n');
                        } else {
                          // Format: id;kanji;hiragana;romaji;meaning;level;importinity;chapter
                          content = ['id;kanji;hiragana;romaji;meaning;level;importinity;chapter'].concat(
                            data.map(d => `${d.id || ''};${d.kanji || ''};${d.hiragana || ''};${d.romaji || ''};${d.meaning || ''};${d.level || '-'};${d.importinity || 1};${d.chapter || ''}`)
                          ).join('\n');
                        }
                        
                        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `${category}_all_data.txt`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);
                      }}
                    >
                      Export {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="admin-card" style={{padding: '24px', backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)'}}>
                <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  Bulk Import Data (.txt)
                </h3>
                <p style={{color: 'var(--text-muted)', marginBottom: '16px', fontSize: '14px'}}>
                  Import file .txt yang berisi ratusan/ribuan data. Sistem otomatis akan memecahnya menjadi file `.json` per-Bab dan mem-push 1 bulk commit ke repository GitHub.
                </p>
                <div style={{display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px'}}>
                  <select 
                    className="admin-btn admin-btn-outline" 
                    style={{backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 16px', color: '#fff'}}
                    value={importCategory}
                    onChange={e => setImportCategory(e.target.value)}
                    disabled={isImporting}
                  >
                    <option value="minna">Minna no Nihongo</option>
                    <option value="irodori">Irodori</option>
                    <option value="kanji">Kanji</option>
                    <option value="bunpou/minna">Bunpou Minna</option>
                    <option value="bunpou/irodori">Bunpou Irodori</option>
                  </select>
                  
                  <label className={`admin-btn admin-btn-primary ${isImporting ? 'disabled' : ''}`} style={{cursor: isImporting ? 'not-allowed' : 'pointer', opacity: isImporting ? 0.7 : 1}}>
                    <input 
                      type="file" 
                      accept=".txt" 
                      style={{display: 'none'}} 
                      disabled={isImporting}
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        setIsImporting(true);
                        setImportProgress('Membaca file...');
                        
                        try {
                          const text = await file.text();
                          const cleanText = text.replace(/\r/g, '');
                          const lines = cleanText.split('\n').filter(line => line.trim());
                          if (lines.length <= 1) throw new Error('File kosong atau hanya berisi header');
                          
                          const header = lines[0].split(';').map(h => h.trim());
                          const dataRows = lines.slice(1);
                          
                          const parsedData = dataRows.map(row => {
                            const cols = row.split(';');
                            const obj = {};
                            header.forEach((key, i) => {
                              const val = cols[i] ? cols[i].trim() : '';
                              if (key === 'importinity') obj[key] = parseInt(val) || 1;
                              else obj[key] = val;
                            });
                            return obj;
                          });

                          setImportProgress(`Mem-parsing ${parsedData.length} baris data...`);
                          
                          // Group by chapter
                          const groupedByChapter = {};
                          parsedData.forEach(item => {
                            const chap = item.chapter || 'Unknown';
                            if (!groupedByChapter[chap]) groupedByChapter[chap] = [];
                            groupedByChapter[chap].push(item);
                          });
                          
                          const chaptersCount = Object.keys(groupedByChapter).length;
                          if (!confirm(`Ditemukan ${chaptersCount} file/bab dari ${parsedData.length} baris data. Proses commit bulk ke GitHub (menimpa file lama)?`)) {
                            setIsImporting(false);
                            setImportProgress('');
                            e.target.value = null;
                            return;
                          }
                          
                          setImportProgress(`Mempersiapkan Git Tree untuk ${chaptersCount} file...`);
                          const tree = [];
                          
                          for (const [chapName, items] of Object.entries(groupedByChapter)) {
                            let fileName = chapName;
                            let filePath = `src/data/${importCategory}/`;
                            
                            if (importCategory === 'minna') {
                              fileName = chapName.toLowerCase().replace(' ', '-');
                              if (!fileName.includes('bab')) fileName = `bab-${fileName}`;
                              filePath += `${fileName}.json`;
                            } else if (importCategory.startsWith('bunpou')) {
                              // format usually: bab11.json, irA1-01.json
                              if (chapName.toLowerCase().startsWith('bab')) {
                                const num = chapName.replace(/\D/g, '').padStart(2, '0');
                                filePath += `bab${num}.json`;
                              } else {
                                filePath += `${chapName}.json`;
                              }
                            } else {
                              filePath += `${chapName.replace(/\s/g, '')}.json`;
                            }
                            
                            // Remove empty chapter field if needed, but we can keep it.
                            const jsonStr = JSON.stringify(items, null, 2);
                            tree.push({
                              path: filePath,
                              mode: '100644',
                              type: 'blob',
                              content: jsonStr
                            });
                          }
                          
                          setImportProgress(`Mengirim ${chaptersCount} file ke GitHub...`);
                          
                          const { data: refData } = await octokit.rest.git.getRef({
                            owner: authConfig.owner,
                            repo: authConfig.repo,
                            ref: `heads/${authConfig.branch}`,
                          });
                          const commitSha = refData.object.sha;
                          
                          const { data: commitData } = await octokit.rest.git.getCommit({
                            owner: authConfig.owner,
                            repo: authConfig.repo,
                            commit_sha: commitSha,
                          });
                          const baseTreeSha = commitData.tree.sha;
                          
                          const { data: newTreeData } = await octokit.rest.git.createTree({
                            owner: authConfig.owner,
                            repo: authConfig.repo,
                            base_tree: baseTreeSha,
                            tree: tree,
                          });
                          
                          const { data: newCommitData } = await octokit.rest.git.createCommit({
                            owner: authConfig.owner,
                            repo: authConfig.repo,
                            message: `Bulk Import ${importCategory} (${parsedData.length} data)`,
                            tree: newTreeData.sha,
                            parents: [commitSha],
                          });
                          
                          await octokit.rest.git.updateRef({
                            owner: authConfig.owner,
                            repo: authConfig.repo,
                            ref: `heads/${authConfig.branch}`,
                            sha: newCommitData.sha,
                          });
                          
                          alert('Bulk Import Berhasil! Silakan refresh aplikasi untuk melihat perubahan.');
                          await fetchRepoTree(octokit, authConfig);
                        } catch (err) {
                          console.error(err);
                          alert('Gagal import data: ' + err.message);
                        } finally {
                          setIsImporting(false);
                          setTimeout(() => setImportProgress(''), 3000);
                          e.target.value = null;
                        }
                      }} 
                    />
                    {isImporting ? 'Memproses...' : 'Pilih File .txt & Import'}
                  </label>
                </div>
                {importProgress && (
                  <div style={{fontSize: '13px', color: 'var(--accent-emerald)', marginTop: '8px', fontWeight: '500'}}>
                    <span className="spinner" style={{width:'12px', height:'12px', display:'inline-block', borderWidth:'2px', marginRight:'6px', verticalAlign:'middle'}}></span>
                    {importProgress}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
