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

  // Process text content to enhance styling
  const textElements = textContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
  textElements.forEach(heading => {
    heading.style.fontSize = '48px';
    heading.style.fontWeight = '700';
    heading.style.lineHeight = '1.1';
    heading.style.color = 'white';
    heading.style.marginBottom = '24px';
  });

  // Style paragraphs
  const paragraphs = textContent.querySelectorAll('p');
  paragraphs.forEach(p => {
    // Skip if it's the wrapper paragraph we created
    if (p.querySelector('div')) return;
    
    p.style.fontSize = '18px';
    p.style.lineHeight = '1.5';
    p.style.color = '#ccc';
    p.style.marginBottom = '32px';
  });

  // Style links
  const links = textContent.querySelectorAll('a');
  links.forEach(link => {
    link.style.color = '#76b900';
    link.style.textDecoration = 'none';
    link.style.fontWeight = '600';
    link.style.fontSize = '16px';
    
    // Add hover effects
    link.addEventListener('mouseenter', () => {
      link.style.color = '#8fcc19';
    });
    
    link.addEventListener('mouseleave', () => {
      link.style.color = '#76b900';
    });
  });

  // Ensure images are properly sized
  const images = assetContent.querySelectorAll('img');
  images.forEach(img => {
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.objectFit = 'contain';
    img.style.filter = 'brightness(1.1) contrast(1.1)';
  });

  // Handle responsive behavior
  if (isMobile()) {
    textElements.forEach(heading => {
      heading.style.fontSize = '28px';
    });
    
    paragraphs.forEach(p => {
      if (p.querySelector('div')) return;
      p.style.fontSize = '16px';
    });
  }

  // Add any dynamic functionality here if needed
  console.log('Banner block decorated successfully');
}
