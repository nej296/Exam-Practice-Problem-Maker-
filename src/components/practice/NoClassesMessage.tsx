import { useNavigate } from 'react-router-dom';
import PageContainer from '../layout/PageContainer';

export default function NoClassesMessage() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <div className="text-center py-20">
        <h2 className="text-xl font-bold mb-3">
          Please create a class first before making any practice problems.
        </h2>
        <button
          onClick={() => navigate('/scheduler')}
          className="text-sm text-gray-500 hover:text-black underline underline-offset-4 transition-colors mt-2"
        >
          Go to Exam Scheduler &rarr;
        </button>
      </div>
    </PageContainer>
  );
}
