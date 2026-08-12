import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Send, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import { Spinner } from '../components/Loader';
import customerApi from '../utils/customerApi';
import { useCustomerAuth } from '../context/CustomerAuthContext';

const PROJECT_TYPES = ['Residential Construction', 'Commercial Construction', 'Interior Design', 'Renovation', 'Other'];
const BUDGET_RANGES = ['Under 10 Lakh', '10-25 Lakh', '25-50 Lakh', '50 Lakh - 1 Crore', 'Above 1 Crore'];

const GetQuote = () => {
  const { customer } = useCustomerAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { name: customer?.name || '', email: customer?.email || '', phone: customer?.phone || '' },
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (customer) {
      reset({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
      });
    }
  }, [customer, reset]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      // Uses the customer-aware axios instance so that if the visitor is
      // logged in, their JWT is sent along and the backend links this quote
      // to their account (see attachCustomerIfPresent middleware). Works
      // fine for guests too - the token header is simply absent then.
      await customerApi.post('/quotes', data);
      setSuccess(true);
      reset();
      toast.success('Quote request submitted! Check your email for a summary PDF.');
    } catch (err) {
      toast.error(err.message || 'Failed to submit quote request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Get a Free Quote" description="Request a free, no-obligation quote from PrimeInfraStudio for your construction or interior design project." />
      <PageHeader subtitle="Start Your Project" title="Get a Free Quote" bgImage="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600" />

      <section className="section-padding bg-white dark:bg-charcoal-950">
        <div className="container-custom max-w-3xl">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center bg-charcoal-50 dark:bg-charcoal-900 rounded-2xl p-12 border border-charcoal-100 dark:border-charcoal-800"
            >
              <CheckCircle2 size={56} className="text-amber-600 mx-auto mb-4" />
              <h2 className="text-2xl font-display font-bold text-charcoal-900 dark:text-white mb-3">Thank You!</h2>
              <p className="text-charcoal-500 dark:text-charcoal-400 mb-6">
                Your quote request has been received. Our team will contact you within 24-48 hours, and a summary
                PDF has been sent to your email.
              </p>
              <button onClick={() => setSuccess(false)} className="btn-primary">Submit Another Request</button>
              {customer && (
                <a href="/account" className="block mt-4 text-sm text-amber-600 hover:underline">
                  View this request in My Account →
                </a>
              )}
            </motion.div>
          ) : (
            <div className="bg-charcoal-50 dark:bg-charcoal-900 rounded-2xl p-8 md:p-10 border border-charcoal-100 dark:border-charcoal-800">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm text-charcoal-600 dark:text-charcoal-300 mb-1 block">Full Name *</label>
                    <input {...register('name', { required: 'Name is required' })} placeholder="John Doe" className="input-field" />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm text-charcoal-600 dark:text-charcoal-300 mb-1 block">Email Address *</label>
                    <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} placeholder="you@example.com" className="input-field" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm text-charcoal-600 dark:text-charcoal-300 mb-1 block">Phone Number *</label>
                    <input {...register('phone', { required: 'Phone number is required' })} placeholder="+91 XXXXXXXXXX" className="input-field" />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm text-charcoal-600 dark:text-charcoal-300 mb-1 block">Project Type *</label>
                    <select {...register('projectType', { required: 'Please select a project type' })} className="input-field">
                      <option value="">Select an option</option>
                      {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {errors.projectType && <p className="text-red-500 text-xs mt-1">{errors.projectType.message}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm text-charcoal-600 dark:text-charcoal-300 mb-1 block">Project Location *</label>
                    <input {...register('location', { required: 'Location is required' })} placeholder="e.g. Baner, Pune" className="input-field" />
                    {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm text-charcoal-600 dark:text-charcoal-300 mb-1 block">Area (approx.)</label>
                    <input {...register('area')} placeholder="e.g. 2000 sq.ft" className="input-field" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm text-charcoal-600 dark:text-charcoal-300 mb-1 block">Budget Range</label>
                    <select {...register('budgetRange')} className="input-field">
                      <option value="">Select a range</option>
                      {BUDGET_RANGES.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-charcoal-600 dark:text-charcoal-300 mb-1 block">Preferred Timeline</label>
                    <input {...register('timeline')} placeholder="e.g. Within 3 months" className="input-field" />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-charcoal-600 dark:text-charcoal-300 mb-1 block">Additional Requirements</label>
                  <textarea {...register('message')} rows={4} placeholder="Tell us more about your project..." className="input-field resize-none" />
                </div>

                <button type="submit" disabled={submitting} className="btn-primary w-full justify-center disabled:opacity-60">
                  {submitting ? <Spinner size={18} /> : <>Submit Quote Request <Send size={16} /></>}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default GetQuote;
