import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <h1
          className="text-xl font-bold tracking-tight cursor-pointer select-none"
          onClick={() => navigate('/')}
        >
          Exam Scheduler and Practice Problems
        </h1>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>
    </header>
  );
}
