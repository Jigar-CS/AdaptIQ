import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import profileService from '../../services/profileService';
import styles from './Dashboard.module.css';

const PROFILE_FIELDS = [
  { name: 'name', label: 'Full Name', type: 'text', required: true },
  { name: 'email', label: 'Email Address', type: 'email', required: true },
  { name: 'phone', label: 'Phone', type: 'text', required: true },
  { name: 'college', label: 'College / University', type: 'text', required: true },
  { name: 'branch', label: 'Branch / Discipline', type: 'text', required: true },
  { name: 'graduation_year', label: 'Graduation Year', type: 'number', required: true, min: 1900, max: new Date().getFullYear() + 10 },
  { name: 'cgpa', label: 'CGPA', type: 'number', required: true, step: 0.01, min: 0, max: 10 },
  { name: 'linkedin_url', label: 'LinkedIn URL', type: 'url', required: false },
];

const Profile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    branch: '',
    graduation_year: '',
    cgpa: '',
    linkedin_url: '',
  });
  const [profile, setProfile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [resumeName, setResumeName] = useState('No resume uploaded');
  const [status, setStatus] = useState({ loading: false, message: '', error: '' });
  const navigate = useNavigate();

  const completionCount = useMemo(() => {
    const fields = ['phone', 'college', 'branch', 'graduation_year', 'cgpa', 'profile_photo_path', 'resume_path'];
    const filled = fields.filter((key) => form[key] || profile?.[key]);
    return Math.round((filled.length / fields.length) * 100);
  }, [form, profile]);

  useEffect(() => {
    const loadProfile = async () => {
      setStatus({ loading: true, message: '', error: '' });
      try {
        const userData = await profileService.getProfile();
        setProfile(userData);
        setForm((current) => ({
          ...current,
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          college: userData.college || '',
          branch: userData.branch || '',
          graduation_year: userData.graduation_year || '',
          cgpa: userData.cgpa || '',
          linkedin_url: userData.linkedin_url || '',
          profile_photo_path: userData.profile_photo_path || '',
          resume_path: userData.resume_path || '',
        }));
        setPhotoPreview(userData.profile_photo_path ? `/uploads/${userData.profile_photo_path}` : null);
        setResumeName(userData.resume_path ? userData.resume_path : 'No resume uploaded');
      } catch (err) {
        setStatus({ loading: false, message: '', error: 'Failed to load profile.' });
      } finally {
        setStatus((prev) => ({ ...prev, loading: false }));
      }
    };
    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, message: '', error: '' });

    try {
      const updated = await profileService.updateProfile(form);
      setProfile(updated);
      setStatus({ loading: false, message: 'Profile saved successfully.', error: '' });
      localStorage.setItem('adaptiq_user', JSON.stringify(updated));
      if (setUser) {
        setUser(updated);
      }
    } catch (err) {
      setStatus({ loading: false, message: '', error: err.response?.data?.error?.message || 'Unable to save profile.' });
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setStatus({ loading: true, message: '', error: '' });
    try {
      const { data } = await profileService.uploadPhoto(file);
      setProfile(data.user);
      setPhotoPreview(`/uploads/${data.photoPath}`);
      setForm((prev) => ({ ...prev, profile_photo_path: data.photoPath }));
      setStatus({ loading: false, message: 'Photo uploaded successfully.', error: '' });
    } catch (err) {
      setStatus({ loading: false, message: '', error: err.response?.data?.error?.message || 'Photo upload failed.' });
    }
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setStatus({ loading: true, message: '', error: '' });
    try {
      const { data } = await profileService.uploadResume(file);
      setProfile(data.user);
      setResumeName(file.name);
      setForm((prev) => ({ ...prev, resume_path: data.resumePath }));
      setStatus({ loading: false, message: 'Resume uploaded successfully.', error: '' });
    } catch (err) {
      setStatus({ loading: false, message: '', error: err.response?.data?.error?.message || 'Resume upload failed.' });
    }
  };

  const profileComplete = profile?.is_profile_complete;

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}><span>⚡</span><span>AdaptIQ</span></div>
        <nav className={styles.nav}>
          {[
            { to: '/dashboard', label: '🏠 Dashboard' },
            { to: '/practice', label: '📝 Practice' },
            { to: '/adaptive', label: '⚡ Adaptive Test' },
            { to: '/performance', label: '📊 Performance' },
            { to: '/profile', label: '👤 Profile' },
          ].map((link) => (
            <button key={link.to} type="button" className={styles.navLink} onClick={() => navigate(link.to)}>
              {link.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.greeting}>Your Profile</h1>
            <p className="text-muted text-sm">Keep your details up to date for test access and recruiter readiness.</p>
          </div>
        </header>

        <section className={styles.section}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <h2 className={styles.sectionTitle}>Profile Completion</h2>
              <div style={{ marginBottom: 12 }}>
                <div style={{ height: 12, width: '100%', background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${completionCount}%`, height: '100%', background: 'linear-gradient(90deg,#6c63ff,#00d4aa)' }} />
                </div>
                <div className="text-sm" style={{ marginTop: 8 }}>{completionCount}% complete</div>
              </div>
              <div className="text-sm">Required for adaptive test access after the 3rd topic test.</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="badge" style={{ background: profileComplete ? 'rgba(0,212,170,0.15)' : 'rgba(255,92,92,0.12)', color: profileComplete ? 'var(--color-success)' : 'var(--color-danger)' }}>
                {profileComplete ? 'Complete' : 'Incomplete'}
              </div>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="card">
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24 }}>
            <div>
              {PROFILE_FIELDS.map((field) => (
                <div key={field.name} className="form-group">
                  <label className="form-label" htmlFor={field.name}>{field.label}</label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    required={field.required}
                    value={form[field.name] ?? ''}
                    onChange={handleChange}
                    className="form-input"
                    min={field.min}
                    max={field.max}
                    step={field.step}
                  />
                </div>
              ))}
            </div>

            <div>
              <div className="form-group">
                <label className="form-label">Profile Photo</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 104, height: 104, borderRadius: 16, overflow: 'hidden', background: 'rgba(255,255,255,0.04)' }}>
                    {photoPreview ? (
                      <img src={photoPreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: 'var(--color-text-muted)' }}>No photo</div>
                    )}
                  </div>
                  <label className="btn btn-outline" style={{ padding: '10px 16px' }}>
                    Upload photo
                    <input type="file" accept="image/*" hidden onChange={handlePhotoUpload} />
                  </label>
                </div>
                <div className="text-sm text-muted">Max 5MB. JPG, PNG, WEBP.</div>
              </div>

              <div className="form-group">
                <label className="form-label">Resume</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span>{resumeName}</span>
                  <label className="btn btn-outline" style={{ padding: '10px 16px' }}>
                    Upload resume
                    <input type="file" accept="application/pdf" hidden onChange={handleResumeUpload} />
                  </label>
                </div>
                {profile?.resume_path ? (
                  <a href={`/uploads/${profile.resume_path}`} target="_blank" rel="noreferrer" className="text-sm" style={{ color: 'var(--color-primary)', marginTop: 8, display: 'inline-block' }}>
                    Download current resume
                  </a>
                ) : null}
                <div className="text-sm text-muted">Max 10MB. PDF only.</div>
              </div>
            </div>
          </div>

          {status.error && <div className="error-text">{status.error}</div>}
          {status.message && <div style={{ color: 'var(--color-accent)', marginBottom: 12 }}>{status.message}</div>}

          <button type="submit" className="btn btn-primary" disabled={status.loading}>
            {status.loading ? 'Saving…' : 'Save Profile'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Profile;
