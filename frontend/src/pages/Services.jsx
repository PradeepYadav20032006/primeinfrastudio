import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Home as HomeIcon, Sofa, Hammer, CheckCircle2, ArrowRight, Calculator } from 'lucide-react';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import api from '../utils/api';

const ICONS = { Building2, Home: HomeIcon, Sofa, Hammer };

const FALLBACK_SERVICES = [
  {
    _id: '1', title: 'Residential Construction', icon: 'Home',
    shortDescription: 'End-to-end home building services with quality craftsmanship.',
    fullDescription: 'From foundation to finishing, we build homes that stand the test of time.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    features: ['Custom Home Design', 'Structural Engineering', 'Quality Materials', 'On-time Delivery'],
    startingPrice: '₹1,800/sq.ft',
  },
  {
    _id: '2', title: 'Commercial Construction', icon: 'Building2',
    shortDescription: 'Office spaces, retail units and industrial facilities built to scale.',
    fullDescription: 'We deliver commercial construction projects that balance functionality and compliance.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    features: ['Office Buildings', 'Retail Spaces', 'Warehouses', 'Regulatory Compliance'],
    startingPrice: '₹2,200/sq.ft',
  },
  {
    _id: '3', title: 'Interior Design', icon: 'Sofa',
    shortDescription: 'Bespoke interiors that reflect your personality and lifestyle.',
    fullDescription: 'Our interior design team crafts spaces that are as functional as they are beautiful.',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800',
    features: ['Space Planning', '3D Visualization', 'Custom Furniture', 'Lighting Design'],
    startingPrice: '₹950/sq.ft',
  },
  {
    _id: '4', title: 'Renovation & Remodeling', icon: 'Hammer',
    shortDescription: 'Transform existing spaces into modern, functional environments.',
    fullDescription: 'We breathe new life into old structures through careful planning and modern materials.',
    image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800',
    features: ['Kitchen Remodeling', 'Bathroom Upgrades', 'Structural Repairs', 'Facade Renewal'],
    startingPrice: '₹700/sq.ft',
  },
];

const Services = () => {
  const [services, setServices] = useState(FALLBACK_SERVICES);

  useEffect(() => {
    api
      .get('/services?sort=order&limit=50')
      .then((res) => res.data.data.length && setServices(res.data.data))
      .catch(() => {});
  }, []);

  return (
    <>
      <SEO title="Our Services" description="Explore PrimeInfraStudio's construction and interior design services: residential, commercial, interior design, and renovation." />
      <PageHeader subtitle="What We Offer" title="Our Services" bgImage="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600" />

      <section className="section-padding bg-white dark:bg-charcoal-950">
        <div className="container-custom space-y-20">
          {services.map((service, i) => {
            const Icon = ICONS[service.icon] || Building2;
            const reversed = i % 2 === 1;
            return (
              <motion.div
                id={service.title.toLowerCase().includes('residential') ? 'residential'
                  : service.title.toLowerCase().includes('commercial') ? 'commercial'
                  : service.title.toLowerCase().includes('interior') ? 'interior'
                  : service.title.toLowerCase().includes('renovation') ? 'renovation' : undefined}
                key={service._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`grid md:grid-cols-2 gap-10 items-center scroll-mt-28 ${reversed ? 'md:[&>*:first-child]:order-2' : ''}`}
              >
                <img src={service.image} alt={service.title} className="rounded-2xl shadow-xl w-full h-96 object-cover" />
                <div>
                  <div className="w-14 h-14 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-5">
                    <Icon size={26} className="text-amber-600" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-charcoal-900 dark:text-white mb-3">
                    {service.title}
                  </h2>
                  <p className="text-charcoal-500 dark:text-charcoal-400 mb-5 leading-relaxed">{service.fullDescription}</p>
                  <ul className="grid sm:grid-cols-2 gap-3 mb-6">
                    {(service.features || []).map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-charcoal-700 dark:text-charcoal-200">
                        <CheckCircle2 size={16} className="text-amber-600 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-6 flex-wrap">
                    {service.startingPrice && (
                      <p className="text-charcoal-900 dark:text-white font-semibold">
                        Starting at <span className="text-amber-600">{service.startingPrice}</span>
                      </p>
                    )}
                    <Link to="/get-quote" className="btn-primary text-sm">
                      Request a Quote <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="section-padding bg-amber-600">
        <div className="container-custom text-center">
          <Calculator size={40} className="text-white mx-auto mb-4" />
          <h2 className="text-3xl font-display font-bold text-white mb-4">Not Sure Where to Start?</h2>
          <p className="text-amber-50 max-w-xl mx-auto mb-8">
            Use our free cost estimator tool to get an instant ballpark estimate for your project.
          </p>
          <Link to="/cost-estimator" className="inline-flex items-center gap-2 bg-white text-amber-700 font-semibold px-8 py-4 rounded-md hover:bg-charcoal-50 transition-colors">
            Try Cost Estimator <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
};

export default Services;
