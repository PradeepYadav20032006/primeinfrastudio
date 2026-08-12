import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Calendar } from 'lucide-react';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import api from '../utils/api';

const CATEGORIES = ['All', 'Residential', 'Commercial', 'Interior Design', 'Renovation', 'Industrial'];

const FALLBACK_PROJECTS = [
  { _id: 'f1', slug: 'serene-villa-baner', title: 'Serene Villa, Baner', category: 'Residential', location: 'Baner, Pune', coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900', year: 2024, area: '4500 sq.ft' },
  { _id: 'f2', slug: 'horizon-business-park', title: 'Horizon Business Park', category: 'Commercial', location: 'Hinjewadi, Pune', coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900', year: 2023, area: '85000 sq.ft' },
  { _id: 'f3', slug: 'minimalist-penthouse', title: 'Minimalist Penthouse Interiors', category: 'Interior Design', location: 'Koregaon Park, Pune', coverImage: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=900', year: 2024, area: '3200 sq.ft' },
];

const Projects = () => {
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (category !== 'All') params.set('category', category);
      if (search) params.set('search', search);
      const res = await api.get(`/projects?${params.toString()}`);
      setProjects(res.data.data.length ? res.data.data : (category === 'All' && !search ? FALLBACK_PROJECTS : []));
    } catch (err) {
      if (category === 'All' && !search) setProjects(FALLBACK_PROJECTS);
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    const t = setTimeout(fetchProjects, 300);
    return () => clearTimeout(t);
  }, [fetchProjects]);

  return (
    <>
      <SEO title="Our Projects" description="Browse PrimeInfraStudio's portfolio of residential, commercial, and interior design projects across Pune, Maharashtra." />
      <PageHeader subtitle="Our Portfolio" title="Projects We've Delivered" bgImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600" />

      <section className="section-padding bg-white dark:bg-charcoal-950">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    category === c
                      ? 'bg-amber-600 text-white'
                      : 'bg-charcoal-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-200 hover:bg-charcoal-200 dark:hover:bg-charcoal-700'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-72">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="input-field pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-charcoal-400">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 text-charcoal-400">No projects found matching your criteria.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {projects.map((p) => (
                  <motion.div
                    key={p._id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Link to={`/projects/${p.slug}`} className="group block rounded-2xl overflow-hidden shadow-lg h-96 relative">
                      <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 p-6 text-white w-full">
                        <span className="text-xs uppercase tracking-widest text-amber-400">{p.category}</span>
                        <h3 className="text-xl font-display font-bold mt-1 mb-2">{p.title}</h3>
                        <div className="flex items-center gap-4 text-xs text-charcoal-200">
                          <span className="flex items-center gap-1"><MapPin size={12} /> {p.location}</span>
                          <span className="flex items-center gap-1"><Calendar size={12} /> {p.year}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Projects;
