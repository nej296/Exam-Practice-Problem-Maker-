import { useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import StudyModeSelector from '../practice/StudyModeSelector';
import PageContainer from '../layout/PageContainer';

export default function StudyModeSelectPage() {
  const { semesterId, classId, setId } = useParams<{
    semesterId: string;
    classId: string;
    setId: string;
  }>();
  const { data } = useAppContext();

  const cls =
    semesterId && classId ? data.semesters[semesterId]?.classes[classId] : null;
  const practiceSet = cls && setId ? cls.practiceSets[setId] : null;

  if (!cls || !practiceSet || !semesterId || !classId) {
    return (
      <PageContainer>
        <p className="text-gray-500">Practice set not found.</p>
      </PageContainer>
    );
  }

  return (
    <StudyModeSelector
      semesterId={semesterId}
      classId={classId}
      practiceSet={practiceSet}
    />
  );
}
