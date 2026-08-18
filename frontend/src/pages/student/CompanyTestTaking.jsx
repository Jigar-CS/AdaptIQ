import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import companyTestService from '../../services/companyTestService';
import { IconClock, IconArrowRight, IconArrowLeft } from '../../components/icons/Icon';
import styles from './AdaptiveTest.module.css';

const OPTION_KEYS = ['A', 'B', 'C', 'D'];

/**
 * Timed, fixed-question company mock test session (test_type = 'company').
 * Unlike the adaptive flow, difficulty does not change and the timer
 * auto-submits the whole test when it hits zero (server also enforces this).
 */
const CompanyTestTaking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const testId = location.state?.testId;

  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [showExitModal, setShowExitModal] = useState(false);
  const submittingRef = useRef(false);

  useEffect(() => {
    if (!testId) {
      navigate('/company-tests');
      return;
    }
    const load = async () => {
      try {
        const data = await companyTestService.start(testId);
        setQuestions(data.questions || []);
        setSecondsLeft((data.time_limit_minutes || 60) * 60);
        setStatus('active');
      } catch (err) {
        setError(err.response?.data?.error?.message || 'Unable to load this test.');
        setStatus('error');
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId]);

  const handleSubmitAll = useCallback(async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setStatus('submitting');
    try {
      const result = await companyTestService.complete(testId);
      navigate('/company-tests/result', { state: { result } });
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to submit the test.');
      setStatus('error');
    }
  }, [testId, navigate]);

  useEffect(() => {
    if (status !== 'active' || secondsLeft === null) return;
    if (secondsLeft <= 0) {
      handleSubmitAll();
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, status, handleSubmitAll]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const handleSelect = async (key) => {
    const q = questions[index];
    setAnswers((prev) => ({ ...prev, [q.id]: key }));
    try {
      await companyTestService.submitAnswer(testId, { question_id: q.id, selected_option: key });
    } catch {
      // non-blocking — final submit still records answers server-side if resent
    }
  };

  const goNext = () => {
    if (index + 1 < questions.length) setIndex((i) => i + 1);
    else handleSubmitAll();
  };

  if (status === 'loading') {
    return (
      <div className={styles.page}>
        <div className={styles.frame}>
          <div className={styles.centerState}><p className="text-muted">Loading your mock test…</p></div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={styles.page}>
        <div className={styles.frame}>
          <div className={styles.centerState}>
            <p className="error-text">{error}</p>
            <button className="btn btn-outline mt-4" onClick={() => navigate('/company-tests')}>Back to Company Mock Hub</button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[index];
  if (!q) {
    return (
      <div className={styles.page}>
        <div className={styles.frame}>
          <div className={styles.centerState}><p className="text-muted">No questions configured for this test yet.</p></div>
        </div>
      </div>
    );
  }

  const selected = answers[q.id];
  const progress = Math.round(((index + 1) / questions.length) * 100);

  return (
    <div className={styles.page}>
      <div className={styles.frame} style={{ borderColor: 'var(--color-primary-glow)', boxShadow: 'var(--shadow-glow-primary)' }}>
        <div className={styles.topRow}>
          <div className={styles.topBarLeft}>
            <button
              type="button"
              className={styles.backBtn}
              onClick={() => setShowExitModal(true)}
              title="Exit test session"
            >
              <IconArrowLeft width={14} height={14} />
              <span>Exit Test</span>
            </button>
            <div className={styles.timer} style={{ color: secondsLeft < 60 ? 'var(--color-danger)' : 'var(--color-text-muted)' }}>
              <IconClock width={15} height={15} /> {formatTime(secondsLeft)}
            </div>
          </div>

          <div className={styles.progressWrap}>
            <div className={styles.progressLabel}>QUESTION {index + 1} OF {questions.length}</div>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
          </div>

          <span className="badge badge-primary">Company Test</span>
        </div>

        <div className={styles.questionCard}>
          <h2 className={styles.questionTitle}>{q.question_text}</h2>
        </div>

        <div className={styles.optionsGrid}>
          {OPTION_KEYS.map((key) => {
            const optionText = q[`option_${key.toLowerCase()}`];
            if (optionText === undefined) return null;
            return (
              <button
                key={key}
                type="button"
                className={`${styles.optionCard} ${key === selected ? styles.selected : ''}`}
                onClick={() => handleSelect(key)}
              >
                <span className={styles.optionLetter}>{key}</span>
                <div className={styles.optionText}>{optionText}</div>
              </button>
            );
          })}
        </div>

        <div className={styles.bottomBar}>
          <span className="text-sm text-muted">{Object.keys(answers).length} of {questions.length} answered</span>
          <button className="btn btn-primary" onClick={goNext} disabled={status === 'submitting'}>
            {index + 1 === questions.length ? (status === 'submitting' ? 'Submitting…' : 'Submit Test') : 'Next'} <IconArrowRight width={15} height={15} />
          </button>
        </div>
      </div>

      {showExitModal && (
        <div className={styles.modalOverlay} onClick={() => setShowExitModal(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Exit Company Mock Test?</h3>
            <p className={styles.modalText}>
              Are you sure you want to leave? Your submitted answers so far have been saved, but you will leave this timed session.
            </p>
            <div className={styles.modalActions}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setShowExitModal(false)}
              >
                Resume Test
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => navigate('/company-tests')}
              >
                Exit to Company Tests
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyTestTaking;
