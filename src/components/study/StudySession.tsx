import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { shuffleArray } from '../../utils/helpers';
import { useMemo } from 'react';
import FlashcardMode from './FlashcardMode';
import QuizMode from './QuizMode';
import PracticeExamMode from './PracticeExamMode';
import PageContainer from '../layout/PageContainer';
import type { StudyMode } from '../../types';

export default function StudySession() {
  const { semesterId, classId, setId } = useParams<{
    semesterId: string;
    classId: string;
    setId: string;
  }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data } = useAppContext();

  const mode = (searchParams.get('mode') || 'flashcards') as StudyMode;
  const count = Number(searchParams.get('count') || '999');
  const shouldShuffle = searchParams.get('shuffle') !== 'false';
  const timeLimit = Number(searchParams.get('time') || '60');

  const practiceSet =
    semesterId && classId && setId
      ? data.semesters[semesterId]?.classes[classId]?.practiceSets[setId]
      : null;

  const problems = useMemo(() => {
    if (!practiceSet) return [];
    let probs = [...practiceSet.problems];
    if (shouldShuffle) probs = shuffleArray(probs);
    return probs.slice(0, count);
  }, [practiceSet, count, shouldShuffle]);

  if (!practiceSet || problems.length === 0) {
    return (
      <PageContainer>
        <p className="text-gray-500">Practice set not found or has no problems.</p>
      </PageContainer>
    );
  }

  const handleExit = () => {
    navigate(`/scheduler/${semesterId}`);
  };

  switch (mode) {
    case 'flashcards':
      return <FlashcardMode problems={problems} onExit={handleExit} />;
    case 'quiz':
      return <QuizMode problems={problems} onExit={handleExit} />;
    case 'practice-exam':
      return <PracticeExamMode problems={problems} timeLimit={timeLimit} onExit={handleExit} />;
    default:
      return <FlashcardMode problems={problems} onExit={handleExit} />;
  }
}
