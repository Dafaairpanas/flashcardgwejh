import '../src/fonts.css';
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
