
// ===================================================================================
// FILE: src/components/Navbar.jsx (FINAL)
// ===================================================================================
export default function Navbar({ page, setPage }) {
  const linkClasses = (pageName) => 
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      page === pageName 
        ? 'bg-indigo-600 text-white' 
        : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
    }`;

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <span
              className="text-2xl font-bold text-indigo-600 cursor-pointer flex items-center gap-2"
              onClick={() => setPage('home')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              BillWise
            </span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button onClick={() => setPage('home')} className={linkClasses('home')}>Home</button>
              <button onClick={() => setPage('explorer')} className={linkClasses('explorer')}>Data Explorer</button>
              <button onClick={() => setPage('about')} className={linkClasses('about')}>About</button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
