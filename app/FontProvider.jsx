'use client';
import { useEffect } from 'react';
import { useStore } from '../src/store/useStore';

export default function FontProvider() {
  const jpFont = useStore((state) => state.jpFont);
  
  useEffect(() => {
    document.documentElement.style.setProperty('--font-jp', jpFont);
  }, [jpFont]);
  
  return null;
}
