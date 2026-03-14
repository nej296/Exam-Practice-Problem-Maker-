import { useState } from 'react';
import Modal from '../layout/Modal';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, instructor?: string) => void;
  initialName?: string;
  initialInstructor?: string;
  title?: string;
}

export default function AddClassModal({
  open,
  onClose,
  onSave,
  initialName = '',
  initialInstructor = '',
  title = 'Add a Class',
}: Props) {
  const [name, setName] = useState(initialName);
  const [instructor, setInstructor] = useState(initialInstructor);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim(), instructor.trim() || undefined);
    setName('');
    setInstructor('');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Class Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='e.g., MATH 301 — Linear Algebra'
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Instructor Name (optional)</label>
          <input
            type="text"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            placeholder="e.g., Dr. Smith"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}
