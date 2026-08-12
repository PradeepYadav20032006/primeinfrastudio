import { useEffect } from 'react';

// Lightweight SEO helper: updates document title & meta description per page
// without needing an extra dependency like react-helmet.
const SEO = ({ title, description }) => {
  useEffect(() => {
    if (title) document.title = `${title} | PrimeInfraStudio`;
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.name = 'description';
        document.head.appendChild(tag);
      }
      tag.content = description;
    }
  }, [title, description]);

  return null;
};

export default SEO;
