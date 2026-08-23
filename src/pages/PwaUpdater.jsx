
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

  if (!show) return null;

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
        @keyframes spinLoading {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
      
      {status === 'downloading' ? (
        <>
          <svg style={{ animation: 'spinLoading 1.2s linear infinite' }} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2V6M12 18V22M6 12H2M22 12H18M19.0784 19.0784L16.25 16.25M19.0784 4.92157L16.25 7.75M4.92157 19.0784L7.75 16.25M4.92157 4.92157L7.75 7.75" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Mengunduh data offline...
        </>
      ) : (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Siap digunakan offline!
        </>
      )}
    </div>
  );
}
