import { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Topbar from '../../components/layout/Topbar';
import { ADMIN_NAV } from '../../components/layout/navConfig';
import adminService from '../../services/adminService';
import { IconPlus } from '../../components/icons/Icon';
import styles from './AdminDashboard.module.css';

const DIFFICULTY_BADGE = { Easy: 'badge-easy', Medium: 'badge-medium', Hard: 'badge-hard' };

const QuestionManagement = () => {
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ message: '', error: '' });

  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [saving, setSaving] = useState(false);

  const initialForm = {
    topic_id: '', question_text: '', option_a: '', option_b: '', option_c: '', option_d: '',
    correct_option: 'A', difficulty: 'Easy', explanation: '',
  };
  const [form, setForm] = useState(initialForm);

  const fetchTopics = async () => {
    try {
      const topicList = await adminService.getTopics();
      setTopics(topicList);
      if (topicList.length > 0 && !form.topic_id) {
        setForm((prev) => ({ ...prev, topic_id: topicList[0].id }));
      }
    } catch { /* ignore */ }
  };

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getQuestions({
        topic_id: selectedTopic, difficulty: selectedDifficulty, search: searchTerm, page, limit: 10,
      });
      setQuestions(data.questions);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      setStatus({ message: '', error: 'Failed to load questions' });
    } finally {
      setLoading(false);
    }
  }, [selectedTopic, selectedDifficulty, searchTerm, page]);

  useEffect(() => { fetchTopics(); }, []);
  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const openAddModal = () => {
    setEditingQuestion(null);
    setForm({ ...initialForm, topic_id: topics[0]?.id || '' });
    setIsModalOpen(true);
  };

  const openEditModal = (q) => {
    setEditingQuestion(q);
    setForm({
      topic_id: q.topic_id, question_text: q.question_text, option_a: q.option_a, option_b: q.option_b,
      option_c: q.option_c, option_d: q.option_d, correct_option: q.correct_option, difficulty: q.difficulty,
      explanation: q.explanation || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ message: '', error: '' });
    try {
      if (editingQuestion) {
        await adminService.updateQuestion(editingQuestion.id, form);
        setStatus({ message: 'Question updated successfully', error: '' });
      } else {
        await adminService.createQuestion(form);
        setStatus({ message: 'Question added successfully', error: '' });
      }
      setIsModalOpen(false);
      fetchQuestions();
    } catch (err) {
      setStatus({ message: '', error: err.response?.data?.error?.message || 'Failed to save question' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    setStatus({ message: '', error: '' });
    try {
      await adminService.deleteQuestion(id);
      setStatus({ message: 'Question deleted successfully', error: '' });
      fetchQuestions();
    } catch {
      setStatus({ message: '', error: 'Failed to delete question' });
    }
  };

  return (
    <DashboardLayout navItems={ADMIN_NAV} subtitle="EdTech SaaS · Admin">
      <Topbar
        title="Question Management"
        subtitle={`Manage question bank items (${total} total questions).`}
        showSearch={false}
        rightSlot={
          <button className="btn btn-primary btn-sm" onClick={openAddModal}>
            <IconPlus width={14} height={14} /> Add Question
          </button>
        }
      />

      {status.message && <div className="text-primary mb-4">{status.message}</div>}
      {status.error && <div className="error-text">{status.error}</div>}

      <div className={styles.filterBar}>
        <select value={selectedTopic} onChange={(e) => { setSelectedTopic(e.target.value); setPage(1); }} className="form-input" style={{ width: 180 }}>
          <option value="">All Topics</option>
          {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <select value={selectedDifficulty} onChange={(e) => { setSelectedDifficulty(e.target.value); setPage(1); }} className="form-input" style={{ width: 160 }}>
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <input type="text" placeholder="Search questions..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} className="form-input" style={{ flex: 1, minWidth: 200 }} />
      </div>

      {loading ? (
        <div className="text-muted">Loading questions…</div>
      ) : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: 60 }}>ID</th>
                <th>Question</th>
                <th style={{ width: 140 }}>Topic</th>
                <th style={{ width: 100 }}>Difficulty</th>
                <th style={{ width: 90 }}>Correct</th>
                <th style={{ width: 130, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--color-text-muted)' }}>No questions match your filter.</td></tr>
              ) : (
                questions.map((q) => (
                  <tr key={q.id}>
                    <td style={{ fontWeight: 600 }}>#{q.id}</td>
                    <td style={{ maxWidth: 360, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.question_text}</td>
                    <td className="text-muted">{q.topic_name || '—'}</td>
                    <td><span className={`badge ${DIFFICULTY_BADGE[q.difficulty] || 'badge-neutral'}`}>{q.difficulty}</span></td>
                    <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{q.correct_option}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-outline btn-sm" style={{ marginRight: 6 }} onClick={() => openEditModal(q)}>Edit</button>
                      <button className="btn btn-outline btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => handleDelete(q.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className={styles.pagination}>
            <span className="text-sm text-muted">Page {page} of {totalPages} ({total} questions)</span>
            <div className="flex gap-2">
              <button className="btn btn-outline btn-sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</button>
              <button className="btn btn-outline btn-sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard} style={{ width: 560 }}>
            <h2 style={{ fontSize: 18, marginBottom: 16 }}>{editingQuestion ? 'Edit Question' : 'Add New Question'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Topic</label>
                  <select className="form-input" value={form.topic_id} onChange={(e) => setForm({ ...form, topic_id: e.target.value })} required>
                    {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Difficulty</label>
                  <select className="form-input" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} required>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Question Text</label>
                <textarea rows={3} required className="form-input" value={form.question_text} onChange={(e) => setForm({ ...form, question_text: e.target.value })} placeholder="Enter the question text..." />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Option A</label>
                  <input type="text" required className="form-input" value={form.option_a} onChange={(e) => setForm({ ...form, option_a: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Option B</label>
                  <input type="text" required className="form-input" value={form.option_b} onChange={(e) => setForm({ ...form, option_b: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Option C</label>
                  <input type="text" required className="form-input" value={form.option_c} onChange={(e) => setForm({ ...form, option_c: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Option D</label>
                  <input type="text" required className="form-input" value={form.option_d} onChange={(e) => setForm({ ...form, option_d: e.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Correct Option</label>
                <select className="form-input" value={form.correct_option} onChange={(e) => setForm({ ...form, correct_option: e.target.value })} required>
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Explanation (Optional)</label>
                <textarea rows={2} className="form-input" value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} placeholder="Solution explanation for students after answering..." />
              </div>

              <div className="flex gap-3 mt-4" style={{ justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : editingQuestion ? 'Update Question' : 'Add Question'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default QuestionManagement;
