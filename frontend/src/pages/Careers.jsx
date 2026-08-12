import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Briefcase, MapPin, Clock, UploadCloud, Send } from 'lucide-react';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import { Spinner } from '../components/Loader';
import api from '../utils/api';

const OPEN_POSITIONS = [
  { title: 'Site Engineer', type: 'Full-time', location: 'Pune, Maharashtra', experience: '2-5 years' },
  { title: 'Interior Designer', type: 'Full-time', location: 'Pune, Maharashtra', experience: '3-6 years' },
  { title: 'Project Manager - Construction', type: 'Full-time', location: 'Pune, Maharashtra', experience: '5-8 years' },
  { title: 'AutoCAD / 3D Visualizer', type: 'Full-time', location: 'Pune, Maharashtra', experience: '1-3 years' },
];

const Careers = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  const onSubmit = async (data) => {
    if (!resumeFile) {
      toast.error('Please attach your resume (PDF).');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, val]) => formData.append(key, val));
      formData.append('resume', resumeFile);
      await api.post('/careers', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Application submitted successfully! We will be in touch soon.');
      reset();
      setResumeFile(null);
    } catch (err) {
      toast.error(err.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Careers" description="Join the PrimeInfraStudio team. Explore current openings in construction and interior design in Pune." />
      <PageHeader subtitle="Join Our Team" title="Careers at PrimeInfraStudio" bgImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600" />

      <section className="section-padding bg-white dark:bg-charcoal-950">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-charcoal-900 dark:text-white mb-8 text-center">
            Current Openings
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 mb-20">
            {OPEN_POSITIONS.map((job, i) => (
              <motion.div
                key={job.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card-hover bg-charcoal-50 dark:bg-charcoal-900 rounded-2xl p-6 border border-charcoal-100 dark:border-charcoal-800"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                    <Briefcase size={22} className="text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal-900 dark:text-white mb-1">{job.title}</h3>
                    <div className="flex flex-wrap gap-3 text-xs text-charcoal-500 dark:text-charcoal-400">
                      <span className="flex items-center gap-1"><Clock size={12} /> {job.type}</span>
                      <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                      <span>{job.experience}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto bg-charcoal-50 dark:bg-charcoal-900 rounded-2xl p-8 md:p-10 border border-charcoal-100 dark:border-charcoal-800">
            <h2 className="text-2xl font-display font-bold text-charcoal-900 dark:text-white mb-6 text-center">
              Apply Now
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <input {...register('fullName', { required: 'Full name is required' })} placeholder="Full Name *" className="input-field" />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} placeholder="Email Address *" className="input-field" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <input {...register('phone', { required: 'Phone is required' })} placeholder="Phone Number *" className="input-field" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <select {...register('positionAppliedFor', { required: 'Please select a position' })} className="input-field">
                    <option value="">Select Position *</option>
                    {OPEN_POSITIONS.map((j) => <option key={j.title} value={j.title}>{j.title}</option>)}
                    <option value="Other">Other</option>
                  </select>
                  {errors.positionAppliedFor && <p className="text-red-500 text-xs mt-1">{errors.positionAppliedFor.message}</p>}
                </div>
              </div>
              <input type="number" {...register('experienceYears', { min: 0 })} placeholder="Years of Experience" className="input-field" />
              <textarea {...register('coverLetter')} rows={4} placeholder="Cover Letter (optional)" className="input-field resize-none" />

              <label className="flex items-center gap-3 border-2 border-dashed border-charcoal-300 dark:border-charcoal-700 rounded-md px-4 py-4 cursor-pointer hover:border-amber-600 transition-colors">
                <UploadCloud size={22} className="text-amber-600 shrink-0" />
                <span className="text-sm text-charcoal-500 dark:text-charcoal-400">
                  {resumeFile ? resumeFile.name : 'Upload Resume (PDF) *'}
                </span>
                <input type="file" accept=".pdf" className="hidden" onChange={(e) => setResumeFile(e.target.files[0])} />
              </label>

              <button type="submit" disabled={submitting} className="btn-primary w-full justify-center disabled:opacity-60">
                {submitting ? <Spinner size={18} /> : <>Submit Application <Send size={16} /></>}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Careers;
