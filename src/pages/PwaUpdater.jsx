
import { useEffect, useState } from 'react';

export default function PwaUpdater() {
  const [status, setStatus] = useState(''); // 'downloading' | 'ready'
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      let refreshing = false;
      
      // Deteksi ketika Service Worker baru mengambil alih
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });

      // Pantau proses registrasi & instalasi Service Worker
      navigator.serviceWorker.getRegistration().then(reg => {
        if (!reg) return;

        const trackInstallation = (sw) => {
          sw.addEventListener('statechange', (e) => {
            if (e.target.state === 'installed') {
              setStatus('ready');
              setTimeout(() => {
                setShow(false);
              }, 4000); // Sembunyikan toast setelah 4 detik
            }
          });
        };

        // Sedang instalasi (awal load)
        if (reg.installing) {
          setStatus('downloading');
          setShow(true);
          trackInstallation(reg.installing);
        }

        // Jika ada update baru yang ditemukan dan mulai instal
        reg.addEventListener('updatefound', () => {
          if (reg.installing) {
            setStatus('downloading');
            setShow(true);
            trackInstallation(reg.installing);
          }
        });
      });
    }
  }, []);

  if (!show || status !== 'ready') return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '32px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(15, 15, 15, 0.85)',
      backdropFilter: 'blur(12px)',
      color: '#fff',
      padding: '12px 24px',
      borderRadius: '50px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      border: '1px solid rgba(255,255,255,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      zIndex: 99999,
      fontFamily: 'inherit',
      fontSize: '14px',
      fontWeight: '500',
      animation: 'slideUpToast 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      whiteSpace: 'nowrap'
    }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUpToast {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}} />
      
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Aplikasi siap digunakan offline!
    </div>
  );
}
