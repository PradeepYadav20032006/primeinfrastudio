import AdminCrudPage from '../../components/AdminCrudPage';

const fields = [
  { name: 'title', label: 'Title', required: true },
  { name: 'category', label: 'Category', type: 'select', required: true, options: ['Interior', 'Exterior', 'Construction', 'Renovation', 'Landscape'] },
  { name: 'image', label: 'Image URL', required: true },
  { name: 'order', label: 'Display Order', type: 'number' },
];

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category' },
  { key: 'image', label: 'Preview', render: (i) => <img src={i.image} alt={i.title} className="w-16 h-10 object-cover rounded" /> },
];

const AdminGallery = () => (
  <AdminCrudPage title="Gallery" resource="gallery" fields={fields} columns={columns} />
);

export default AdminGallery;
