import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';

const stub = (icon, title, desc) => () => (
  <div className={styles.layout}>
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo}><span>⚡</span><span>AdaptIQ</span></div>
      <nav className={styles.nav}>
        {[['/', '🏠 Dashboard'], ['/practice', '📝 Practice'], ['/adaptive', '⚡ Adaptive Test'], ['/performance', '📊 Performance'], ['/profile', '👤 Profile']].map(([to, label]) => (
          <Link key={to} to={to} className={styles.navLink}>{label}</Link>
        ))}
      </nav>
    </aside>
    <main className={styles.main}>
      <div className={styles.comingSoon}>
        <div className={styles.comingSoonIcon}>{icon}</div>
        <h1 className={styles.comingSoonTitle}>{title}</h1>
        <p className={styles.comingSoonSub}>{desc}</p>
        <Link to="/dashboard" className="btn btn-outline mt-4">← Back to Dashboard</Link>
      </div>
    </main>
  </div>
);

export const TopicPractice = stub('📝', 'Topic Practice', 'Practice by topic and difficulty. Coming in Phase 7.');
export const AdaptiveTest = stub('⚡', 'Adaptive Test', 'Real-time difficulty adaptation. Coming in Phase 8.');
export const PerformanceDashboard = stub('📊', 'Performance Analytics', 'Accuracy, topic charts, and trends. Coming in Phase 11.');
export const Profile = stub('👤', 'Profile', 'Manage your account details. Coming soon.');
