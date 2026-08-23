import { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';

// Valid font values — migrate any old/removed font choices to the default
const VALID_FONTS = [
  '"Noto Sans JP", sans-serif',
  '"Noto Serif JP", serif',
  '"Klee One", cursive',
];

// Google Fonts CSS URLs for fonts that aren't self-hosted
// These are loaded on-demand (non-blocking) only when the user selects them
const GOOGLE_FONT_URLS = {
  '"Noto Serif JP", serif': 'https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&display=swap',
  '"Klee One", cursive': 'https://fonts.googleapis.com/css2?family=Klee+One&display=swap',
};

export default function FontProvider() {
  const jpFont = useStore((state) => state.jpFont);
  const setJpFont = useStore((state) => state.setJpFont);
  const loadedFonts = useRef(new Set());

  useEffect(() => {
    // Migrate removed fonts (Zen Maru Gothic, Hiragino Kaku, Yu Gothic) to default
    if (!VALID_FONTS.includes(jpFont)) {
      setJpFont('"Noto Sans JP", sans-serif');
      return;
    }
    document.documentElement.style.setProperty('--font-jp', jpFont);

    // Lazy-load Google Font CSS only when needed (non-blocking)
    const url = GOOGLE_FONT_URLS[jpFont];
    if (url && !loadedFonts.current.has(url)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      document.head.appendChild(link);
      loadedFonts.current.add(url);
    }
  }, [jpFont, setJpFont]);
  
  return null;
}
