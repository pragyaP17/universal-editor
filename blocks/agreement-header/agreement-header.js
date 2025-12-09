import { decorateIcons } from '../../scripts/aem.js';

export default function decorate(block) {
  console.warn('agreement-header block loaded');

  // Check if we have the expected DOM structure with ul/li elements
  const existingList = block.querySelector('ul');
  if (existingList) {
    // If we already have a navigation list, just wrap it properly
    const wrapper = document.createElement('div');
    wrapper.className = 'agreement-header-block';

    // Move the existing content to the left side
    const left = document.createElement('div');
    left.className = 'agreement-left agreement-desktop';
    left.appendChild(existingList.cloneNode(true));

    // Look for the "Stay Informed" button
    const stayInformedBtn = block.querySelector('a.button.primary');
    const right = document.createElement('div');
    right.className = 'agreement-right';
    
    if (stayInformedBtn) {
      right.appendChild(stayInformedBtn.cloneNode(true));
    }

    // Create mobile version
    const mobileRow = document.createElement('div');
    mobileRow.className = 'agreement-mobile';

    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'agreement-mobile-toggle';
    mobileToggle.innerHTML = `
      <span class="text">Navigation</span>
      <span class="icon icon-arrow-down"></span>
    `;
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

    left.appendChild(mobileRow);
    left.appendChild(dropdown);

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
    mobileToggle.innerHTML = `
      <span class="text">${agreementsBtn.textContent}</span>
      <span class="icon icon-arrow-down"></span>
    `;
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
