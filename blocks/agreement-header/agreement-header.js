import { decorateIcons } from '../../scripts/aem.js';

export default function decorate(block) {
  // Get all the data from the block - Universal Editor provides data as DOM elements
  const rows = [...block.children];
  
  // Parse secondary buttons - each row with secondary-button model
  const secondaryButtons = [];
  rows.forEach(row => {
    const textEl = row.querySelector('div[data-aue-prop="text"]');
    const linkEl = row.querySelector('div[data-aue-prop="link"]');
    
    if (textEl) {
      secondaryButtons.push({
        text: textEl.textContent?.trim() || '',
        link: linkEl?.textContent?.trim() || '#'
      });
    }
  });

  // Parse primary button data from block-level properties
  const primaryButton = {};
  const primaryButtonTextEl = block.querySelector('div[data-aue-prop="primaryButtonText"]');
  const primaryButtonLinkEl = block.querySelector('div[data-aue-prop="primaryButtonLink"]');
  const primaryButtonStyleEl = block.querySelector('div[data-aue-prop="primaryButtonStyle"]');
  
  primaryButton.primaryButtonText = primaryButtonTextEl?.textContent?.trim() || 'Stay Informed';
  primaryButton.primaryButtonLink = primaryButtonLinkEl?.textContent?.trim() || '#';
  primaryButton.primaryButtonStyle = primaryButtonStyleEl?.textContent?.trim() || 'primary';

  // Parse mobile dropdown settings from block-level properties
  const enableMobileDropdownEl = block.querySelector('div[data-aue-prop="enableMobileDropdown"]');
  const enableMobileDropdown = enableMobileDropdownEl?.textContent?.trim() !== 'false';
  
  const mobileDropdownTitleEl = block.querySelector('div[data-aue-prop="mobileDropdownTitle"]');
  const mobileDropdownTitle = mobileDropdownTitleEl?.textContent?.trim() || 'Navigation';

  // If no secondary buttons found via data attributes, try to parse any anchor tags
  if (secondaryButtons.length === 0) {
    const allButtons = block.querySelectorAll('a');
    allButtons.forEach(button => {
      if (button.textContent.trim()) {
        secondaryButtons.push({
          text: button.textContent.trim(),
          link: button.href || '#'
        });
      }
    });
  }

  // Always create the header layout even if no buttons configured

  // --- MAIN WRAPPER ---
  const wrapper = document.createElement('div');
  wrapper.className = 'agreement-header-block';

  // --- LEFT SIDE ---
  const left = document.createElement('div');
  left.className = 'agreement-left';

  // DESKTOP - show all secondary buttons
  const desktopRow = document.createElement('div');
  desktopRow.className = 'agreement-desktop';

  secondaryButtons.forEach(button => {
    const desktopLink = document.createElement('a');
    desktopLink.className = 'button secondary';
    desktopLink.href = button.link || '#';
    desktopLink.textContent = button.text || '';
    desktopRow.appendChild(desktopLink);
  });

  // MOBILE toggle row (only if mobile dropdown is enabled)
  let mobileRow, mobileToggle, dropdown;
  if (enableMobileDropdown && secondaryButtons.length > 0) {
    mobileRow = document.createElement('div');
    mobileRow.className = 'agreement-mobile';

    mobileToggle = document.createElement('button');
    mobileToggle.className = 'agreement-mobile-toggle';
    mobileToggle.innerHTML = `
      <span class="text">${mobileDropdownTitle}</span>
      <span class="icon icon-arrow-down"></span>
    `;
    mobileRow.appendChild(mobileToggle);

    // DROPDOWN panel with all secondary buttons
    dropdown = document.createElement('div');
    dropdown.className = 'agreement-dropdown';
    
    secondaryButtons.forEach(button => {
      const dropdownItem = document.createElement('a');
      dropdownItem.className = 'dropdown-item';
      dropdownItem.href = button.link || '#';
      dropdownItem.textContent = button.text || '';
      dropdown.appendChild(dropdownItem);
    });
  }

  // Add rows to left side
  left.appendChild(desktopRow);
  if (mobileRow) left.appendChild(mobileRow);
  if (dropdown) left.appendChild(dropdown);

  // --- RIGHT SIDE ---
  const right = document.createElement('div');
  right.className = 'agreement-right';

  // Create primary button if configured
  if (primaryButton.primaryButtonText) {
    const primaryLink = document.createElement('a');
    primaryLink.className = `button ${primaryButton.primaryButtonStyle || 'primary'}`;
    primaryLink.href = primaryButton.primaryButtonLink || '#';
    primaryLink.textContent = primaryButton.primaryButtonText;
    primaryLink.setAttribute('role', 'button');
    right.appendChild(primaryLink);
  }

  // Build final layout
  wrapper.appendChild(left);
  wrapper.appendChild(right);

  // Inject into the block
  block.textContent = '';
  block.appendChild(wrapper);

  // Decorate icons after DOM is built
  decorateIcons(block);

  // --- MOBILE DROPDOWN LOGIC ---
  if (mobileToggle && dropdown) {
    mobileToggle.addEventListener('click', () => {
      dropdown.classList.toggle('open');
      mobileToggle.classList.toggle('expanded');
    });

    // Close dropdown when clicking any dropdown item
    const dropdownItems = dropdown.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
      item.addEventListener('click', () => {
        dropdown.classList.remove('open');
        mobileToggle.classList.remove('expanded');
        // link will open normally, no preventDefault()
      });
    });
  }
}
