import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Sun, Moon, Phone, UserCircle2 } from 'lucide-react';
import { NAV_LINKS, COMPANY } from '../utils/constants';
import { useTheme } from '../context/ThemeContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const { theme, toggleTheme } = useTheme();
  const { customer, isAuthenticated } = useCustomerAuth();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? 'bg-white/95 dark:bg-charcoal-950/95 backdrop-blur-md shadow-md py-3 border-charcoal-100 dark:border-charcoal-800'
          : 'bg-white/90 dark:bg-charcoal-950/90 backdrop-blur-sm py-4 border-charcoal-100/50 dark:border-charcoal-800/50'
      }`}
    >
      <nav className="w-full px-6 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Logo with explicit Light/Dark mode contrast */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-display font-bold text-charcoal-900 dark:text-white transition-colors">
            Prime<span className="text-amber-500">Infra</span>Studio
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center">
          {NAV_LINKS.map((link) => (
            <div
              key={link.label}
              className="relative"
              onMouseEnter={() => link.dropdown && setOpenDropdown(link.label)}
              onMouseLeave={() => link.dropdown && setOpenDropdown(null)}
            >
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'text-amber-500 font-semibold'
                      : 'text-charcoal-700 dark:text-white hover:text-amber-500 dark:hover:text-amber-400'
                  }`
                }
              >
                {link.label}
                {link.dropdown && <ChevronDown size={14} />}
              </NavLink>
              
              <AnimatePresence>
                {link.dropdown && openDropdown === link.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-charcoal-900 rounded-lg shadow-xl border border-charcoal-100 dark:border-charcoal-800 py-2"
                  >
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.label}
                        to={item.path}
                        className="block px-4 py-2.5 text-sm text-charcoal-700 dark:text-charcoal-200 hover:bg-amber-50 dark:hover:bg-charcoal-800 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Action Controls */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-6">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="p-2.5 rounded-full bg-charcoal-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-amber-400 hover:bg-charcoal-200 dark:hover:bg-charcoal-700 transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isAuthenticated ? (
            <Link to="/account" className="flex items-center gap-1.5 text-sm font-medium text-charcoal-700 dark:text-white hover:text-amber-500 transition-colors">
              <UserCircle2 size={18} /> {customer?.name?.split(' ')[0] || 'My Account'}
            </Link>
          ) : (
            <Link to="/login" className="flex items-center gap-1.5 text-sm font-medium text-charcoal-700 dark:text-white hover:text-amber-500 transition-colors">
              Login
            </Link>
          )}

          <Link to="/get-quote" className="btn-primary text-sm px-5 py-2.5 whitespace-nowrap shrink-0">
            Get a Quote
          </Link>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="p-2 rounded-full bg-charcoal-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-amber-400"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            className="p-2 text-charcoal-900 dark:text-white"
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden bg-white dark:bg-charcoal-950 border-t border-charcoal-100 dark:border-charcoal-800 mt-4"
          >
            <div className="container-custom py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <div key={link.label}>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                    className="w-full"
                  >
                    <NavLink
                      to={link.path}
                      className="flex items-center justify-between py-3 text-charcoal-800 dark:text-white font-medium"
                    >
                      {link.label}
                      {link.dropdown && <ChevronDown size={16} />}
                    </NavLink>
                  </button>
                  {link.dropdown && openDropdown === link.label && (
                    <div className="pl-4 pb-2 flex flex-col gap-1">
                      {link.dropdown.map((item) => (
                        <Link key={item.label} to={item.path} className="py-2 text-sm text-charcoal-600 dark:text-charcoal-200">
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link to="/get-quote" className="btn-primary justify-center mt-3">
                Get a Quote
              </Link>
              {isAuthenticated ? (
                <Link to="/account" className="flex items-center justify-center gap-2 py-3 text-charcoal-700 dark:text-white font-medium">
                  <UserCircle2 size={18} /> My Account
                </Link>
              ) : (
                <Link to="/login" className="flex items-center justify-center gap-2 py-3 text-charcoal-700 dark:text-white font-medium">
                  <UserCircle2 size={18} /> Login / Register
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;