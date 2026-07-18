import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Dashboard.module.css';

const NAV_LINKS = [
  { to: '/dashboard',   label: '🏠 Dashboard' },
  { to: '/practice',    label: '📝 Practice' },
  { to: '/adaptive',    label: '⚡ Adaptive Test' },
  { to: '/performance', label: '📊 Performance' },
  { to: '/profile',     label: '👤 Profile' },
];

const STAT_CARDS = [
  { label: 'Placement Score',  value: '—',   sub: 'Not yet calculated',  color: 'var(--color-primary)' },
  { label: 'Topics Attempted', value: '0',    sub: 'of 10 topics',        color: 'var(--color-accent)' },
  { label: 'Questions Done',   value: '0',    sub: 'Total attempts',      color: 'var(--color-warning)' },
  { label: 'Accuracy',         value: '—',    sub: 'Overall accuracy',    color: 'var(--color-danger)' },
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <span>⚡</span>
          <span>AdaptIQ</span>
        </div>
        <nav className={styles.nav}>
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className={styles.navLink}
              style={location.pathname === link.to ? { background: 'rgba(108,99,255,0.15)', color: 'var(--color-primary)' } : {}}>
              {link.label}
            </Link>
          ))}
        </nav>
        <button onClick={handleLogout} className={`btn btn-outline ${styles.logoutBtn}`}>
          Sign Out
        </button>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.greeting}>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="text-muted text-sm">Ready to continue your placement prep?</p>
          </div>
        </header>

        {/* Stats Grid */}
        <section className={styles.statsGrid}>
          {STAT_CARDS.map((card) => (
            <div key={card.label} className={styles.statCard}>
              <div className={styles.statValue} style={{ color: card.color }}>{card.value}</div>
              <div className={styles.statLabel}>{card.label}</div>
              <div className={styles.statSub}>{card.sub}</div>
            </div>
          ))}
        </section>

        {/* Quick Actions */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Quick Start</h2>
          <div className={styles.quickGrid}>
            <Link to="/practice" className={styles.quickCard}>
              <span className={styles.quickIcon}>📝</span>
              <div>
                <div className={styles.quickTitle}>Topic Practice</div>
                <div className={styles.quickSub}>Practice by topic at fixed difficulty</div>
              </div>
            </Link>
            <Link to="/adaptive" className={styles.quickCard} style={{ borderColor: 'rgba(108,99,255,0.3)' }}>
              <span className={styles.quickIcon}>⚡</span>
              <div>
                <div className={styles.quickTitle}>Adaptive Test</div>
                <div className={styles.quickSub}>AI-adjusted difficulty based on your performance</div>
              </div>
            </Link>
            <Link to="/performance" className={styles.quickCard}>
              <span className={styles.quickIcon}>📊</span>
              <div>
                <div className={styles.quickTitle}>View Analytics</div>
                <div className={styles.quickSub}>Track accuracy, speed, and topic coverage</div>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
