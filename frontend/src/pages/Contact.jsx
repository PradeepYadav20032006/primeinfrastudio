import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import { Spinner } from '../components/Loader';
import customerApi from '../utils/customerApi';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { COMPANY } from '../utils/constants';

// Local images
import image3 from '../assets/images/image3.jpg';

const Contact = () => {
  const { customer } = useCustomerAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { name: customer?.name || '', email: customer?.email || '', phone: customer?.phone || '' },
  });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      // customerApi attaches the logged-in customer's JWT (if any) so the
      // backend can link this message to their account automatically.
      await customerApi.post('/contact', data);
      toast.success("Message sent! We'll get back to you within 24 hours.");
      reset();
    } catch (err) {
      toast.error(err.message || 'Failed to send message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Contact Us" description="Get in touch with PrimeInfraStudio, Pune. Call, email, or visit our office to discuss your construction or interior design project." />
      <PageHeader subtitle="Get In Touch" title="Contact Us" bgImage={image3} />

      <section className="section-padding bg-white dark:bg-charcoal-950">
        <div className="container-custom grid lg:grid-cols-3 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {[
              { icon: MapPin, title: 'Our Office', text: COMPANY.address },
              { icon: Phone, title: 'Call Us', text: COMPANY.phone, href: `tel:${COMPANY.phoneRaw}` },
              { icon: Mail, title: 'Email Us', text: COMPANY.email, href: `mailto:${COMPANY.email}` },
              { icon: Clock, title: 'Working Hours', text: 'Mon - Sat: 9:00 AM - 7:00 PM' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 bg-charcoal-50 dark:bg-charcoal-900 rounded-2xl p-6 border border-charcoal-100 dark:border-charcoal-800">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                  <item.icon size={22} className="text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal-900 dark:text-white mb-1">{item.title}</h3>
                  {item.href ? (
                    <a href={item.href} className="text-sm text-charcoal-500 dark:text-charcoal-400 hover:text-amber-600">{item.text}</a>
                  ) : (
                    <p className="text-sm text-charcoal-500 dark:text-charcoal-400">{item.text}</p>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-charcoal-50 dark:bg-charcoal-900 rounded-2xl p-8 border border-charcoal-100 dark:border-charcoal-800"
          >
            <h2 className="text-2xl font-display font-bold text-charcoal-900 dark:text-white mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <input {...register('name', { required: 'Name is required' })} placeholder="Your Name *" className="input-field" />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} placeholder="Your Email *" className="input-field" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <input {...register('phone')} placeholder="Phone Number" className="input-field" />
                <input {...register('subject')} placeholder="Subject" className="input-field" />
              </div>
              <div>
                <textarea {...register('message', { required: 'Message is required' })} rows={5} placeholder="Your Message *" className="input-field resize-none" />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>
              <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
                {submitting ? <Spinner size={18} /> : <>Send Message <Send size={16} /></>}
              </button>
            </form>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="container-custom mt-12"
        >
          <div className="rounded-2xl overflow-hidden shadow-xl h-96 border border-charcoal-100 dark:border-charcoal-800">
            <iframe
              title="PrimeInfraStudio office location"
              src={COMPANY.mapEmbedSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default Contact;
