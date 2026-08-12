export const COMPANY = {
  name: 'PrimeInfraStudio',
  president: 'Akhilesh Yadav',
  office: 'CRRR+PMP une, Maharashtra, India',
  address: 'CRRR+6M9 Pune, Maharashtra, India',
  phone: '+919369737080',
  phoneRaw: '+919369737080',
  email: 'primeinfrastructure.design@gmail.com',
  tagline: 'Crafting Spaces. Creating Experiences.',
  mapEmbedSrc:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60374.15!2d73.8567!3d18.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDMxJzEzLjQiTiA3M8KwNTEnMjQuMSJF!5e0!3m2!1sen!2sin!4v1700000000000',
  social: {
    facebook: 'https://www.facebook.com/profile.php?id=61591942978135',
    instagram: 'https://www.instagram.com/prime.infrastructure?igsh=ZXF5aGR0Z3JxN2o3',
    linkedin: 'https://www.linkedin.com/in/prime-infrastructure-2a6395422?utm_source=share_via&utm_content=profile&utm_medium=member_android',
   telegram: 'https://t.me/+919369737080',
  },
};

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  {
    label: 'Services',
    path: '/services',
    dropdown: [
      { label: 'Residential Construction', path: '/services#residential' },
      { label: 'Commercial Construction', path: '/services#commercial' },
      { label: 'Interior Design', path: '/services#interior' },
      { label: 'Renovation & Remodeling', path: '/services#renovation' },
    ],
  },
  { label: 'Projects', path: '/projects' },
  { label: 'Gallery', path: '/gallery' },
  {
    label: 'Company',
    path: '/blog',
    dropdown: [
      { label: 'Blog', path: '/blog' },
      { label: 'Testimonials', path: '/testimonials' },
      { label: 'Careers', path: '/careers' },
    ],
  },
  { label: 'Contact', path: '/contact' },
];
