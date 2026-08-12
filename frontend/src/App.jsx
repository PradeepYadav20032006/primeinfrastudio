import { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTopButton from './components/ScrollToTopButton';
import ChatbotWidget from './components/ChatbotWidget';
import Loader from './components/Loader';
import ProtectedRoute from './components/ProtectedRoute';
import CustomerProtectedRoute from './components/CustomerProtectedRoute';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const Careers = lazy(() => import('./pages/Careers'));
const Contact = lazy(() => import('./pages/Contact'));
const GetQuote = lazy(() => import('./pages/GetQuote'));
const CostEstimator = lazy(() => import('./pages/CostEstimator'));
const CustomerLogin = lazy(() => import('./pages/CustomerLogin'));
const CustomerRegister = lazy(() => import('./pages/CustomerRegister'));
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'));
const AdminServices = lazy(() => import('./pages/admin/AdminServices'));
const AdminGallery = lazy(() => import('./pages/admin/AdminGallery'));
const AdminBlogs = lazy(() => import('./pages/admin/AdminBlogs'));
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials'));
const AdminQuotes = lazy(() => import('./pages/admin/AdminQuotes'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));
const AdminCareers = lazy(() => import('./pages/admin/AdminCareers'));
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile'));

const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main className="min-h-screen">{children}</main>
    <Footer />
    <WhatsAppButton />
    <ChatbotWidget />
    <ScrollToTopButton />
  </>
);

function App() {
  const location = useLocation();
  const [initialLoad, setInitialLoad] = useState(true);
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const t = setTimeout(() => setInitialLoad(false), 700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (initialLoad) return <Loader />;

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#1F2937', color: '#fff', fontSize: '14px' },
          success: { iconTheme: { primary: '#D97706', secondary: '#fff' } },
        }}
      />
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Admin routes (no public navbar/footer) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="blogs" element={<AdminBlogs />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="quotes" element={<AdminQuotes />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="careers" element={<AdminCareers />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>

          {/* Public site */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
          <Route path="/projects" element={<PublicLayout><Projects /></PublicLayout>} />
          <Route path="/projects/:slug" element={<PublicLayout><ProjectDetail /></PublicLayout>} />
          <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
          <Route path="/testimonials" element={<PublicLayout><Testimonials /></PublicLayout>} />
          <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
          <Route path="/blog/:slug" element={<PublicLayout><BlogDetail /></PublicLayout>} />
          <Route path="/careers" element={<PublicLayout><Careers /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/get-quote" element={<PublicLayout><GetQuote /></PublicLayout>} />
          <Route path="/cost-estimator" element={<PublicLayout><CostEstimator /></PublicLayout>} />
          <Route path="/login" element={<PublicLayout><CustomerLogin /></PublicLayout>} />
          <Route path="/register" element={<PublicLayout><CustomerRegister /></PublicLayout>} />
          <Route
            path="/account"
            element={
              <PublicLayout>
                <CustomerProtectedRoute>
                  <CustomerDashboard />
                </CustomerProtectedRoute>
              </PublicLayout>
            }
          />
          <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
