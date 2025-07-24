export default function Navbar({ setPage }) {
    return (
      <nav className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <span
                className="text-2xl font-bold text-indigo-600 cursor-pointer"
                onClick={() => setPage('home')}
              >
                BillWise
              </span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button onClick={() => setPage('home')} className="text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium transition">Home</button>
                <button onClick={() => setPage('explorer')} className="text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium transition">Data Explorer</button>
                <button onClick={() => setPage('about')} className="text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium transition">About</button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
  
  