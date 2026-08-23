import HistoryClient from './HistoryClient';

export const metadata = {
  title: 'Riwayat Belajar - AditFlashcard',
  description: 'Lihat riwayat belajar, kartu sulit, kartu dikuasai, dan statistik harian.',
};

export default function HistoryPage() {
  return <HistoryClient />;
}
