import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';

export interface ParsedData {
  carrier: string;
  premium: number;
  commission: number;
  lives: number;
  month: string;
  fileName: string;
  fileType: string;
  confidence: number;
}

interface FileUploaderProps {
  onFilesSelected?: (files: File[]) => void;
  onParsedData?: (data: ParsedData) => void;
  onFileProcessed?: (fileName: string) => void;
  multiple?: boolean;
  className?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesSelected,
  onParsedData,
  onFileProcessed,
  multiple = true,
  className = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [parsedResults, setParsedResults] = useState<ParsedData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingFile, setProcessingFile] = useState<string>('');
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

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const parseFile = async (file: File): Promise<ParsedData | null> => {
    try {
      setProcessingFile(file.name);
      
      let fileContent: string;
      
      // Try to read as text first (for Excel files)
      if (file.type.includes('excel') || file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls')) {
        try {
          fileContent = await readFileAsText(file);
        } catch {
          // Fallback to base64 if text reading fails
          fileContent = await readFileAsBase64(file);
        }
      } else {
        // For PDFs, use base64
        fileContent = await readFileAsBase64(file);
      }

      const response = await fetch('/api/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileContent,
          fileName: file.name,
          fileType: file.type
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Parsing failed');
      }

      return result.data;
    } catch (error) {
      console.error('Error parsing file:', error);
      return null;
    } finally {
      setProcessingFile('');
    }
  };

  const handleFiles = async (files: FileList | null) => {
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

      // Parse each file
      setIsProcessing(true);
      const newParsedResults: ParsedData[] = [];
      
      for (const file of validFiles) {
        const parsedData = await parseFile(file);
        if (parsedData) {
          newParsedResults.push(parsedData);
          onParsedData?.(parsedData);
          onFileProcessed?.(file.name);
        }
      }
      
      setParsedResults(prev => [...prev, ...newParsedResults]);
      setIsProcessing(false);
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

      {/* Processing Status */}
      {isProcessing && (
        <div className="processing-status">
          <div className="processing-spinner"></div>
          <p>Processing {processingFile}...</p>
        </div>
      )}

      {/* Parsed Results */}
      {parsedResults.length > 0 && (
        <div className="parsed-results">
          <h4>📊 Parsed Data:</h4>
          {parsedResults.map((result, index) => (
            <div key={index} className="parsed-card">
              <div className="parsed-header">
                <span className="carrier-name">{result.carrier}</span>
                <span className="confidence-badge">
                  {Math.round(result.confidence * 100)}% confidence
                </span>
              </div>
              <div className="parsed-details">
                <div className="detail-row">
                  <span className="detail-label">Premium:</span>
                  <span className="detail-value">${result.premium.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Commission:</span>
                  <span className="detail-value">${result.commission.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Lives:</span>
                  <span className="detail-value">{result.lives.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Month:</span>
                  <span className="detail-value">{result.month}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">File:</span>
                  <span className="detail-value">{result.fileName}</span>
                </div>
              </div>
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

        .processing-status {
          margin-top: 20px;
          padding: 16px;
          background-color: #e3f2fd;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .processing-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #2196f3;
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .processing-status p {
          margin: 0;
          color: #1976d2;
          font-weight: 500;
        }

        .parsed-results {
          margin-top: 20px;
        }

        .parsed-results h4 {
          margin: 0 0 16px 0;
          color: #333;
          font-size: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .parsed-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .parsed-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .carrier-name {
          font-size: 18px;
          font-weight: 600;
        }

        .confidence-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .parsed-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .detail-label {
          font-size: 14px;
          opacity: 0.9;
        }

        .detail-value {
          font-weight: 600;
          font-size: 14px;
        }

        @media (max-width: 480px) {
          .parsed-details {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default FileUploader; 