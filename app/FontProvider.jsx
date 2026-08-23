'use client';
import { useEffect } from 'react';
import { useStore } from '../src/store/useStore';

// Valid font values — migrate any old/removed font choices to the default
const VALID_FONTS = [
  '"Noto Sans JP", sans-serif',
  '"Noto Serif JP", serif',
  '"Klee One", cursive',
];

export default function FontProvider() {
  const jpFont = useStore((state) => state.jpFont);
  const setJpFont = useStore((state) => state.setJpFont);
  
  useEffect(() => {
    // Migrate removed fonts (Zen Maru Gothic, Hiragino Kaku, Yu Gothic) to default
    if (!VALID_FONTS.includes(jpFont)) {
      setJpFont('"Noto Sans JP", sans-serif');
      return;
    }
    document.documentElement.style.setProperty('--font-jp', jpFont);
  }, [jpFont, setJpFont]);
  
  return null;
}
