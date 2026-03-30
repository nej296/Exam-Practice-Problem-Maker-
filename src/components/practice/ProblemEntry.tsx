import { useRef } from 'react';
import { Trash2, List } from 'lucide-react';
import PdfViewerInline from './PdfViewerInline';
import type { Problem } from '../../types';

interface Props {
  problem: Problem;
  index: number;
  onChange: (updated: Problem) => void;
  onRemove: () => void;
}

export default function ProblemEntry({ problem, index, onChange, onRemove }: Props) {
  const answerRef = useRef<HTMLTextAreaElement>(null);

  const updateField = (field: string, value: unknown) => {
    onChange({ ...problem, [field]: value });
  };

  const insertBullet = () => {
    const textarea = answerRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd, value } = textarea;
    const atLineStart = selectionStart === 0 || value[selectionStart - 1] === '\n';
    const insertion = atLineStart ? '• ' : '\n• ';
    const newValue = value.substring(0, selectionStart) + insertion + value.substring(selectionEnd);
    updateField('answer', newValue);
    const newPos = selectionStart + insertion.length;
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = newPos;
      textarea.selectionEnd = newPos;
    });
  };

  const handleAnswerKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter') return;
    const textarea = e.currentTarget;
    const { selectionStart, value } = textarea;
    const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
    const currentLine = value.substring(lineStart, selectionStart);
    if (!currentLine.startsWith('• ')) return;
    e.preventDefault();
    if (currentLine === '• ') {
      // Empty bullet — exit bullet mode
      const newValue = value.substring(0, lineStart) + value.substring(selectionStart);
      updateField('answer', newValue);
      requestAnimationFrame(() => {
        textarea.selectionStart = lineStart;
        textarea.selectionEnd = lineStart;
      });
    } else {
      // Continue bullets on next line
      const newValue = value.substring(0, selectionStart) + '\n• ' + value.substring(selectionStart);
      updateField('answer', newValue);
      requestAnimationFrame(() => {
        const newPos = selectionStart + 3;
        textarea.selectionStart = newPos;
        textarea.selectionEnd = newPos;
      });
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-500">Question {index + 1}</span>
        <button
          onClick={onRemove}
          className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-400 hover:text-black"
          title="Remove this question"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium mb-1">Question Type</label>
          <select
            value={problem.type}
            onChange={(e) => {
              const type = e.target.value as Problem['type'];
              const updated: Problem = { ...problem, type };
              if (type === 'multiple-choice') {
                updated.options = updated.options?.length === 4 ? updated.options : ['', '', '', ''];
                updated.correctOption = updated.correctOption ?? 0;
                updated.answer = '';
              } else if (type === 'true-false') {
                updated.answer = updated.answer === 'True' || updated.answer === 'False' ? updated.answer : 'True';
                updated.options = undefined;
                updated.correctOption = undefined;
              } else {
                updated.options = undefined;
                updated.correctOption = undefined;
              }
              onChange(updated);
            }}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black bg-white"
          >
            <option value="open-ended">Open-ended</option>
            <option value="multiple-choice">Multiple Choice</option>
            <option value="true-false">True / False</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">What should this question ask?</label>
          <textarea
            value={problem.question}
            onChange={(e) => updateField('question', e.target.value)}
            rows={2}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black resize-none"
            placeholder="Enter your question..."
          />
          <PdfViewerInline
            fileName={problem.questionPdfFileName ?? null}
            pdfData={problem.questionPdfData ?? null}
            onFileSelect={(file) => {
              const reader = new FileReader();
              reader.onload = () =>
                onChange({
                  ...problem,
                  questionPdfFileName: file.name,
                  questionPdfData: reader.result as string,
                });
              reader.readAsDataURL(file);
            }}
            onRemove={() =>
              onChange({
                ...problem,
                questionPdfFileName: undefined,
                questionPdfData: undefined,
              })
            }
            label="Import PDF for this question"
          />
        </div>

        {problem.type === 'open-ended' && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium">What is the correct answer?</label>
              <button
                type="button"
                onClick={insertBullet}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-black px-2 py-0.5 rounded hover:bg-gray-100 transition-colors"
                title="Insert bullet point"
              >
                <List size={12} />
                Bullet
              </button>
            </div>
            <textarea
              ref={answerRef}
              value={problem.answer}
              onChange={(e) => updateField('answer', e.target.value)}
              onKeyDown={handleAnswerKeyDown}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black resize-y"
              placeholder="Enter the answer..."
            />
            <PdfViewerInline
              fileName={problem.answerPdfFileName ?? null}
              pdfData={problem.answerPdfData ?? null}
              onFileSelect={(file) => {
                const reader = new FileReader();
                reader.onload = () =>
                  onChange({
                    ...problem,
                    answerPdfFileName: file.name,
                    answerPdfData: reader.result as string,
                  });
                reader.readAsDataURL(file);
              }}
              onRemove={() =>
                onChange({
                  ...problem,
                  answerPdfFileName: undefined,
                  answerPdfData: undefined,
                })
              }
              label="Import PDF for the answer"
            />
          </div>
        )}

        {problem.type === 'multiple-choice' && (
          <div className="space-y-2">
            <label className="block text-xs font-medium">Answer Options</label>
            <PdfViewerInline
              fileName={problem.answerPdfFileName ?? null}
              pdfData={problem.answerPdfData ?? null}
              onFileSelect={(file) => {
                const reader = new FileReader();
                reader.onload = () =>
                  onChange({
                    ...problem,
                    answerPdfFileName: file.name,
                    answerPdfData: reader.result as string,
                  });
                reader.readAsDataURL(file);
              }}
              onRemove={() =>
                onChange({
                  ...problem,
                  answerPdfFileName: undefined,
                  answerPdfData: undefined,
                })
              }
              label="Import PDF for the correct answer"
            />
            {['A', 'B', 'C', 'D'].map((letter, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`correct-${problem.id}`}
                  checked={problem.correctOption === i}
                  onChange={() => onChange({ ...problem, correctOption: i })}
                  className="accent-black"
                />
                <span className="text-sm font-medium w-5">{letter}.</span>
                <input
                  type="text"
                  value={problem.options?.[i] || ''}
                  onChange={(e) => {
                    const opts = [...(problem.options || ['', '', '', ''])];
                    opts[i] = e.target.value;
                    onChange({ ...problem, options: opts });
                  }}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  placeholder={`Option ${letter}`}
                />
              </div>
            ))}
            <p className="text-xs text-gray-400">Select the radio button next to the correct answer.</p>
          </div>
        )}

        {problem.type === 'true-false' && (
          <div>
            <label className="block text-xs font-medium mb-2">Correct Answer</label>
            <PdfViewerInline
              fileName={problem.answerPdfFileName ?? null}
              pdfData={problem.answerPdfData ?? null}
              onFileSelect={(file) => {
                const reader = new FileReader();
                reader.onload = () =>
                  onChange({
                    ...problem,
                    answerPdfFileName: file.name,
                    answerPdfData: reader.result as string,
                  });
                reader.readAsDataURL(file);
              }}
              onRemove={() =>
                onChange({
                  ...problem,
                  answerPdfFileName: undefined,
                  answerPdfData: undefined,
                })
              }
              label="Import PDF for the correct answer"
            />
            <div className="flex gap-3 mt-2">
              {['True', 'False'].map((val) => (
                <button
                  key={val}
                  onClick={() => updateField('answer', val)}
                  className={`px-4 py-2 text-sm rounded-md border transition-colors ${
                    problem.answer === val
                      ? 'bg-black text-white border-black'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
