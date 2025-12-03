/**
 * Wraps the footer sections in a new div.
 */
function wrapFooterSections() {
  const footer = document.querySelector('.footer');
  if (!footer) return;

  const sections = footer.querySelectorAll('.section.page-footer-links, .section.page-footer-subscribe');
  if (sections.length > 0) {
    const wrapper = document.createElement('div');
    wrapper.className = 'page-footer-wrapper';
    
    // Move the sections into the new wrapper
    sections.forEach(section => {
      wrapper.appendChild(section);
    });

    // Add the new wrapper to the footer
    footer.querySelector(':scope > div').prepend(wrapper);
  }
}


function handleAccordion() {
  if (window.innerWidth < 1024) {
    const titles = document.querySelectorAll('.footer h1');
    titles.forEach((title) => {
      const list = title.nextElementSibling;
      if (list && list.tagName === 'DIV' && list.querySelector('ul')) {
        const ul = list.querySelector('ul');
        
        // Initially hide the list
        ul.classList.remove('active');
        title.classList.remove('active');

        title.addEventListener('click', () => {
          title.classList.toggle('active');
          ul.classList.toggle('active');
        });
      }
    });
  } else {
    // On desktop, ensure all lists are visible
    const lists = document.querySelectorAll('.footer ul');
    lists.forEach(list => {
      list.classList.add('active');
      list.style.maxHeight = 'none'; // Remove max-height for desktop
    });
  }
}

// Run on initial load
wrapFooterSections();
handleAccordion();

// Re-run on window resize
window.addEventListener('resize', handleAccordion);
