import React, { useState } from 'react';
import Navigation from './components/Navigation';
import VisitorForm from './components/VisitorForm';
import TodaysRecords from './components/TodaysRecords';

function App() {
  const [currentPage, setCurrentPage] = useState<'entry' | 'records'>('entry');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      
      {currentPage === 'entry' ? <VisitorForm /> : <TodaysRecords />}
    </div>
  );
}

export default App;