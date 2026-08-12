import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Ruler, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import api from '../utils/api';

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api
      .get(`/projects/${slug}`)
      .then((res) => setProject(res.data.data))
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="pt-40 pb-24 text-center container-custom">
        <h1 className="text-3xl font-display font-bold mb-4">Project Not Found</h1>
        <p className="text-charcoal-500 mb-6">This project may have been moved or the backend isn't connected yet.</p>
        <Link to="/projects" className="btn-primary inline-flex"><ArrowLeft size={16} /> Back to Projects</Link>
      </div>
    );
  }

  if (!project) return <div className="pt-40 pb-24 text-center container-custom text-charcoal-400">Loading project...</div>;

  return (
    <>
      <SEO title={project.title} description={project.description} />
      <section className="relative pt-40 pb-16 bg-charcoal-900">
        <div
          className="absolute inset-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: `url(${project.coverImage})` }}
        />
        <div className="relative container-custom">
          <Link to="/projects" className="text-amber-500 flex items-center gap-1 text-sm mb-4"><ArrowLeft size={14} /> Back to Projects</Link>
          <span className="text-xs uppercase tracking-widest text-amber-500">{project.category}</span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mt-2">{project.title}</h1>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-charcoal-950">
        <div className="container-custom grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <img src={project.coverImage} alt={project.title} className="rounded-2xl shadow-xl w-full h-[420px] object-cover mb-8" />
            <h2 className="text-2xl font-display font-bold text-charcoal-900 dark:text-white mb-4">Project Overview</h2>
            <p className="text-charcoal-500 dark:text-charcoal-400 leading-relaxed mb-8">{project.description}</p>

            {project.images?.length > 1 && (
              <div className="grid sm:grid-cols-2 gap-4">
                {project.images.slice(1).map((img, i) => (
                  <img key={i} src={img} alt={`${project.title} ${i + 2}`} className="rounded-xl h-56 w-full object-cover" />
                ))}
              </div>
            )}
          </div>

          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-charcoal-50 dark:bg-charcoal-900 rounded-2xl p-8 h-fit sticky top-28 space-y-5"
          >
            <h3 className="font-semibold text-charcoal-900 dark:text-white mb-2">Project Details</h3>
            <div className="flex items-center gap-3 text-sm text-charcoal-600 dark:text-charcoal-300">
              <MapPin size={18} className="text-amber-600" /> {project.location}
            </div>
            {project.area && (
              <div className="flex items-center gap-3 text-sm text-charcoal-600 dark:text-charcoal-300">
                <Ruler size={18} className="text-amber-600" /> {project.area}
              </div>
            )}
            {project.duration && (
              <div className="flex items-center gap-3 text-sm text-charcoal-600 dark:text-charcoal-300">
                <Clock size={18} className="text-amber-600" /> {project.duration}
              </div>
            )}
            <div className="flex items-center gap-3 text-sm text-charcoal-600 dark:text-charcoal-300">
              <Calendar size={18} className="text-amber-600" /> {project.year}
            </div>
            <div className="pt-4 border-t border-charcoal-200 dark:border-charcoal-700">
              <Link to="/get-quote" className="btn-primary w-full justify-center">
                Start Similar Project <ArrowRight size={16} />
              </Link>
            </div>
          </motion.aside>
        </div>
      </section>
    </>
  );
};

export default ProjectDetail;
