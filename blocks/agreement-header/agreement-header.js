import { decorateIcons } from '../../scripts/aem.js';

export default function decorate(block) {
  // Get all the data from the block - Universal Editor provides data as DOM elements
  const rows = [...block.children];
  
  // Parse secondary buttons from the first row if it exists
  const secondaryButtons = [];
  const secondaryButtonsRow = rows.find(row => row.querySelector('div[data-aue-prop="secondaryButtons"]'));
  if (secondaryButtonsRow) {
    const buttons = secondaryButtonsRow.querySelectorAll('a');
    buttons.forEach(button => {
      secondaryButtons.push({
        text: button.textContent.trim(),
        link: button.href
      });
    });
  }

  // Parse primary button data
  const primaryButton = {};
  const primaryButtonRow = rows.find(row => row.querySelector('div[data-aue-prop="primaryButtonText"]') || row.querySelector('div[data-aue-prop="primaryButton"]'));
  if (primaryButtonRow) {
    const textEl = primaryButtonRow.querySelector('div[data-aue-prop="primaryButtonText"]');
    const linkEl = primaryButtonRow.querySelector('div[data-aue-prop="primaryButtonLink"]');
    const styleEl = primaryButtonRow.querySelector('div[data-aue-prop="primaryButtonStyle"]');
    
    primaryButton.primaryButtonText = textEl?.textContent?.trim() || 'Stay Informed';
    primaryButton.primaryButtonLink = linkEl?.textContent?.trim() || '#';
    primaryButton.primaryButtonStyle = styleEl?.textContent?.trim() || 'primary';
  }

  // Parse mobile dropdown settings
  const enableMobileDropdownRow = rows.find(row => row.querySelector('div[data-aue-prop="enableMobileDropdown"]'));
  const enableMobileDropdown = enableMobileDropdownRow?.querySelector('div[data-aue-prop="enableMobileDropdown"]')?.textContent?.trim() !== 'false';
  
  const mobileDropdownTitleRow = rows.find(row => row.querySelector('div[data-aue-prop="mobileDropdownTitle"]'));
  const mobileDropdownTitle = mobileDropdownTitleRow?.querySelector('div[data-aue-prop="mobileDropdownTitle"]')?.textContent?.trim() || 'Navigation';

  // If no secondary buttons, check if there are any buttons in the block at all
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

  // If still no buttons, return
  if (secondaryButtons.length === 0 && !primaryButton.primaryButtonText) return;

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
