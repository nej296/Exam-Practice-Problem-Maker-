import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import PageContainer from '../layout/PageContainer';
import NoClassesMessage from './NoClassesMessage';
import { ChevronRight } from 'lucide-react';

export default function ClassSelector() {
  const { getAllClasses } = useAppContext();
  const navigate = useNavigate();

  const allClasses = getAllClasses();

  if (allClasses.length === 0) {
    return <NoClassesMessage />;
  }

  // Group by semester
  const grouped: Record<string, typeof allClasses> = {};
  for (const item of allClasses) {
    if (!grouped[item.semesterName]) grouped[item.semesterName] = [];
    grouped[item.semesterName].push(item);
  }

  return (
    <PageContainer>
      <h2 className="text-2xl font-bold mb-6">Create Practice Problems</h2>
      <p className="text-gray-500 text-sm mb-8">Select a class to create practice problems for.</p>

      <div className="space-y-6">
        {Object.entries(grouped).map(([semName, items]) => (
          <div key={semName}>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              {semName}
            </h3>
            <div className="space-y-2">
              {items.map(({ semesterId, cls }) => (
                <button
                  key={cls.id}
                  onClick={() => navigate(`/practice/${semesterId}/${cls.id}`)}
                  className="group w-full flex items-center justify-between border border-gray-200 rounded-lg p-4 text-left hover:shadow-md hover:border-gray-300 transition-all"
                >
                  <span className="font-medium text-sm">
                    Create Practice Problems for {cls.name}
                  </span>
                  <ChevronRight
                    size={18}
                    className="text-gray-400 group-hover:text-black transition-colors"
                  />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
