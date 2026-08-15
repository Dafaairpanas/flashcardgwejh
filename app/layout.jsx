import '../src/style.css';
import FontProvider from './FontProvider';
import ThemeProvider from './ThemeProvider';

export const metadata = {
  title: 'AditFlashcard - Belajar Bahasa Jepang',
  description: 'Belajar kosakata dan kanji JLPT N5-N1 dengan sistem flashcard pintar.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
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
