import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminDashboard.module.css';

const ADMIN_NAV = [
  { to: '/admin',                 label: '📊 Overview' },
  { to: '/admin/topics',          label: '📚 Topics' },
  { to: '/admin/questions',       label: '❓ Questions' },
  { to: '/admin/csv-import',      label: '📥 CSV Import' },
  { to: '/admin/users',           label: '👥 Users' },
  { to: '/admin/analytics',       label: '📈 Analytics' },
];

const STATS = [
  { label: 'Total Users',     value: '—', icon: '👥' },
  { label: 'Total Questions', value: '—', icon: '❓' },
  { label: 'Topics Active',   value: '—', icon: '📚' },
  { label: 'Avg. Accuracy',   value: '—', icon: '🎯' },
];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
            <span key={link.to} className={styles.navLink}>{link.label}</span>
          ))}
        </nav>
        <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%', fontSize: '13px', marginTop: '16px' }}>
          Sign Out
        </button>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Admin Dashboard</h1>
            <p className="text-muted text-sm">Logged in as {user?.email}</p>
          </div>
        </header>

        <div className={styles.statsGrid}>
          {STATS.map((s) => (
            <div key={s.label} className={styles.statCard}>
              <span className={styles.statIcon}>{s.icon}</span>
              <div className={styles.statValue}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className={styles.notice}>
          <span>🚧</span>
          <div>
            <strong>Admin panel under construction</strong>
            <p className="text-sm text-muted mt-4">Topic management, question CRUD, CSV import, and analytics will be implemented in Phases 4–11.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
