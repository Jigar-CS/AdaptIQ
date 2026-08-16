import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Topbar from '../../components/layout/Topbar';
import { ADMIN_NAV } from '../../components/layout/navConfig';
import adminService from '../../services/adminService';
import { IconCourses, IconAssignments, IconAnalytics } from '../../components/icons/Icon';
import styles from './AdminDashboard.module.css';

const Analytics = () => {
  const [overview, setOverview] = useState(null);
  const [breakdown, setBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const results = await Promise.allSettled([
        adminService.getAnalyticsOverview(),
        adminService.getTopicDifficultyBreakdown(),
      ]);
      if (results[0].status === 'fulfilled') setOverview(results[0].value);
      if (results[1].status === 'fulfilled') {
        const data = results[1].value;
        setBreakdown(Array.isArray(data) ? data : data?.breakdown || []);
      }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <DashboardLayout navItems={ADMIN_NAV} subtitle="EdTech SaaS · Admin">
      <Topbar title="Platform Analytics" subtitle="Question distribution and student performance overview." showSearch={false} />

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statTop}><span>Total Users</span> <IconCourses width={15} height={15} /></div>
          <div className={styles.statValue}>{overview?.total_users ?? '—'}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTop}><span>Total Questions</span> <IconAssignments width={15} height={15} /></div>
          <div className={styles.statValue}>{overview?.total_questions ?? '—'}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTop}><span>Platform Avg Accuracy</span> <IconAnalytics width={15} height={15} /></div>
          <div className={styles.statValue}>{overview?.avg_accuracy != null ? `${Math.round(overview.avg_accuracy)}%` : '—'}</div>
        </div>
      </div>

      <div className={styles.tableCard} style={{ padding: 24 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Questions per Topic × Difficulty</h2>
        {loading ? (
          <div className="text-muted">Loading chart data…</div>
        ) : breakdown.length === 0 ? (
          <div className="text-muted text-sm">No question data yet — import questions via CSV to populate this chart.</div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={breakdown} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="topic_name" tick={{ fill: 'var(--color-text-faint)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--color-text-faint)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="easy_count" name="Easy" stackId="a" fill="#4ade80" radius={[0, 0, 0, 0]} />
              <Bar dataKey="medium_count" name="Medium" stackId="a" fill="#ffb020" radius={[0, 0, 0, 0]} />
              <Bar dataKey="hard_count" name="Hard" stackId="a" fill="#ff5c5c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
