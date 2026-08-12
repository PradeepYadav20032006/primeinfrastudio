import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Home as HomeIcon, Sofa, Hammer, ArrowRight, CheckCircle2, Star } from 'lucide-react';
import SEO from '../components/SEO';
import SectionTitle from '../components/SectionTitle';
import api from '../utils/api';
import { COMPANY } from '../utils/constants';

const ICONS = { Building2, Home: HomeIcon, Sofa, Hammer };

const STATS = [
  { label: 'Projects Delivered', value: '100+' },
  { label: 'Years of Experience', value: '12+' },
  { label: 'Happy Clients', value: '200+' },
  { label: 'Cities Served', value: '8+' },
];

const Home = () => {
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, pRes, tRes] = await Promise.all([
          api.get('/services?limit=4&sort=order'),
          api.get('/projects?limit=3&featured=true'),
          api.get('/testimonials?limit=3&isFeatured=true'),
        ]);
        setServices(sRes.data.data);
        setProjects(pRes.data.data);
        setTestimonials(tRes.data.data);
      } catch (err) {
        // Backend may not be reachable yet - fail gracefully, sections just won't render.
        console.warn('Home data fetch failed (is the backend running?):', err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <SEO
        title="Premium Construction & Interior Design in Pune"
        description="PrimeInfraStudio delivers premium construction and interior design services in Pune, Maharashtra. Crafting Spaces. Creating Experiences."
      />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-charcoal-950">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(10,12,16,0.55), rgba(10,12,16,0.85)), url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920')",
          }}
        />
        <div className="relative z-10 container-custom text-center pt-24">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-tag !text-amber-500 mb-4"
          >
            Premium Construction & Interior Design · Pune
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-white leading-tight max-w-4xl mx-auto"
          >
            {COMPANY.tagline}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-charcoal-200 text-lg max-w-2xl mx-auto"
          >
            {COMPANY.name} builds homes, offices, and interiors that blend timeless design with modern
            engineering — delivered on time, every time.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/get-quote" className="btn-primary">
              Get a Free Quote <ArrowRight size={18} />
            </Link>
            <Link to="/projects" className="btn-secondary !border-white !text-white hover:!bg-white hover:!text-charcoal-900">
              View Our Projects
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-charcoal-950/95 backdrop-blur-sm py-8"
        >
          <div className="container-custom grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-3xl md:text-4xl font-display font-bold text-amber-600">{s.value}</p>
                <p className="text-xs md:text-sm text-charcoal-500 dark:text-charcoal-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ABOUT SNIPPET */}
      <section className="section-padding bg-white dark:bg-charcoal-950">
        <div className="container-custom grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900"
              alt="PrimeInfraStudio construction site"
              className="rounded-2xl shadow-2xl w-full object-cover h-[420px]"
            />
            <div className="absolute -bottom-8 -right-8 bg-amber-600 text-white p-6 rounded-2xl shadow-xl hidden md:block">
              <p className="text-3xl font-display font-bold">12+</p>
              <p className="text-sm">Years of Excellence</p>
            </div>
          </motion.div>
          <div>
            <span className="section-tag">About PrimeInfraStudio</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal-900 dark:text-white mb-5">
              Building Trust, One Structure at a Time
            </h2>
            <p className="text-charcoal-500 dark:text-charcoal-400 mb-6 leading-relaxed">
              Led by President {COMPANY.president}, PrimeInfraStudio is a Pune-based construction and interior
              design company committed to delivering exceptional quality, transparent processes, and timely
              execution across residential, commercial, and interior projects.
            </p>
            <ul className="space-y-3 mb-8">
              {['Certified & Experienced Team', 'Transparent Pricing', 'On-Time Project Delivery', 'End-to-End Project Management'].map(
                (item) => (
                  <li key={item} className="flex items-center gap-3 text-charcoal-700 dark:text-charcoal-200">
                    <CheckCircle2 size={20} className="text-amber-600 shrink-0" /> {item}
                  </li>
                )
              )}
            </ul>
            <Link to="/about" className="btn-primary">
              Learn More About Us <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section-padding bg-charcoal-50 dark:bg-charcoal-900">
        <div className="container-custom">
          <SectionTitle
            tag="What We Do"
            title="Our Core Services"
            description="From ground-up construction to bespoke interiors, we offer a complete suite of services tailored to your vision."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(services.length ? services : Array.from({ length: 4 })).map((service, i) => {
              const Icon = service ? ICONS[service.icon] || Building2 : Building2;
              return (
                <motion.div
                  key={service?._id || i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="card-hover bg-white dark:bg-charcoal-800 rounded-2xl p-8 shadow-sm border border-charcoal-100 dark:border-charcoal-700"
                >
                  <div className="w-14 h-14 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-5">
                    <Icon size={26} className="text-amber-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-charcoal-900 dark:text-white mb-2">
                    {service?.title || 'Loading...'}
                  </h3>
                  <p className="text-sm text-charcoal-500 dark:text-charcoal-400 mb-4">
                    {service?.shortDescription || 'Fetching service details from the API.'}
                  </p>
                  {service && (
                    <Link to="/services" className="text-amber-600 text-sm font-medium flex items-center gap-1">
                      Explore <ArrowRight size={14} />
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      {projects.length > 0 && (
        <section className="section-padding bg-white dark:bg-charcoal-950">
          <div className="container-custom">
            <SectionTitle
              tag="Our Portfolio"
              title="Featured Projects"
              description="A glimpse into the spaces we've crafted across Pune and beyond."
            />
            <div className="grid md:grid-cols-3 gap-8">
              {projects.map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative rounded-2xl overflow-hidden shadow-lg h-96"
                >
                  <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 p-6 text-white">
                    <span className="text-xs uppercase tracking-widest text-amber-400">{p.category}</span>
                    <h3 className="text-xl font-display font-bold mt-1">{p.title}</h3>
                    <p className="text-sm text-charcoal-200 mt-1">{p.location}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link to="/projects" className="btn-secondary dark:!border-white dark:!text-white">
                View All Projects <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="section-padding bg-charcoal-900 text-white">
          <div className="container-custom">
            <SectionTitle tag="Client Love" title="What Our Clients Say" />
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-charcoal-800 rounded-2xl p-8"
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <Star key={idx} size={16} className="fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-charcoal-200 mb-6 leading-relaxed">"{t.message}"</p>
                  <p className="font-semibold">{t.clientName}</p>
                  <p className="text-sm text-charcoal-400">{t.clientRole}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding bg-amber-600">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Ready to Start Your Dream Project?
          </h2>
          <p className="text-amber-50 max-w-xl mx-auto mb-8">
            Get a free, no-obligation quote from our team today. Let's build something extraordinary together.
          </p>
          <Link to="/get-quote" className="inline-flex items-center gap-2 bg-white text-amber-700 font-semibold px-8 py-4 rounded-md hover:bg-charcoal-50 transition-colors">
            Get Your Free Quote <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
