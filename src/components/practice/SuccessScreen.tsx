import { useParams, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import StudyModeSelector from './StudyModeSelector';
import PageContainer from '../layout/PageContainer';

export default function SuccessScreen() {
  const { semesterId, classId } = useParams<{ semesterId: string; classId: string }>();
  const { data } = useAppContext();
  const location = useLocation();

  const cls = semesterId && classId ? data.semesters[semesterId]?.classes[classId] : null;
  if (!cls || !semesterId || !classId) {
    return (
      <PageContainer>
        <p className="text-gray-500">Class not found.</p>
      </PageContainer>
    );
  }

  // Get the most recently created practice set
  const sets = Object.values(cls.practiceSets);
  const state = location.state as { setName?: string } | null;
  const latestSet = state?.setName
    ? sets.find((s) => s.name === state.setName) || sets[sets.length - 1]
    : sets[sets.length - 1];

  if (!latestSet) {
    return (
      <PageContainer>
        <p className="text-gray-500">No practice set found.</p>
      </PageContainer>
    );
  }

  return (
    <StudyModeSelector
      semesterId={semesterId}
      classId={classId}
      practiceSet={latestSet}
    />
  );
}
