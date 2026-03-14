import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { formatDate, formatTime, isUpcoming } from '../../utils/helpers';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '../layout/Modal';
import type { Exam } from '../../types';

interface Props {
  semesterId: string;
  classId: string;
  className: string;
  open: boolean;
  onClose: () => void;
}

export default function ExamScheduler({ semesterId, classId, className, open, onClose }: Props) {
  const { data, dispatch } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [label, setLabel] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');

  const cls = data.semesters[semesterId]?.classes[classId];
  const exams = cls
    ? Object.values(cls.exams).sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    : [];

  const resetForm = () => {
    setLabel('');
    setDate('');
    setTime('');
    setLocation('');
    setShowForm(false);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!label.trim() || !date) return;
    const exam: Omit<Exam, 'id'> = {
      label: label.trim(),
      date,
      time,
      location: location.trim(),
    };
    if (editingId) {
      dispatch({ type: 'EDIT_EXAM', semesterId, classId, examId: editingId, exam });
    } else {
      dispatch({ type: 'ADD_EXAM', semesterId, classId, exam });
    }
    resetForm();
  };

  const startEdit = (exam: Exam) => {
    setEditingId(exam.id);
    setLabel(exam.label);
    setDate(exam.date);
    setTime(exam.time);
    setLocation(exam.location);
    setShowForm(true);
  };

  const handleDelete = (examId: string) => {
    if (confirm('Delete this exam?')) {
      dispatch({ type: 'DELETE_EXAM', semesterId, classId, examId });
    }
  };

  return (
    <Modal open={open} onClose={() => { resetForm(); onClose(); }} title={`Schedule Exams for ${className}`}>
      <div className="space-y-4">
        {exams.length > 0 && (
          <div className="space-y-2">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="flex items-center justify-between border border-gray-200 rounded-md p-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{exam.label}</span>
                    {isUpcoming(exam.date) && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        Upcoming
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatDate(exam.date)}
                    {exam.time && ` at ${formatTime(exam.time)}`}
                    {exam.location && ` — ${exam.location}`}
                  </p>
                </div>
                <div className="flex gap-1 ml-2 shrink-0">
                  <button
                    onClick={() => startEdit(exam)}
                    className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(exam.id)}
                    className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 text-sm border border-black rounded-md px-4 py-2 hover:bg-gray-50 transition-colors w-full justify-center"
          >
            <Plus size={16} />
            Add Exam
          </button>
        ) : (
          <div className="border border-gray-200 rounded-md p-4 space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">Exam Label</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder='e.g., Midterm 1, Final Exam'
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Room 204, Science Building"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={resetForm}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!label.trim() || !date}
                className="px-3 py-1.5 text-sm bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {editingId ? 'Update Exam' : 'Save Exam'}
              </button>
            </div>
          </div>
        )}

        {exams.length === 0 && !showForm && (
          <p className="text-center text-sm text-gray-400 py-4">No exams scheduled yet.</p>
        )}
      </div>
    </Modal>
  );
}
