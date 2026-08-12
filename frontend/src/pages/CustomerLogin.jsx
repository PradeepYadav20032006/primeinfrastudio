import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { Spinner } from '../components/Loader';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import GoogleSignInButton from '../components/GoogleSignInButton';

const CustomerLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, isAuthenticated } = useCustomerAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/account" replace />;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      navigate('/account');
    } catch (err) {
      toast.error(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Login" description="Log in to your PrimeInfraStudio account to track your quote requests and messages." />
      <PageHeader subtitle="Welcome Back" title="Customer Login" bgImage="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600" />

      <section className="section-padding bg-white dark:bg-charcoal-950">
        <div className="container-custom max-w-md">
          <div className="bg-charcoal-50 dark:bg-charcoal-900 rounded-2xl p-8 border border-charcoal-100 dark:border-charcoal-800">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="text-sm text-charcoal-600 dark:text-charcoal-300 mb-1 block">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
                  <input
                    {...register('email', { required: 'Email is required' })}
                    placeholder="you@example.com"
                    className="input-field pl-10"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="text-sm text-charcoal-600 dark:text-charcoal-300 mb-1 block">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
                  <input
                    type="password"
                    {...register('password', { required: 'Password is required' })}
                    placeholder="••••••••"
                    className="input-field pl-10"
                  />
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
                {loading ? <Spinner size={18} /> : <>Sign In <LogIn size={16} /></>}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-charcoal-200 dark:bg-charcoal-700" />
              <span className="text-xs text-charcoal-400 uppercase tracking-widest">Or</span>
              <div className="flex-1 h-px bg-charcoal-200 dark:bg-charcoal-700" />
            </div>

            <GoogleSignInButton label="signin_with" />
            <p className="text-center text-sm text-charcoal-500 dark:text-charcoal-400 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-amber-600 font-medium hover:underline">Create one</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default CustomerLogin;
