import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { IconLogout } from '../icons/Icon';
import styles from './Sidebar.module.css';

/**
 * Shared sidebar for both student and admin shells.
 * @param {Array<{to:string, label:string, icon:Function}>} navItems
 * @param {string} subtitle - small caption under the AdaptIQ logo (e.g. "EdTech SaaS")
 */
const Sidebar = ({ navItems, subtitle = 'EdTech SaaS' }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = (user?.name || user?.email || '?').trim().charAt(0).toUpperCase();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoTitle}>AdaptIQ</span>
        <span className={styles.logoSub}>{subtitle}</span>
      </div>

      <nav className={styles.nav}>
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`}
            >
              <Icon />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {user?.role !== 'admin' && (
        <button className={`btn btn-primary ${styles.upgradeBtn}`}>
          Upgrade to Pro
        </button>
      )}

      <div className={styles.userFooter}>
        <div className={styles.avatar}>{initials}</div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{user?.name || user?.email}</div>
          <div className={styles.userRole}>{user?.role === 'admin' ? 'System Admin' : 'Student'}</div>
        </div>
        <button className={styles.logoutIcon} onClick={handleLogout} title="Sign out">
          <IconLogout width={16} height={16} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
