import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calculator, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';

// Approximate per-sq.ft rates used purely to give visitors a ballpark estimate.
// Real quotes are always confirmed by the team via the Get a Quote form.
const RATES = {
  'Residential Construction': { Basic: 1500, Standard: 1800, Premium: 2400 },
  'Commercial Construction': { Basic: 1800, Standard: 2200, Premium: 2900 },
  'Interior Design': { Basic: 650, Standard: 950, Premium: 1500 },
  'Renovation': { Basic: 500, Standard: 700, Premium: 1100 },
};

const CostEstimator = () => {
  const [projectType, setProjectType] = useState('Residential Construction');
  const [area, setArea] = useState(1000);
  const [quality, setQuality] = useState('Standard');

  const estimate = useMemo(() => {
    const rate = RATES[projectType][quality];
    const total = rate * Number(area || 0);
    return { rate, total };
  }, [projectType, area, quality]);

  return (
    <>
      <SEO title="Cost Estimator" description="Get an instant ballpark cost estimate for your construction or interior design project with PrimeInfraStudio's free calculator." />
      <PageHeader subtitle="Plan Your Budget" title="Project Cost Estimator" bgImage="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600" />

      <section className="section-padding bg-white dark:bg-charcoal-950">
        <div className="container-custom max-w-3xl">
          <div className="bg-charcoal-50 dark:bg-charcoal-900 rounded-2xl p-8 md:p-10 border border-charcoal-100 dark:border-charcoal-800">
            <div className="flex items-center gap-3 mb-8">
              <Calculator className="text-amber-600" size={28} />
              <h2 className="text-xl font-display font-bold text-charcoal-900 dark:text-white">Instant Estimate Calculator</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm text-charcoal-600 dark:text-charcoal-300 mb-2 block">Project Type</label>
                <select value={projectType} onChange={(e) => setProjectType(e.target.value)} className="input-field">
                  {Object.keys(RATES).map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm text-charcoal-600 dark:text-charcoal-300 mb-2 block">
                  Built-up Area: <span className="font-semibold text-amber-600">{area} sq.ft</span>
                </label>
                <input
                  type="range"
                  min="200"
                  max="10000"
                  step="100"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full accent-amber-600"
                />
              </div>

              <div>
                <label className="text-sm text-charcoal-600 dark:text-charcoal-300 mb-2 block">Finish Quality</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Basic', 'Standard', 'Premium'].map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuality(q)}
                      className={`py-2.5 rounded-md text-sm font-medium transition-colors ${
                        quality === q ? 'bg-amber-600 text-white' : 'bg-white dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-200 border border-charcoal-200 dark:border-charcoal-700'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <motion.div
              key={estimate.total}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 bg-amber-600 rounded-2xl p-8 text-center text-white"
            >
              <p className="text-sm uppercase tracking-widest text-amber-100 mb-2">Estimated Cost</p>
              <p className="text-4xl md:text-5xl font-display font-bold">
                ₹{estimate.total.toLocaleString('en-IN')}
              </p>
              <p className="text-amber-100 text-sm mt-2">at ₹{estimate.rate}/sq.ft</p>
            </motion.div>

            <p className="text-xs text-charcoal-400 mt-4 text-center">
              This is a rough estimate for planning purposes only. Actual costs vary based on site conditions,
              material choices, and design complexity.
            </p>

            <div className="text-center mt-8">
              <Link to="/get-quote" className="btn-primary">
                Get an Accurate Quote <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CostEstimator;
