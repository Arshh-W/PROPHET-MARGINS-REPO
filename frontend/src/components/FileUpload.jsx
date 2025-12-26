import { useState } from 'react';
import './FileUpload.css';

const FileUpload = ({ onFileSelect, accept = '.csv,.pkl', disabled = false }) => {
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    } else {
      setFileName('');
      onFileSelect(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      const isValidFileType = fileName.endsWith('.csv') || fileName.endsWith('.pkl');
      if (isValidFileType) {
        setFileName(file.name);
        onFileSelect(file);
      }
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-primary font-semibold mb-3 text-lg">
        Upload Dataset
      </label>
      <div
        className={`file-upload-area ${isDragging ? 'dragging' : ''} ${fileName ? 'has-file' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled}
          className="file-input"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="file-label">
          <div className="file-icon">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div className="file-text">
            <span className="file-text-main">
              {fileName ? fileName : 'Click to upload or drag and drop'}
            </span>
            <span className="file-text-sub">CSV files only</span>
          </div>
        </label>
        {fileName && (
          <div className="file-success">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>File selected</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
