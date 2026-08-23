import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ThemeProvider from './pages/ThemeProvider';
import FontProvider from './pages/FontProvider';
import PwaUpdater from './pages/PwaUpdater';

import Home from './pages/page';
import Settings from './pages/settings/page';
import Study from './pages/study/page';
import StudySetup from './pages/study/setup/page';
import StudyHistory from './pages/study/history/page';
import Kanji from './pages/kanji/page';
import Kotoba from './pages/kotoba/page';
import Renshuu from './pages/renshuu/page';
import Bunpou from './pages/bunpou/page';
import BunpouChapter from './pages/bunpou/[source]/[chapter]/page';
import Complete from './pages/complete/page';
import Search from './pages/search/page';
import Admin from './pages/admin/page';
import AdminAdit from './pages/adminadit/page';

export default function App() {
  return (
    <Router>
      <FontProvider />
      <ThemeProvider>
        <PwaUpdater />
        <div className="ambient-bg">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/study" element={<Study />} />
          <Route path="/study/setup" element={<StudySetup />} />
          <Route path="/study/history" element={<StudyHistory />} />
          <Route path="/kanji" element={<Kanji />} />
          <Route path="/kotoba" element={<Kotoba />} />
          <Route path="/renshuu" element={<Renshuu />} />
          <Route path="/bunpou" element={<Bunpou />} />
          <Route path="/bunpou/:source/:chapter" element={<BunpouChapter />} />
          <Route path="/complete" element={<Complete />} />
          <Route path="/search" element={<Search />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/adminadit" element={<AdminAdit />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}
