import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Adds aria-labels to links based on their href for accessibility
 * @param {Element} footer The footer element
 */
function addAccessibilityLabels(footer) {
  const socialMediaMap = {
    'facebook.com': 'Facebook',
    'instagram.com': 'Instagram',
    'linkedin.com': 'LinkedIn',
    'twitter.com': 'Twitter',
    'x.com': 'X (Twitter)',
    'youtube.com': 'YouTube',
  };

  // Find all links in the footer
  const links = footer.querySelectorAll('a');
  links.forEach((link) => {
    // Skip if link already has aria-label or has visible text content
    if (link.getAttribute('aria-label') || (link.textContent && link.textContent.trim().length > 0)) {
      return;
    }

    const href = link.href || '';
    
    // Check if it's a social media link
    Object.keys(socialMediaMap).forEach((domain) => {
      if (href.includes(domain) && !link.getAttribute('aria-label')) {
        link.setAttribute('aria-label', socialMediaMap[domain]);
      }
    });
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
