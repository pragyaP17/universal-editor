import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Adds aria-labels to links based on their href for accessibility
 * @param {Element} footer The footer element
 */
function addAccessibilityLabels(footer) {
  if (!footer) return;
  
  const socialMedia = {
    'facebook.com': 'Facebook',
    'instagram.com': 'Instagram',
    'linkedin.com': 'LinkedIn',
    'twitter.com': 'Twitter',
    'x.com': 'X (formerly Twitter)',
    'youtube.com': 'YouTube',
  };

  // Only query links without text content for performance
  const links = footer.querySelectorAll('a:not([aria-label]):not([aria-labelledby])');
  
  links.forEach((link) => {
    // Quick exit if link has text
    if (link.textContent?.trim()) return;

    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    
    // Check social media (most common case for footer)
    for (const [domain, label] of Object.entries(socialMedia)) {
      if (href.includes(domain)) {
        link.setAttribute('aria-label', label);
        return;
      }
    }
    
    // Check icon class
    const icon = link.querySelector('.icon');
    if (icon) {
      const iconClass = [...icon.classList].find((c) => c.startsWith('icon-'));
      if (iconClass) {
        const name = iconClass.slice(5).replace(/-/g, ' ');
        link.setAttribute('aria-label', name.charAt(0).toUpperCase() + name.slice(1));
        return;
      }
    }
    
    // Check image alt
    const img = link.querySelector('img[alt]');
    if (img?.alt) {
      link.setAttribute('aria-label', img.alt);
    }
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Add accessibility labels to social media and icon-only links
  addAccessibilityLabels(footer);

  block.append(footer);
}
