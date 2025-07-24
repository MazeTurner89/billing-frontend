import { useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import ExplorerPage from './components/ExplorerPage';
import AboutPage from './components/AboutPage';

function App() {
  // This state variable will control which page is currently visible.
  const [currentPage, setCurrentPage] = useState('home');

  // This function will render the correct page component based on the state.
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'explorer':
        return <ExplorerPage />;
      case 'about':
        return <AboutPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar setPage={setCurrentPage} />
      <main className="p-4 sm:p-6 md:p-8">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;