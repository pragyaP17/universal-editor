import { decorateIcons } from '../../scripts/aem.js';

export default function decorate(block) {
  console.warn('agreement-header block loaded');

  // Check if we have the expected DOM structure with ul/li elements
  const existingList = block.querySelector('ul');
  if (existingList) {
    // If we already have a navigation list, just wrap it properly
    const wrapper = document.createElement('div');
    wrapper.className = 'agreement-header-block';

    // Create left side container
    const left = document.createElement('div');
    left.className = 'agreement-left';

    // Desktop navigation - move the existing list
    const desktopRow = document.createElement('div');
    desktopRow.className = 'agreement-desktop';
    desktopRow.appendChild(existingList.cloneNode(true));

    // Mobile navigation toggle
    const mobileRow = document.createElement('div');
    mobileRow.className = 'agreement-mobile';

    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'agreement-mobile-toggle';
    
    // Use the first navigation item's text as the toggle label
    const firstNavLink = existingList.querySelector('a');
    const toggleText = firstNavLink ? firstNavLink.textContent : 'Navigation';
    mobileToggle.innerHTML = `<span class="text">${toggleText}</span>`;

    mobileRow.appendChild(mobileToggle);

    // Create mobile dropdown with all navigation items
    const dropdown = document.createElement('div');
    dropdown.className = 'agreement-dropdown';
    
    const navLinks = existingList.querySelectorAll('a');
    navLinks.forEach(link => {
      const dropdownItem = document.createElement('a');
      dropdownItem.className = 'dropdown-item';
      dropdownItem.href = link.href;
      dropdownItem.title = link.title;
      dropdownItem.textContent = link.textContent;
      dropdown.appendChild(dropdownItem);
    });

    // Add elements to left container
    left.appendChild(desktopRow);
    left.appendChild(mobileRow);
    left.appendChild(dropdown);

    // Create right side for button
    const right = document.createElement('div');
    right.className = 'agreement-right';
    
    // Look for the "Stay Informed" button
    const stayInformedBtn = block.querySelector('a.button.primary');
    if (stayInformedBtn) {
      right.appendChild(stayInformedBtn.cloneNode(true));
    }

    // Build final structure
    wrapper.appendChild(left);
    wrapper.appendChild(right);

    // Replace block content
    block.textContent = '';
    block.appendChild(wrapper);

    // Mobile dropdown functionality
    mobileToggle.addEventListener('click', () => {
      dropdown.classList.toggle('open');
      mobileToggle.classList.toggle('expanded');
    });

    // Close dropdown when clicking any dropdown item
    dropdown.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        dropdown.classList.remove('open');
        mobileToggle.classList.remove('expanded');
      });
    });

  } else {
    // Fallback to original behavior if no list found
    const links = block.querySelectorAll('a.button');
    if (links.length < 2) return;

    const agreementsBtn = links[0];
    const pdfBtn = links[1];

    const wrapper = document.createElement('div');
    wrapper.className = 'agreement-header-block';

    const left = document.createElement('div');
    left.className = 'agreement-left';

    const desktopRow = document.createElement('div');
    desktopRow.className = 'agreement-desktop';

    const desktopLink = document.createElement('a');
    desktopLink.className = 'button secondary';
    desktopLink.href = agreementsBtn.href;
    desktopLink.title = agreementsBtn.title;
    desktopLink.textContent = agreementsBtn.textContent;

    desktopRow.appendChild(desktopLink);

    const mobileRow = document.createElement('div');
    mobileRow.className = 'agreement-mobile';

    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'agreement-mobile-toggle';
    mobileToggle.innerHTML = `<span class="text">${agreementsBtn.textContent}</span>`;
    mobileRow.appendChild(mobileToggle);

    const dropdown = document.createElement('div');
    dropdown.className = 'agreement-dropdown';
    dropdown.innerHTML = `
      <a href="${agreementsBtn.href}" class="dropdown-item">${agreementsBtn.textContent}</a>
    `;

    left.appendChild(desktopRow);
    left.appendChild(mobileRow);
    left.appendChild(dropdown);

    const right = document.createElement('div');
    right.className = 'agreement-right';

    const pdfLink = document.createElement('a');
    pdfLink.className = 'button primary';
    pdfLink.href = pdfBtn.href;
    pdfLink.title = pdfBtn.title;
    pdfLink.textContent = pdfBtn.textContent;
    pdfLink.setAttribute('role', 'button');

    right.appendChild(pdfLink);

    wrapper.appendChild(left);
    wrapper.appendChild(right);

    block.textContent = '';
    block.appendChild(wrapper);

    mobileToggle.addEventListener('click', () => {
      dropdown.classList.toggle('open');
      mobileToggle.classList.toggle('expanded');
    });

    const dropdownItem = dropdown.querySelector('.dropdown-item');
    if (dropdownItem) {
      dropdownItem.addEventListener('click', () => {
        dropdown.classList.remove('open');
        mobileToggle.classList.remove('expanded');
      });
    }
  }

  // Decorate icons after DOM is built
  decorateIcons(block);
}
