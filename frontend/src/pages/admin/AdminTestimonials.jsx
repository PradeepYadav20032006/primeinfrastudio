import AdminCrudPage from '../../components/AdminCrudPage';

const fields = [
  { name: 'clientName', label: 'Client Name', required: true },
  { name: 'clientRole', label: 'Client Role / Title' },
  { name: 'clientImage', label: 'Client Image URL' },
  { name: 'projectType', label: 'Project Type' },
  { name: 'rating', label: 'Rating (1-5)', type: 'number' },
  { name: 'message', label: 'Testimonial Message', type: 'textarea', required: true },
  { name: 'isApproved', label: 'Approved', type: 'checkbox' },
  { name: 'isFeatured', label: 'Featured on Homepage', type: 'checkbox' },
];

const columns = [
  { key: 'clientName', label: 'Client' },
  { key: 'rating', label: 'Rating' },
  { key: 'isApproved', label: 'Approved', render: (i) => (i.isApproved ? 'Yes' : 'No') },
  { key: 'isFeatured', label: 'Featured', render: (i) => (i.isFeatured ? 'Yes' : 'No') },
];

const AdminTestimonials = () => (
  <AdminCrudPage title="Testimonials" resource="testimonials" fields={fields} columns={columns} />
);

export default AdminTestimonials;
