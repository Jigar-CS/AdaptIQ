import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Topbar from '../../components/layout/Topbar';
import { ADMIN_NAV } from '../../components/layout/navConfig';
import adminService from '../../services/adminService';
import { IconCourses, IconAssignments, IconUpload, IconAnalytics } from '../../components/icons/Icon';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ topicsCount: '—', questionsCount: '—' });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const topics = await adminService.getTopics();
        const qData = await adminService.getQuestions({ limit: 1 });
        setStats({ topicsCount: topics.length, questionsCount: qData.total });
      } catch {
        // ignore
      }
    };
    loadStats();
  }, []);

  return (
    <DashboardLayout navItems={ADMIN_NAV} subtitle="EdTech SaaS · Admin">
      <Topbar title="Admin Overview" subtitle="Manage topics, questions, and platform data." showSearch={false} />

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statTop}><span>Active Topics</span> <IconCourses width={15} height={15} /></div>
          <div className={styles.statValue}>{stats.topicsCount}</div>
          <div className={styles.statSub}>Available for practice & CSV import</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTop}><span>Total Questions</span> <IconAssignments width={15} height={15} /></div>
          <div className={styles.statValue}>{stats.questionsCount}</div>
          <div className={styles.statSub}>Across all difficulty levels</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTop}><span>Import Pipeline</span> <IconUpload width={15} height={15} /></div>
          <div className={styles.statValue}>Streaming</div>
          <div className={styles.statSub}>CSV batch import active</div>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>Quick Management Actions</h2>
      <div className={styles.quickGrid}>
        <Link to="/admin/topics" className={styles.quickCard}>
          <div className={styles.quickIconWrap}><IconCourses /></div>
          <div className={styles.quickTitle}>Topic Management</div>
          <p className={styles.quickDesc}>Add, edit, or remove aptitude topics used by the adaptive engine.</p>
        </Link>
        <Link to="/admin/questions" className={styles.quickCard}>
          <div className={styles.quickIconWrap}><IconAssignments /></div>
          <div className={styles.quickTitle}>Question Bank CRUD</div>
          <p className={styles.quickDesc}>Manage single questions with topic and difficulty filters.</p>
        </Link>
        <Link to="/admin/csv-import" className={styles.quickCard}>
          <div className={styles.quickIconWrap}><IconUpload /></div>
          <div className={styles.quickTitle}>CSV Batch Import</div>
          <p className={styles.quickDesc}>Stream and validate large CSV question sets with duplicate detection.</p>
        </Link>
        <Link to="/admin/analytics" className={styles.quickCard}>
          <div className={styles.quickIconWrap}><IconAnalytics /></div>
          <div className={styles.quickTitle}>Platform Analytics</div>
          <p className={styles.quickDesc}>View question distribution and student performance at a glance.</p>
        </Link>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
