import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Trash2, Eye, X } from 'lucide-react';
import api from '../../utils/api';
import { Spinner } from '../../components/Loader';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/contact?limit=100');
      setMessages(res.data.data);
    } catch (err) {
      toast.error(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const openMessage = async (msg) => {
    setSelected(msg);
    if (msg.status === 'Unread') {
      try {
        await api.put(`/contact/${msg._id}`, { status: 'Read' });
        setMessages((prev) => prev.map((m) => (m._id === msg._id ? { ...m, status: 'Read' } : m)));
      } catch (err) { /* non-critical */ }
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.delete(`/contact/${id}`);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      toast.success('Deleted');
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-charcoal-900 dark:text-white mb-1">Contact Messages</h1>
      <p className="text-charcoal-500 dark:text-charcoal-400 mb-6 text-sm">Messages submitted through the website's contact form</p>

      <div className="bg-white dark:bg-charcoal-900 rounded-2xl border border-charcoal-100 dark:border-charcoal-800 overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center"><Spinner size={24} /></div>
        ) : messages.length === 0 ? (
          <p className="p-12 text-center text-charcoal-400 text-sm">No messages yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-charcoal-100 dark:border-charcoal-800 text-left text-charcoal-500 dark:text-charcoal-400">
                <th className="px-6 py-3 font-medium">From</th>
                <th className="px-6 py-3 font-medium">Subject</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m._id} className={`border-b border-charcoal-50 dark:border-charcoal-800 last:border-0 hover:bg-charcoal-50 dark:hover:bg-charcoal-800/50 ${m.status === 'Unread' ? 'font-semibold' : ''}`}>
                  <td className="px-6 py-4">
                    <p className="text-charcoal-800 dark:text-charcoal-100">{m.name}</p>
                    <p className="text-xs text-charcoal-400 font-normal">{m.email}</p>
                  </td>
                  <td className="px-6 py-4 text-charcoal-600 dark:text-charcoal-300 font-normal">{m.subject}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-normal ${m.status === 'Unread' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-charcoal-500 dark:text-charcoal-400 text-xs font-normal">
                    {new Date(m.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openMessage(m)} className="p-2 rounded-md bg-charcoal-100 dark:bg-charcoal-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-600"><Eye size={14} /></button>
                      <button onClick={() => deleteMessage(m._id)} className="p-2 rounded-md bg-charcoal-100 dark:bg-charcoal-800 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600"><Trash2 size={14} /></button>
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
              <h2 className="text-lg font-semibold text-charcoal-900 dark:text-white">{selected.subject}</h2>
              <button onClick={() => setSelected(null)}><X size={20} className="text-charcoal-400" /></button>
            </div>
            <p className="text-sm text-charcoal-400 mb-4">From {selected.name} ({selected.email}) {selected.phone && `· ${selected.phone}`}</p>
            <p className="text-sm text-charcoal-700 dark:text-charcoal-200 leading-relaxed whitespace-pre-line">{selected.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
