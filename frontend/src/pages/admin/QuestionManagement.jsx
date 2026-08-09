import { useEffect, useState, useCallback } from 'react';
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

const DIFFICULTY_COLORS = {
  Easy: 'var(--color-success)',
  Medium: 'var(--color-warning)',
  Hard: 'var(--color-danger)',
};

const QuestionManagement = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ message: '', error: '' });

  // Filters
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [saving, setSaving] = useState(false);

  const initialForm = {
    topic_id: '',
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_option: 'A',
    difficulty: 'Easy',
    explanation: '',
  };
  const [form, setForm] = useState(initialForm);

  const fetchTopics = async () => {
    try {
      const topicList = await adminService.getTopics();
      setTopics(topicList);
      if (topicList.length > 0 && !form.topic_id) {
        setForm((prev) => ({ ...prev, topic_id: topicList[0].id }));
      }
    } catch {
      // ignore
    }
  };

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getQuestions({
        topic_id: selectedTopic,
        difficulty: selectedDifficulty,
        search: searchTerm,
        page,
        limit: 10,
      });
      setQuestions(data.questions);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      setStatus({ message: '', error: 'Failed to load questions' });
    } finally {
      setLoading(false);
    }
  }, [selectedTopic, selectedDifficulty, searchTerm, page]);

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const openAddModal = () => {
    setEditingQuestion(null);
    setForm({
      ...initialForm,
      topic_id: topics[0]?.id || '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (q) => {
    setEditingQuestion(q);
    setForm({
      topic_id: q.topic_id,
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_option: q.correct_option,
      difficulty: q.difficulty,
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
      setStatus({
        message: '',
        error: err.response?.data?.error?.message || 'Failed to save question',
      });
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
    } catch (err) {
      setStatus({ message: '', error: 'Failed to delete question' });
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
            <h1 className={styles.title}>Question Management</h1>
            <p className="text-muted text-sm">Manage question bank items ({total} total questions)</p>
          </div>
          <button className="btn btn-primary" onClick={openAddModal}>
            + Add Question
          </button>
        </header>

        {status.message && <div style={{ color: 'var(--color-accent)', marginBottom: 16 }}>{status.message}</div>}
        {status.error && <div className="error-text" style={{ marginBottom: 16 }}>{status.error}</div>}

        {/* Filter Toolbar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <select
            value={selectedTopic}
            onChange={(e) => { setSelectedTopic(e.target.value); setPage(1); }}
            className="form-input"
            style={{ width: 180 }}
          >
            <option value="">All Topics</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => { setSelectedDifficulty(e.target.value); setPage(1); }}
            className="form-input"
            style={{ width: 150 }}
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            className="form-input"
            style={{ flex: 1, minWidth: 200 }}
          />
        </div>

        {/* Questions Table */}
        {loading ? (
          <div>Loading questions…</div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '12px 16px', width: 60 }}>ID</th>
                  <th style={{ padding: '12px 16px' }}>Question</th>
                  <th style={{ padding: '12px 16px', width: 140 }}>Topic</th>
                  <th style={{ padding: '12px 16px', width: 100 }}>Difficulty</th>
                  <th style={{ padding: '12px 16px', width: 100 }}>Correct</th>
                  <th style={{ padding: '12px 16px', width: 120, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      No questions match your filter.
                    </td>
                  </tr>
                ) : (
                  questions.map((q) => (
                    <tr key={q.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600 }}>#{q.id}</td>
                      <td style={{ padding: '12px 16px', maxWidth: 360, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {q.question_text}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)' }}>{q.topic_name || '—'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span className="badge" style={{ color: DIFFICULTY_COLORS[q.difficulty] || 'var(--color-primary)', background: 'rgba(255,255,255,0.05)' }}>
                          {q.difficulty}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-accent)' }}>
                        Option {q.correct_option}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <button className="btn btn-outline" style={{ padding: '3px 8px', fontSize: '12px', marginRight: 6 }} onClick={() => openEditModal(q)}>
                          Edit
                        </button>
                        <button className="btn btn-outline" style={{ padding: '3px 8px', fontSize: '12px', color: 'var(--color-danger)', borderColor: 'rgba(255,92,92,0.3)' }} onClick={() => handleDelete(q.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderTop: '1px solid var(--color-border)' }}>
              <span className="text-sm text-muted">
                Page {page} of {totalPages} ({total} questions)
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  Previous
                </button>
                <button className="btn btn-outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add / Edit Question Modal */}
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'grid', placeItems: 'center', zIndex: 100, padding: 20 }}>
            <div className="card" style={{ width: 560, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
              <h2 style={{ fontSize: 18, marginBottom: 16 }}>{editingQuestion ? 'Edit Question' : 'Add New Question'}</h2>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Topic</label>
                    <select
                      className="form-input"
                      value={form.topic_id}
                      onChange={(e) => setForm({ ...form, topic_id: e.target.value })}
                      required
                    >
                      {topics.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Difficulty</label>
                    <select
                      className="form-input"
                      value={form.difficulty}
                      onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                      required
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Question Text</label>
                  <textarea
                    rows={3}
                    required
                    className="form-input"
                    value={form.question_text}
                    onChange={(e) => setForm({ ...form, question_text: e.target.value })}
                    placeholder="Enter the question text..."
                  />
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
                  <select
                    className="form-input"
                    value={form.correct_option}
                    onChange={(e) => setForm({ ...form, correct_option: e.target.value })}
                    required
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Explanation (Optional)</label>
                  <textarea
                    rows={2}
                    className="form-input"
                    value={form.explanation}
                    onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                    placeholder="Solution explanation for students after answering..."
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
                  <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving…' : editingQuestion ? 'Update Question' : 'Add Question'}
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

export default QuestionManagement;
