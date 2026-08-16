'use client';

import { useEffect } from 'react';

export default function PwaUpdater() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      let refreshing = false;
      
      // Deteksi ketika Service Worker baru mengambil alih (update tersedia)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          // Reload halaman secara otomatis agar user mendapat versi terbaru
          window.location.reload();
        }
      });
    }
  }, []);

  return null; // Komponen ini tidak me-render apapun, hanya menjalankan script di background
}
