import { useState } from 'react';
import { ChevronLeft, ChevronRight, Shuffle, X } from 'lucide-react';
import { shuffleArray } from '../../utils/helpers';
import type { Problem } from '../../types';

interface Props {
  problems: Problem[];
  onExit: () => void;
}

export default function FlashcardMode({ problems: initialProblems, onExit }: Props) {
  const [problems, setProblems] = useState(initialProblems);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const current = problems[currentIndex];

  const goNext = () => {
    if (currentIndex < problems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFlipped(false);
    }
  };

  const handleShuffle = () => {
    setProblems(shuffleArray(problems));
    setCurrentIndex(0);
    setFlipped(false);
  };

  const getAnswerDisplay = (p: Problem) => {
    if (p.answerPdfData) {
      return (
        <div>
          <div className="mb-4 rounded-md overflow-hidden border border-gray-200">
            <iframe src={p.answerPdfData} className="w-full h-48 bg-white" title="Answer PDF" />
          </div>
          {p.type === 'multiple-choice' && p.options ? (
            <div className="space-y-2">
              {p.options.map((opt, i) => (
                <div
                  key={i}
                  className={`px-3 py-2 rounded-md text-sm ${
                    i === p.correctOption ? 'bg-black text-white font-medium' : 'bg-gray-50 text-gray-500'
                  }`}
                >
                  {['A', 'B', 'C', 'D'][i]}. {opt}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-lg">{p.answer}</p>
          )}
        </div>
      );
    }
    if (p.type === 'multiple-choice' && p.options) {
      const letters = ['A', 'B', 'C', 'D'];
      return (
        <div className="space-y-2">
          {p.options.map((opt, i) => (
            <div
              key={i}
              className={`px-3 py-2 rounded-md text-sm ${
                i === p.correctOption
                  ? 'bg-black text-white font-medium'
                  : 'bg-gray-50 text-gray-500'
              }`}
            >
              {letters[i]}. {opt}
            </div>
          ))}
        </div>
      );
    }
    return <p className="text-lg">{p.answer}</p>;
  };

  const getQuestionDisplay = (p: Problem) => {
    return (
      <div>
        <p className="text-lg mb-4">{p.question}</p>
        {p.questionPdfData && (
          <div className="mb-4 rounded-md overflow-hidden border border-gray-200">
            <iframe src={p.questionPdfData} className="w-full h-48 bg-white" title="Question PDF" />
          </div>
        )}
        {p.type === 'multiple-choice' && p.options && (
          <div className="space-y-2 text-left">
            {['A', 'B', 'C', 'D'].map((letter, i) => (
              <div key={i} className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                {letter}. {p.options![i]}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <span className="text-sm text-gray-500">
          Card {currentIndex + 1} of {problems.length}
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleShuffle}
            className="flex items-center gap-1.5 text-sm border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors"
          >
            <Shuffle size={14} />
            Shuffle
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

      {/* Card */}
      <div
        className="perspective cursor-pointer mb-8"
        onClick={() => setFlipped(!flipped)}
      >
        <div
          className={`relative w-full min-h-64 transition-transform duration-500 preserve-3d ${
            flipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden border border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center text-center bg-white shadow-sm">
            <span className="text-xs text-gray-400 uppercase tracking-wide mb-4">Question</span>
            {getQuestionDisplay(current)}
            <p className="text-xs text-gray-400 mt-6">Click to reveal answer</p>
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 border border-black rounded-lg p-8 flex flex-col items-center justify-center text-center bg-white shadow-sm">
            <span className="text-xs text-gray-400 uppercase tracking-wide mb-4">Answer</span>
            {getAnswerDisplay(current)}
            <p className="text-xs text-gray-400 mt-6">Click to see question</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="w-full max-w-xs bg-gray-100 rounded-full h-1.5">
          <div
            className="bg-black rounded-full h-1.5 transition-all"
            style={{ width: `${((currentIndex + 1) / problems.length) * 100}%` }}
          />
        </div>
        <button
          onClick={goNext}
          disabled={currentIndex === problems.length - 1}
          className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
