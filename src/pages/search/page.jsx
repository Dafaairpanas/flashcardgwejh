import React, { useEffect, useState } from 'react';
import SearchClient from './SearchClient';

export default function SearchPage() {
  const [allData, setAllData] = useState(null);

  useEffect(() => {
    fetch('/api/all-search-data.json')
      .then(res => res.json())
      .then(data => setAllData(data))
      .catch(console.error);
  }, []);

  return <SearchClient allData={allData} />;
}
