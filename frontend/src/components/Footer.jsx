import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Send, MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';
import { COMPANY } from '../utils/constants';

const SOCIAL_LINKS = [
  { 
    Icon: Facebook, 
    url: COMPANY.social.facebook || 'https://facebook.com', 
    label: 'Facebook' 
  },
  { 
    Icon: Instagram, 
    url: COMPANY.social.instagram || 'https://instagram.com', 
    label: 'Instagram' 
  },
  { 
    Icon: Linkedin, 
    url: COMPANY.social.linkedin || 'https://linkedin.com', 
    label: 'LinkedIn' 
  },
  { 
    Icon: Send, 
    url: `https://t.me/+919369737080`, // Direct Telegram link to the number
    label: 'Telegram' 
  },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal-950 text-charcoal-300 pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="text-2xl font-display font-bold text-white mb-3">
              Prime<span className="text-amber-500">Infra</span>Studio
            </h3>
            <p className="text-sm leading-relaxed mb-4">{COMPANY.tagline}</p>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((item) => (
                <a 
                  key={item.label} 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={`${COMPANY.name} on ${item.label}`} 
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-charcoal-800 hover:bg-amber-600 text-white transition-colors"
                >
                  <item.Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                ['About Us', '/about'],
                ['Our Services', '/services'],
                ['Projects', '/projects'],
                ['Gallery', '/gallery'],
                ['Blog', '/blog'],
                ['Careers', '/careers'],
              ].map(([label, path]) => (
                <li key={label}>
                  <Link to={path} className="hover:text-amber-500 transition-colors flex items-center gap-1 group">
                    {label}
                    <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide">Our Services</h4>
            <ul className="space-y-2.5 text-sm">
              {['Residential Construction', 'Commercial Construction', 'Interior Design', 'Renovation & Remodeling'].map(
                (s) => (
                  <li key={s}>
                    <Link to="/services" className="hover:text-amber-500 transition-colors">
                      {s}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <span>{COMPANY.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-amber-500 shrink-0" />
                {/* Updated Phone Direct Click Link */}
                <a href="tel:+919369737080" className="hover:text-amber-500">+91 9369737080</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-amber-500 shrink-0" />
                <a href={`mailto:${COMPANY.email}`} className="hover:text-amber-500 break-all">{COMPANY.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-charcoal-800 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-charcoal-400">
          <p>© {year} {COMPANY.name}. All rights reserved.</p>
          <p>President: {COMPANY.president} · {COMPANY.office}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;