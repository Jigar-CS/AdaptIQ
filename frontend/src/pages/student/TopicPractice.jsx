import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Topbar from '../../components/layout/Topbar';
import { STUDENT_NAV } from '../../components/layout/navConfig';
import topicService from '../../services/topicService';
import { IconArrowRight } from '../../components/icons/Icon';
import styles from './TopicPractice.module.css';

const TopicPractice = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await topicService.getTopics();
        setTopics(data || []);
      } catch {
        setError('Unable to load topics right now.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <DashboardLayout navItems={STUDENT_NAV} subtitle="EdTech SaaS">
      <Topbar title="Topic Practice" subtitle="Pick a topic — the adaptive engine adjusts difficulty every 5 questions." showSearch={false} />

      {loading ? (
        <div className="text-muted">Loading topics…</div>
      ) : error ? (
        <div className="error-text">{error}</div>
      ) : topics.length === 0 ? (
        <div className={styles.empty}>No topics available yet. Check back once the admin adds question topics.</div>
      ) : (
        <div className={styles.grid}>
          {topics.map((t) => (
            <div key={t.id} className={styles.topicCard}>
              <div className={styles.topicIcon}>{(t.name || '?').charAt(0).toUpperCase()}</div>
              <div className={styles.topicName}>{t.name}</div>
              <p className={styles.topicDesc}>{t.description || 'Adaptive practice across Easy, Medium, and Hard difficulty.'}</p>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/adaptive', { state: { topicId: t.id, topicName: t.name } })}>
                Start Practice <IconArrowRight width={14} height={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default TopicPractice;
