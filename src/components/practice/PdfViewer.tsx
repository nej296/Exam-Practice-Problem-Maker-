import { X, FileText } from 'lucide-react';

interface Props {
  fileName: string | null;
  pdfData: string | null;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
}

export default function PdfViewer({ fileName, pdfData, onFileSelect, onRemove }: Props) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      onFileSelect(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  if (!fileName || !pdfData) {
    return (
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
      >
        <FileText size={32} className="mx-auto text-gray-300 mb-3" />
        <p className="text-sm font-medium mb-1">Import a PDF (optional)</p>
        <p className="text-xs text-gray-400 mb-3">
          Upload your notes, textbook chapters, or study guides for reference while creating
          problems.
        </p>
        <label className="inline-block cursor-pointer text-sm border border-black rounded-md px-4 py-2 hover:bg-gray-50 transition-colors">
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
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between bg-gray-50 px-4 py-2 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-gray-500" />
          <span className="text-sm font-medium truncate">{fileName}</span>
        </div>
        <button
          onClick={onRemove}
          className="p-1 rounded hover:bg-gray-200 transition-colors"
          title="Remove PDF"
        >
          <X size={16} />
        </button>
      </div>
      <iframe src={pdfData} className="w-full h-96 bg-white" title="PDF Preview" />
    </div>
  );
}
