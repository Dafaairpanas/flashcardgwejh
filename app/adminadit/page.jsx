import AdminClient from './AdminClient';
import { fetchAllSearchData } from '../lib/serverData';

export const metadata = {
  title: 'Dashboard Admin - AditFlashcard',
  description: 'Manage flashcard data via GitHub API',
  robots: 'noindex, nofollow',
};

export default async function AdminPage() {
  const allData = await fetchAllSearchData();
  return <AdminClient allData={allData} />;
}
