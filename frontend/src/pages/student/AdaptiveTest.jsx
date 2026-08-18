import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAdaptiveTest from '../../hooks/useAdaptiveTest';
import { IconClock, IconFlag, IconArrowRight, IconArrowLeft } from '../../components/icons/Icon';
import styles from './AdaptiveTest.module.css';

const DIFFICULTY_STYLES = {
  Easy: { color: 'var(--color-success)', background: 'var(--color-success-soft)', borderColor: 'transparent' },
  Medium: { color: 'var(--color-warning)', background: 'var(--color-warning-soft)', borderColor: 'transparent' },
  Hard: { color: 'var(--color-danger)', background: 'var(--color-danger-soft)', borderColor: 'transparent' },
};

const OPTION_KEYS = ['A', 'B', 'C', 'D'];

/**
 * Shared adaptive test-taking screen.
 * Works for both topic_adaptive (topicId provided via router state)
 * and full_adaptive / "Miscellaneous" sessions (topicId omitted).
 */
const AdaptiveTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const topicId = location.state?.topicId;
  const topicName = location.state?.topicName;

  const test = useAdaptiveTest();
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [flagged, setFlagged] = useState({});
  const [showExitModal, setShowExitModal] = useState(false);

  const handleExitConfirm = () => {
    if (topicId) {
      navigate('/topic-practice');
    } else {
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    test.start(topicId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId]);

  useEffect(() => {
    setElapsed(0);
    const interval = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [test.questionIndex, test.batchNumber]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const handleSelect = (key) => {
    if (submitted) return;
    setSelected(key);
  };

  const handleSubmit = async () => {
    if (!selected) return;
    await test.answer(selected);
    setSubmitted(true);
  };

  const handleNext = async () => {
    setSelected(null);
    setSubmitted(false);
    await test.nextQuestion();
  };

  const toggleFlag = () => {
    const qId = test.currentQuestion?.id;
    if (!qId) return;
    setFlagged((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  if (test.status === 'loading' && !test.currentQuestion) {
    return (
      <div className={styles.page}>
        <div className={styles.frame}>
          <div className={styles.centerState}>
            <p className="text-muted" style={{ marginBottom: 16 }}>Preparing your adaptive session…</p>
            <button
              type="button"
              className={styles.backBtn}
              style={{ margin: '0 auto' }}
              onClick={() => (topicId ? navigate('/topic-practice') : navigate('/dashboard'))}
            >
              <IconArrowLeft width={14} height={14} /> Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (test.status === 'error') {
    const isProfileGate =
      test.errorCode === 'PROFILE_INCOMPLETE' ||
      (typeof test.error === 'string' && test.error.toLowerCase().includes('profile'));

    return (
      <div className={styles.page}>
        <div className={styles.frame}>
          <div className={styles.centerState}>
            <p className="error-text" style={{ fontSize: 16, marginBottom: 16 }}>
              {test.error || 'An error occurred.'}
            </p>
            <div className="flex gap-3" style={{ justifyContent: 'center' }}>
              {isProfileGate && (
                <button className="btn btn-primary" onClick={() => navigate('/profile')}>
                  Complete Profile
                </button>
              )}
              <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (test.status === 'completed') {
    const accuracy = test.answered ? Math.round((test.correctCount / test.answered) * 100) : 0;
    const profilePrompt = test.resultData?.profile_prompt_triggered;

    return (
      <div className={styles.page}>
        <div className={styles.frame}>
          <div className={styles.centerState}>
            <h1 style={{ fontSize: 24, marginBottom: 8 }}>Test Complete 🎉</h1>
            <p className="text-muted" style={{ marginBottom: 24 }}>
              {topicName ? `${topicName} — ` : 'Miscellaneous — '}
              You answered {test.correctCount} of {test.answered} questions correctly ({accuracy}% accuracy).
            </p>

            {profilePrompt && (
              <div
                style={{
                  background: 'var(--color-violet-soft)',
                  border: '1px solid var(--color-violet)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 20px',
                  marginBottom: 24,
                  textAlign: 'left',
                }}
              >
                <strong style={{ color: 'var(--color-violet)' }}>🌟 Milestone Reached!</strong>
                <p className="text-sm text-muted" style={{ margin: '6px 0 12px' }}>
                  You have completed 3 topic tests. Please update your profile with your resume and placement details to unlock further practice.
                </p>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/profile')}>
                  Update Profile Now
                </button>
              </div>
            )}

            <div className="flex gap-3" style={{ justifyContent: 'center' }}>
              <button className="btn btn-outline" onClick={() => navigate('/performance')}>
                View Analytics
              </button>
              <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const q = test.currentQuestion;
  if (!q) return null;

  const diffStyle = DIFFICULTY_STYLES[test.difficulty] || DIFFICULTY_STYLES.Medium;
  const questionNumber = test.answered + 1;
  const isFlagged = !!flagged[q.id];

  // If question_text looks like it contains a code snippet (heuristic: has "def ", "function", or indentation),
  // split into prose + code block for the reference-matching layout.
  const codeMatch = q.question_text?.match(/```([\s\S]*?)```/);
  const proseText = codeMatch ? q.question_text.replace(codeMatch[0], '').trim() : q.question_text;
  const codeText = codeMatch ? codeMatch[1].trim() : q.code_snippet || null;

  return (
    <div className={styles.page}>
      <div className={styles.frame}>
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
            <div className={styles.timer}>
              <IconClock width={15} height={15} /> {formatTime(elapsed)}
            </div>
          </div>

          <div className={styles.progressWrap}>
            <div className={styles.progressLabel}>
              {topicName ? `${topicName.toUpperCase()} • ` : ''}QUESTION {questionNumber} OF {test.totalQuestions}
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${test.progress}%` }} />
            </div>
          </div>

          <span className={styles.difficultyBadge} style={diffStyle}>{test.difficulty}</span>
        </div>

        <div className={styles.questionCard}>
          <h2 className={styles.questionTitle}>{proseText}</h2>
          {q.explanation_prompt && <p className={styles.questionDesc}>{q.explanation_prompt}</p>}
          {codeText && <pre className={styles.codeBlock}>{codeText}</pre>}
        </div>

        {submitted && test.feedback && (
          <div className={`${styles.feedbackBanner} ${test.feedback.isCorrect ? styles.correct : styles.incorrect}`}>
            <strong>{test.feedback.isCorrect ? 'Correct!' : 'Not quite.'}</strong>
            {test.feedback.explanation ? ` ${test.feedback.explanation}` : ''}
          </div>
        )}

        <div className={styles.optionsGrid}>
          {OPTION_KEYS.map((key) => {
            const optionText = q[`option_${key.toLowerCase()}`];
            if (optionText === undefined) return null;

            let stateClass = '';
            if (submitted) {
              const correctOpt = test.feedback?.correctOption || q.correct_option;
              if (key === correctOpt) stateClass = styles.correct;
              else if (key === selected) stateClass = styles.incorrect;
            } else if (key === selected) {
              stateClass = styles.selected;
            }

            return (
              <button
                key={key}
                type="button"
                disabled={submitted}
                className={`${styles.optionCard} ${stateClass}`}
                onClick={() => handleSelect(key)}
              >
                <span className={styles.optionLetter}>{key}</span>
                <div>
                  <div className={styles.optionText}>{optionText}</div>
                  {q[`option_${key.toLowerCase()}_meta`] && (
                    <div className={styles.optionMeta}>{q[`option_${key.toLowerCase()}_meta`]}</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className={styles.bottomBar}>
          <button className="btn btn-outline" onClick={toggleFlag}>
            <IconFlag width={15} height={15} /> {isFlagged ? 'Flagged' : 'Flag for Review'}
          </button>

          {submitted ? (
            <button className="btn btn-violet" onClick={handleNext} disabled={test.status === 'loading'}>
              {test.status === 'loading' ? 'Loading…' : 'Next Question'} <IconArrowRight width={15} height={15} />
            </button>
          ) : (
            <button className="btn btn-violet" onClick={handleSubmit} disabled={!selected}>
              Submit Answer <IconArrowRight width={15} height={15} />
            </button>
          )}
        </div>
      </div>

      {showExitModal && (
        <div className={styles.modalOverlay} onClick={() => setShowExitModal(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Exit Test Session?</h3>
            <p className={styles.modalText}>
              Are you sure you want to leave? Questions answered so far have been saved, but this active test session will be closed.
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
                onClick={handleExitConfirm}
              >
                Exit to {topicId ? 'Topics' : 'Dashboard'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdaptiveTest;
