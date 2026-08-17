import React, { useState, useEffect, useMemo } from 'react';

export default function DataGrid({ filePath, octokit, authConfig }) {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [fileSha, setFileSha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Table state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  
  // Modal state
  const [editingItem, setEditingItem] = useState(null);
  const [isBulkEditing, setIsBulkEditing] = useState(false);
  const [bulkEditData, setBulkEditData] = useState({ level: '', importinity: '' });
  
  const isBunpou = filePath.includes('bunpou');

  // Fetch file content
  useEffect(() => {
    let isMounted = true;
    
    const fetchFile = async () => {
      setIsLoading(true);
      try {
        const { data: fileData } = await octokit.rest.repos.getContent({
          owner: authConfig.owner,
          repo: authConfig.repo,
          path: filePath,
          ref: authConfig.branch,
        });
        
        if (isMounted) {
          setFileSha(fileData.sha);
          // GitHub content is base64 encoded, sometimes with newlines
          const content = decodeURIComponent(escape(atob(fileData.content.replace(/\n/g, ''))));
          const parsed = JSON.parse(content);
          setData(parsed);
          setOriginalData(parsed);
          setSelectedIds(new Set());
          setSearchTerm('');
        }
      } catch (err) {
        console.error("Gagal load file:", err);
        if (isMounted) alert("Gagal memuat isi file. Pastikan format JSON valid.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    
    fetchFile();
    return () => { isMounted = false; };
  }, [filePath, octokit, authConfig]);

  // Derived state
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lower = searchTerm.toLowerCase();
    return data.filter(item => {
      if (isBunpou) {
        return (item.pattern || '').toLowerCase().includes(lower) || 
               (item.meaning || '').toLowerCase().includes(lower);
      }
      return (item.kanji || '').toLowerCase().includes(lower) ||
             (item.hiragana || '').toLowerCase().includes(lower) ||
             (item.meaning || '').toLowerCase().includes(lower);
    });
  }, [data, searchTerm, isBunpou]);

  const hasChanges = JSON.stringify(data) !== JSON.stringify(originalData);

  // Actions
  const toggleSelect = (id) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };
  
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredData.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredData.map(d => d.id)));
  };

  const handleDeleteSelected = () => {
    if (!confirm(`Hapus ${selectedIds.size} item terpilih?`)) return;
    setData(prev => prev.filter(item => !selectedIds.has(item.id)));
    setSelectedIds(new Set());
  };

  const openEditModal = (item = null) => {
    if (item) {
      setEditingItem(JSON.parse(JSON.stringify(item))); // clone
    } else {
      // Create new template
      if (isBunpou) {
        setEditingItem({ id: `new-${Date.now()}`, pattern: '', meaning: '', explanation: '', examples: [] });
      } else {
        setEditingItem({ id: `new-${Date.now()}`, kanji: '', hiragana: '', romaji: '', meaning: '', level: '-', importinity: 1 });
      }
    }
  };

  const saveBulkEdit = (e) => {
    e.preventDefault();
    setData(prev => prev.map(item => {
      if (selectedIds.has(item.id)) {
        const updatedItem = { ...item };
        if (bulkEditData.level !== '') updatedItem.level = bulkEditData.level;
        if (bulkEditData.importinity !== '') updatedItem.importinity = Number(bulkEditData.importinity);
        return updatedItem;
      }
      return item;
    }));
    setIsBulkEditing(false);
    setSelectedIds(new Set()); // Clear selection after bulk edit
  };

  const saveEdit = (e) => {
    e.preventDefault();
    setData(prev => {
      const idx = prev.findIndex(item => item.id === editingItem.id);
      if (idx > -1) {
        const newData = [...prev];
        newData[idx] = editingItem;
        return newData;
      }
      return [editingItem, ...prev]; // add new to top
    });
    setEditingItem(null);
  };

  const handleSaveToGitHub = async () => {
    if (!confirm(`Commit perubahan ke ${filePath}?`)) return;
    setIsSaving(true);
    
    try {
      // Format with 2 spaces
      const jsonStr = JSON.stringify(data, null, 2);
      const base64Content = btoa(unescape(encodeURIComponent(jsonStr)));
      
      const res = await octokit.rest.repos.createOrUpdateFileContents({
        owner: authConfig.owner,
        repo: authConfig.repo,
        path: filePath,
        message: `CMS Update: ${filePath}`,
        content: base64Content,
        sha: fileSha,
        branch: authConfig.branch,
      });
      
      setFileSha(res.data.content.sha);
      setOriginalData(data);
      alert("Berhasil disimpan ke GitHub!");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan ke GitHub. Cek konsol.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filePath.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed)) {
          if (confirm('Import JSON ini? Data saat ini akan diganti sepenuhnya.')) {
            setData(parsed);
          }
        } else {
          alert('Format JSON tidak valid (harus berupa array).');
        }
      } catch (err) {
        alert('Gagal parsing JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = null; // reset
  };

  if (isLoading) return <div className="admin-loading">Memuat data dari GitHub...</div>;

  return (
    <div className="admin-datagrid-container">
      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-toolbar-left">
          <div className="admin-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              placeholder="Search data..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
          </div>
          {selectedIds.size > 0 && (
            <>
              {!isBunpou && (
                <button className="admin-btn admin-btn-primary" onClick={() => { setBulkEditData({ level: '', importinity: '' }); setIsBulkEditing(true); }}>
                  Edit Terpilih ({selectedIds.size})
                </button>
              )}
              <button className="admin-btn admin-btn-danger" onClick={handleDeleteSelected}>
                Hapus ({selectedIds.size})
              </button>
            </>
          )}
        </div>
        
        <div className="admin-toolbar-right">
          <button className="admin-btn admin-btn-ghost" onClick={handleExport} title="Download JSON">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Export
          </button>
          <label className="admin-btn admin-btn-ghost" style={{cursor: 'pointer'}} title="Upload JSON">
            <input type="file" accept=".json" style={{display: 'none'}} onChange={handleImport} />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            Import
          </label>
          
          {hasChanges && (
            <div className="admin-badge admin-badge-warning" style={{marginRight:'12px', marginLeft:'12px'}}>Unsaved Changes</div>
          )}
          <button className="admin-btn admin-btn-ghost" onClick={() => openEditModal()}>
            + Tambah Data
          </button>
          <button className="admin-btn admin-btn-primary" onClick={handleSaveToGitHub} disabled={!hasChanges || isSaving}>
            {isSaving ? 'Menyimpan...' : 'Push to GitHub'}
          </button>
        </div>
      </div>

      {/* Table Area */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{width: '40px'}}>
                <input type="checkbox" checked={selectedIds.size === filteredData.length && filteredData.length > 0} onChange={toggleSelectAll} />
              </th>
              <th>ID</th>
              {isBunpou ? (
                <>
                  <th>Pattern</th>
                  <th>Meaning</th>
                </>
              ) : (
                <>
                  <th>Kanji</th>
                  <th>Hiragana</th>
                  <th>Meaning</th>
                  <th>Level / Imp</th>
                </>
              )}
              <th style={{width: '80px', textAlign:'right'}}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(item => (
              <tr key={item.id} className={selectedIds.has(item.id) ? 'selected' : ''}>
                <td>
                  <input type="checkbox" checked={selectedIds.has(item.id)} onChange={() => toggleSelect(item.id)} />
                </td>
                <td className="admin-cell-muted">{item.id}</td>
                {isBunpou ? (
                  <>
                    <td className="admin-cell-bold">{item.pattern}</td>
                    <td>{item.meaning}</td>
                  </>
                ) : (
                  <>
                    <td className="admin-cell-bold" style={{fontFamily:'var(--font-jp)'}}>{item.kanji}</td>
                    <td style={{fontFamily:'var(--font-jp)'}}>{item.hiragana}</td>
                    <td>{item.meaning}</td>
                    <td>
                      <span className="admin-badge">{item.level}</span>
                      {item.importinity && <span className="admin-badge admin-badge-outline" style={{marginLeft:'4px'}}>★{item.importinity}</span>}
                    </td>
                  </>
                )}
                <td style={{textAlign:'right'}}>
                  <button className="admin-btn-icon" onClick={() => openEditModal(item)} title="Edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{data.find(d => d.id === editingItem.id) ? 'Edit Data' : 'Tambah Data'}</h3>
              <button className="admin-btn-icon" onClick={() => setEditingItem(null)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <form onSubmit={saveEdit} className="admin-modal-body admin-form">
              <div className="form-group">
                <label>ID</label>
                <input type="text" value={editingItem.id} onChange={e => setEditingItem({...editingItem, id: e.target.value})} required />
              </div>
              
              {isBunpou ? (
                <>
                  <div className="form-group">
                    <label>Pattern (Pola)</label>
                    <input type="text" value={editingItem.pattern} onChange={e => setEditingItem({...editingItem, pattern: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Meaning (Arti)</label>
                    <input type="text" value={editingItem.meaning} onChange={e => setEditingItem({...editingItem, meaning: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Explanation</label>
                    <textarea value={editingItem.explanation || ''} onChange={e => setEditingItem({...editingItem, explanation: e.target.value})} rows="3" />
                  </div>
                  {/* For Examples, since it's an array of objects, we use a simple text area for raw JSON editing to save time, or a dedicated field set. Raw JSON is easiest for power users */}
                  <div className="form-group">
                    <label>Examples (JSON Array)</label>
                    <textarea 
                      value={JSON.stringify(editingItem.examples || [], null, 2)} 
                      onChange={e => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          setEditingItem({...editingItem, examples: parsed});
                        } catch (err) {
                          // just don't update if invalid json during typing
                        }
                      }} 
                      rows="6"
                      style={{fontFamily: 'monospace'}}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Kanji</label>
                    <input type="text" value={editingItem.kanji} onChange={e => setEditingItem({...editingItem, kanji: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Hiragana</label>
                    <input type="text" value={editingItem.hiragana} onChange={e => setEditingItem({...editingItem, hiragana: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Romaji</label>
                    <input type="text" value={editingItem.romaji} onChange={e => setEditingItem({...editingItem, romaji: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Meaning</label>
                    <input type="text" value={editingItem.meaning} onChange={e => setEditingItem({...editingItem, meaning: e.target.value})} required />
                  </div>
                  <div style={{display:'flex', gap:'12px'}}>
                    <div className="form-group" style={{flex:1}}>
                      <label>Level</label>
                      <input type="text" value={editingItem.level || '-'} onChange={e => setEditingItem({...editingItem, level: e.target.value})} />
                    </div>
                    <div className="form-group" style={{flex:1}}>
                      <label>Importinity (1-3)</label>
                      <input type="number" min="1" max="3" value={editingItem.importinity || 1} onChange={e => setEditingItem({...editingItem, importinity: Number(e.target.value)})} />
                    </div>
                  </div>
                </>
              )}
              
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setEditingItem(null)}>Batal</button>
                <button type="submit" className="admin-btn admin-btn-primary">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Edit Modal */}
      {isBulkEditing && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>Edit {selectedIds.size} Data Terpilih</h3>
              <button className="admin-btn-icon" onClick={() => setIsBulkEditing(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <form onSubmit={saveBulkEdit} className="admin-modal-body admin-form">
              <p style={{marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-muted)'}}>
                Kosongkan field jika tidak ingin mengubah nilainya.
              </p>
              <div className="form-group">
                <label>Level Baru</label>
                <input type="text" placeholder="Biarkan kosong untuk tidak mengubah" value={bulkEditData.level} onChange={e => setBulkEditData({...bulkEditData, level: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Importinity Baru (1-3)</label>
                <input type="number" min="1" max="3" placeholder="Biarkan kosong untuk tidak mengubah" value={bulkEditData.importinity} onChange={e => setBulkEditData({...bulkEditData, importinity: e.target.value})} />
              </div>
              
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setIsBulkEditing(false)}>Batal</button>
                <button type="submit" className="admin-btn admin-btn-primary">Terapkan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
