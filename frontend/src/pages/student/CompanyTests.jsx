import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Topbar from '../../components/layout/Topbar';
import { STUDENT_NAV } from '../../components/layout/navConfig';
import companyTestService from '../../services/companyTestService';
import placementScoreService from '../../services/placementScoreService';
import { IconTrophy, IconLock, IconUnlock, IconClock, IconAssignments, IconArrowRight, IconAlert } from '../../components/icons/Icon';
import styles from './CompanyTests.module.css';

/**
 * This portal offers a single, company-level standard mock test —
 * not separate tests per company (no TCS/Infosys/Amazon-specific suites).
 * Unlock rule: >= 5 completed Miscellaneous (full_adaptive) tests AND placement score >= 80.
 */
const CompanyTests = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [testInfo, setTestInfo] = useState(null);
  const [scoreInfo, setScoreInfo] = useState(null);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await companyTestService.getStandardTest();
        setTestInfo(data);
      } catch {
        // fall back to placement score endpoint if company-tests isn't populated yet
      }
      try {
        const score = await placementScoreService.getLatest();
        setScoreInfo(score);
      } catch {
        setScoreInfo(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const miscCompleted = testInfo?.misc_tests_completed ?? scoreInfo?.misc_tests_completed ?? 0;
  const placementScore = testInfo?.placement_score ?? scoreInfo?.score ?? 0;
  const testsRequired = 5;
  const scoreRequired = 80;

  const misComplete = miscCompleted >= testsRequired;
  const scoreComplete = placementScore >= scoreRequired;
  const unlocked = testInfo?.locked === false || (misComplete && scoreComplete);

  const testsPct = Math.min(100, Math.round((miscCompleted / testsRequired) * 100));
  const scorePct = Math.min(100, Math.round((placementScore / scoreRequired) * 100));

  const handleStart = async () => {
    const testId = testInfo?.id || testInfo?.company_test_id || 'standard';
    setStarting(true);
    setError('');
    try {
      await companyTestService.start(testId);
      navigate('/company-tests/take', { state: { testId } });
    } catch (err) {
      setError(err.response?.data?.error?.message || 'This test is still locked.');
    } finally {
      setStarting(false);
    }
  };

  return (
    <DashboardLayout navItems={STUDENT_NAV} subtitle="EdTech SaaS">
      <Topbar
        title="Company Mock Hub"
        subtitle="Prepare for top-tier placements. Complete prerequisites to unlock the standard company-level mock test."
        searchPlaceholder="Search…"
      />

      {loading ? (
        <div className="text-muted">Loading eligibility…</div>
      ) : (
        <>
          {/* Eligibility Status */}
          <div className={styles.eligibilityCard}>
            <div className={styles.eligibilityLeft}>
              <div className={styles.eligibilityIcon}><IconTrophy width={22} height={22} /></div>
              <div>
                <div className={styles.eligibilityTitle}>Eligibility Status</div>
                <div className={styles.eligibilitySub}>Unlock requirements for the standard mock test.</div>
              </div>
            </div>

            <div className={styles.eligibilityStats}>
              <div className={styles.statBlock}>
                <div className={styles.statLabelRow}><span>Tests Complete</span><span>{miscCompleted}/{testsRequired}</span></div>
                <div className="progress-track"><div className="progress-fill" style={{ width: `${testsPct}%` }} /></div>
              </div>
              <div className={styles.statBlock}>
                <div className={styles.statLabelRow}><span>Aptitude Score</span><span>{Math.round(placementScore)}/100</span></div>
                <div className="progress-track"><div className={`progress-fill ${scoreComplete ? '' : 'warning'}`} style={{ width: `${scorePct}%` }} /></div>
              </div>
            </div>
          </div>

          {/* Standard Company Test Card */}
          <div className={`${styles.mainCard} ${unlocked ? styles.unlocked : ''}`}>
            <div className={styles.mainIcon}>
              {unlocked ? <IconUnlock width={28} height={28} /> : <IconLock width={28} height={28} />}
            </div>

            <div className={styles.mainBody}>
              <div className={styles.mainTop}>
                <span className={styles.mainTitle}>Standard Company Mock Test</span>
                <span className={`badge ${unlocked ? 'badge-primary' : 'badge-neutral'}`}>
                  {unlocked ? 'Unlocked' : 'Locked'}
                </span>
              </div>
              <p className={styles.mainDesc}>
                A single, company-level standard placement assessment — fixed question set spanning aptitude, logical
                reasoning, and technical fundamentals, timed and auto-submitted like a real recruitment test.
              </p>

              <div className={styles.metaRow}>
                <div className={styles.metaItem}><IconClock width={15} height={15} /> {testInfo?.time_limit_minutes || 60} min time limit</div>
                <div className={styles.metaItem}><IconAssignments width={15} height={15} /> {testInfo?.question_count || 30} questions</div>
              </div>

              {!unlocked && (
                <div className={styles.lockRequirement}>
                  <IconAlert width={14} height={14} />
                  {!misComplete
                    ? `Complete at least ${testsRequired} Miscellaneous tests to unlock (${miscCompleted}/${testsRequired} done).`
                    : `Your score is ${Math.round(placementScore)}/100. Reach ${scoreRequired} to unlock.`}
                </div>
              )}
              {error && <div className="error-text">{error}</div>}

              <div>
                <button className="btn btn-primary" disabled={!unlocked || starting} onClick={handleStart}>
                  {starting ? 'Starting…' : 'Start Mock Test'} <IconArrowRight width={15} height={15} />
                </button>
                {!unlocked && (
                  <button className="btn btn-outline" style={{ marginLeft: 12 }} onClick={() => navigate('/adaptive')}>
                    Take a Miscellaneous Test
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default CompanyTests;
