import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Topbar from '../../components/layout/Topbar';
import { STUDENT_NAV } from '../../components/layout/navConfig';
import { useAuth } from '../../context/AuthContext';
import profileService from '../../services/profileService';
import styles from './Profile.module.css';

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
  const { setUser } = useAuth();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', college: '', branch: '', graduation_year: '', cgpa: '', linkedin_url: '',
  });
  const [profile, setProfile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [resumeName, setResumeName] = useState('No resume uploaded');
  const [status, setStatus] = useState({ loading: false, message: '', error: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordStatus, setPasswordStatus] = useState({ loading: false, message: '', error: '' });

  const completionCount = useMemo(() => {
    const fields = ['phone', 'college', 'branch', 'graduation_year', 'cgpa', 'profile_photo_path', 'resume_path'];
    const filled = fields.filter((key) => {
      const val = form[key] ?? profile?.[key];
      return val !== null && val !== undefined && String(val).trim() !== '';
    });
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
      } catch {
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

  const handlePasswordFormChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, message: '', error: '' });
    try {
      const updated = await profileService.updateProfile(form);
      setProfile(updated);
      setStatus({ loading: false, message: 'Profile saved successfully.', error: '' });
      localStorage.setItem('adaptiq_user', JSON.stringify(updated));
      if (setUser) setUser(updated);
    } catch (err) {
      setStatus({ loading: false, message: '', error: err.response?.data?.error?.message || 'Unable to save profile.' });
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordStatus({ loading: true, message: '', error: '' });
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ loading: false, message: '', error: 'New passwords do not match.' });
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordStatus({ loading: false, message: '', error: 'Password must be at least 8 characters long.' });
      return;
    }
    try {
      await profileService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordStatus({ loading: false, message: 'Password changed successfully.', error: '' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordStatus({ loading: false, message: '', error: err.response?.data?.error?.message || 'Failed to update password.' });
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setStatus({ loading: true, message: '', error: '' });
    try {
      const result = await profileService.uploadPhoto(file);
      setProfile(result.user);
      setPhotoPreview(`/uploads/${result.photoPath}`);
      setForm((prev) => ({ ...prev, profile_photo_path: result.photoPath }));
      localStorage.setItem('adaptiq_user', JSON.stringify(result.user));
      if (setUser) setUser(result.user);
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
      const result = await profileService.uploadResume(file);
      setProfile(result.user);
      setResumeName(file.name);
      setForm((prev) => ({ ...prev, resume_path: result.resumePath }));
      localStorage.setItem('adaptiq_user', JSON.stringify(result.user));
      if (setUser) setUser(result.user);
      setStatus({ loading: false, message: 'Resume uploaded successfully.', error: '' });
    } catch (err) {
      setStatus({ loading: false, message: '', error: err.response?.data?.error?.message || 'Resume upload failed.' });
    }
  };

  const profileComplete = profile?.is_profile_complete;

  return (
    <DashboardLayout navItems={STUDENT_NAV} subtitle="EdTech SaaS">
      <Topbar title="Your Profile" subtitle="Keep your details up to date for test access and recruiter readiness." showSearch={false} />

      <div className={styles.completionCard}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Profile Completion</h2>
          <div className="progress-track" style={{ height: 10, marginBottom: 8 }}>
            <div className="progress-fill" style={{ width: `${completionCount}%` }} />
          </div>
          <div className="text-sm text-muted">{completionCount}% complete — required after your 3rd topic test.</div>
        </div>
        <span className={`badge ${profileComplete ? 'badge-primary' : 'badge-neutral'}`} style={!profileComplete ? { color: 'var(--color-danger)', background: 'var(--color-danger-soft)' } : {}}>
          {profileComplete ? 'Complete' : 'Incomplete'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ marginBottom: 24 }}>
        <div className={styles.formGrid}>
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
              <div className="flex items-center gap-4">
                <div className={styles.avatarPreview}>
                  {photoPreview ? (
                    <img src={photoPreview} alt="Profile" />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: 'var(--color-text-faint)' }}>No photo</div>
                  )}
                </div>
                <label className="btn btn-outline btn-sm">
                  Upload photo
                  <input type="file" accept="image/*" hidden onChange={handlePhotoUpload} />
                </label>
              </div>
              <div className="text-xs text-faint mt-2">Max 5MB. JPG, PNG, WEBP.</div>
            </div>

            <div className="form-group">
              <label className="form-label">Resume</label>
              <div className="flex items-center gap-4">
                <span className="text-sm">{resumeName}</span>
                <label className="btn btn-outline btn-sm">
                  Upload resume
                  <input type="file" accept="application/pdf" hidden onChange={handleResumeUpload} />
                </label>
              </div>
              {profile?.resume_path && (
                <a href={`/uploads/${profile.resume_path}`} target="_blank" rel="noreferrer" className="text-sm mt-2" style={{ display: 'inline-block' }}>
                  Download current resume
                </a>
              )}
              <div className="text-xs text-faint mt-2">Max 10MB. PDF only.</div>
            </div>
          </div>
        </div>

        {status.error && <div className="error-text">{status.error}</div>}
        {status.message && <div className="text-primary mb-4">{status.message}</div>}

        <button type="submit" className="btn btn-primary" disabled={status.loading}>
          {status.loading ? 'Saving…' : 'Save Profile'}
        </button>
      </form>

      <section className="card">
        <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Change Password</h2>
        <form onSubmit={handlePasswordSubmit} style={{ maxWidth: 480 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="currentPassword">Current Password</label>
            <input id="currentPassword" name="currentPassword" type="password" required value={passwordForm.currentPassword} onChange={handlePasswordFormChange} className="form-input" placeholder="••••••••" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="newPassword">New Password</label>
            <input id="newPassword" name="newPassword" type="password" required minLength={8} value={passwordForm.newPassword} onChange={handlePasswordFormChange} className="form-input" placeholder="At least 8 characters" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
            <input id="confirmPassword" name="confirmPassword" type="password" required value={passwordForm.confirmPassword} onChange={handlePasswordFormChange} className="form-input" placeholder="Re-enter new password" />
          </div>

          {passwordStatus.error && <div className="error-text">{passwordStatus.error}</div>}
          {passwordStatus.message && <div className="text-primary mb-4">{passwordStatus.message}</div>}

          <button type="submit" className="btn btn-outline" disabled={passwordStatus.loading}>
            {passwordStatus.loading ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </section>
    </DashboardLayout>
  );
};

export default Profile;
