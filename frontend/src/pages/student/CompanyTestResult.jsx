import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Topbar from '../../components/layout/Topbar';
import { STUDENT_NAV } from '../../components/layout/navConfig';
import { IconCheck, IconArrowRight } from '../../components/icons/Icon';

const CompanyTestResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <DashboardLayout navItems={STUDENT_NAV} subtitle="EdTech SaaS">
        <Topbar title="Test Result" showSearch={false} />
        <div className="card text-center" style={{ padding: 40 }}>
          <p className="text-muted">No recent result found.</p>
          <button className="btn btn-primary mt-4" onClick={() => navigate('/company-tests')}>Back to Company Mock Hub</button>
        </div>
      </DashboardLayout>
    );
  }

  const { score = 0, total_questions = 0, correct_count = 0, section_breakdown = [] } = result;

  return (
    <DashboardLayout navItems={STUDENT_NAV} subtitle="EdTech SaaS">
      <Topbar title="Mock Test Result" subtitle="Standard company-level assessment — completed." showSearch={false} />

      <div className="card" style={{ textAlign: 'center', padding: '40px 32px', marginBottom: 24 }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%', margin: '0 auto 16px',
          background: 'var(--color-primary-soft)', color: 'var(--color-primary)',
          display: 'grid', placeItems: 'center',
        }}>
          <IconCheck width={30} height={30} />
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>{Math.round(score)}%</h2>
        <p className="text-muted">
          {correct_count} of {total_questions} questions correct
        </p>
      </div>

      {section_breakdown.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Section-wise Breakdown</h3>
          {section_breakdown.map((s) => (
            <div key={s.section} className="form-group">
              <div className="flex justify-between text-sm">
                <span className="text-muted">{s.section}</span>
                <span>{Math.round(s.accuracy)}%</span>
              </div>
              <div className="progress-track"><div className="progress-fill" style={{ width: `${s.accuracy}%` }} /></div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <button className="btn btn-outline" onClick={() => navigate('/performance')}>View Full Analytics</button>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard <IconArrowRight width={15} height={15} />
        </button>
      </div>
    </DashboardLayout>
  );
};

export default CompanyTestResult;
