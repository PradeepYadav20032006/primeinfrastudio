import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, FolderKanban, Wrench, Image, Newspaper, MessageSquareQuote,
  FileText, Mail, Briefcase, UserCog, LogOut, ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Projects', path: '/admin/projects', icon: FolderKanban },
  { label: 'Services', path: '/admin/services', icon: Wrench },
  { label: 'Gallery', path: '/admin/gallery', icon: Image },
  { label: 'Blogs', path: '/admin/blogs', icon: Newspaper },
  { label: 'Testimonials', path: '/admin/testimonials', icon: MessageSquareQuote },
  { label: 'Quote Requests', path: '/admin/quotes', icon: FileText },
  { label: 'Messages', path: '/admin/messages', icon: Mail },
  { label: 'Career Applications', path: '/admin/careers', icon: Briefcase },
  { label: 'Profile Settings', path: '/admin/profile', icon: UserCog },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-charcoal-100 dark:bg-charcoal-950">
      <aside className="w-64 bg-charcoal-950 text-white flex flex-col shrink-0 fixed h-screen overflow-y-auto">
        <div className="p-6 border-b border-charcoal-800">
          <h1 className="text-lg font-display font-bold">
            Prime<span className="text-amber-500">Infra</span>Studio
          </h1>
          <p className="text-xs text-charcoal-400 mt-0.5">Admin Dashboard</p>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive ? 'bg-amber-600 text-white' : 'text-charcoal-300 hover:bg-charcoal-800'
                }`
              }
            >
              <item.icon size={18} /> {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-charcoal-800 space-y-2">
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2.5 rounded-md text-sm text-charcoal-300 hover:bg-charcoal-800">
            <ExternalLink size={18} /> View Site
          </a>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm text-red-400 hover:bg-charcoal-800">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 ml-64">
        <header className="bg-white dark:bg-charcoal-900 border-b border-charcoal-200 dark:border-charcoal-800 px-8 py-4 flex items-center justify-end">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-600 text-white flex items-center justify-center font-semibold text-sm">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="text-sm font-medium text-charcoal-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-charcoal-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </header>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
