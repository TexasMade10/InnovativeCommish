import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';

interface FileUploaderProps {
  onFilesSelected?: (files: File[]) => void;
  multiple?: boolean;
  className?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesSelected,
  multiple = true,
  className = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Allowed file types
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];

  const allowedExtensions = ['.pdf', '.xlsx', '.xls'];

  const validateFile = (file: File): boolean => {
    const isValidType = allowedTypes.includes(file.type);
    const isValidExtension = allowedExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );
    return isValidType || isValidExtension;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    Array.from(files).forEach(file => {
      if (validateFile(file)) {
        validFiles.push(file);
        console.log(`File uploaded: ${file.name}`);
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      alert(`Invalid file type(s): ${invalidFiles.join(', ')}\nOnly PDF and Excel files are allowed.`);
    }

    if (validFiles.length > 0) {
      const newFiles = multiple ? [...uploadedFiles, ...validFiles] : validFiles;
      setUploadedFiles(newFiles);
      onFilesSelected?.(newFiles);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset input value to allow uploading the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onFilesSelected?.(newFiles);
  };

  return (
    <div className={`file-uploader ${className}`}>
      <div
        className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="upload-content">
          <div className="upload-icon">📁</div>
          <h3>Upload Files</h3>
          <p>Drag and drop files here, or click to browse</p>
          <p className="file-types">Supported: PDF, Excel (.xlsx, .xls)</p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept=".pdf,.xlsx,.xls,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />

      {uploadedFiles.length > 0 && (
        <div className="file-list">
          <h4>Uploaded Files:</h4>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="file-item">
              <span className="file-name">{file.name}</span>
              <span className="file-size">({(file.size / 1024).toFixed(1)} KB)</span>
              <button
                type="button"
                className="remove-file"
                onClick={() => removeFile(index)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .file-uploader {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }

        .upload-area {
          border: 2px dashed #ccc;
          border-radius: 8px;
          padding: 40px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background-color: #fafafa;
        }

        .upload-area:hover {
          border-color: #007bff;
          background-color: #f0f8ff;
        }

        .upload-area.drag-over {
          border-color: #007bff;
          background-color: #e3f2fd;
          transform: scale(1.02);
        }

        .upload-content {
          pointer-events: none;
        }

        .upload-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .upload-content h3 {
          margin: 0 0 8px 0;
          color: #333;
          font-size: 18px;
        }

        .upload-content p {
          margin: 4px 0;
          color: #666;
          font-size: 14px;
        }

        .file-types {
          font-size: 12px !important;
          color: #999 !important;
          font-style: italic;
        }

        .file-list {
          margin-top: 20px;
          padding: 16px;
          background-color: #f8f9fa;
          border-radius: 6px;
        }

        .file-list h4 {
          margin: 0 0 12px 0;
          color: #333;
          font-size: 16px;
        }

        .file-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background-color: white;
          border-radius: 4px;
          margin-bottom: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .file-name {
          flex: 1;
          font-weight: 500;
          color: #333;
        }

        .file-size {
          color: #666;
          font-size: 12px;
          margin: 0 12px;
        }

        .remove-file {
          background: none;
          border: none;
          color: #dc3545;
          cursor: pointer;
          font-size: 16px;
          padding: 4px 8px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .remove-file:hover {
          background-color: #f8d7da;
        }
      `}</style>
    </div>
  );
};

export default FileUploader; 