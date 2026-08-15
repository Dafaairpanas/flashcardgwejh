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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Klee+One&family=Noto+Sans+JP:wght@100..900&family=Zen+Maru+Gothic&display=swap"
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

