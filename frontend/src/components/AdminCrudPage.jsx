import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Search } from 'lucide-react';
import api from '../utils/api';
import { Spinner } from './Loader';

/**
 * Generic admin CRUD page. Renders a searchable table plus a create/edit modal
 * built from a field-config array. Used for Projects, Services, Gallery, Blogs, Testimonials.
 *
 * fields: [{ name, label, type: 'text'|'textarea'|'number'|'select'|'checkbox'|'tags', options?, required? }]
 * columns: [{ key, label, render?(item) }]
 */
const AdminCrudPage = ({ title, resource, fields, columns }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '100' });
      if (search) params.set('search', search);
      const res = await api.get(`/${resource}?${params.toString()}`);
      setItems(res.data.data);
    } catch (err) {
      toast.error(`Failed to load ${title.toLowerCase()}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [resource, search, title]);

  useEffect(() => {
    const t = setTimeout(fetchItems, 300);
    return () => clearTimeout(t);
  }, [fetchItems]);

  const openCreate = () => {
    const defaults = {};
    fields.forEach((f) => { defaults[f.name] = f.type === 'checkbox' ? false : f.type === 'tags' ? '' : ''; });
    setFormData(defaults);
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    const data = {};
    fields.forEach((f) => {
      const val = item[f.name];
      data[f.name] = f.type === 'tags' && Array.isArray(val) ? val.join(', ') : val ?? '';
    });
    setFormData(data);
    setEditing(item);
    setModalOpen(true);
  };

  const handleChange = (name, value) => setFormData((prev) => ({ ...prev, [name]: value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...formData };
      fields.forEach((f) => {
        if (f.type === 'tags') payload[f.name] = (payload[f.name] || '').split(',').map((s) => s.trim()).filter(Boolean);
        if (f.type === 'number') payload[f.name] = Number(payload[f.name]) || 0;
      });

      if (editing) {
        await api.put(`/${resource}/${editing._id}`, payload);
        toast.success(`${title.slice(0, -1)} updated successfully`);
      } else {
        await api.post(`/${resource}`, payload);
        toast.success(`${title.slice(0, -1)} created successfully`);
      }
      setModalOpen(false);
      fetchItems();
    } catch (err) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete this ${title.slice(0, -1).toLowerCase()}? This cannot be undone.`)) return;
    try {
      await api.delete(`/${resource}/${item._id}`);
      toast.success('Deleted successfully');
      fetchItems();
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-charcoal-900 dark:text-white">{title}</h1>
          <p className="text-charcoal-500 dark:text-charcoal-400 text-sm">Manage your {title.toLowerCase()}</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="input-field !py-2 pl-9 text-sm w-48"
            />
          </div>
          <button onClick={openCreate} className="btn-primary text-sm px-4 py-2">
            <Plus size={16} /> Add New
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-charcoal-900 rounded-2xl border border-charcoal-100 dark:border-charcoal-800 overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center"><Spinner size={24} /></div>
        ) : items.length === 0 ? (
          <p className="p-12 text-center text-charcoal-400 text-sm">No records found. Click "Add New" to create one.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-charcoal-100 dark:border-charcoal-800 text-left text-charcoal-500 dark:text-charcoal-400">
                {columns.map((c) => <th key={c.key} className="px-6 py-3 font-medium">{c.label}</th>)}
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-b border-charcoal-50 dark:border-charcoal-800 last:border-0 hover:bg-charcoal-50 dark:hover:bg-charcoal-800/50">
                  {columns.map((c) => (
                    <td key={c.key} className="px-6 py-4 text-charcoal-700 dark:text-charcoal-200">
                      {c.render ? c.render(item) : String(item[c.key] ?? '')}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="p-2 rounded-md bg-charcoal-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-300 hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-600">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(item)} className="p-2 rounded-md bg-charcoal-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-300 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-charcoal-900 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-charcoal-100 dark:border-charcoal-800">
                <h2 className="text-lg font-semibold text-charcoal-900 dark:text-white">
                  {editing ? `Edit ${title.slice(0, -1)}` : `Add New ${title.slice(0, -1)}`}
                </h2>
                <button onClick={() => setModalOpen(false)}><X size={20} className="text-charcoal-400" /></button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                {fields.map((f) => (
                  <div key={f.name}>
                    <label className="text-sm text-charcoal-600 dark:text-charcoal-300 mb-1 block">
                      {f.label} {f.required && '*'}
                    </label>
                    {f.type === 'textarea' ? (
                      <textarea
                        required={f.required}
                        rows={4}
                        value={formData[f.name] ?? ''}
                        onChange={(e) => handleChange(f.name, e.target.value)}
                        className="input-field resize-none"
                      />
                    ) : f.type === 'select' ? (
                      <select
                        required={f.required}
                        value={formData[f.name] ?? ''}
                        onChange={(e) => handleChange(f.name, e.target.value)}
                        className="input-field"
                      >
                        <option value="">Select...</option>
                        {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : f.type === 'checkbox' ? (
                      <input
                        type="checkbox"
                        checked={!!formData[f.name]}
                        onChange={(e) => handleChange(f.name, e.target.checked)}
                        className="w-5 h-5 accent-amber-600"
                      />
                    ) : (
                      <input
                        type={f.type === 'number' ? 'number' : 'text'}
                        required={f.required}
                        value={formData[f.name] ?? ''}
                        onChange={(e) => handleChange(f.name, e.target.value)}
                        placeholder={f.placeholder}
                        className="input-field"
                      />
                    )}
                    {f.hint && <p className="text-xs text-charcoal-400 mt-1">{f.hint}</p>}
                  </div>
                ))}
                <button type="submit" disabled={saving} className="btn-primary w-full justify-center disabled:opacity-60">
                  {saving ? <Spinner size={18} /> : editing ? 'Save Changes' : 'Create'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCrudPage;
