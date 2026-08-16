import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Topbar from '../../components/layout/Topbar';
import { STUDENT_NAV } from '../../components/layout/navConfig';
import performanceService from '../../services/performanceService';
import placementScoreService from '../../services/placementScoreService';
import { IconSpark, IconDownload, IconClock, IconCheck, IconAssignments } from '../../components/icons/Icon';
import styles from './PerformanceDashboard.module.css';

const RANGES = [
  { key: '7d', label: '7D' },
  { key: '30d', label: '30D' },
  { key: '90d', label: '90D' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 10, padding: '10px 14px' }}>
      <div className="text-xs text-muted">{label}</div>
      <div style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: 14 }}>{payload[0].value}% Readiness</div>
    </div>
  );
};

const PerformanceDashboard = () => {
  const [summary, setSummary] = useState({ total_attempted: 0, accuracy_percent: 0, avg_response_time: 0 });
  const [history, setHistory] = useState([]);
  const [topics, setTopics] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [range, setRange] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const results = await Promise.allSettled([
        performanceService.getSummary(),
        placementScoreService.getHistory(),
        performanceService.getByTopic(),
        performanceService.getRecommendations(),
      ]);

      if (results[0].status === 'fulfilled' && results[0].value) {
        setSummary(results[0].value);
      }
      if (results[1].status === 'fulfilled' && Array.isArray(results[1].value?.history)) {
        setHistory(results[1].value.history);
      } else if (results[1].status === 'fulfilled' && Array.isArray(results[1].value)) {
        setHistory(results[1].value);
      }
      if (results[2].status === 'fulfilled' && Array.isArray(results[2].value?.topics)) {
        setTopics(results[2].value.topics);
      } else if (results[2].status === 'fulfilled' && Array.isArray(results[2].value)) {
        setTopics(results[2].value);
      }
      if (results[3].status === 'fulfilled' && Array.isArray(results[3].value?.recommendations)) {
        setRecommendations(results[3].value.recommendations);
      } else if (results[3].status === 'fulfilled' && Array.isArray(results[3].value)) {
        setRecommendations(results[3].value);
      }
      setLoading(false);
    };
    load();
  }, []);

  const chartData = history.length
    ? history.map((h) => ({ date: h.date || h.calculated_at, score: h.score }))
    : [];

  const latestScore = chartData.length ? chartData[chartData.length - 1].score : 0;

  return (
    <DashboardLayout navItems={STUDENT_NAV} subtitle="EdTech SaaS">
      <Topbar
        title="Performance Analytics"
        subtitle="Track your learning velocity and mastery readiness."
        showSearch={false}
        rightSlot={
          <button className="btn btn-outline btn-sm">
            <IconDownload width={14} height={14} /> Export
          </button>
        }
      />

      {/* Stat cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statTop}><span>Total Attempts</span> <IconAssignments width={15} height={15} /></div>
          <div className={styles.statValueRow}>
            <span className={styles.statValue}>{summary.total_attempted?.toLocaleString?.() ?? summary.total_attempted ?? 0}</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTop}><span>Overall Accuracy</span> <IconCheck width={15} height={15} /></div>
          <div className={styles.statValueRow}>
            <span className={styles.statValue} style={{ color: 'var(--color-primary)' }}>{Math.round(summary.accuracy_percent ?? 0)}%</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTop}><span>Avg Time/Question</span> <IconClock width={15} height={15} /></div>
          <div className={styles.statValueRow}>
            <span className={styles.statValue}>{Math.round(summary.avg_response_time ?? 0)}s</span>
          </div>
        </div>
      </div>

      <div className={styles.mainGrid}>
        {/* Readiness Trend Chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <span className={styles.chartTitle}>Readiness Trend</span>
            <div className={styles.rangeToggle}>
              {RANGES.map((r) => (
                <button
                  key={r.key}
                  className={`${styles.rangeBtn} ${range === r.key ? styles.rangeBtnActive : ''}`}
                  onClick={() => setRange(r.key)}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {chartData.length === 0 ? (
            <div className="text-muted text-sm" style={{ padding: '60px 0', textAlign: 'center' }}>
              Complete a Miscellaneous test to start building your readiness trend.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: 'var(--color-text-faint)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--color-text-faint)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="var(--color-primary)"
                  strokeWidth={3}
                  dot={{ r: 3, fill: 'var(--color-primary)' }}
                  activeDot={{ r: 5 }}
                  style={{ filter: 'drop-shadow(0 0 6px rgba(198,255,61,0.6))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* AdaptIQ Insights */}
        <div className={styles.insightsCard}>
          <div className={styles.insightsTitle}><IconSpark width={15} height={15} /> AdaptIQ Insights</div>
          {recommendations.length === 0 ? (
            <div className="text-sm text-muted">No recommendations yet — complete more tests to unlock personalized insights.</div>
          ) : (
            recommendations.slice(0, 4).map((rec) => (
              <div key={rec.id} className={styles.insightItem}>
                <IconSpark width={14} height={14} className={styles.insightIcon} />
                <span>{rec.message}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Topic Mastery */}
      <div className={styles.masteryCard}>
        <div className={styles.masteryTitle}>Topic Mastery</div>
        {topics.length === 0 ? (
          <div className="text-sm text-muted">Attempt topic practice tests to see mastery breakdown here.</div>
        ) : (
          topics.map((t) => {
            const pct = Math.round(t.accuracy_percent ?? 0);
            const cls = pct >= 70 ? '' : pct >= 40 ? 'warning' : 'danger';
            return (
              <div key={t.topic_id || t.name} className={styles.masteryRow}>
                <div className={styles.masteryLabelRow}>
                  <span className="text-muted">{t.topic_name || t.name}</span>
                  <span>{pct}%</span>
                </div>
                <div className="progress-track">
                  <div className={`progress-fill ${cls}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
};

export default PerformanceDashboard;
