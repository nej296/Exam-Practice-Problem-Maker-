import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ArrowLeft, Plus } from 'lucide-react';
import PageContainer from '../layout/PageContainer';
import ProblemEntry from './ProblemEntry';
import { generateId } from '../../utils/helpers';
import type { Problem } from '../../types';

function createEmptyProblem(): Problem {
  return {
    id: generateId(),
    type: 'open-ended',
    question: '',
    answer: '',
  };
}

export default function ProblemCreator() {
  const { semesterId, classId } = useParams<{ semesterId: string; classId: string }>();
  const { data, dispatch } = useAppContext();
  const navigate = useNavigate();

  const cls = semesterId && classId ? data.semesters[semesterId]?.classes[classId] : null;

  const [problems, setProblems] = useState<Problem[]>([createEmptyProblem()]);
  const [setName, setSetName] = useState('');

  if (!cls || !semesterId || !classId) {
    return (
      <PageContainer>
        <p className="text-gray-500">Class not found.</p>
      </PageContainer>
    );
  }

  const updateProblem = (index: number, updated: Problem) => {
    const newProblems = [...problems];
    newProblems[index] = updated;
    setProblems(newProblems);
  };

  const removeProblem = (index: number) => {
    if (problems.length === 1) return;
    setProblems(problems.filter((_, i) => i !== index));
  };

  const handleCreate = () => {
    if (!setName.trim()) {
      alert('Please enter a name for this practice set.');
      return;
    }
    const validProblems = problems.filter((p) => p.question.trim());
    if (validProblems.length === 0) {
      alert('Please add at least one question.');
      return;
    }

    dispatch({
      type: 'ADD_PRACTICE_SET',
      semesterId,
      classId,
      set: {
        name: setName.trim(),
        problems: validProblems,
      },
    });

    // Find the just-created set ID
    // Navigate to study mode selector
    // We need to get the latest data after dispatch, so use a small trick
    navigate(`/practice/${semesterId}/${classId}/success`, {
      state: { setName: setName.trim(), problemCount: validProblems.length },
    });
  };

  return (
    <PageContainer>
      <button
        onClick={() => navigate('/practice')}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-black mb-4 transition-colors"
      >
        <ArrowLeft size={16} />
        Create Practice Problems
      </button>

      <h2 className="text-2xl font-bold mb-1">Create Practice Problems for {cls.name}</h2>
      <p className="text-sm text-gray-500 mb-6">Build a set of practice problems to study.</p>

      {/* Problem Builder */}
      <div className="space-y-4 mb-6">
        {problems.map((problem, index) => (
          <ProblemEntry
            key={problem.id}
            problem={problem}
            index={index}
            onChange={(updated) => updateProblem(index, updated)}
            onRemove={() => removeProblem(index)}
          />
        ))}
      </div>

      <button
        onClick={() => setProblems([...problems, createEmptyProblem()])}
        className="flex items-center gap-2 text-sm border border-black rounded-md px-4 py-2 hover:bg-gray-50 transition-colors mb-6"
      >
        <Plus size={16} />
        Add Another Question
      </button>

      <p className="text-sm text-gray-500 mb-6">
        {problems.filter((p) => p.question.trim()).length} question{problems.filter((p) => p.question.trim()).length !== 1 ? 's' : ''} created
      </p>

      <div className="border-t border-gray-200 pt-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Set Name</label>
          <input
            type="text"
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
            placeholder='e.g., Chapter 5 Review, Midterm Prep'
            className="w-full max-w-md border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
          />
        </div>

        <button
          onClick={handleCreate}
          className="bg-black text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Create Practice Problems
        </button>
      </div>
    </PageContainer>
  );
}
