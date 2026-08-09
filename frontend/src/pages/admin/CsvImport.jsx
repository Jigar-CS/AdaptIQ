import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/adminService';
import styles from './AdminDashboard.module.css';

const ADMIN_NAV = [
  { to: '/admin',           label: '📊 Overview' },
  { to: '/admin/topics',    label: '📚 Topics' },
  { to: '/admin/questions', label: '❓ Questions' },
  { to: '/admin/csv-import',label: '📥 CSV Import' },
];

const CsvImport = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [report, setReport] = useState(null);
  const [status, setStatus] = useState({ message: '', error: '' });

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const topicList = await adminService.getTopics();
        setTopics(topicList);
      } catch {
        // ignore
      }
    };
    loadTopics();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (!selected.name.endsWith('.csv')) {
        setStatus({ message: '', error: 'Please select a valid .csv file' });
        return;
      }
      setFile(selected);
      setStatus({ message: '', error: '' });
      setReport(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus({ message: '', error: 'Please select a CSV file to upload' });
      return;
    }

    setUploading(true);
    setStatus({ message: '', error: '' });
    setReport(null);

    try {
      const resReport = await adminService.importCsv(file, selectedTopic);
      setReport(resReport);
      setStatus({ message: 'CSV import processed successfully!', error: '' });
    } catch (err) {
      setStatus({
        message: '',
        error: err.response?.data?.error?.message || 'CSV import failed to process',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadSample = () => {
    const sampleCsv = `question_text,option_a,option_b,option_c,option_d,correct_option,difficulty,topic,explanation
"What is the capital of France?","London","Paris","Berlin","Madrid","B","Easy","General Knowledge","Paris is the capital of France."
"If 2x + 5 = 15, what is x?","3","5","7","10","B","Medium","Quantitative Aptitude","2x = 10, so x = 5."
"Which number comes next in sequence 2, 4, 8, 16?","24","30","32","64","C","Easy","Logical Reasoning","Each number doubles."`;

    const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sample_questions_import.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.layout}>
      {/* Admin Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}><span>⚡</span><span>AdaptIQ Admin</span></div>
        <nav className={styles.nav}>
          {ADMIN_NAV.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={styles.navLink}
              style={location.pathname === link.to ? { background: 'rgba(108,99,255,0.15)', color: 'var(--color-primary)' } : {}}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%', fontSize: '13px', marginTop: '16px' }}>
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <header className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className={styles.title}>CSV Batch Import</h1>
            <p className="text-muted text-sm">Upload large question banks in bulk using streaming validation</p>
          </div>
          <button className="btn btn-outline" onClick={handleDownloadSample}>
            📥 Download Sample CSV
          </button>
        </header>

        {status.message && <div style={{ color: 'var(--color-accent)', marginBottom: 16 }}>{status.message}</div>}
        {status.error && <div className="error-text" style={{ marginBottom: 16 }}>{status.error}</div>}

        {/* Upload Form Card */}
        <form onSubmit={handleSubmit} className="card" style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 16, marginBottom: 16 }}>1. Select Import Configuration</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div className="form-group">
              <label className="form-label">Default Topic (Fallback if not in CSV)</label>
              <select
                className="form-input"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
              >
                <option value="">Auto-detect / None</option>
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">CSV File</label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', marginBottom: 20 }}>
            <strong style={{ fontSize: 13, display: 'block', marginBottom: 6 }}>CSV Format Instructions:</strong>
            <ul style={{ fontSize: 13, color: 'var(--color-text-muted)', paddingLeft: 20, margin: 0 }}>
              <li>Required columns: <code>question_text</code>, <code>option_a</code>, <code>option_b</code>, <code>option_c</code>, <code>option_d</code>, <code>correct_option</code>, <code>difficulty</code>.</li>
              <li>Optional columns: <code>topic</code> (or <code>topic_id</code>), <code>explanation</code>.</li>
              <li><code>correct_option</code> must be one of: <code>A</code>, <code>B</code>, <code>C</code>, <code>D</code>.</li>
              <li><code>difficulty</code> must be one of: <code>Easy</code>, <code>Medium</code>, <code>Hard</code>.</li>
              <li>Duplicate questions per topic (SHA-256 matched) are automatically skipped.</li>
            </ul>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={uploading || !file}
          >
            {uploading ? 'Processing CSV Stream…' : 'Start Batch Import'}
          </button>
        </form>

        {/* Import Results Report Dashboard */}
        {report && (
          <div className="card">
            <h2 style={{ fontSize: 18, marginBottom: 16 }}>Import Execution Report</h2>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statValue} style={{ color: 'var(--color-text-main)' }}>{report.total_rows}</div>
                <div className={styles.statLabel}>Total Rows Parsed</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue} style={{ color: 'var(--color-success)' }}>{report.inserted}</div>
                <div className={styles.statLabel}>Successfully Inserted</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue} style={{ color: 'var(--color-warning)' }}>{report.skipped_duplicates}</div>
                <div className={styles.statLabel}>Skipped Duplicates</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue} style={{ color: report.errors.length > 0 ? 'var(--color-danger)' : 'var(--color-text-muted)' }}>
                  {report.errors.length}
                </div>
                <div className={styles.statLabel}>Rejected Rows</div>
              </div>
            </div>

            {report.errors && report.errors.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <h3 style={{ fontSize: 15, marginBottom: 12, color: 'var(--color-danger)' }}>Error Breakdown ({report.errors.length} issues)</h3>
                <div style={{ maxHeight: 260, overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,92,92,0.1)', borderBottom: '1px solid var(--color-border)' }}>
                        <th style={{ padding: '10px 14px', width: 90 }}>Row #</th>
                        <th style={{ padding: '10px 14px' }}>Rejection Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.errors.map((err, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '10px 14px', fontWeight: 600 }}>Row {err.row}</td>
                          <td style={{ padding: '10px 14px', color: 'var(--color-danger)' }}>{err.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default CsvImport;
