import React, { useEffect, useState } from 'react';
import AdminClient from './AdminClient';

export default function AdminPage() {
  const [allData, setAllData] = useState(null);

  useEffect(() => {
    fetch('/api/all-search-data.json')
      .then(res => res.json())
      .then(data => setAllData(data))
      .catch(console.error);
  }, []);

  return <AdminClient allData={allData} />;
}
