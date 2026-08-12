import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Lock, UserPlus } from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { Spinner } from '../components/Loader';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import GoogleSignInButton from '../components/GoogleSignInButton';

const CustomerRegister = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { register: createAccount, isAuthenticated } = useCustomerAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/account" replace />;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await createAccount(data);
      toast.success('Account created! Welcome to PrimeInfraStudio.');
      navigate('/account');
    } catch (err) {
      toast.error(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Create Account" description="Create a free PrimeInfraStudio account to track your quote requests and messages." />
      <PageHeader subtitle="Join Us" title="Create Your Account" bgImage="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600" />

      <section className="section-padding bg-white dark:bg-charcoal-950">
        <div className="container-custom max-w-md">
          <div className="bg-charcoal-50 dark:bg-charcoal-900 rounded-2xl p-8 border border-charcoal-100 dark:border-charcoal-800">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="text-sm text-charcoal-600 dark:text-charcoal-300 mb-1 block">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
                  <input {...register('name', { required: 'Name is required' })} placeholder="John Doe" className="input-field pl-10" />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="text-sm text-charcoal-600 dark:text-charcoal-300 mb-1 block">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
                  <input
                    {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
                    placeholder="you@example.com"
                    className="input-field pl-10"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="text-sm text-charcoal-600 dark:text-charcoal-300 mb-1 block">Phone Number</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
                  <input {...register('phone')} placeholder="+91 XXXXXXXXXX" className="input-field pl-10" />
                </div>
              </div>
              <div>
                <label className="text-sm text-charcoal-600 dark:text-charcoal-300 mb-1 block">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
                  <input
                    type="password"
                    {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
                    placeholder="At least 6 characters"
                    className="input-field pl-10"
                  />
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
                {loading ? <Spinner size={18} /> : <>Create Account <UserPlus size={16} /></>}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-charcoal-200 dark:bg-charcoal-700" />
              <span className="text-xs text-charcoal-400 uppercase tracking-widest">Or</span>
              <div className="flex-1 h-px bg-charcoal-200 dark:bg-charcoal-700" />
            </div>

            <GoogleSignInButton label="signup_with" />
            <p className="text-center text-sm text-charcoal-500 dark:text-charcoal-400 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-amber-600 font-medium hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default CustomerRegister;
