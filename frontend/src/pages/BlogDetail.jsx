import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';
import api from '../utils/api';

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api
      .get(`/blogs/${slug}`)
      .then((res) => setPost(res.data.data))
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="pt-40 pb-24 text-center container-custom">
        <h1 className="text-3xl font-display font-bold mb-4">Article Not Found</h1>
        <p className="text-charcoal-500 mb-6">This article may have been moved or the backend isn't connected yet.</p>
        <Link to="/blog" className="btn-primary inline-flex"><ArrowLeft size={16} /> Back to Blog</Link>
      </div>
    );
  }

  if (!post) return <div className="pt-40 pb-24 text-center container-custom text-charcoal-400">Loading article...</div>;

  return (
    <>
      <SEO title={post.title} description={post.excerpt} />
      <article className="pt-40 pb-24">
        <div className="container-custom max-w-3xl">
          <Link to="/blog" className="text-amber-600 flex items-center gap-1 text-sm mb-6"><ArrowLeft size={14} /> Back to Blog</Link>
          <span className="text-xs uppercase tracking-widest text-amber-600">{post.category}</span>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-charcoal-900 dark:text-white mt-2 mb-6">{post.title}</h1>
          <div className="flex items-center gap-5 text-sm text-charcoal-500 dark:text-charcoal-400 mb-8">
            <span className="flex items-center gap-1"><User size={14} /> {post.author}</span>
            <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString('en-IN')}</span>
          </div>
          <img src={post.coverImage} alt={post.title} className="rounded-2xl shadow-xl w-full h-96 object-cover mb-10" />
          <div className="prose dark:prose-invert max-w-none text-charcoal-600 dark:text-charcoal-300 leading-relaxed whitespace-pre-line">
            {post.content}
          </div>
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10">
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-charcoal-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-300 rounded-full text-xs">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </>
  );
};

export default BlogDetail;
