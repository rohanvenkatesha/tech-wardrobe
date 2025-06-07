import React, { useState } from 'react';
import Link from 'next/link';
import PdfUploader from './PdfUploader'; // Adjust if needed

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

const PdfMerger: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleMerge = async () => {
    if (files.length < 2) {
      alert('Please select at least two PDF files to merge');
      return;
    }
    setLoading(true);
    setMergedPdfUrl(null);
    try {
      const formData = new FormData();
      files.forEach(f => formData.append('files', f));

      const res = await fetch(`${apiBaseUrl}/merge-pdf`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to merge PDFs');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      setMergedPdfUrl(url);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow-md">
      <Link href="/" passHref>
        <button className="mb-4 px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300">
          ← Back to Home
        </button>
      </Link>

      <h2 className="text-2xl font-bold mb-4">PDF Merger</h2>
      <PdfUploader onFilesChange={setFiles} />

      <button
        onClick={handleMerge}
        disabled={loading || files.length < 2}
        className={`mt-4 px-4 py-2 rounded text-white ${
          loading || files.length < 2 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Merging...' : 'Merge PDFs'}
      </button>

      {mergedPdfUrl && (
        <div className="mt-6">
          <a
            href={mergedPdfUrl}
            download="merged.pdf"
            className="text-blue-700 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download Merged PDF
          </a>
        </div>
      )}
    </div>
  );
};

export default PdfMerger;
