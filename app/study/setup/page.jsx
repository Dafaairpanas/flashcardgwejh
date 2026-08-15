import { fetchAllCards, getChaptersFromCards } from '../../lib/serverData';
import SetupClient from './SetupClient';

export const metadata = {
  title: 'Setup Flashcard - AditFlashcard',
  description: 'Pilih bab dan mode belajar untuk memulai sesi flashcard bahasa Jepang.',
};

export default async function SetupPage() {
  const allCards = await fetchAllCards();
  const chapters = getChaptersFromCards(allCards);

  return <SetupClient initialCards={allCards} initialChapters={chapters} />;
}
