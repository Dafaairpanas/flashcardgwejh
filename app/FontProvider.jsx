'use client';
import { useEffect, useRef } from 'react';
import { useStore } from '../src/store/useStore';

// Lazy-load optional Japanese fonts only when user selects them in Settings
const LAZY_FONTS = {
  '"Klee One", cursive': 'https://fonts.googleapis.com/css2?family=Klee+One&display=swap',
  '"Zen Maru Gothic", sans-serif': 'https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic&display=swap',
};

export default function FontProvider() {
  const jpFont = useStore((state) => state.jpFont);
  const loadedFontsRef = useRef(new Set());
  
  useEffect(() => {
    document.documentElement.style.setProperty('--font-jp', jpFont);

    // Check if this font needs lazy loading
    for (const [fontValue, url] of Object.entries(LAZY_FONTS)) {
      if (jpFont.includes(fontValue.split(',')[0].replace(/"/g, '')) && !loadedFontsRef.current.has(url)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.head.appendChild(link);
        loadedFontsRef.current.add(url);
      }
    }
  }, [jpFont]);
  
  return null;
}
