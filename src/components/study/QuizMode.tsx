import { useState } from 'react';
import { X, RotateCcw } from 'lucide-react';
import type { Problem } from '../../types';

interface Props {
  problems: Problem[];
  onExit: () => void;
}

interface QuizResult {
  problem: Problem;
  userAnswer: string;
  correct: boolean;
}

export default function QuizMode({ problems, onExit }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [userInput, setUserInput] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedMc, setSelectedMc] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const current = problems[currentIndex];
  const isLast = currentIndex === problems.length - 1;

  const recordAndAdvance = (answer: string, correct: boolean) => {
    const newResults = [...results, { problem: current, userAnswer: answer, correct }];
    setResults(newResults);
    setUserInput('');
    setShowAnswer(false);
    setSelectedMc(null);

    if (isLast) {
      setFinished(true);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleMcSelect = (optionIndex: number) => {
    if (showAnswer) return;
    setSelectedMc(optionIndex);
    setShowAnswer(true);
  };

  const handleTfSelect = (value: string) => {
    if (showAnswer) return;
    setUserInput(value);
    setShowAnswer(true);
  };

  const score = results.filter((r) => r.correct).length;

  if (finished) {
    const missedQuestions = results.filter((r) => !r.correct);
    return (
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-4xl font-bold mb-1">
            {score} / {problems.length}
          </p>
          <p className="text-gray-500">
            {Math.round((score / problems.length) * 100)}%
          </p>
        </div>

        {missedQuestions.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-medium mb-3 text-gray-500 uppercase tracking-wide">
              Missed Questions
            </h3>
            <div className="space-y-3">
              {missedQuestions.map((r, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <p className="font-medium text-sm mb-2">{r.problem.question}</p>
                  {r.problem.answerPdfData && (
                    <div className="mb-3 rounded-md overflow-hidden border border-gray-200">
                      <iframe src={r.problem.answerPdfData} className="w-full h-40 bg-white" title="Answer PDF" />
                    </div>
                  )}
                  <p className="text-sm text-gray-500">
                    Your answer: <span className="text-black">{r.userAnswer || '(empty)'}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Correct answer:{' '}
                    <span className="font-medium text-black">
                      {r.problem.type === 'multiple-choice' && r.problem.options
                        ? `${['A', 'B', 'C', 'D'][r.problem.correctOption!]}. ${r.problem.options[r.problem.correctOption!]}`
                        : r.problem.answer}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center gap-3">
          {missedQuestions.length > 0 && (
            <button
              onClick={() => {
                setResults([]);
                setCurrentIndex(0);
                setFinished(false);
                // Re-quiz with only missed questions - we'd need to restructure for that
                // For now, just restart
              }}
              className="flex items-center gap-2 text-sm border border-black rounded-md px-4 py-2 hover:bg-gray-50 transition-colors"
            >
              <RotateCcw size={14} />
              Restart Quiz
            </button>
          )}
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
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <span className="text-sm text-gray-500">
          Question {currentIndex + 1} of {problems.length}
        </span>
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-sm border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors"
        >
          <X size={14} />
          Exit
        </button>
      </div>

      <div className="border border-gray-200 rounded-lg p-6 mb-6 animate-fade-in">
        <p className="text-lg font-medium mb-4">{current.question}</p>
        {current.questionPdfData && (
          <div className="mb-6 rounded-md overflow-hidden border border-gray-200">
            <iframe src={current.questionPdfData} className="w-full h-48 bg-white" title="Question PDF" />
          </div>
        )}

        {current.type === 'open-ended' && (
          <>
            {!showAnswer ? (
              <div>
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  rows={3}
                  placeholder="Type your answer..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black resize-none mb-3"
                />
                <button
                  onClick={() => setShowAnswer(true)}
                  className="text-sm bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                >
                  Check Answer
                </button>
              </div>
            ) : (
              <div>
                {current.answerPdfData && (
                  <div className="mb-4 rounded-md overflow-hidden border border-gray-200">
                    <iframe src={current.answerPdfData} className="w-full h-48 bg-white" title="Answer PDF" />
                  </div>
                )}
                <div className="bg-gray-50 rounded-md p-4 mb-4">
                  <p className="text-xs text-gray-500 mb-1">Correct Answer</p>
                  <p className="text-sm font-medium">{current.answer}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => recordAndAdvance(userInput, true)}
                    className="text-sm bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Got it right
                  </button>
                  <button
                    onClick={() => recordAndAdvance(userInput, false)}
                    className="text-sm border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Got it wrong
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {current.type === 'multiple-choice' && current.options && (
          <div className="space-y-2">
            {current.answerPdfData && (
              <div className="mb-4 rounded-md overflow-hidden border border-gray-200">
                <iframe src={current.answerPdfData} className="w-full h-48 bg-white" title="Answer PDF" />
              </div>
            )}
            {['A', 'B', 'C', 'D'].map((letter, i) => (
              <button
                key={i}
                onClick={() => handleMcSelect(i)}
                disabled={showAnswer}
                className={`w-full text-left px-4 py-3 rounded-md text-sm border transition-colors ${
                  showAnswer
                    ? i === current.correctOption
                      ? 'border-black bg-black text-white'
                      : i === selectedMc
                      ? 'border-gray-300 bg-gray-100 text-gray-400'
                      : 'border-gray-200 text-gray-400'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {letter}. {current.options![i]}
              </button>
            ))}
            {showAnswer && (
              <button
                onClick={() =>
                  recordAndAdvance(
                    current.options![selectedMc!],
                    selectedMc === current.correctOption
                  )
                }
                className="text-sm bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors mt-3"
              >
                {isLast ? 'Finish Quiz' : 'Next Question'}
              </button>
            )}
          </div>
        )}

        {current.type === 'true-false' && (
          <>
            {current.answerPdfData && (
              <div className="mb-4 rounded-md overflow-hidden border border-gray-200">
                <iframe src={current.answerPdfData} className="w-full h-48 bg-white" title="Answer PDF" />
              </div>
            )}
            <div className="flex gap-3 mb-4">
              {['True', 'False'].map((val) => (
                <button
                  key={val}
                  onClick={() => handleTfSelect(val)}
                  disabled={showAnswer}
                  className={`flex-1 px-4 py-3 rounded-md text-sm border transition-colors ${
                    showAnswer
                      ? val === current.answer
                        ? 'border-black bg-black text-white'
                        : val === userInput
                        ? 'border-gray-300 bg-gray-100 text-gray-400'
                        : 'border-gray-200 text-gray-400'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
            {showAnswer && (
              <button
                onClick={() =>
                  recordAndAdvance(userInput, userInput === current.answer)
                }
                className="text-sm bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                {isLast ? 'Finish Quiz' : 'Next Question'}
              </button>
            )}
          </>
        )}
      </div>

      {/* Progress */}
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div
          className="bg-black rounded-full h-1.5 transition-all"
          style={{ width: `${((currentIndex + 1) / problems.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
