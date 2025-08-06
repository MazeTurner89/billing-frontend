// ===================================================================================
// FILE: src/App.jsx (FINAL)
// ===================================================================================
import { useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import ExplorerPage from './components/ExplorerPage';
import AboutPage from './components/AboutPage';
import Footer from './components/Footer';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    if (currentPage === 'explorer') {
      return <ExplorerPage />;
    }
    if (currentPage === 'about') {
      return <AboutPage />;
    }
    // Default to home page
    return <HomePage />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar page={currentPage} setPage={setCurrentPage} />
      <main className="flex-grow p-4 sm:p-6 md:p-10">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default App;