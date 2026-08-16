import { useAuth } from '../../context/AuthContext';
import { IconSearch, IconBell, IconChat } from '../icons/Icon';
import styles from './Topbar.module.css';

/**
 * Page header used inside DashboardLayout.
 * @param {string} title
 * @param {string} subtitle
 * @param {React.ReactNode} rightSlot - optional custom action (e.g. "Export" button)
 * @param {boolean} showSearch
 * @param {string} searchPlaceholder
 */
const Topbar = ({ title, subtitle, rightSlot, showSearch = true, searchPlaceholder = 'Search...' }) => {
  const { user } = useAuth();
  const initials = (user?.name || user?.email || '?').trim().charAt(0).toUpperCase();

  return (
    <header className={styles.topbar}>
      <div className={styles.titleBlock}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>

      <div className={styles.actions}>
        {showSearch && (
          <div className={styles.searchBox}>
            <IconSearch width={15} height={15} />
            <input type="text" placeholder={searchPlaceholder} />
          </div>
        )}
        {rightSlot}
        <button className={styles.iconBtn} title="Notifications">
          <IconBell width={17} height={17} />
          <span className={styles.dot} />
        </button>
        <button className={styles.iconBtn} title="Messages">
          <IconChat width={17} height={17} />
        </button>
        <div className={styles.avatarBtn}>{initials}</div>
      </div>
    </header>
  );
};

export default Topbar;
