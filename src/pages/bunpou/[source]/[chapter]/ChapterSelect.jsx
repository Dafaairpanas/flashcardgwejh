
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChapterSelect({ source, currentChapter }) {
  const router = useNavigate();
  
  // Determine chapters based on source
  let chapters = [];
  if (source === 'minna') {
    chapters = Array.from({ length: 50 }, (_, i) => `bab${String(i + 1).padStart(2, '0')}`);
  } else {
    // All Irodori levels (a1, a2-1, a2-2) have 18 chapters
    chapters = Array.from({ length: 18 }, (_, i) => `bab${String(i + 1).padStart(2, '0')}`);
  }

  const handleChange = (e) => {
    const selectedChapter = e.target.value;
    router(`/bunpou/${source}/${selectedChapter}`);
  };

  return (
    <select 
      value={currentChapter} 
      onChange={handleChange}
      style={{
        background: 'var(--bg-input)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-glass)',
        borderRadius: '8px',
        padding: '6px 32px 6px 12px',
        fontSize: '0.9rem',
        cursor: 'pointer',
        outline: 'none',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23999999%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px top 50%',
        backgroundSize: '10px auto'
      }}
    >
      {chapters.map(chap => (
        <option 
          key={chap} 
          value={chap}
          style={{ background: '#1a1a1a', color: '#ffffff' }}
        >
          {chap.replace('bab', 'Bab ')}
        </option>
      ))}
    </select>
  );
}
