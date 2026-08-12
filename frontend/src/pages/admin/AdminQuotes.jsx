import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Download, Trash2, Eye, X } from 'lucide-react';
import api from '../../utils/api';
import { Spinner } from '../../components/Loader';

const STATUSES = ['New', 'Contacted', 'In Discussion', 'Quoted', 'Converted', 'Closed'];
const STATUS_COLORS = {
  New: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Contacted: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'In Discussion': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Quoted: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Converted: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Closed: 'bg-charcoal-200 text-charcoal-600 dark:bg-charcoal-700 dark:text-charcoal-300',
};

const AdminQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/quotes?limit=100');
      setQuotes(res.data.data);
    } catch (err) {
      toast.error(err.message || 'Failed to load quote requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchQuotes(); }, [fetchQuotes]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/quotes/${id}`, { status });
      setQuotes((prev) => prev.map((q) => (q._id === id ? { ...q, status } : q)));
      toast.success('Status updated');
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  const deleteQuote = async (id) => {
    if (!window.confirm('Delete this quote request?')) return;
    try {
      await api.delete(`/quotes/${id}`);
      setQuotes((prev) => prev.filter((q) => q._id !== id));
      toast.success('Deleted');
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const downloadPDF = async (id) => {
    try {
      const res = await api.get(`/quotes/${id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Quotation-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error('Failed to download PDF');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-charcoal-900 dark:text-white mb-1">Quote Requests</h1>
      <p className="text-charcoal-500 dark:text-charcoal-400 mb-6 text-sm">Manage incoming quotation requests from customers</p>

      <div className="bg-white dark:bg-charcoal-900 rounded-2xl border border-charcoal-100 dark:border-charcoal-800 overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center"><Spinner size={24} /></div>
        ) : quotes.length === 0 ? (
          <p className="p-12 text-center text-charcoal-400 text-sm">No quote requests yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-charcoal-100 dark:border-charcoal-800 text-left text-charcoal-500 dark:text-charcoal-400">
                <th className="px-6 py-3 font-medium">Client</th>
                <th className="px-6 py-3 font-medium">Project Type</th>
                <th className="px-6 py-3 font-medium">Location</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <tr key={q._id} className="border-b border-charcoal-50 dark:border-charcoal-800 last:border-0 hover:bg-charcoal-50 dark:hover:bg-charcoal-800/50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-charcoal-800 dark:text-charcoal-100">{q.name}</p>
                    <p className="text-xs text-charcoal-400">{q.email}</p>
                  </td>
                  <td className="px-6 py-4 text-charcoal-600 dark:text-charcoal-300">{q.projectType}</td>
                  <td className="px-6 py-4 text-charcoal-600 dark:text-charcoal-300">{q.location}</td>
                  <td className="px-6 py-4">
                    <select
                      value={q.status}
                      onChange={(e) => updateStatus(q._id, e.target.value)}
                      className={`text-xs rounded-full px-3 py-1.5 border-0 font-medium ${STATUS_COLORS[q.status]}`}
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-charcoal-500 dark:text-charcoal-400 text-xs">
                    {new Date(q.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setSelected(q)} className="p-2 rounded-md bg-charcoal-100 dark:bg-charcoal-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-600"><Eye size={14} /></button>
                      <button onClick={() => downloadPDF(q._id)} className="p-2 rounded-md bg-charcoal-100 dark:bg-charcoal-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600"><Download size={14} /></button>
                      <button onClick={() => deleteQuote(q._id)} className="p-2 rounded-md bg-charcoal-100 dark:bg-charcoal-800 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-charcoal-900 rounded-2xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold text-charcoal-900 dark:text-white">Quote Details</h2>
              <button onClick={() => setSelected(null)}><X size={20} className="text-charcoal-400" /></button>
            </div>
            <div className="space-y-2 text-sm">
              {Object.entries({
                Name: selected.name, Email: selected.email, Phone: selected.phone,
                'Project Type': selected.projectType, Location: selected.location, Area: selected.area,
                Budget: selected.budgetRange, Timeline: selected.timeline, Message: selected.message,
              }).map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <span className="text-charcoal-400 w-28 shrink-0">{k}:</span>
                  <span className="text-charcoal-800 dark:text-charcoal-100">{v || 'N/A'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuotes;
