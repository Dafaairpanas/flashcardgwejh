import AdminClient from './AdminClient';

export const metadata = {
  title: 'Dashboard Admin - AditFlashcard',
  description: 'Manage flashcard data via GitHub API',
  robots: 'noindex, nofollow',
};

export default function AdminPage() {
  return <AdminClient />;
}
