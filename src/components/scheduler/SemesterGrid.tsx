import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ChevronRight } from 'lucide-react';
import PageContainer from '../layout/PageContainer';

const SEMESTER_ORDER = [
  'spring-2026', 'summer-2026', 'fall-2026',
  'winter-2027', 'spring-2027', 'summer-2027',
];

export default function SemesterGrid() {
  const { data } = useAppContext();
  const navigate = useNavigate();

  return (
    <PageContainer>
      <h2 className="text-2xl font-bold mb-6">Exam Scheduler</h2>
      <p className="text-gray-500 text-sm mb-8">Select a semester to manage your classes and exams.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SEMESTER_ORDER.map((semId) => {
          const sem = data.semesters[semId];
          if (!sem) return null;
          const classCount = Object.keys(sem.classes).length;
          return (
            <button
              key={semId}
              onClick={() => navigate(`/scheduler/${semId}`)}
              className="group border border-gray-200 rounded-lg p-6 text-left hover:shadow-md hover:border-gray-300 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">{sem.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {classCount === 0
                      ? 'No classes yet'
                      : `${classCount} class${classCount > 1 ? 'es' : ''}`}
                  </p>
                </div>
                <ChevronRight
                  size={20}
                  className="text-gray-400 group-hover:text-black transition-colors"
                />
              </div>
            </button>
          );
        })}
      </div>
    </PageContainer>
  );
}
