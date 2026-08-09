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

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [stats, setStats] = useState({
    topicsCount: '—',
    questionsCount: '—',
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const topics = await adminService.getTopics();
        const qData = await adminService.getQuestions({ limit: 1 });
        setStats({
          topicsCount: topics.length,
          questionsCount: qData.total,
        });
      } catch {
        // ignore
      }
    };
    loadStats();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className={styles.layout}>
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

      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Admin Overview</h1>
            <p className="text-muted text-sm">Logged in as {user?.email}</p>
          </div>
        </header>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>📚</span>
            <div className={styles.statValue}>{stats.topicsCount}</div>
            <div className={styles.statLabel}>Active Topics</div>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>❓</span>
            <div className={styles.statValue}>{stats.questionsCount}</div>
            <div className={styles.statLabel}>Total Questions</div>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>📥</span>
            <div className={styles.statValue}>CSV</div>
            <div className={styles.statLabel}>Stream Import Active</div>
          </div>
        </div>

        <h2 style={{ fontSize: 18, marginBottom: 16, marginTop: 32 }}>Quick Management Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          <Link to="/admin/topics" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span style={{ fontSize: 24, display: 'block', marginBottom: 8 }}>📚</span>
            <strong style={{ fontSize: 16 }}>Topic Management</strong>
            <p className="text-sm text-muted" style={{ marginTop: 6 }}>Add, edit, or remove aptitude topics.</p>
          </Link>
          <Link to="/admin/questions" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span style={{ fontSize: 24, display: 'block', marginBottom: 8 }}>❓</span>
            <strong style={{ fontSize: 16 }}>Question Bank CRUD</strong>
            <p className="text-sm text-muted" style={{ marginTop: 6 }}>Manage single questions with filters & search.</p>
          </Link>
          <Link to="/admin/csv-import" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span style={{ fontSize: 24, display: 'block', marginBottom: 8 }}>📥</span>
            <strong style={{ fontSize: 16 }}>CSV Batch Import</strong>
            <p className="text-sm text-muted" style={{ marginTop: 6 }}>Stream and validate 6000+ question CSVs.</p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
