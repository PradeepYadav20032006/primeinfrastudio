import AdminCrudPage from '../../components/AdminCrudPage';

const fields = [
  { name: 'title', label: 'Title', required: true },
  { name: 'category', label: 'Category', type: 'select', required: true, options: ['Residential', 'Commercial', 'Interior Design', 'Renovation', 'Industrial'] },
  { name: 'location', label: 'Location', required: true },
  { name: 'clientName', label: 'Client Name' },
  { name: 'description', label: 'Description', type: 'textarea', required: true },
  { name: 'coverImage', label: 'Cover Image URL', required: true, hint: 'Paste an image URL (or your uploaded /uploads/... path)' },
  { name: 'area', label: 'Area (e.g. 2500 sq.ft)' },
  { name: 'duration', label: 'Duration (e.g. 6 months)' },
  { name: 'status', label: 'Status', type: 'select', options: ['Completed', 'Ongoing', 'Upcoming'] },
  { name: 'featured', label: 'Featured on Homepage', type: 'checkbox' },
  { name: 'tags', label: 'Tags (comma separated)', type: 'tags' },
];

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category' },
  { key: 'location', label: 'Location' },
  { key: 'status', label: 'Status' },
  { key: 'featured', label: 'Featured', render: (i) => (i.featured ? 'Yes' : 'No') },
];

const AdminProjects = () => (
  <AdminCrudPage title="Projects" resource="projects" fields={fields} columns={columns} />
);

export default AdminProjects;
