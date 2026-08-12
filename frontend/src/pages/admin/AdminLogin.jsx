import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Lock, Mail, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from '../../components/Loader';
import SEO from '../../components/SEO';

const AdminLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Admin Login" />
      <div className="min-h-screen flex items-center justify-center bg-charcoal-950 px-4">
        <div className="w-full max-w-md bg-charcoal-900 rounded-2xl p-8 md:p-10 border border-charcoal-800">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-display font-bold text-white">
              Prime<span className="text-amber-500">Infra</span>Studio
            </h1>
            <p className="text-charcoal-400 text-sm mt-1">Admin Dashboard Login</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-500" />
                <input
                  {...register('email', { required: 'Email is required' })}
                  placeholder="Email address"
                  className="w-full bg-charcoal-800 border border-charcoal-700 rounded-md pl-10 pr-4 py-3 text-white placeholder-charcoal-500 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-500" />
                <input
                  type="password"
                  {...register('password', { required: 'Password is required' })}
                  placeholder="Password"
                  className="w-full bg-charcoal-800 border border-charcoal-700 rounded-md pl-10 pr-4 py-3 text-white placeholder-charcoal-500 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
              {loading ? <Spinner size={18} /> : <>Sign In <LogIn size={16} /></>}
            </button>
          </form>
          <p className="text-center text-xs text-charcoal-500 mt-6">
            Default credentials are set via ADMIN_EMAIL / ADMIN_PASSWORD in your backend .env,
            created by running <code className="text-amber-500">npm run seed</code>.
          </p>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
