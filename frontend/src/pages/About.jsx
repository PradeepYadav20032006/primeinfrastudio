import { motion } from 'framer-motion';
import { Target, Eye, Award, Users } from 'lucide-react';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import SectionTitle from '../components/SectionTitle';
import { COMPANY } from '../utils/constants';

// Local team photos from src/assets/images/
import akhileshPhoto from '../assets/images/Akhilesh.jpeg';
import ramPrasadPhoto from '../assets/images/Ram.png';
import premPhoto from '../assets/images/Prem.jpg';
import sushilPhoto from '../assets/images/Sushil.jpg'; // Matches Sushil.jpg exactly

// Local placeholder replacements
import image1 from '../assets/images/image1.jpg';
import image2 from '../assets/images/image2.jpg';

const VALUES = [
  { icon: Target, title: 'Our Mission', text: 'To craft functional, beautiful spaces that exceed client expectations through quality craftsmanship and honest communication.' },
  { icon: Eye, title: 'Our Vision', text: 'To be the most trusted construction and interior design partner in Maharashtra, known for reliability and design excellence.' },
  { icon: Award, title: 'Our Values', text: 'Integrity, quality, transparency, and a relentless focus on client satisfaction guide every project we undertake.' },
  { icon: Users, title: 'Our Team', text: 'A dedicated team of architects, engineers, designers, and project managers working in close collaboration with every client.' },
];

const TEAM = [
  { name: COMPANY.president || 'Akhilesh Yadav', role: 'President & Founder', image: akhileshPhoto },
  { name: 'Ram Prasad Yadav', role: 'Construction Manager', image: ramPrasadPhoto },
  { name: 'Prem Waghmare', role: 'Chief Interior Architect', image: premPhoto },
  { name: 'Sushil', role: 'Architect', image: sushilPhoto },
];

const About = () => (
  <>
    <SEO title={`About Us | ${COMPANY.name}`} description={`Learn about ${COMPANY.name}, a premium construction and interior design company based in Pune, led by President ${COMPANY.president}.`} />
    <PageHeader
      subtitle="Who We Are"
      title={`About ${COMPANY.name}`}
      bgImage={image1}
    />

    <section className="section-padding bg-white dark:bg-charcoal-950">
      <div className="container-custom grid md:grid-cols-2 gap-12 items-center">
        <motion.img
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          src={image2}
          alt="Our story"
          className="rounded-2xl shadow-xl w-full h-[420px] object-cover"
        />
        <div>
          <span className="section-tag">Our Story</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal-900 dark:text-white mb-5">
            Over a Decade of Building Excellence
          </h2>
          <p className="text-charcoal-500 dark:text-charcoal-400 mb-4 leading-relaxed">
            Founded in Pune, Maharashtra, {COMPANY.name} began with a simple belief: that great spaces are
            built on great relationships. Under the leadership of President {COMPANY.president}, we have
            grown from a small residential contractor into a full-service construction and interior design
            studio serving clients across Maharashtra.
          </p>
          <p className="text-charcoal-500 dark:text-charcoal-400 leading-relaxed">
            Today, our portfolio spans luxury villas, commercial complexes, and bespoke interiors — each
            project reflecting our commitment to craftsmanship, transparency, and timely delivery.
          </p>
        </div>
      </div>
    </section>

    <section className="section-padding bg-charcoal-50 dark:bg-charcoal-900">
      <div className="container-custom">
        <SectionTitle tag={`Why ${COMPANY.name}`} title="Mission, Vision & Values" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-hover bg-white dark:bg-charcoal-800 rounded-2xl p-8 border border-charcoal-100 dark:border-charcoal-700 text-center"
            >
              <div className="w-14 h-14 mx-auto rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-5">
                <v.icon size={26} className="text-amber-600" />
              </div>
              <h3 className="font-semibold text-charcoal-900 dark:text-white mb-2">{v.title}</h3>
              <p className="text-sm text-charcoal-500 dark:text-charcoal-400">{v.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="section-padding bg-white dark:bg-charcoal-950">
      <div className="container-custom">
        <SectionTitle tag="Meet The Team" title="The People Behind Our Projects" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center group"
            >
              <div className="rounded-2xl overflow-hidden mb-4 shadow-lg bg-charcoal-100 dark:bg-charcoal-800">
                <img 
                  src={m.image} 
                  alt={m.name} 
                  className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500" 
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=f59e0b&color=fff&size=400`;
                  }}
                />
              </div>
              <h3 className="font-semibold text-charcoal-900 dark:text-white">{m.name}</h3>
              <p className="text-sm text-amber-600">{m.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default About;