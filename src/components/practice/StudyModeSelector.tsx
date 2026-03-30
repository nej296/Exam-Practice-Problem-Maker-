import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  ClipboardCheck,
  Timer,
} from 'lucide-react';
import type { StudyMode, PracticeSet } from '../../types';
import PageContainer from '../layout/PageContainer';

interface Props {
  semesterId: string;
  classId: string;
  practiceSet: PracticeSet;
}

const MODES: {
  id: StudyMode;
  name: string;
  description: string;
  icon: typeof Layers;
}[] = [
  {
    id: 'flashcards',
    name: 'Flashcards',
    description: 'Flip through your questions one at a time. See the question, then reveal the answer.',
    icon: Layers,
  },
  {
    id: 'quiz',
    name: 'Quiz Mode',
    description: 'Answer questions one by one and get scored at the end.',
    icon: ClipboardCheck,
  },
  {
    id: 'practice-exam',
    name: 'Practice Exam with Timer',
    description: 'Simulate a real exam environment with a countdown timer.',
    icon: Timer,
  },
];

export default function StudyModeSelector({ semesterId, classId, practiceSet }: Props) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<StudyMode>('flashcards');
  const [questionCount, setQuestionCount] = useState(practiceSet.problems.length);
  const [shuffle, setShuffle] = useState(true);
  const [timeLimit, setTimeLimit] = useState(60);

  const maxQ = practiceSet.problems.length;

  const startStudying = () => {
    const params = new URLSearchParams({
      mode: selected,
      count: String(Math.min(questionCount, maxQ)),
      shuffle: String(shuffle),
      time: String(timeLimit),
    });
    navigate(
      `/study/${semesterId}/${classId}/${practiceSet.id}/session?${params.toString()}`
    );
  };

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto text-center">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">
            Practice set "{practiceSet.name}" created with {maxQ} question{maxQ !== 1 ? 's' : ''}!
          </h2>
          <p className="text-gray-500">How would you like to study these problems?</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8 text-left">
          {MODES.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => setSelected(mode.id)}
                className={`border rounded-lg p-4 transition-all text-left ${
                  selected === mode.id
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <Icon
                  size={20}
                  className={`mb-2 ${selected === mode.id ? 'text-white' : 'text-gray-400'}`}
                />
                <h3 className="text-sm font-medium mb-1">{mode.name}</h3>
                <p
                  className={`text-xs ${
                    selected === mode.id ? 'text-gray-300' : 'text-gray-500'
                  }`}
                >
                  {mode.description}
                </p>
              </button>
            );
          })}
        </div>

        {(selected === 'quiz' || selected === 'practice-exam') && (
          <div className="border border-gray-200 rounded-lg p-4 mb-6 text-left max-w-sm mx-auto">
            <h4 className="text-sm font-medium mb-3">Options</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Number of questions ({maxQ} available)
                </label>
                <input
                  type="range"
                  min={1}
                  max={maxQ}
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full accent-black"
                />
                <span className="text-sm font-medium">{questionCount}</span>
              </div>
              {selected === 'quiz' && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shuffle}
                    onChange={(e) => setShuffle(e.target.checked)}
                    className="accent-black"
                  />
                  <span className="text-sm">Shuffle order</span>
                </label>
              )}
              {selected === 'practice-exam' && (
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Time limit (minutes)</label>
                  <input
                    type="number"
                    min={1}
                    max={300}
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                    className="w-20 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col items-center gap-3">
          <button
            onClick={startStudying}
            className="bg-black text-white px-8 py-3 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Start Studying
          </button>
          <button
            onClick={() => navigate(`/practice/${semesterId}/${classId}/${practiceSet.id}/edit`)}
            className="text-sm text-gray-500 hover:text-black underline underline-offset-4 transition-colors"
          >
            Edit Set
          </button>
          <button
            onClick={() => navigate(`/scheduler/${semesterId}`)}
            className="text-sm text-gray-500 hover:text-black underline underline-offset-4 transition-colors"
          >
            Study Later
          </button>
        </div>
      </div>
    </PageContainer>
  );
}
