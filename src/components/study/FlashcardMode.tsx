import { useState } from 'react';
import { ChevronLeft, ChevronRight, Shuffle, X, Star } from 'lucide-react';
import { shuffleArray } from '../../utils/helpers';
import type { Problem } from '../../types';

interface Props {
  problems: Problem[];
  onExit: () => void;
  onToggleStar?: (problemId: string) => void;
}

export default function FlashcardMode({ problems: initialProblems, onExit, onToggleStar }: Props) {
  const [problems, setProblems] = useState(initialProblems);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [starredIds, setStarredIds] = useState<Set<string>>(
    () => new Set(initialProblems.filter((p) => p.starred).map((p) => p.id))
  );
  const [starredOnly, setStarredOnly] = useState(false);

  const displayProblems = starredOnly ? problems.filter((p) => starredIds.has(p.id)) : problems;
  const safeIndex = Math.min(currentIndex, Math.max(0, displayProblems.length - 1));
  const current = displayProblems[safeIndex];

  const goNext = () => {
    if (safeIndex < displayProblems.length - 1) {
      setCurrentIndex(safeIndex + 1);
      setFlipped(false);
    }
  };

  const goPrev = () => {
    if (safeIndex > 0) {
      setCurrentIndex(safeIndex - 1);
      setFlipped(false);
    }
  };

  const handleShuffle = () => {
    setProblems(shuffleArray(problems));
    setCurrentIndex(0);
    setFlipped(false);
  };

  const toggleStar = (problemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStarredIds((prev) => {
      const next = new Set(prev);
      if (next.has(problemId)) next.delete(problemId);
      else next.add(problemId);
      return next;
    });
    onToggleStar?.(problemId);
  };

  const toggleStarredOnly = () => {
    setCurrentIndex(0);
    setFlipped(false);
    setStarredOnly((prev) => !prev);
  };

  const starredCount = starredIds.size;

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
            <p className="text-lg whitespace-pre-wrap">{p.answer}</p>
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
    return <p className="text-lg whitespace-pre-wrap">{p.answer}</p>;
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
          Card {displayProblems.length > 0 ? safeIndex + 1 : 0} of {displayProblems.length}
          {starredOnly && <span className="ml-1 text-yellow-500">★ starred</span>}
        </span>
        <div className="flex gap-2">
          <button
            onClick={toggleStarredOnly}
            disabled={!starredOnly && starredCount === 0}
            className={`flex items-center gap-1.5 text-sm border rounded-md px-3 py-1.5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
              starredOnly
                ? 'border-yellow-400 bg-yellow-50 text-yellow-700'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
            title={starredCount === 0 ? 'Star some cards first' : starredOnly ? 'Show all cards' : 'Show starred only'}
          >
            <Star size={14} className={starredOnly ? 'fill-yellow-400 text-yellow-400' : ''} />
            {starredOnly ? `Starred (${starredCount})` : `Starred (${starredCount})`}
          </button>
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

      {displayProblems.length === 0 ? (
        <div className="border border-gray-200 rounded-lg p-16 flex flex-col items-center justify-center text-center">
          <Star size={32} className="text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">No starred cards yet.</p>
          <p className="text-gray-400 text-xs mt-1">Star cards while reviewing to study them here.</p>
        </div>
      ) : (
        <>
          {/* Card */}
          <div className="relative mb-8">
            {/* Star button — outside the flip target */}
            <button
              onClick={(e) => toggleStar(current.id, e)}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              title={starredIds.has(current.id) ? 'Unstar' : 'Star this card'}
            >
              <Star
                size={20}
                className={
                  starredIds.has(current.id)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 hover:text-yellow-400'
                }
              />
            </button>

            <div
              className="perspective cursor-pointer"
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
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={goPrev}
              disabled={safeIndex === 0}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="w-full max-w-xs bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-black rounded-full h-1.5 transition-all"
                style={{ width: `${((safeIndex + 1) / displayProblems.length) * 100}%` }}
              />
            </div>
            <button
              onClick={goNext}
              disabled={safeIndex === displayProblems.length - 1}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
