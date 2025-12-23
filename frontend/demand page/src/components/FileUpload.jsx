import { useState } from 'react';

const FileUpload = ({ onFileSelect, accept = '.csv', disabled = false }) => {
  const [fileName, setFileName] = useState('');

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

  return (
    <div className="mb-6">
      <label className="block text-primary font-semibold mb-2">
        Upload Dataset
      </label>
      <div className="flex flex-col gap-2">
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled}
          className="block w-full text-sm text-primary
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-primary file:text-beige
            hover:file:bg-secondary
            file:cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {fileName && (
          <p className="text-sm text-secondary">
            Selected: <span className="font-medium">{fileName}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
