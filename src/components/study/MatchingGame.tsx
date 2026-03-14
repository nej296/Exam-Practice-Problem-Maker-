import { useState, useMemo } from 'react';
import { RotateCcw, X } from 'lucide-react';
import { shuffleArray } from '../../utils/helpers';
import type { Problem } from '../../types';

interface Props {
  problems: Problem[];
  onExit: () => void;
}

function getAnswerText(p: Problem): string {
  if (p.type === 'multiple-choice' && p.options && p.correctOption !== undefined) {
    return p.options[p.correctOption];
  }
  return p.answer;
}

export default function MatchingGame({ problems, onExit }: Props) {
  const shuffledAnswers = useMemo(() => {
    return shuffleArray(problems.map((p, i) => ({ index: i, text: getAnswerText(p) })));
  }, [problems]);

  const [selectedQ, setSelectedQ] = useState<number | null>(null);
  const [selectedA, setSelectedA] = useState<number | null>(null);
  const [pairs, setPairs] = useState<Record<number, number>>({}); // q index -> a original index
  const [incorrect, setIncorrect] = useState<{ q: number; a: number } | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [finished, setFinished] = useState(false);

  const pairedQuestions = new Set(Object.keys(pairs).map(Number));
  const pairedAnswers = new Set(Object.values(pairs));

  const tryPair = (qIdx: number, aOrigIdx: number) => {
    setAttempts((a) => a + 1);
    if (qIdx === aOrigIdx) {
      const newPairs = { ...pairs, [qIdx]: aOrigIdx };
      setPairs(newPairs);
      setSelectedQ(null);
      setSelectedA(null);
      setIncorrect(null);
      if (Object.keys(newPairs).length === problems.length) {
        setFinished(true);
      }
    } else {
      setIncorrect({ q: qIdx, a: aOrigIdx });
      setTimeout(() => {
        setIncorrect(null);
        setSelectedQ(null);
        setSelectedA(null);
      }, 800);
    }
  };

  const handleQClick = (idx: number) => {
    if (pairedQuestions.has(idx)) return;
    setSelectedQ(idx);
    if (selectedA !== null) {
      tryPair(idx, selectedA);
    }
  };

  const handleAClick = (origIdx: number) => {
    if (pairedAnswers.has(origIdx)) return;
    setSelectedA(origIdx);
    if (selectedQ !== null) {
      tryPair(selectedQ, origIdx);
    }
  };

  const reset = () => {
    setPairs({});
    setSelectedQ(null);
    setSelectedA(null);
    setIncorrect(null);
    setAttempts(0);
    setFinished(false);
  };

  const correctCount = Object.keys(pairs).length;

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8 text-center">
        <h2 className="text-2xl font-bold mb-2">All Matched!</h2>
        <p className="text-gray-500 mb-1">
          {correctCount} / {problems.length} correct
        </p>
        <p className="text-sm text-gray-400 mb-6">{attempts} total attempts</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 text-sm border border-black rounded-md px-4 py-2 hover:bg-gray-50 transition-colors"
          >
            <RotateCcw size={14} />
            Reset
          </button>
          <button
            onClick={onExit}
            className="text-sm bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            Exit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-sm text-gray-500">
            Matched: {correctCount} / {problems.length} &middot; Attempts: {attempts}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-sm border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors"
          >
            <RotateCcw size={14} />
            Reset
          </button>
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 text-sm border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors"
          >
            <X size={14} />
            Exit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Questions */}
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
            Questions
          </h3>
          {problems.map((p, i) => (
            <button
              key={i}
              onClick={() => handleQClick(i)}
              disabled={pairedQuestions.has(i)}
              className={`w-full text-left px-4 py-3 rounded-md text-sm border transition-all ${
                pairedQuestions.has(i)
                  ? 'border-gray-100 bg-gray-50 text-gray-300'
                  : selectedQ === i
                  ? 'border-black bg-black text-white'
                  : incorrect?.q === i
                  ? 'border-gray-400 bg-gray-100'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {p.question}
            </button>
          ))}
        </div>

        {/* Answers */}
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
            Answers
          </h3>
          {shuffledAnswers.map((a) => (
            <button
              key={a.index}
              onClick={() => handleAClick(a.index)}
              disabled={pairedAnswers.has(a.index)}
              className={`w-full text-left px-4 py-3 rounded-md text-sm border transition-all ${
                pairedAnswers.has(a.index)
                  ? 'border-gray-100 bg-gray-50 text-gray-300'
                  : selectedA === a.index
                  ? 'border-black bg-black text-white'
                  : incorrect?.a === a.index
                  ? 'border-gray-400 bg-gray-100'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {a.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
