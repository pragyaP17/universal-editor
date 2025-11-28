/* eslint-disable */
import { isMobile } from '../../scripts/scripts.js';

export default async function decorate(block) {
  // Extract content from the block
  const [textContent, assetContent] = block.firstElementChild.children;
  
  if (!textContent || !assetContent) {
    console.warn('Banner block requires both text content and asset content');
    return;
  }
  
  textContent.classList.add('banner-text-content');
  assetContent.classList.add('asset-content');
  
  // Structure to maintain consistency with nested blocks approach
  const hasCorrectStructure = 
    textContent.firstElementChild && 
    textContent.firstElementChild.tagName === 'P' && 
    textContent.firstElementChild.firstElementChild && 
    textContent.firstElementChild.firstElementChild.tagName === 'DIV';
  
  if (!hasCorrectStructure) {
    const contentDiv = document.createElement('div');
    while (textContent.firstChild) {
      contentDiv.appendChild(textContent.firstChild);
    }
    const pTag = document.createElement('p');
    pTag.appendChild(contentDiv);
    textContent.appendChild(pTag);
  }

  // Add enhanced visual effects for images
  const images = assetContent.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('load', () => {
      // Add subtle animation on load
      img.style.opacity = '0';
      img.style.transform = 'translateY(20px)';
      img.style.transition = 'all 0.6s ease-out';
      
      setTimeout(() => {
        img.style.opacity = '1';
        img.style.transform = 'translateY(0)';
      }, 100);
    });

    // Add loading state handling
    if (img.complete && img.naturalHeight !== 0) {
      // Image is already loaded
      img.style.opacity = '1';
    }
  });

  // Add intersection observer for scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('banner-visible');
        
        // Animate text elements
        const headings = entry.target.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach((heading, index) => {
          setTimeout(() => {
            heading.style.transform = 'translateY(0)';
            heading.style.opacity = '1';
          }, index * 200);
        });

        // Animate paragraphs
        const paragraphs = entry.target.querySelectorAll('p:not(.wrapper)');
        paragraphs.forEach((p, index) => {
          setTimeout(() => {
            p.style.transform = 'translateY(0)';
            p.style.opacity = '1';
          }, (headings.length + index) * 200);
        });
      }
    });
  }, { threshold: 0.1 });

  // Initialize animation styles
  const headings = textContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const paragraphs = textContent.querySelectorAll('p:not(.wrapper)');
  
  [...headings, ...paragraphs].forEach(element => {
    element.style.transform = 'translateY(30px)';
    element.style.opacity = '0';
    element.style.transition = 'all 0.6s ease-out';
  });

  observer.observe(block);

  // Add enhanced link interactions
  const links = textContent.querySelectorAll('a');
  links.forEach(link => {
    // Add ripple effect on click
    link.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
      const rect = link.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(118, 185, 0, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      `;
      
      link.style.position = 'relative';
      link.style.overflow = 'hidden';
      link.appendChild(ripple);
      
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 600);
    });
  });

  // Add CSS for ripple animation
  if (!document.querySelector('#banner-animations')) {
    const style = document.createElement('style');
    style.id = 'banner-animations';
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
      
      .banner-visible {
        animation: fadeInUp 0.6s ease-out;
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
  }

  console.log('Enhanced banner block decorated successfully');
}
