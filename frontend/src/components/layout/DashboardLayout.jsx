import Sidebar from './Sidebar';
import styles from './DashboardLayout.module.css';

/**
 * Shell used by every authenticated page (student + admin).
 * Renders sidebar + content area; footer is optional (shown on data-heavy pages).
 */
const DashboardLayout = ({ navItems, subtitle, children, footer = true }) => (
  <div className={styles.layout}>
    <Sidebar navItems={navItems} subtitle={subtitle} />
    <div className={styles.main}>
      <div className={styles.content}>{children}</div>
      {footer && (
        <footer className={styles.footer}>
          <span className={styles.footerBrand}>AdaptIQ</span>
          <nav className={styles.footerLinks}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Help Center</a>
            <a href="#">Contact Support</a>
          </nav>
          <span className={styles.footerCopy}>© {new Date().getFullYear()} AdaptIQ EdTech. All rights reserved.</span>
        </footer>
      )}
    </div>
  </div>
);

export default DashboardLayout;
