import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import SidebarCopilot from './components/SidebarCopilot';

interface ParsedData {
  carrier: string;
  premium: number;
  commission: number;
  lives: number;
  month: string;
  fileName: string;
  fileType: string;
  confidence: number;
}

const App: React.FC = () => {
  const [parsedData, setParsedData] = useState<ParsedData[]>([]);

  const handleParsedData = (data: ParsedData) => {
    setParsedData(prev => [...prev, data]);
  };

  return (
    <div className="app">
      <div className="app-header">
        <h1>Document Analysis Assistant</h1>
        <p>Upload your PDF and Excel files, then ask questions about them</p>
      </div>

      <div className="app-content">
        <div className="upload-panel">
          <div className="panel-header">
            <h2>📄 File Upload</h2>
            <p>Upload your documents to get started</p>
          </div>
          <div className="upload-container">
            <FileUploader onParsedData={handleParsedData} />
          </div>
        </div>

        <div className="copilot-panel">
          <SidebarCopilot parsedData={parsedData} />
        </div>
      </div>

      <style jsx>{`
        .app {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .app-header {
          text-align: center;
          padding: 40px 20px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }

        .app-header h1 {
          margin: 0 0 12px 0;
          color: #2c3e50;
          font-size: 2.5rem;
          font-weight: 700;
        }

        .app-header p {
          margin: 0;
          color: #7f8c8d;
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .app-content {
          display: flex;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
          gap: 20px;
          min-height: calc(100vh - 200px);
        }

        .upload-panel {
          flex: 0 0 70%;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          overflow: hidden;
        }

        .panel-header {
          padding: 24px 32px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .panel-header h2 {
          margin: 0 0 8px 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .panel-header p {
          margin: 0;
          opacity: 0.9;
          font-size: 0.95rem;
        }

        .upload-container {
          padding: 32px;
        }

        .copilot-panel {
          flex: 0 0 30%;
          position: relative;
        }

        /* Responsive design */
        @media (max-width: 1024px) {
          .app-content {
            flex-direction: column;
            gap: 16px;
          }

          .upload-panel {
            flex: none;
            width: 100%;
          }

          .copilot-panel {
            flex: none;
            width: 100%;
          }

          .app-header h1 {
            font-size: 2rem;
          }

          .app-header p {
            font-size: 1rem;
          }
        }

        @media (max-width: 768px) {
          .app-header {
            padding: 24px 16px;
          }

          .app-header h1 {
            font-size: 1.75rem;
          }

          .app-content {
            padding: 0 16px;
            gap: 12px;
          }

          .panel-header {
            padding: 20px 24px;
          }

          .panel-header h2 {
            font-size: 1.25rem;
          }

          .upload-container {
            padding: 24px;
          }
        }

        @media (max-width: 480px) {
          .app-header h1 {
            font-size: 1.5rem;
          }

          .panel-header {
            padding: 16px 20px;
          }

          .upload-container {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default App; 