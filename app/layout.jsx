import '../src/fonts.css';
import '../src/style.css';
import FontProvider from './FontProvider';
import ThemeProvider from './ThemeProvider';
import PwaUpdater from './PwaUpdater';

export const metadata = {
  title: 'AditFlashcard - Belajar Bahasa Jepang',
  description: 'Belajar kosakata dan kanji JLPT N5-N1 dengan sistem flashcard pintar.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'AditFlashcard',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    apple: '/icon192_rounded.png',
  },
  verification: {
    google: 'qrdarlNMiQu34nxabHCfjZm0ZXWYYFTBfswPviTrevQ',
  },
};

export const viewport = {
  themeColor: '#0a0a0b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var font = localStorage.getItem('gw_jp_font') || '"Noto Sans JP", sans-serif';
                document.documentElement.style.setProperty('--font-jp', font);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        <PwaUpdater />
        <FontProvider />
        <ThemeProvider>
          <div className="ambient-bg">
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
