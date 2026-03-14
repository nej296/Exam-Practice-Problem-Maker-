import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Clock } from 'lucide-react';
import type { Problem } from '../../types';

interface Props {
  problems: Problem[];
  timeLimit: number; // minutes
  onExit: () => void;
}

interface UserAnswer {
  text: string;
  mcChoice?: number;
}

export default function PracticeExamMode({ problems, timeLimit, onExit }: Props) {
  const [answers, setAnswers] = useState<Record<number, UserAnswer>>({});
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60);
  const [submitted, setSubmitted] = useState(false);
  const [activeQ, setActiveQ] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTime = useRef(Date.now());

  const submitExam = useCallback(() => {
    setSubmitted(true);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          submitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [submitExam]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const setAnswer = (index: number, ans: UserAnswer) => {
    setAnswers((prev) => ({ ...prev, [index]: ans }));
  };

  const getScore = () => {
    let correct = 0;
    problems.forEach((p, i) => {
      const ans = answers[i];
      if (!ans) return;
      if (p.type === 'multiple-choice') {
        if (ans.mcChoice === p.correctOption) correct++;
      } else if (p.type === 'true-false') {
        if (ans.text === p.answer) correct++;
      } else {
        // open-ended self-graded - mark as correct if they wrote something
        if (ans.text?.trim().toLowerCase() === p.answer.trim().toLowerCase()) correct++;
      }
    });
    return correct;
  };

  const handleExit = () => {
    if (!submitted && !confirm('Leave the exam? Your progress will be lost.')) return;
    onExit();
  };

  if (submitted) {
    const score = getScore();
    const elapsed = Math.round((Date.now() - startTime.current) / 1000);
    const elapsedMin = Math.floor(elapsed / 60);
    const elapsedSec = elapsed % 60;

    return (
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Exam Results</h2>
          <p className="text-4xl font-bold mb-1">
            {score} / {problems.length}
          </p>
          <p className="text-gray-500 mb-2">
            {Math.round((score / problems.length) * 100)}%
          </p>
          <p className="text-sm text-gray-400">
            Time taken: {elapsedMin}m {elapsedSec}s
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {problems.map((p, i) => {
            const ans = answers[i];
            let isCorrect = false;
            let userDisplay = '(no answer)';

            if (p.type === 'multiple-choice' && ans?.mcChoice !== undefined) {
              isCorrect = ans.mcChoice === p.correctOption;
              userDisplay = `${['A', 'B', 'C', 'D'][ans.mcChoice]}. ${p.options![ans.mcChoice]}`;
            } else if (p.type === 'true-false' && ans?.text) {
              isCorrect = ans.text === p.answer;
              userDisplay = ans.text;
            } else if (ans?.text) {
              isCorrect = ans.text.trim().toLowerCase() === p.answer.trim().toLowerCase();
              userDisplay = ans.text;
            }

            const correctDisplay =
              p.type === 'multiple-choice' && p.options
                ? `${['A', 'B', 'C', 'D'][p.correctOption!]}. ${p.options[p.correctOption!]}`
                : p.answer;

            return (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-sm font-bold">{isCorrect ? '\u2713' : '\u2717'}</span>
                  <p className="font-medium text-sm">{p.question}</p>
                </div>
                <p className="text-sm text-gray-500 ml-5">
                  Your answer: <span className="text-black">{userDisplay}</span>
                </p>
                {!isCorrect && (
                  <p className="text-sm text-gray-500 ml-5">
                    Correct: <span className="font-medium text-black">{correctDisplay}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <button
            onClick={onExit}
            className="text-sm bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            Exit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Timer bar */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-200 -mx-6 px-6 py-3 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={16} className={timeLeft < 60 ? 'text-black animate-pulse' : 'text-gray-500'} />
          <span className={`text-sm font-mono font-medium ${timeLeft < 60 ? 'text-black' : ''}`}>
            {formatTimer(timeLeft)}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={submitExam}
            className="text-sm bg-black text-white px-4 py-1.5 rounded-md hover:bg-gray-800 transition-colors"
          >
            Submit Exam
          </button>
          <button
            onClick={handleExit}
            className="p-1.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Question navigator */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {problems.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveQ(i)}
            className={`w-8 h-8 text-xs rounded-md border transition-colors ${
              i === activeQ
                ? 'bg-black text-white border-black'
                : answers[i]
                ? 'bg-gray-100 border-gray-300'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Current question */}
      <div className="border border-gray-200 rounded-lg p-6 animate-fade-in">
        <p className="text-xs text-gray-400 mb-2">Question {activeQ + 1} of {problems.length}</p>
        <p className="text-lg font-medium mb-6">{problems[activeQ].question}</p>

        {problems[activeQ].type === 'open-ended' && (
          <textarea
            value={answers[activeQ]?.text || ''}
            onChange={(e) => setAnswer(activeQ, { text: e.target.value })}
            rows={4}
            placeholder="Type your answer..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black resize-none"
          />
        )}

        {problems[activeQ].type === 'multiple-choice' && problems[activeQ].options && (
          <div className="space-y-2">
            {['A', 'B', 'C', 'D'].map((letter, i) => (
              <button
                key={i}
                onClick={() => setAnswer(activeQ, { text: '', mcChoice: i })}
                className={`w-full text-left px-4 py-3 rounded-md text-sm border transition-colors ${
                  answers[activeQ]?.mcChoice === i
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {letter}. {problems[activeQ].options![i]}
              </button>
            ))}
          </div>
        )}

        {problems[activeQ].type === 'true-false' && (
          <div className="flex gap-3">
            {['True', 'False'].map((val) => (
              <button
                key={val}
                onClick={() => setAnswer(activeQ, { text: val })}
                className={`flex-1 px-4 py-3 rounded-md text-sm border transition-colors ${
                  answers[activeQ]?.text === val
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        )}

        {/* Quick nav */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setActiveQ(Math.max(0, activeQ - 1))}
            disabled={activeQ === 0}
            className="text-sm border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => setActiveQ(Math.min(problems.length - 1, activeQ + 1))}
            disabled={activeQ === problems.length - 1}
            className="text-sm border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
