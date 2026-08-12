import AdminCrudPage from '../../components/AdminCrudPage';

const fields = [
  { name: 'title', label: 'Title', required: true },
  { name: 'icon', label: 'Icon Name (lucide-react)', placeholder: 'e.g. Home, Building2, Sofa, Hammer', hint: 'Must match an imported lucide-react icon name on the frontend' },
  { name: 'shortDescription', label: 'Short Description', type: 'textarea', required: true },
  { name: 'fullDescription', label: 'Full Description', type: 'textarea', required: true },
  { name: 'image', label: 'Image URL', required: true },
  { name: 'features', label: 'Features (comma separated)', type: 'tags' },
  { name: 'startingPrice', label: 'Starting Price (e.g. ₹1,800/sq.ft)' },
  { name: 'order', label: 'Display Order', type: 'number' },
  { name: 'isActive', label: 'Active', type: 'checkbox' },
];

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'startingPrice', label: 'Starting Price' },
  { key: 'order', label: 'Order' },
  { key: 'isActive', label: 'Active', render: (i) => (i.isActive ? 'Yes' : 'No') },
];

const AdminServices = () => (
  <AdminCrudPage title="Services" resource="services" fields={fields} columns={columns} />
);

export default AdminServices;
