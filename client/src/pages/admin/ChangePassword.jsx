import { useState } from 'react';
import { authService } from '../../services/authService';
import { useToast } from '../../components/Toast';

export default function ChangePassword() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    if (form.newPassword.length < 6) {
      showToast('New password must be at least 6 characters.', 'error');
      return;
    }
    setSaving(true);
    try {
      await authService.changePassword(form.currentPassword, form.newPassword);
      showToast('Password changed successfully.');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to change password.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-bakery-900 dark:text-cream-50">
        Change Password
      </h1>
      <p className="mt-1 text-sm text-bakery-500 dark:text-cream-300/60">
        Update your administrator account password
      </p>

      <form onSubmit={handleSubmit} className="card mt-8 max-w-md space-y-5 p-6 sm:p-8">
        <div>
          <label className="label">Current Password</label>
          <input
            type="password"
            required
            className="input"
            value={form.currentPassword}
            onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))}
          />
        </div>
        <div>
          <label className="label">New Password</label>
          <input
            type="password"
            required
            className="input"
            value={form.newPassword}
            onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
          />
        </div>
        <div>
          <label className="label">Confirm New Password</label>
          <input
            type="password"
            required
            className="input"
            value={form.confirmPassword}
            onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
          />
        </div>
        <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-60">
          {saving ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
