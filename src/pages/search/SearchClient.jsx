
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function SearchClient({ allData }) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [categories, setCategories] = useState({
    minna: true,
    irodori: true,
    kanji: true,
    bunpou: true,
    renshuu: true
  });
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [totalMatch, setTotalMatch] = useState(0);
  
  const searchTimeoutRef = useRef(null);

  // Debounce query
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (query.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        setDebouncedQuery(query.trim());
      }, 400);
    } else {
      setDebouncedQuery('');
      setResults([]);
      setHasSearched(false);
      setTotalMatch(0);
    }
    
    return () => clearTimeout(searchTimeoutRef.current);
  }, [query]);

  // Perform local search when debounced query or categories change
  useEffect(() => {
    if (!debouncedQuery || !allData) return;

    setIsLoading(true);
    setHasSearched(true);
    
    setTimeout(() => {
      try {
        const activeCats = Object.entries(categories)
          .filter(([_, isActive]) => isActive)
          .map(([key]) => key);
          
        if (activeCats.length === 0) {
          setResults([]);
          setTotalMatch(0);
          setIsLoading(false);
          return;
        }

        const q = debouncedQuery.toLowerCase();
        let matched = [];

        activeCats.forEach(cat => {
          if (allData[cat]) {
            const filtered = allData[cat].filter(item => {
              if (cat === 'bunpou') {
                return (
                  (item.title && item.title.toLowerCase().includes(q)) ||
                  (item.romajiTitle && item.romajiTitle.toLowerCase().includes(q)) ||
                  (item.meaning && item.meaning.toLowerCase().includes(q)) ||
                  (item.formula && item.formula.toLowerCase().includes(q)) ||
                  (item.examples && item.examples.some(ex => 
                    (ex.jp && ex.jp.toLowerCase().includes(q)) ||
                    (ex.romaji && ex.romaji.toLowerCase().includes(q)) ||
                    (ex.id_translation && ex.id_translation.toLowerCase().includes(q))
                  ))
                );
              }
              
              return (
                (item.kanji && item.kanji.toLowerCase().includes(q)) ||
                (item.hiragana && item.hiragana.toLowerCase().includes(q)) ||
                (item.romaji && item.romaji.toLowerCase().includes(q)) ||
                (item.meaning && item.meaning.toLowerCase().includes(q)) ||
                (item.onyomi && item.onyomi.toLowerCase().includes(q)) ||
                (item.kunyomi && item.kunyomi.toLowerCase().includes(q)) ||
                (item.id && item.id.toLowerCase().includes(q))
              );
            });
            matched = matched.concat(filtered);
          }
        });

        setTotalMatch(matched.length);
        setResults(matched.slice(0, 100));
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 50); // Small timeout to allow UI to update loading state
  }, [debouncedQuery, categories, allData]);

  const toggleCategory = (cat) => {
    setCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  const clearSearch = () => {
    setQuery('');
  };

  const getCategoryColor = (cat) => {
    switch(cat) {
      case 'minna': return 'var(--accent-blue)';
      case 'irodori': return 'var(--accent-orange)';
      case 'kanji': return 'var(--accent-rose)';
      case 'bunpou': return 'var(--accent-violet)';
      case 'renshuu': return 'var(--accent-green)';
      default: return 'var(--text-muted)';
    }
  };

  const getCategoryLabel = (cat) => {
    switch(cat) {
      case 'minna': return 'Minna Kotoba';
      case 'irodori': return 'Irodori Kotoba';
      case 'kanji': return 'Kanji';
      case 'bunpou': return 'Bunpou (Tata Bahasa)';
      case 'renshuu': return 'Renshuu';
      default: return cat;
    }
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', width: '100%' }}>
      <div className="search-container" style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', minHeight: '80vh' }}>
      
      <div className="search-header" style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Universal Search</h1>
        <p style={{ color: 'var(--text-muted)' }}>Cari kosakata, kanji, dan tata bahasa di semua materi</p>
      </div>

      <div className="search-box-wrapper" style={{ position: 'relative', marginBottom: '24px' }}>
        <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:'20px', height:'20px'}}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari kanji, romaji, atau arti (min. 2 karakter)..."
          autoFocus
          style={{
            width: '100%',
            padding: '16px 48px',
            borderRadius: '16px',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            background: 'var(--bg-card)',
            color: 'var(--text-main)',
            fontSize: '1.1rem',
            outline: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'border-color 0.2s, box-shadow 0.2s'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--accent-violet)';
            e.target.style.boxShadow = '0 0 0 4px rgba(168, 85, 247, 0.15)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
          }}
        />
        {query && (
          <button 
            onClick={clearSearch}
            style={{
              position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
              background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
              padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:'20px', height:'20px'}}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        )}
      </div>

      <div className="search-filters" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px', justifyContent: 'center' }}>
        {Object.keys(categories).map(cat => (
          <button
            key={cat}
            onClick={() => toggleCategory(cat)}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              border: `1.5px solid ${categories[cat] ? getCategoryColor(cat) : 'rgba(255,255,255,0.1)'}`,
              background: categories[cat] ? `${getCategoryColor(cat)}22` : 'transparent',
              color: categories[cat] ? getCategoryColor(cat) : 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <div style={{ 
              width: '12px', height: '12px', borderRadius: '50%', 
              background: categories[cat] ? getCategoryColor(cat) : 'transparent',
              border: `1.5px solid ${categories[cat] ? getCategoryColor(cat) : 'var(--text-muted)'}`
            }}></div>
            {getCategoryLabel(cat)}
          </button>
        ))}
      </div>

      <div className="search-results">
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <div className="spinner" style={{ margin: '0 auto 16px', width: '32px', height: '32px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-violet)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            Mencari...
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : hasSearched && results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.5 }}>🔍</div>
            <h3 style={{ marginBottom: '8px' }}>Tidak ada hasil</h3>
            <p style={{ color: 'var(--text-muted)' }}>Coba kata kunci lain atau periksa filter kategori Anda.</p>
          </div>
        ) : results.length > 0 ? (
          <div>
            <div style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>Ditemukan <strong>{totalMatch}</strong> hasil untuk "{debouncedQuery}"</span>
              {totalMatch > 100 && <span style={{ color: 'var(--accent-orange)' }}>Menampilkan 100 teratas</span>}
            </div>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              {results.map((item, idx) => (
                <div key={item.id || idx} style={{ 
                  background: 'var(--bg-card)', 
                  borderRadius: '12px', 
                  padding: '16px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px',
                    background: getCategoryColor(item._category)
                  }}></div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      padding: '2px 8px', 
                      borderRadius: '4px',
                      background: `${getCategoryColor(item._category)}22`,
                      color: getCategoryColor(item._category),
                      fontWeight: 600,
                      display: 'inline-block'
                    }}>
                      {getCategoryLabel(item._category)} • {item.chapter || item.source || item._sourceFile.replace('.json', '')}
                    </div>
                  </div>
                  
                  {item._category === 'bunpou' ? (
                    <div>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '4px', color: 'var(--accent-violet)' }}>{item.title}</h3>
                      {item.formula && (
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px', fontFamily: 'var(--font-jp)' }}>
                          <strong>Pola:</strong> {item.formula}
                        </div>
                      )}
                      <div style={{ fontSize: '0.95rem' }}>{item.meaning}</div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                        {item.kanji && (
                          <div style={{ fontSize: '2rem', fontFamily: 'var(--font-jp)', lineHeight: 1 }}>{item.kanji}</div>
                        )}
                        <div>
                          <div style={{ fontSize: item.kanji ? '1rem' : '1.5rem', fontFamily: 'var(--font-jp)', color: item.kanji ? 'var(--text-muted)' : 'var(--text-main)' }}>
                            {item._category === 'kanji' ? (item.onyomi || item.kunyomi || '') : item.hiragana}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {item._category === 'kanji' ? (item.kunyomi ? `Kun: ${item.kunyomi}` : '') : item.romaji}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--accent-blue)' }}>{item.meaning}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
    </div>
  );
}
