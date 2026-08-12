import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FolderKanban, Wrench, Newspaper, MessageSquareQuote, FileText, Mail, Briefcase, TrendingUp } from 'lucide-react';
import api from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/dashboard/stats')
      .then((res) => setStats(res.data.data))
      .catch((err) => setError(err.message || 'Failed to load dashboard stats'));
  }, []);

  const cards = stats
    ? [
        { label: 'Total Projects', value: stats.totals.projects, icon: FolderKanban, color: 'bg-blue-500' },
        { label: 'Total Services', value: stats.totals.services, icon: Wrench, color: 'bg-purple-500' },
        { label: 'Blog Posts', value: stats.totals.blogs, icon: Newspaper, color: 'bg-green-500' },
        { label: 'Testimonials', value: stats.totals.testimonials, icon: MessageSquareQuote, color: 'bg-pink-500' },
        { label: 'Quote Requests', value: stats.totals.quotes, icon: FileText, color: 'bg-amber-600' },
        { label: 'New Quotes', value: stats.totals.newQuotes, icon: TrendingUp, color: 'bg-red-500' },
        { label: 'Contact Messages', value: stats.totals.messages, icon: Mail, color: 'bg-cyan-500' },
        { label: 'Job Applications', value: stats.totals.applications, icon: Briefcase, color: 'bg-indigo-500' },
      ]
    : [];

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-charcoal-900 dark:text-white mb-1">Dashboard</h1>
      <p className="text-charcoal-500 dark:text-charcoal-400 mb-8">Overview of your website activity</p>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md p-4 mb-6 text-sm">
          Could not load stats: {error}. Make sure the backend server is running and connected to MongoDB.
        </div>
      )}

      {stats && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {cards.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-charcoal-900 rounded-2xl p-6 border border-charcoal-100 dark:border-charcoal-800"
              >
                <div className={`w-11 h-11 rounded-xl ${c.color} flex items-center justify-center mb-4`}>
                  <c.icon size={20} className="text-white" />
                </div>
                <p className="text-2xl font-display font-bold text-charcoal-900 dark:text-white">{c.value}</p>
                <p className="text-sm text-charcoal-500 dark:text-charcoal-400">{c.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-charcoal-900 rounded-2xl p-6 border border-charcoal-100 dark:border-charcoal-800">
              <h3 className="font-semibold text-charcoal-900 dark:text-white mb-4">Recent Quote Requests</h3>
              <div className="space-y-3">
                {stats.recentQuotes.length === 0 && <p className="text-sm text-charcoal-400">No quote requests yet.</p>}
                {stats.recentQuotes.map((q) => (
                  <div key={q._id} className="flex items-center justify-between py-2 border-b border-charcoal-100 dark:border-charcoal-800 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-charcoal-800 dark:text-charcoal-100">{q.name}</p>
                      <p className="text-xs text-charcoal-400">{q.projectType}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                      {q.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-charcoal-900 rounded-2xl p-6 border border-charcoal-100 dark:border-charcoal-800">
              <h3 className="font-semibold text-charcoal-900 dark:text-white mb-4">Recent Messages</h3>
              <div className="space-y-3">
                {stats.recentMessages.length === 0 && <p className="text-sm text-charcoal-400">No messages yet.</p>}
                {stats.recentMessages.map((m) => (
                  <div key={m._id} className="flex items-center justify-between py-2 border-b border-charcoal-100 dark:border-charcoal-800 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-charcoal-800 dark:text-charcoal-100">{m.name}</p>
                      <p className="text-xs text-charcoal-400">{m.subject}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${m.status === 'Unread' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
