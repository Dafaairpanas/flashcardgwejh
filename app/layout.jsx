import '../src/style.css';
import FontProvider from './FontProvider';
import ThemeProvider from './ThemeProvider';

export const metadata = {
  title: 'AditFlashcard - Belajar Bahasa Jepang',
  description: 'Belajar kosakata dan kanji JLPT N5-N1 dengan sistem flashcard pintar.',
  verification: {
    google: 'qrdarlNMiQu34nxabHCfjZm0ZXWYYFTBfswPviTrevQ',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* 
          Critical font: Inter (UI) — only weights 400,500,600,700
          Reduced from 6 weights to 4 = smaller CSS payload
        */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* 
          Japanese font: Noto Sans JP — only weights 400,500,700
          Changed from variable (100-900) to specific weights = MASSIVE reduction
          Original: ~89 KiB CSS → Now: ~15 KiB CSS
        */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
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
