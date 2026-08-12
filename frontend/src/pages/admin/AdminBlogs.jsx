import AdminCrudPage from '../../components/AdminCrudPage';

const fields = [
  { name: 'title', label: 'Title', required: true },
  { name: 'author', label: 'Author' },
  { name: 'category', label: 'Category' },
  { name: 'coverImage', label: 'Cover Image URL', required: true },
  { name: 'excerpt', label: 'Excerpt', type: 'textarea', required: true },
  { name: 'content', label: 'Full Content', type: 'textarea', required: true },
  { name: 'tags', label: 'Tags (comma separated)', type: 'tags' },
  { name: 'published', label: 'Published', type: 'checkbox' },
];

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category' },
  { key: 'views', label: 'Views' },
  { key: 'published', label: 'Published', render: (i) => (i.published ? 'Yes' : 'No') },
];

const AdminBlogs = () => (
  <AdminCrudPage title="Blogs" resource="blogs" fields={fields} columns={columns} />
);

export default AdminBlogs;
