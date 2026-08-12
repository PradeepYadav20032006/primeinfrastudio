import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { Spinner } from '../../components/Loader';

const AdminProfile = () => {
  const { user, setUser } = useAuth();
  const profileForm = useForm({ defaultValues: { name: user?.name, email: user?.email } });
  const passwordForm = useForm();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const onProfileSubmit = async (data) => {
    setSavingProfile(true);
    try {
      const res = await api.put('/auth/profile', data);
      setUser(res.data.user);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setSavingPassword(true);
    try {
      await api.put('/auth/password', data);
      toast.success('Password updated successfully');
      passwordForm.reset();
    } catch (err) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-display font-bold text-charcoal-900 dark:text-white mb-1">Profile Settings</h1>
      <p className="text-charcoal-500 dark:text-charcoal-400 mb-8 text-sm">Manage your admin account details</p>

      <div className="bg-white dark:bg-charcoal-900 rounded-2xl border border-charcoal-100 dark:border-charcoal-800 p-6 mb-6">
        <h2 className="font-semibold text-charcoal-900 dark:text-white mb-4">Account Details</h2>
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
          <div>
            <label className="text-sm text-charcoal-600 dark:text-charcoal-300 mb-1 block">Full Name</label>
            <input {...profileForm.register('name', { required: true })} className="input-field" />
          </div>
          <div>
            <label className="text-sm text-charcoal-600 dark:text-charcoal-300 mb-1 block">Email Address</label>
            <input {...profileForm.register('email', { required: true })} className="input-field" />
          </div>
          <div>
            <label className="text-sm text-charcoal-600 dark:text-charcoal-300 mb-1 block">Role</label>
            <input value={user?.role} disabled className="input-field opacity-60 cursor-not-allowed capitalize" />
          </div>
          <button type="submit" disabled={savingProfile} className="btn-primary disabled:opacity-60">
            {savingProfile ? <Spinner size={18} /> : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-charcoal-900 rounded-2xl border border-charcoal-100 dark:border-charcoal-800 p-6">
        <h2 className="font-semibold text-charcoal-900 dark:text-white mb-4">Change Password</h2>
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
          <div>
            <label className="text-sm text-charcoal-600 dark:text-charcoal-300 mb-1 block">Current Password</label>
            <input type="password" {...passwordForm.register('currentPassword', { required: true })} className="input-field" />
          </div>
          <div>
            <label className="text-sm text-charcoal-600 dark:text-charcoal-300 mb-1 block">New Password</label>
            <input type="password" {...passwordForm.register('newPassword', { required: true, minLength: 6 })} className="input-field" />
          </div>
          <button type="submit" disabled={savingPassword} className="btn-primary disabled:opacity-60">
            {savingPassword ? <Spinner size={18} /> : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
