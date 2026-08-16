import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Topbar from '../../components/layout/Topbar';
import { ADMIN_NAV } from '../../components/layout/navConfig';
import adminService from '../../services/adminService';
import styles from './AdminDashboard.module.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ message: '', error: '' });
  const [search, setSearch] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers({ search });
      setUsers(data.users || []);
    } catch {
      setStatus({ message: '', error: 'Failed to load users. This endpoint may not be implemented yet.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadUsers();
  };

  const toggleActive = async (user) => {
    setStatus({ message: '', error: '' });
    try {
      await adminService.updateUser(user.id, { is_active: !user.is_active });
      setStatus({ message: `${user.name || user.email} ${user.is_active ? 'deactivated' : 'activated'}.`, error: '' });
      loadUsers();
    } catch {
      setStatus({ message: '', error: 'Failed to update user status.' });
    }
  };

  return (
    <DashboardLayout navItems={ADMIN_NAV} subtitle="EdTech SaaS · Admin">
      <Topbar title="User Management" subtitle="Manage registered students and administrators." showSearch={false} />

      <form onSubmit={handleSearchSubmit} className={styles.filterBar}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input"
          style={{ flex: 1, minWidth: 240 }}
        />
        <button type="submit" className="btn btn-outline btn-sm">Search</button>
      </form>

      {status.message && <div className="text-primary mb-4">{status.message}</div>}
      {status.error && <div className="error-text">{status.error}</div>}

      {loading ? (
        <div className="text-muted">Loading users…</div>
      ) : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--color-text-muted)' }}>No users found.</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600 }}>#{u.id}</td>
                    <td>{u.name}</td>
                    <td className="text-muted">{u.email}</td>
                    <td><span className="badge badge-neutral">{u.role}</span></td>
                    <td>
                      <span className={`badge ${u.is_active ? 'badge-primary' : 'badge-neutral'}`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ color: u.is_active ? 'var(--color-danger)' : 'var(--color-primary)' }}
                        onClick={() => toggleActive(u)}
                        disabled={u.role === 'admin'}
                      >
                        {u.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default UserManagement;
