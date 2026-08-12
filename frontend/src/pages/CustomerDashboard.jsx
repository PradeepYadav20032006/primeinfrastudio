import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FileText, Mail, User, LogOut, Calendar, MapPin } from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import customerApi from '../utils/customerApi';
import { Spinner } from '../components/Loader';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';

const STATUS_COLORS = {
  New: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Contacted: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'In Discussion': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Quoted: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Converted: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Closed: 'bg-charcoal-200 text-charcoal-600 dark:bg-charcoal-700 dark:text-charcoal-300',
  Unread: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Read: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Replied: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

const TABS = [
  { id: 'quotes', label: 'My Quote Requests', icon: FileText },
  { id: 'messages', label: 'My Messages', icon: Mail },
  { id: 'profile', label: 'Profile Settings', icon: User },
];

const CustomerDashboard = () => {
  const { customer, setCustomer, logout } = useCustomerAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('quotes');
  const [quotes, setQuotes] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const profileForm = useForm({ defaultValues: { name: customer?.name, phone: customer?.phone } });
  const passwordForm = useForm();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([customerApi.get('/quotes/my'), customerApi.get('/contact/my')])
      .then(([qRes, mRes]) => {
        setQuotes(qRes.data.data);
        setMessages(mRes.data.data);
      })
      .catch((err) => toast.error(err.message || 'Failed to load your data'))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const onProfileSubmit = async (data) => {
    setSavingProfile(true);
    try {
      const res = await customerApi.put('/customer-auth/profile', data);
      setCustomer(res.data.customer);
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
      await customerApi.put('/customer-auth/password', data);
      toast.success('Password updated successfully');
      passwordForm.reset();
    } catch (err) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <>
      <SEO title="My Account" description="View your quote requests, messages, and manage your PrimeInfraStudio account." />
      <PageHeader subtitle={`Welcome, ${customer?.name || ''}`} title="My Account" bgImage="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600" />

      <section className="section-padding bg-white dark:bg-charcoal-950">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="md:w-64 shrink-0">
              <div className="bg-charcoal-50 dark:bg-charcoal-900 rounded-2xl p-4 border border-charcoal-100 dark:border-charcoal-800 space-y-1">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                      tab === t.id ? 'bg-amber-600 text-white' : 'text-charcoal-600 dark:text-charcoal-300 hover:bg-charcoal-100 dark:hover:bg-charcoal-800'
                    }`}
                  >
                    <t.icon size={18} /> {t.label}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </aside>

            <div className="flex-1">
              {loading && tab !== 'profile' ? (
                <div className="text-center py-16"><Spinner size={24} /></div>
              ) : tab === 'quotes' ? (
                <div className="space-y-4">
                  {quotes.length === 0 ? (
                    <p className="text-charcoal-400 text-center py-16">
                      You haven't submitted any quote requests yet.{' '}
                      <a href="/get-quote" className="text-amber-600 hover:underline">Get a quote</a>
                    </p>
                  ) : (
                    quotes.map((q) => (
                      <div key={q._id} className="bg-charcoal-50 dark:bg-charcoal-900 rounded-2xl p-6 border border-charcoal-100 dark:border-charcoal-800">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-charcoal-900 dark:text-white">{q.projectType}</h3>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLORS[q.status]}`}>{q.status}</span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-charcoal-500 dark:text-charcoal-400">
                          <span className="flex items-center gap-1"><MapPin size={14} /> {q.location}</span>
                          <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(q.createdAt).toLocaleDateString('en-IN')}</span>
                        </div>
                        {q.message && <p className="text-sm text-charcoal-600 dark:text-charcoal-300 mt-3">{q.message}</p>}
                      </div>
                    ))
                  )}
                </div>
              ) : tab === 'messages' ? (
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <p className="text-charcoal-400 text-center py-16">
                      You haven't sent any messages yet.{' '}
                      <a href="/contact" className="text-amber-600 hover:underline">Contact us</a>
                    </p>
                  ) : (
                    messages.map((m) => (
                      <div key={m._id} className="bg-charcoal-50 dark:bg-charcoal-900 rounded-2xl p-6 border border-charcoal-100 dark:border-charcoal-800">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-charcoal-900 dark:text-white">{m.subject}</h3>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLORS[m.status]}`}>{m.status}</span>
                        </div>
                        <p className="text-sm text-charcoal-600 dark:text-charcoal-300">{m.message}</p>
                        <p className="text-xs text-charcoal-400 mt-3 flex items-center gap-1">
                          <Calendar size={12} /> {new Date(m.createdAt).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-charcoal-50 dark:bg-charcoal-900 rounded-2xl p-6 border border-charcoal-100 dark:border-charcoal-800">
                    <h3 className="font-semibold text-charcoal-900 dark:text-white mb-4">Account Details</h3>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                      <div>
                        <label className="text-sm text-charcoal-600 dark:text-charcoal-300 mb-1 block">Full Name</label>
                        <input {...profileForm.register('name', { required: true })} className="input-field" />
                      </div>
                      <div>
                        <label className="text-sm text-charcoal-600 dark:text-charcoal-300 mb-1 block">Phone Number</label>
                        <input {...profileForm.register('phone')} className="input-field" />
                      </div>
                      <div>
                        <label className="text-sm text-charcoal-600 dark:text-charcoal-300 mb-1 block">Email</label>
                        <input value={customer?.email} disabled className="input-field opacity-60 cursor-not-allowed" />
                      </div>
                      <button type="submit" disabled={savingProfile} className="btn-primary disabled:opacity-60">
                        {savingProfile ? <Spinner size={18} /> : 'Save Changes'}
                      </button>
                    </form>
                  </div>

                  <div className="bg-charcoal-50 dark:bg-charcoal-900 rounded-2xl p-6 border border-charcoal-100 dark:border-charcoal-800">
                    <h3 className="font-semibold text-charcoal-900 dark:text-white mb-4">Change Password</h3>
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
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CustomerDashboard;
