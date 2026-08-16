import { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Topbar from '../../components/layout/Topbar';
import { ADMIN_NAV } from '../../components/layout/navConfig';
import adminService from '../../services/adminService';
import { IconUpload, IconCheck, IconAlert, IconDownload } from '../../components/icons/Icon';
import adminStyles from './AdminDashboard.module.css';
import styles from './CsvImport.module.css';

const CsvImport = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('auto');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [report, setReport] = useState(null);
  const [status, setStatus] = useState({ message: '', error: '' });
  const [dragOver, setDragOver] = useState(false);
  const [recentUploads, setRecentUploads] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const topicList = await adminService.getTopics();
        setTopics(topicList);
      } catch { /* ignore */ }
    };
    loadTopics();
  }, []);

  const validateAndSetFile = (selected) => {
    if (!selected) return;
    if (!selected.name.endsWith('.csv')) {
      setStatus({ message: '', error: 'Please select a valid .csv file' });
      return;
    }
    setFile(selected);
    setStatus({ message: '', error: '' });
    setReport(null);
  };

  const handleFileChange = (e) => validateAndSetFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    validateAndSetFile(e.dataTransfer.files[0]);
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
      const resReport = await adminService.importCsv(file, selectedTopic === 'auto' ? '' : selectedTopic);
      setReport(resReport);
      setStatus({ message: 'CSV imported successfully.', error: '' });
      setRecentUploads((prev) => [
        {
          name: file.name,
          state: resReport.errors?.length ? 'warn' : 'ok',
          detail: `Processed ${resReport.inserted}/${resReport.total_rows} rows`,
        },
        ...prev,
      ].slice(0, 5));
    } catch (err) {
      const message = err.response?.data?.error?.message || 'CSV import failed to process';
      setStatus({ message: '', error: message });
      setRecentUploads((prev) => [{ name: file.name, state: 'error', detail: message }, ...prev].slice(0, 5));
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadSample = () => {
    const sampleCsv = `question_text,option_a,option_b,option_c,option_d,correct_option,difficulty,topic,explanation
"If a train travels 60 km in 1 hour, how far in 3 hours?","120 km","150 km","180 km","200 km","C","Easy","Time, Speed & Distance","Distance = 60 * 3 = 180 km."
"What is 15% of 200?","25","30","35","40","B","Easy","Percentages & Profit/Loss","15/100 * 200 = 30."`;
    const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sample_question_dataset.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout navItems={ADMIN_NAV} subtitle="EdTech SaaS · Admin">
      <Topbar
        title="Data Management"
        subtitle="Bulk import validated question sets into the question bank."
        searchPlaceholder="Search repository..."
      />

      <div className={styles.grid}>
        {/* Bulk Import drop zone */}
        <div className={styles.dropCard}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 18 }}>Bulk Import</h2>

          <div
            className={`${styles.dropZone} ${dragOver ? styles.dragOver : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <div className={styles.dropIcon}><IconUpload width={24} height={24} /></div>
            <p className={styles.dropText}>{file ? file.name : 'Drag & Drop CSV files here'}</p>
            <p className="text-xs text-faint mb-4">{file ? 'Ready to import' : 'or click to browse from your computer'}</p>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => fileInputRef.current?.click()}>
              Select Files
            </button>
            <input ref={fileInputRef} type="file" accept=".csv" hidden onChange={handleFileChange} />
            <div className={styles.dropSub}>Max file size: 10MB. Supported format: .csv</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, marginTop: 20, alignItems: 'end' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Target Topic</label>
                <select className="form-input" value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
                  <option value="auto">Auto Detect Topic</option>
                  {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <button type="submit" className="btn btn-primary" disabled={uploading || !file}>
                {uploading ? 'Importing…' : 'Start Import'}
              </button>
            </div>
          </form>

          <div className={styles.infoBox}>
            <strong>Validation performed automatically:</strong>
            <ul>
              <li>Required fields present (question, 4 options, correct option, difficulty)</li>
              <li>Difficulty normalized to Easy / Medium / Hard</li>
              <li>SHA-256 duplicate detection per topic</li>
              <li>Bad rows rejected individually with reasons — no partial silent corruption</li>
            </ul>
          </div>

          {status.message && <div className="text-primary mb-4">{status.message}</div>}
          {status.error && <div className="error-text">{status.error}</div>}
        </div>

        {/* Import Status feed */}
        <div className={styles.statusCard}>
          <div className={styles.statusTitle}>Import Status</div>
          {recentUploads.length === 0 ? (
            <p className="text-sm text-muted">No imports yet this session.</p>
          ) : (
            recentUploads.map((u, idx) => (
              <div key={idx} className={styles.statusItem}>
                <div className={`${styles.statusIcon} ${styles[u.state]}`}>
                  {u.state === 'ok' ? <IconCheck width={14} height={14} /> : <IconAlert width={14} height={14} />}
                </div>
                <div>
                  <div className={styles.statusName}>{u.name}</div>
                  <div className={styles.statusDesc}>{u.detail}</div>
                </div>
              </div>
            ))
          )}
          <button className="btn btn-outline btn-sm mt-4" onClick={handleDownloadSample}>
            <IconDownload width={14} height={14} /> Download Sample CSV
          </button>
        </div>
      </div>

      {/* Import Results Report */}
      {report && (
        <div className={adminStyles.tableCard} style={{ padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Import Execution Report</h2>
          <div className={adminStyles.statsGrid}>
            <div className={adminStyles.statCard}>
              <div className={adminStyles.statTop}><span>Total Rows</span></div>
              <div className={adminStyles.statValue} style={{ color: 'var(--color-text)' }}>{report.total_rows}</div>
            </div>
            <div className={adminStyles.statCard}>
              <div className={adminStyles.statTop}><span>Inserted</span></div>
              <div className={adminStyles.statValue} style={{ color: 'var(--color-success)' }}>{report.inserted}</div>
            </div>
            <div className={adminStyles.statCard}>
              <div className={adminStyles.statTop}><span>Skipped Duplicates</span></div>
              <div className={adminStyles.statValue} style={{ color: 'var(--color-warning)' }}>{report.skipped_duplicates}</div>
            </div>
            <div className={adminStyles.statCard}>
              <div className={adminStyles.statTop}><span>Rejected Rows</span></div>
              <div className={adminStyles.statValue} style={{ color: report.errors?.length ? 'var(--color-danger)' : 'var(--color-text-muted)' }}>
                {report.errors?.length || 0}
              </div>
            </div>
          </div>

          {report.errors && report.errors.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <h3 style={{ fontSize: 14, marginBottom: 12, color: 'var(--color-danger)' }}>Error Breakdown ({report.errors.length} issues)</h3>
              <div style={{ maxHeight: 260, overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                <table className={adminStyles.table}>
                  <thead>
                    <tr><th style={{ width: 90 }}>Row #</th><th>Rejection Reason</th></tr>
                  </thead>
                  <tbody>
                    {report.errors.map((err, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600 }}>Row {err.row}</td>
                        <td className="text-danger">{err.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default CsvImport;
