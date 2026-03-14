import { useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const isScheduler = location.pathname.startsWith('/scheduler') || location.pathname === '/';
  const isPractice = location.pathname.startsWith('/practice') || location.pathname.startsWith('/study');

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <h1
          className="text-xl font-bold tracking-tight cursor-pointer select-none"
          onClick={() => navigate('/')}
        >
          Exam Scheduling and Practice Problems
        </h1>
        <nav className="flex gap-2">
          <button
            onClick={() => navigate('/scheduler')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              isScheduler
                ? 'bg-black text-white'
                : 'border border-black text-black hover:bg-gray-50'
            }`}
          >
            Exam Scheduler
          </button>
          <button
            onClick={() => navigate('/practice')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              isPractice
                ? 'bg-black text-white'
                : 'border border-black text-black hover:bg-gray-50'
            }`}
          >
            Create Practice Problems
          </button>
        </nav>
      </div>
    </header>
  );
}
