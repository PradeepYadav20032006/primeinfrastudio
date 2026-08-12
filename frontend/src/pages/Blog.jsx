import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, User, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import api from '../utils/api';

const FALLBACK_BLOGS = [
  {
    _id: 'b1', slug: 'top-5-interior-trends-2026', title: 'Top 5 Interior Design Trends for 2026',
    excerpt: 'Discover the design trends shaping modern Indian homes this year, from biophilic design to warm minimalism.',
    coverImage: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=900',
    author: 'PrimeInfraStudio Team', category: 'Interior Design', createdAt: new Date().toISOString(),
  },
  {
    _id: 'b2', slug: 'choosing-right-construction-partner', title: 'How to Choose the Right Construction Partner',
    excerpt: 'A practical guide for homeowners on evaluating construction companies before signing a contract.',
    coverImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=900',
    author: 'PrimeInfraStudio Team', category: 'Construction', createdAt: new Date().toISOString(),
  },
  {
    _id: 'b3', slug: 'budgeting-your-renovation', title: 'Budgeting Your Home Renovation the Smart Way',
    excerpt: "Tips on planning your renovation budget without compromising on quality or your home's value.",
    coverImage: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=900',
    author: 'PrimeInfraStudio Team', category: 'Renovation', createdAt: new Date().toISOString(),
  },
];

const Blog = () => {
  const [blogs, setBlogs] = useState(FALLBACK_BLOGS);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams({ limit: '50' });
      if (search) params.set('search', search);
      api
        .get(`/blogs?${params.toString()}`)
        .then((res) => setBlogs(res.data.data.length ? res.data.data : (search ? [] : FALLBACK_BLOGS)))
        .catch(() => {
          if (!search) setBlogs(FALLBACK_BLOGS);
        });
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <>
      <SEO title="Blog" description="Read the latest articles and insights from PrimeInfraStudio on construction, interior design, and home improvement." />
      <PageHeader subtitle="Insights & Ideas" title="Our Blog" bgImage="https://images.unsplash.com/photo-1455165814004-1126a7199f9b?w=1600" />

      <section className="section-padding bg-white dark:bg-charcoal-950">
        <div className="container-custom">
          <div className="max-w-md mx-auto mb-12 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="input-field pl-10"
            />
          </div>

          {blogs.length === 0 ? (
            <p className="text-center text-charcoal-400 py-16">No articles found.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((post, i) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="card-hover bg-charcoal-50 dark:bg-charcoal-900 rounded-2xl overflow-hidden border border-charcoal-100 dark:border-charcoal-800"
                >
                  <Link to={`/blog/${post.slug}`}>
                    <img src={post.coverImage} alt={post.title} className="w-full h-52 object-cover" />
                    <div className="p-6">
                      <span className="text-xs uppercase tracking-widest text-amber-600">{post.category}</span>
                      <h3 className="text-lg font-display font-bold text-charcoal-900 dark:text-white mt-2 mb-3">{post.title}</h3>
                      <p className="text-sm text-charcoal-500 dark:text-charcoal-400 mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-charcoal-400">
                        <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
                        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(post.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>
                      <div className="mt-4 text-amber-600 text-sm font-medium flex items-center gap-1">
                        Read More <ArrowRight size={14} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Blog;
