import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Topbar from '../../components/layout/Topbar';
import { ADMIN_NAV } from '../../components/layout/navConfig';
import adminService from '../../services/adminService';
import { IconPlus } from '../../components/icons/Icon';
import styles from './AdminDashboard.module.css';

const TopicManagement = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ message: '', error: '' });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);

  const loadTopics = async () => {
    setLoading(true);
    try {
      const data = await adminService.getTopics();
      setTopics(data);
    } catch {
      setStatus({ message: '', error: 'Failed to load topics' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTopics(); }, []);

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
      setStatus({ message: '', error: err.response?.data?.error?.message || 'Failed to save topic' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete topic "${name}"?`)) return;
    setStatus({ message: '', error: '' });
    try {
      await adminService.deleteTopic(id);
      setStatus({ message: 'Topic deleted successfully', error: '' });
      await loadTopics();
    } catch {
      setStatus({ message: '', error: 'Failed to delete topic' });
    }
  };

  return (
    <DashboardLayout navItems={ADMIN_NAV} subtitle="EdTech SaaS · Admin">
      <Topbar
        title="Topic Management"
        subtitle="Manage aptitude topics available for tests and questions."
        showSearch={false}
        rightSlot={
          <button className="btn btn-primary btn-sm" onClick={openAddModal}>
            <IconPlus width={14} height={14} /> Add Topic
          </button>
        }
      />

      {status.message && <div className="text-primary mb-4">{status.message}</div>}
      {status.error && <div className="error-text">{status.error}</div>}

      {loading ? (
        <div className="text-muted">Loading topics…</div>
      ) : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {topics.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: 32, color: 'var(--color-text-muted)' }}>No active topics found. Click "Add Topic" to create one.</td></tr>
              ) : (
                topics.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 600 }}>#{t.id}</td>
                    <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{t.name}</td>
                    <td className="text-muted">{t.description || '—'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-outline btn-sm" style={{ marginRight: 8 }} onClick={() => openEditModal(t)}>Edit</button>
                      <button className="btn btn-outline btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => handleDelete(t.id, t.name)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <h2 style={{ fontSize: 18, marginBottom: 16 }}>{editingTopic ? 'Edit Topic' : 'Add New Topic'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="topicName">Topic Name</label>
                <input id="topicName" type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="form-input" placeholder="e.g. Quantitative Aptitude" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="topicDesc">Description</label>
                <textarea id="topicDesc" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="form-input" placeholder="Brief description of questions under this topic" />
              </div>
              <div className="flex gap-3 mt-4" style={{ justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : editingTopic ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TopicManagement;
