import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Topbar from '../../components/layout/Topbar';
import { STUDENT_NAV } from '../../components/layout/navConfig';
import { IconAssignments, IconArrowRight } from '../../components/icons/Icon';

/**
 * Entry screen for the cross-topic "Miscellaneous" adaptive test (test_type = full_adaptive).
 * This is the only test type that feeds the Placement Readiness Score.
 */
const MiscellaneousTest = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout navItems={STUDENT_NAV} subtitle="EdTech SaaS">
      <Topbar title="Miscellaneous Test" subtitle="Cross-topic adaptive assessment — counts toward your Placement Readiness Score." showSearch={false} />

      <div className="card" style={{ maxWidth: 620, textAlign: 'center', padding: '48px 40px', margin: '40px auto' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 18, background: 'var(--color-primary-soft)',
          color: 'var(--color-primary)', display: 'grid', placeItems: 'center', margin: '0 auto 20px',
        }}>
          <IconAssignments width={28} height={28} />
        </div>
        <h2 style={{ fontSize: 20, marginBottom: 10 }}>20-Question Adaptive Assessment</h2>
        <p className="text-muted text-sm" style={{ marginBottom: 28, lineHeight: 1.6 }}>
          Questions span every topic in the question bank. Difficulty adjusts every 5 questions based on your accuracy and
          speed. Complete at least 5 of these to unlock the Company Mock Test.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/adaptive')}>
          Start Miscellaneous Test <IconArrowRight width={15} height={15} />
        </button>
      </div>
    </DashboardLayout>
  );
};

export default MiscellaneousTest;
