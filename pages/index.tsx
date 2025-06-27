import React, { useState, useEffect } from 'react';
import FileUploader, { ParsedData } from '../ui/components/FileUploader';
import SidebarCopilot from '../ui/components/SidebarCopilot';

interface Statement {
  id: string;
  file_name: string;
  file_type: string;
  carrier: string;
  premium: number;
  commission: number;
  lives: number;
  month: string;
  confidence: number;
  created_at: string;
}

interface Carrier {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'flagged';
  setup_date?: string;
  first_statement_date?: string;
  notes?: string;
  created_at: string;
}

interface Rep {
  id: string;
  name: string;
  email?: string;
  commission_rate: number;
  total_earnings: number;
  total_lives: number;
  created_at: string;
}

const Home: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [parsedData, setParsedData] = useState<ParsedData[]>([]);
  const [statements, setStatements] = useState<Statement[]>([]);
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [reps, setReps] = useState<Rep[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [processingFiles, setProcessingFiles] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statementsRes, carriersRes, repsRes] = await Promise.all([
        fetch('/api/statements'),
        fetch('/api/carriers'),
        fetch('/api/reps')
      ]);

      const statementsData = await statementsRes.json();
      const carriersData = await carriersRes.json();
      const repsData = await repsRes.json();

      if (statementsData.statements) setStatements(statementsData.statements);
      if (carriersData.carriers) setCarriers(carriersData.carriers);
      if (repsData.reps) setReps(repsData.reps);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleParsedData = (data: ParsedData) => {
    setParsedData(prev => [...prev, data]);
    setTimeout(() => fetchData(), 1000);
  };

  const handleFilesSelected = (files: File[]) => {
    setUploadedFiles(files);
    setProcessingFiles(files.map(f => f.name));
  };

  const handleFileProcessed = (fileName: string) => {
    setProcessingFiles(prev => prev.filter(name => name !== fileName));
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderDashboard = () => (
    <section id="dashboard" className="section">
      <div className="section-header">
        <h2>Commission Dashboard</h2>
        <p>Real-time overview of your commission tracking operations</p>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <div className="dashboard-content">
          <div className="metrics-grid">
            <div className="metric-card primary">
              <div className="metric-icon">$</div>
              <div className="metric-content">
                <h3>Total Commissions</h3>
                <p className="metric-value">
                  ${statements.reduce((sum, stmt) => sum + Number(stmt.commission), 0).toLocaleString()}
                </p>
                <p className="metric-label">This month</p>
              </div>
            </div>

            <div className="metric-card success">
              <div className="metric-icon">👥</div>
              <div className="metric-content">
                <h3>Lives Covered</h3>
                <p className="metric-value">
                  {statements.reduce((sum, stmt) => sum + Number(stmt.lives), 0).toLocaleString()}
                </p>
                <p className="metric-label">Active policies</p>
              </div>
            </div>

            <div className="metric-card info">
              <div className="metric-icon">🏢</div>
              <div className="metric-content">
                <h3>Active Carriers</h3>
                <p className="metric-value">
                  {carriers.filter(c => c.status === 'active').length}
                </p>
                <p className="metric-label">Partnerships</p>
              </div>
            </div>

            <div className="metric-card warning">
              <div className="metric-icon">📄</div>
              <div className="metric-content">
                <h3>Statements Processed</h3>
                <p className="metric-value">{statements.length}</p>
                <p className="metric-label">Total documents</p>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="chart-card">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                {statements.slice(0, 5).map((statement) => (
                  <div key={statement.id} className="activity-item">
                    <div className="activity-icon">📄</div>
                    <div className="activity-details">
                      <div className="activity-title">{statement.file_name}</div>
                      <div className="activity-subtitle">
                        {statement.carrier} • {statement.month} • ${Number(statement.commission).toLocaleString()}
                      </div>
                    </div>
                    <div className="activity-confidence">
                      {Math.round(Number(statement.confidence) * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="chart-card">
              <h3>Top Performers</h3>
              <div className="performers-list">
                {reps.slice(0, 3).map((rep) => (
                  <div key={rep.id} className="performer-item">
                    <div className="performer-avatar">{rep.name.charAt(0)}</div>
                    <div className="performer-details">
                      <div className="performer-name">{rep.name}</div>
                      <div className="performer-stats">
                        ${Number(rep.total_earnings).toLocaleString()} • {Number(rep.total_lives).toLocaleString()} lives
                      </div>
                    </div>
                    <div className="performer-rate">
                      {(Number(rep.commission_rate) * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );

  const renderUpload = () => (
    <section id="upload" className="section">
      <div className="section-header">
        <h2>Statement Processing</h2>
        <p>AI-powered document parsing and data extraction</p>
      </div>

      <div className="upload-content">
        <div className="upload-grid">
          <div className="upload-card">
            <h3>File Upload</h3>
            <FileUploader 
              onParsedData={handleParsedData}
              onFilesSelected={handleFilesSelected}
              onFileProcessed={handleFileProcessed}
            />
          </div>

          <div className="upload-card">
            <h3>Processing Status</h3>
            {uploadedFiles.length > 0 ? (
              <div className="processing-list">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="processing-item">
                    <span className="file-name">{file.name}</span>
                    <span className="processing-status">
                      {processingFiles.includes(file.name) ? 'Processing...' : 'Complete'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📁</div>
                <p>No files uploaded yet</p>
                <p className="empty-subtitle">Drag and drop your commission statements here</p>
              </div>
            )}
          </div>
        </div>

        {parsedData.length > 0 && (
          <div className="results-card">
            <h3>Parsed Results</h3>
            <div className="results-grid">
              {parsedData.map((data, index) => (
                <div key={index} className="result-item">
                  <div className="result-header">
                    <span className="carrier-name">{data.carrier}</span>
                    <span className="confidence-badge">
                      {Math.round(data.confidence * 100)}%
                    </span>
                  </div>
                  <div className="result-details">
                    <div className="detail-row">
                      <span>Premium:</span>
                      <span>${data.premium.toLocaleString()}</span>
                    </div>
                    <div className="detail-row">
                      <span>Commission:</span>
                      <span>${data.commission.toLocaleString()}</span>
                    </div>
                    <div className="detail-row">
                      <span>Lives:</span>
                      <span>{data.lives.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );

  const renderCarriers = () => (
    <section id="carriers" className="section">
      <div className="section-header">
        <h2>Carrier Management</h2>
        <p>Monitor and manage your insurance carrier partnerships</p>
      </div>

      <div className="carriers-content">
        <div className="carriers-grid">
          {carriers.map((carrier) => (
            <div key={carrier.id} className={`carrier-card ${carrier.status}`}>
              <div className="carrier-header">
                <h3>{carrier.name}</h3>
                <span className={`status-badge ${carrier.status}`}>
                  {carrier.status}
                </span>
              </div>
              <div className="carrier-stats">
                <div className="stat-item">
                  <span className="stat-label">Setup Date:</span>
                  <span className="stat-value">
                    {carrier.setup_date ? new Date(carrier.setup_date).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">First Statement:</span>
                  <span className="stat-value">
                    {carrier.first_statement_date ? new Date(carrier.first_statement_date).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
              {carrier.notes && (
                <div className="carrier-notes">
                  <p>{carrier.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderReps = () => (
    <section id="reps" className="section">
      <div className="section-header">
        <h2>Sales Representatives</h2>
        <p>Track performance and commission earnings by representative</p>
      </div>

      <div className="reps-content">
        <div className="reps-grid">
          {reps.map((rep) => (
            <div key={rep.id} className="rep-card">
              <div className="rep-header">
                <div className="rep-avatar">{rep.name.charAt(0)}</div>
                <div className="rep-info">
                  <h3>{rep.name}</h3>
                  {rep.email && <p className="rep-email">{rep.email}</p>}
                </div>
              </div>
              <div className="rep-stats">
                <div className="stat-item">
                  <span className="stat-label">Commission Rate:</span>
                  <span className="stat-value">{(Number(rep.commission_rate) * 100).toFixed(1)}%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Earnings:</span>
                  <span className="stat-value">${Number(rep.total_earnings).toLocaleString()}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Lives Managed:</span>
                  <span className="stat-value">{Number(rep.total_lives).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderAnalytics = () => (
    <section id="analytics" className="section">
      <div className="section-header">
        <h2>Analytics & Reports</h2>
        <p>Advanced insights and performance analytics</p>
      </div>

      <div className="analytics-content">
        <div className="analytics-grid">
          <div className="analytics-card">
            <h3>Commission Trends</h3>
            <div className="chart-placeholder">
              <div className="chart-icon">📈</div>
              <p>Monthly commission trends chart</p>
              <p className="chart-subtitle">Coming soon: Interactive charts and graphs</p>
            </div>
          </div>

          <div className="analytics-card">
            <h3>Carrier Performance</h3>
            <div className="chart-placeholder">
              <div className="chart-icon">🏆</div>
              <p>Carrier comparison metrics</p>
              <p className="chart-subtitle">Performance analysis by carrier</p>
            </div>
          </div>

          <div className="analytics-card">
            <h3>Rep Performance</h3>
            <div className="chart-placeholder">
              <div className="chart-icon">👥</div>
              <p>Sales representative rankings</p>
              <p className="chart-subtitle">Top performers and metrics</p>
            </div>
          </div>

          <div className="analytics-card">
            <h3>Data Quality</h3>
            <div className="chart-placeholder">
              <div className="chart-icon">✅</div>
              <p>Parsing accuracy and confidence</p>
              <p className="chart-subtitle">AI model performance metrics</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <h1>Innovative Commission Tracker</h1>
            <p>AI-Powered Insurance Commission Management</p>
          </div>
          <nav className="main-nav">
            <button 
              className={`nav-link ${activeSection === 'dashboard' ? 'active' : ''}`}
              onClick={() => scrollToSection('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`nav-link ${activeSection === 'upload' ? 'active' : ''}`}
              onClick={() => scrollToSection('upload')}
            >
              Processing
            </button>
            <button 
              className={`nav-link ${activeSection === 'carriers' ? 'active' : ''}`}
              onClick={() => scrollToSection('carriers')}
            >
              Carriers
            </button>
            <button 
              className={`nav-link ${activeSection === 'reps' ? 'active' : ''}`}
              onClick={() => scrollToSection('reps')}
            >
              Representatives
            </button>
            <button 
              className={`nav-link ${activeSection === 'analytics' ? 'active' : ''}`}
              onClick={() => scrollToSection('analytics')}
            >
              Analytics
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        {renderDashboard()}
        {renderUpload()}
        {renderCarriers()}
        {renderReps()}
        {renderAnalytics()}
      </main>

      <div className="copilot-sidebar">
        <SidebarCopilot parsedData={parsedData} />
      </div>

      <style jsx>{`
        .app-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: grid;
          grid-template-areas: 
            "header header header"
            "main main sidebar";
          grid-template-rows: auto 1fr;
          grid-template-columns: 1fr 1fr 350px;
        }

        .app-header {
          grid-area: header;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          padding: 20px 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo h1 {
          margin: 0 0 4px 0;
          color: #2c3e50;
          font-size: 1.75rem;
          font-weight: 700;
        }

        .logo p {
          margin: 0;
          color: #7f8c8d;
          font-size: 0.9rem;
        }

        .main-nav {
          display: flex;
          gap: 8px;
        }

        .nav-link {
          background: none;
          border: none;
          padding: 12px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #666;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .nav-link:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .nav-link.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .main-content {
          grid-area: main;
          padding: 32px;
          overflow-y: auto;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .section {
          margin-bottom: 64px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .section-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .section-header h2 {
          margin: 0 0 8px 0;
          color: #2c3e50;
          font-size: 2rem;
          font-weight: 700;
        }

        .section-header p {
          margin: 0;
          color: #7f8c8d;
          font-size: 1.1rem;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .metric-card {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 12px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-left: 4px solid;
        }

        .metric-card.primary {
          border-left-color: #667eea;
        }

        .metric-card.success {
          border-left-color: #27ae60;
        }

        .metric-card.info {
          border-left-color: #3498db;
        }

        .metric-card.warning {
          border-left-color: #f39c12;
        }

        .metric-icon {
          font-size: 2rem;
        }

        .metric-content h3 {
          margin: 0 0 8px 0;
          color: #666;
          font-size: 14px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .metric-value {
          margin: 0 0 4px 0;
          color: #2c3e50;
          font-size: 1.75rem;
          font-weight: 700;
        }

        .metric-label {
          margin: 0;
          color: #999;
          font-size: 12px;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
        }

        .chart-card {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .chart-card h3 {
          margin: 0 0 20px 0;
          color: #2c3e50;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .activity-list, .performers-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .activity-item, .performer-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }

        .activity-icon {
          font-size: 20px;
        }

        .activity-details, .performer-details {
          flex: 1;
        }

        .activity-title, .performer-name {
          margin: 0 0 4px 0;
          color: #2c3e50;
          font-size: 14px;
          font-weight: 600;
        }

        .activity-subtitle, .performer-stats {
          margin: 0;
          color: #7f8c8d;
          font-size: 12px;
        }

        .activity-confidence {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .performer-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 16px;
        }

        .performer-rate {
          background: rgba(39, 174, 96, 0.1);
          color: #27ae60;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .upload-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .upload-card {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .upload-card h3 {
          margin: 0 0 20px 0;
          color: #2c3e50;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .processing-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .processing-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 8px;
        }

        .file-name {
          font-weight: 500;
          color: #2c3e50;
        }

        .processing-status {
          font-size: 14px;
          color: #7f8c8d;
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #999;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 16px;
        }

        .empty-subtitle {
          font-size: 14px;
          margin-top: 8px;
        }

        .results-card {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .results-card h3 {
          margin: 0 0 20px 0;
          color: #2c3e50;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
        }

        .result-item {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 16px;
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .carrier-name {
          font-weight: 600;
          color: #2c3e50;
        }

        .confidence-badge {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .result-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
        }

        .detail-row span:first-child {
          color: #7f8c8d;
        }

        .detail-row span:last-child {
          font-weight: 600;
          color: #2c3e50;
        }

        .carriers-grid, .reps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 24px;
        }

        .carrier-card, .rep-card {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-left: 4px solid;
        }

        .carrier-card.active {
          border-left-color: #27ae60;
        }

        .carrier-card.pending {
          border-left-color: #f39c12;
        }

        .carrier-card.flagged {
          border-left-color: #e74c3c;
        }

        .carrier-header, .rep-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .carrier-header h3, .rep-header h3 {
          margin: 0;
          color: #2c3e50;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .status-badge.active {
          background: rgba(39, 174, 96, 0.1);
          color: #27ae60;
        }

        .status-badge.pending {
          background: rgba(243, 156, 18, 0.1);
          color: #f39c12;
        }

        .status-badge.flagged {
          background: rgba(231, 76, 60, 0.1);
          color: #e74c3c;
        }

        .carrier-stats, .rep-stats {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
        }

        .stat-label {
          color: #7f8c8d;
        }

        .stat-value {
          font-weight: 600;
          color: #2c3e50;
        }

        .carrier-notes {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e0e0e0;
        }

        .carrier-notes p {
          margin: 0;
          color: #666;
          font-size: 14px;
          font-style: italic;
        }

        .rep-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 18px;
        }

        .rep-info h3 {
          margin: 0 0 4px 0;
        }

        .rep-email {
          margin: 0;
          color: #7f8c8d;
          font-size: 14px;
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .analytics-card {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .analytics-card h3 {
          margin: 0 0 20px 0;
          color: #2c3e50;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .chart-placeholder {
          padding: 40px 20px;
          color: #999;
        }

        .chart-icon {
          font-size: 3rem;
          margin-bottom: 16px;
        }

        .chart-subtitle {
          font-size: 14px;
          margin-top: 8px;
          color: #bbb;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 400px;
          gap: 16px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .copilot-sidebar {
          grid-area: sidebar;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          flex-direction: column;
          box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 1024px) {
          .app-container {
            grid-template-areas: 
              "header"
              "main"
              "sidebar";
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr auto;
          }

          .header-content {
            flex-direction: column;
            gap: 20px;
          }

          .main-nav {
            flex-wrap: wrap;
            justify-content: center;
          }

          .copilot-sidebar {
            height: 300px;
          }

          .main-content {
            padding: 20px;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .upload-grid {
            grid-template-columns: 1fr;
          }

          .carriers-grid, .reps-grid {
            grid-template-columns: 1fr;
          }

          .analytics-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .section {
            padding: 20px;
          }

          .nav-link {
            padding: 8px 12px;
            font-size: 12px;
          }

          .metric-card {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Home; 