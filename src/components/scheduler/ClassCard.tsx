import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Pencil, Trash2, Calendar, BookOpen } from 'lucide-react';
import ExamScheduler from './ExamScheduler';
import AddClassModal from './AddClassModal';
import type { ClassData } from '../../types';

interface Props {
  semesterId: string;
  cls: ClassData;
}

export default function ClassCard({ semesterId, cls }: Props) {
  const { dispatch } = useAppContext();
  const navigate = useNavigate();
  const [showExamScheduler, setShowExamScheduler] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const practiceSets = Object.values(cls.practiceSets);
  const examCount = Object.keys(cls.exams).length;

  const handleDelete = () => {
    if (confirm(`Delete "${cls.name}" and all its exams and practice sets?`)) {
      dispatch({ type: 'DELETE_CLASS', semesterId, classId: cls.id });
    }
  };

  return (
    <>
      <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-medium">{cls.name}</h3>
            {cls.instructor && (
              <p className="text-sm text-gray-500 mt-0.5">{cls.instructor}</p>
            )}
          </div>
          <div className="flex gap-1 shrink-0">
            <button
              onClick={() => setShowEditModal(true)}
              className="p-1.5 rounded hover:bg-gray-100 transition-colors"
              title="Edit class"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 rounded hover:bg-gray-100 transition-colors"
              title="Delete class"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setShowExamScheduler(true)}
            className="flex items-center gap-1.5 text-sm border border-black rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors"
          >
            <Calendar size={14} />
            Schedule Your Exams
            {examCount > 0 && (
              <span className="ml-1 bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded">
                {examCount}
              </span>
            )}
          </button>
        </div>

        {practiceSets.length > 0 && (
          <div className="border-t border-gray-100 pt-3">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Practice Sets
            </h4>
            <div className="space-y-2">
              {practiceSets.map((set) => (
                <div
                  key={set.id}
                  className="flex items-center justify-between bg-gray-50 rounded-md px-3 py-2"
                >
                  <div className="min-w-0">
                    <span className="text-sm font-medium">{set.name}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      {set.problems.length} problem{set.problems.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() =>
                        navigate(`/study/${semesterId}/${cls.id}/${set.id}`)
                      }
                      className="flex items-center gap-1 text-xs bg-black text-white px-3 py-1 rounded-md hover:bg-gray-800 transition-colors"
                    >
                      <BookOpen size={12} />
                      Study
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete practice set "${set.name}"?`)) {
                          dispatch({
                            type: 'DELETE_PRACTICE_SET',
                            semesterId,
                            classId: cls.id,
                            setId: set.id,
                          });
                        }
                      }}
                      className="p-1 rounded hover:bg-gray-200 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ExamScheduler
        semesterId={semesterId}
        classId={cls.id}
        className={cls.name}
        open={showExamScheduler}
        onClose={() => setShowExamScheduler(false)}
      />

      <AddClassModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Class"
        initialName={cls.name}
        initialInstructor={cls.instructor || ''}
        onSave={(name, instructor) => {
          dispatch({
            type: 'EDIT_CLASS',
            semesterId,
            classId: cls.id,
            name,
            instructor,
          });
        }}
      />
    </>
  );
}
