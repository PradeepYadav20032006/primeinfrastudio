import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Trash2, FileDown } from 'lucide-react';
import api from '../../utils/api';
import { Spinner } from '../../components/Loader';

const STATUSES = ['Applied', 'Shortlisted', 'Interviewing', 'Hired', 'Rejected'];

const AdminCareers = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/careers?limit=100');
      setApps(res.data.data);
    } catch (err) {
      toast.error(err.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchApps(); }, [fetchApps]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/careers/${id}`, { status });
      setApps((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
      toast.success('Status updated');
    } catch (err) {
      toast.error(err.message || 'Failed to update');
    }
  };

  const deleteApp = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await api.delete(`/careers/${id}`);
      setApps((prev) => prev.filter((a) => a._id !== id));
      toast.success('Deleted');
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-charcoal-900 dark:text-white mb-1">Career Applications</h1>
      <p className="text-charcoal-500 dark:text-charcoal-400 mb-6 text-sm">Applications submitted through the Careers page</p>

      <div className="bg-white dark:bg-charcoal-900 rounded-2xl border border-charcoal-100 dark:border-charcoal-800 overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center"><Spinner size={24} /></div>
        ) : apps.length === 0 ? (
          <p className="p-12 text-center text-charcoal-400 text-sm">No applications yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-charcoal-100 dark:border-charcoal-800 text-left text-charcoal-500 dark:text-charcoal-400">
                <th className="px-6 py-3 font-medium">Applicant</th>
                <th className="px-6 py-3 font-medium">Position</th>
                <th className="px-6 py-3 font-medium">Experience</th>
                <th className="px-6 py-3 font-medium">Resume</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((a) => (
                <tr key={a._id} className="border-b border-charcoal-50 dark:border-charcoal-800 last:border-0 hover:bg-charcoal-50 dark:hover:bg-charcoal-800/50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-charcoal-800 dark:text-charcoal-100">{a.fullName}</p>
                    <p className="text-xs text-charcoal-400">{a.email} · {a.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-charcoal-600 dark:text-charcoal-300">{a.positionAppliedFor}</td>
                  <td className="px-6 py-4 text-charcoal-600 dark:text-charcoal-300">{a.experienceYears} yrs</td>
                  <td className="px-6 py-4">
                    <a href={a.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-amber-600 flex items-center gap-1 text-xs">
                      <FileDown size={14} /> View
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={a.status}
                      onChange={(e) => updateStatus(a._id, e.target.value)}
                      className="text-xs rounded-full px-3 py-1.5 bg-charcoal-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-200 border-0"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => deleteApp(a._id)} className="p-2 rounded-md bg-charcoal-100 dark:bg-charcoal-800 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminCareers;
