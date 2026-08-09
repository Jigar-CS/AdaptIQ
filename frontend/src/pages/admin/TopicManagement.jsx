import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/adminService';
import styles from './AdminDashboard.module.css';

const ADMIN_NAV = [
  { to: '/admin',           label: '📊 Overview' },
  { to: '/admin/topics',    label: '📚 Topics' },
  { to: '/admin/questions', label: '❓ Questions' },
  { to: '/admin/csv-import',label: '📥 CSV Import' },
];

const TopicManagement = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ message: '', error: '' });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);

  const loadTopics = async () => {
    setLoading(true);
    try {
      const data = await adminService.getTopics();
      setTopics(data);
    } catch (err) {
      setStatus({ message: '', error: 'Failed to load topics' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopics();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const openAddModal = () => {
    setEditingTopic(null);
    setForm({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (topic) => {
    setEditingTopic(topic);
    setForm({ name: topic.name, description: topic.description || '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ message: '', error: '' });

    try {
      if (editingTopic) {
        await adminService.updateTopic(editingTopic.id, form);
        setStatus({ message: 'Topic updated successfully', error: '' });
      } else {
        await adminService.createTopic(form);
        setStatus({ message: 'Topic created successfully', error: '' });
      }
      setIsModalOpen(false);
      await loadTopics();
    } catch (err) {
      setStatus({
        message: '',
        error: err.response?.data?.error?.message || 'Failed to save topic',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete topic "${name}"?`)) return;
    setStatus({ message: '', error: '' });
    try {
      await adminService.deleteTopic(id);
      setStatus({ message: 'Topic deleted successfully', error: '' });
      await loadTopics();
    } catch (err) {
      setStatus({ message: '', error: 'Failed to delete topic' });
    }
  };

  return (
    <div className={styles.layout}>
      {/* Admin Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}><span>⚡</span><span>AdaptIQ Admin</span></div>
        <nav className={styles.nav}>
          {ADMIN_NAV.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={styles.navLink}
              style={location.pathname === link.to ? { background: 'rgba(108,99,255,0.15)', color: 'var(--color-primary)' } : {}}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%', fontSize: '13px', marginTop: '16px' }}>
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <header className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className={styles.title}>Topic Management</h1>
            <p className="text-muted text-sm">Manage aptitude topics available for tests and questions</p>
          </div>
          <button className="btn btn-primary" onClick={openAddModal}>
            + Add Topic
          </button>
        </header>

        {status.message && <div style={{ color: 'var(--color-accent)', marginBottom: 16 }}>{status.message}</div>}
        {status.error && <div className="error-text" style={{ marginBottom: 16 }}>{status.error}</div>}

        {loading ? (
          <div>Loading topics…</div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '14px 20px' }}>ID</th>
                  <th style={{ padding: '14px 20px' }}>Name</th>
                  <th style={{ padding: '14px 20px' }}>Description</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {topics.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      No active topics found. Click "+ Add Topic" to create one.
                    </td>
                  </tr>
                ) : (
                  topics.map((t) => (
                    <tr key={t.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '14px 20px', fontWeight: 600 }}>#{t.id}</td>
                      <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--color-primary)' }}>{t.name}</td>
                      <td style={{ padding: '14px 20px', color: 'var(--color-text-muted)' }}>{t.description || '—'}</td>
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <button className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '12px', marginRight: 8 }} onClick={() => openEditModal(t)}>
                          Edit
                        </button>
                        <button className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '12px', color: 'var(--color-danger)', borderColor: 'rgba(255,92,92,0.3)' }} onClick={() => handleDelete(t.id, t.name)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal for Add / Edit Topic */}
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'grid', placeItems: 'center', zIndex: 100 }}>
            <div className="card" style={{ width: 440, maxWidth: '90%' }}>
              <h2 style={{ fontSize: 18, marginBottom: 16 }}>{editingTopic ? 'Edit Topic' : 'Add New Topic'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="topicName">Topic Name</label>
                  <input
                    id="topicName"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Quantitative Aptitude"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="topicDesc">Description</label>
                  <textarea
                    id="topicDesc"
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="form-input"
                    placeholder="Brief description of questions under this topic"
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
                  <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving…' : editingTopic ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TopicManagement;
