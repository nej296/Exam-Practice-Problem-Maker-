import { X, FileText } from 'lucide-react';

interface Props {
  fileName: string | null;
  pdfData: string | null;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  label?: string;
}

export default function PdfViewerInline({ fileName, pdfData, onFileSelect, onRemove, label = 'Import PDF' }: Props) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      onFileSelect(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onFileSelect(file);
    }
  };

  if (!fileName || !pdfData) {
    return (
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="mt-2 border border-dashed border-gray-300 rounded-md p-3 text-center hover:border-gray-400 transition-colors"
      >
        <FileText size={18} className="mx-auto text-gray-300 mb-1" />
        <p className="text-xs text-gray-500 mb-2">{label}</p>
        <label className="inline-block cursor-pointer text-xs border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50 transition-colors">
          Choose File
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileInput}
            className="hidden"
          />
        </label>
      </div>
    );
  }

  return (
    <div className="mt-2 border border-gray-200 rounded-md overflow-hidden">
      <div className="flex items-center justify-between bg-gray-50 px-3 py-1.5 border-b border-gray-200">
        <div className="flex items-center gap-2 min-w-0">
          <FileText size={14} className="text-gray-500 flex-shrink-0" />
          <span className="text-xs font-medium truncate">{fileName}</span>
        </div>
        <button
          onClick={onRemove}
          className="p-1 rounded hover:bg-gray-200 transition-colors flex-shrink-0"
          title="Remove PDF"
        >
          <X size={14} />
        </button>
      </div>
      <iframe src={pdfData} className="w-full h-48 bg-white" title="PDF Preview" />
    </div>
  );
}
