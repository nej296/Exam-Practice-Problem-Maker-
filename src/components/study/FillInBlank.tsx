import { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { getSignificantWords } from '../../utils/helpers';
import type { Problem } from '../../types';

interface Props {
  problems: Problem[];
  onExit: () => void;
}

interface BlankEntry {
  problem: Problem;
  answerWords: string[];
  blankedIndices: number[];
}

function createBlanks(problems: Problem[]): BlankEntry[] {
  return problems.map((p) => {
    const answerText = p.type === 'multiple-choice' && p.options && p.correctOption !== undefined
      ? p.options[p.correctOption]
      : p.answer;

    const words = answerText.split(/\s+/);
    const significant = getSignificantWords(answerText);

    // Pick 1-3 random significant words to blank out
    const count = Math.min(Math.max(1, Math.floor(significant.length * 0.4)), 3);
    const shuffled = [...significant].sort(() => Math.random() - 0.5);
    const blankedIndices = shuffled.slice(0, count).map((s) => s.index);

    return { problem: p, answerWords: words, blankedIndices };
  });
}

export default function FillInBlank({ problems, onExit }: Props) {
  const blanks = useMemo(() => createBlanks(problems), [problems]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState<{ total: number; correct: number }[]>([]);
  const [finished, setFinished] = useState(false);

  const current = blanks[currentIndex];

  const getInputKey = (qIdx: number, blankIdx: number) => `${qIdx}-${blankIdx}`;

  const checkCurrent = () => {
    let correct = 0;
    for (const bIdx of current.blankedIndices) {
      const key = getInputKey(currentIndex, bIdx);
      const userVal = (inputs[key] || '').trim().toLowerCase();
      const actual = current.answerWords[bIdx].toLowerCase().replace(/[.,;:!?]/g, '');
      if (userVal === actual) correct++;
    }
    setResults([...results, { total: current.blankedIndices.length, correct }]);
    setShowResult(true);
  };

  const advance = () => {
    setShowResult(false);
    if (currentIndex >= blanks.length - 1) {
      setFinished(true);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (finished) {
    const totalBlanks = results.reduce((s, r) => s + r.total, 0);
    const totalCorrect = results.reduce((s, r) => s + r.correct, 0);

    return (
      <div className="max-w-2xl mx-auto px-6 py-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Fill-in-the-Blank Complete!</h2>
        <p className="text-4xl font-bold mb-1">
          {totalCorrect} / {totalBlanks}
        </p>
        <p className="text-gray-500 mb-6">
          blanks filled correctly ({Math.round((totalCorrect / Math.max(totalBlanks, 1)) * 100)}%)
        </p>
        <button
          onClick={onExit}
          className="text-sm bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          Exit
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <span className="text-sm text-gray-500">
          Question {currentIndex + 1} of {blanks.length}
        </span>
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-sm border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors"
        >
          <X size={14} />
          Exit
        </button>
      </div>

      <div className="border border-gray-200 rounded-lg p-6 animate-fade-in">
        <p className="text-xs text-gray-400 mb-2">Context</p>
        <p className="text-lg font-medium mb-6">{current.problem.question}</p>

        <p className="text-xs text-gray-400 mb-3">Fill in the missing words</p>
        <div className="flex flex-wrap items-center gap-1.5 text-sm leading-relaxed">
          {current.answerWords.map((word, wIdx) => {
            if (current.blankedIndices.includes(wIdx)) {
              const key = getInputKey(currentIndex, wIdx);
              const userVal = inputs[key] || '';
              const actual = word.replace(/[.,;:!?]/g, '');
              const isCorrect = showResult && userVal.trim().toLowerCase() === actual.toLowerCase();
              const isWrong = showResult && !isCorrect;

              return (
                <span key={wIdx} className="inline-flex items-center">
                  <input
                    type="text"
                    value={userVal}
                    onChange={(e) =>
                      setInputs((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    disabled={showResult}
                    className={`border-b-2 px-1 py-0.5 text-sm text-center outline-none transition-colors ${
                      showResult
                        ? isCorrect
                          ? 'border-black font-medium'
                          : 'border-gray-300 text-gray-400'
                        : 'border-gray-300 focus:border-black'
                    }`}
                    style={{ width: `${Math.max(actual.length * 10, 60)}px` }}
                    placeholder="___"
                  />
                  {isWrong && (
                    <span className="text-xs text-gray-500 ml-1">({word})</span>
                  )}
                </span>
              );
            }
            return <span key={wIdx}>{word}</span>;
          })}
        </div>

        <div className="mt-6">
          {!showResult ? (
            <button
              onClick={checkCurrent}
              className="text-sm bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              Check
            </button>
          ) : (
            <button
              onClick={advance}
              className="text-sm bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              {currentIndex >= blanks.length - 1 ? 'See Results' : 'Next'}
            </button>
          )}
        </div>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-1.5 mt-8">
        <div
          className="bg-black rounded-full h-1.5 transition-all"
          style={{ width: `${((currentIndex + 1) / blanks.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
