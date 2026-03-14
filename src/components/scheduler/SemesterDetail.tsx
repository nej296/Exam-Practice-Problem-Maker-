import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ArrowLeft, Plus } from 'lucide-react';
import PageContainer from '../layout/PageContainer';
import ClassCard from './ClassCard';
import AddClassModal from './AddClassModal';

export default function SemesterDetail() {
  const { semesterId } = useParams<{ semesterId: string }>();
  const { data, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);

  const semester = semesterId ? data.semesters[semesterId] : null;

  if (!semester) {
    return (
      <PageContainer>
        <p className="text-gray-500">Semester not found.</p>
      </PageContainer>
    );
  }

  const classes = Object.values(semester.classes);

  return (
    <PageContainer>
      <button
        onClick={() => navigate('/scheduler')}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-black mb-4 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Semesters
      </button>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{semester.name}</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 text-sm border border-black rounded-md px-4 py-2 hover:bg-gray-50 transition-colors"
        >
          <Plus size={16} />
          Add a Class
        </button>
      </div>

      {classes.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 mb-4">No classes added yet.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-sm bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            Add Your First Class
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {classes.map((cls) => (
            <ClassCard key={cls.id} semesterId={semester.id} cls={cls} />
          ))}
        </div>
      )}

      <AddClassModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={(name, instructor) => {
          dispatch({ type: 'ADD_CLASS', semesterId: semester.id, name, instructor });
        }}
      />
    </PageContainer>
  );
}
