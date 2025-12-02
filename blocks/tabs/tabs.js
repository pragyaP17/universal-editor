function updateSliderPosition(sliderLine, activeTab) {
  const tabListRect = activeTab.parentElement.getBoundingClientRect();
  const tabRect = activeTab.getBoundingClientRect();

  const { left: tabLeft, width } = tabRect;
  const left = tabLeft - tabListRect.left;

  sliderLine.style.left = `${left}px`;
  sliderLine.style.width = `${width}px`;
}

function switchTab(selectedTab, tabList, tabPanelsContainer, sliderLine) {
  const tabs = tabList.querySelectorAll('.cmp-tabs__tab');
  const panels = tabPanelsContainer.querySelectorAll('.cmp-tabs__tabpanel');

  // Deactivate all tabs and panels
  tabs.forEach((tab) => {
    tab.classList.remove('nv-tabs__tab--active');
    tab.setAttribute('aria-selected', 'false');
    tab.setAttribute('tabindex', '-1');
  });

  panels.forEach((panel) => {
    panel.classList.remove('cmp-tabs__tabpanel--active');
    panel.setAttribute('aria-hidden', 'true');
  });

  // Activate selected tab and panel
  selectedTab.classList.add('nv-tabs__tab--active');
  selectedTab.setAttribute('aria-selected', 'true');
  selectedTab.setAttribute('tabindex', '0');
  selectedTab.focus();

  const panelId = selectedTab.getAttribute('aria-controls');
  const selectedPanel = document.getElementById(panelId);
  if (selectedPanel) {
    selectedPanel.classList.add('cmp-tabs__tabpanel--active');
    selectedPanel.removeAttribute('aria-hidden');
  }

  // Update slider position
  updateSliderPosition(sliderLine, selectedTab);
}

function handleKeyboardNavigation(e, tabs, tabList, tabPanelsContainer, sliderLine) {
  const currentIndex = Array.from(tabs).indexOf(e.target);
  let newIndex = currentIndex;

  if (e.key === 'ArrowRight') {
    e.preventDefault();
    newIndex = (currentIndex + 1) % tabs.length;
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
  } else if (e.key === 'Home') {
    e.preventDefault();
    newIndex = 0;
  } else if (e.key === 'End') {
    e.preventDefault();
    newIndex = tabs.length - 1;
  }

  if (newIndex !== currentIndex) {
    switchTab(tabs[newIndex], tabList, tabPanelsContainer, sliderLine);
  }
}

async function loadFragment(path, container) {
  try {
    // Remove existing link
    const existingLink = container.querySelector('a');
    if (existingLink) {
      existingLink.remove();
    }

    const response = await fetch(`${path}.plain.html`);
    if (!response.ok) {
      throw new Error(`Failed to load fragment: ${response.status}`);
    }

    const html = await response.text();
    const fragmentDiv = document.createElement('div');
    fragmentDiv.innerHTML = html;

    // Decorate fragment content
    const fragmentContent = fragmentDiv.querySelector('div');
    if (fragmentContent) {
      container.appendChild(fragmentContent);

      // Import and decorate blocks within the fragment
      const blocks = fragmentContent.querySelectorAll('[class*="block"]');
      blocks.forEach(async (block) => {
        const blockName = Array.from(block.classList)
          .find((className) => className !== 'block')
          ?.replace(/^block-/, '');

        if (blockName) {
          try {
            const mod = await import(`../${blockName}/${blockName}.js`);
            if (mod.default) {
              await mod.default(block);
            }
          } catch (error) {
            // Block decoration failed, but continue
          }
        }
      });
    }
  } catch (error) {
    container.innerHTML = '<p>Error loading content</p>';
  }
}

export default async function decorate(block) {
  const tabItems = [];

  // Extract tab data from block structure
  // Structure: block > div (row) > div (title cell), div (reference cell)
  const rows = [...block.children];
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const titleCell = cells[0];
      const referenceCell = cells[1];

      const title = titleCell.textContent.trim();
      const referenceLink = referenceCell.querySelector('a');
      const reference = referenceLink?.getAttribute('href') || referenceLink?.textContent.trim() || '';

      if (title && reference) {
        tabItems.push({ title, reference });
      }
    }
  });

  if (tabItems.length === 0) return;

  // Clear the block
  block.innerHTML = '';

  // Create unique ID for this tabs instance
  const tabsId = `tabs-${Math.random().toString(36).substr(2, 9)}`;

  // Create tabs container structure
  const tabsContainer = document.createElement('div');
  tabsContainer.className = 'nv-tabs__container';

  // Create tab list
  const tabList = document.createElement('ol');
  tabList.setAttribute('role', 'tablist');
  tabList.className = 'nv-tabs__tablist align-center';
  tabList.setAttribute('aria-multiselectable', 'false');

  // Create slider line
  const sliderLine = document.createElement('div');
  sliderLine.className = 'nv-tabs__line nv-tabs__trans--enabled';
  tabList.appendChild(sliderLine);

  // Create tabs and panels
  const tabPanelsContainer = document.createElement('div');
  tabPanelsContainer.className = 'nv-tabs__content';

  tabItems.forEach((item, index) => {
    const tabId = `${tabsId}-tab-${index}`;
    const panelId = `${tabsId}-panel-${index}`;
    const isActive = index === 0;

    // Create tab button
    const tab = document.createElement('li');
    tab.setAttribute('role', 'tab');
    tab.id = tabId;
    tab.className = `cmp-tabs__tab${isActive ? ' nv-tabs__tab--active' : ''}`;
    tab.setAttribute('aria-controls', panelId);
    tab.setAttribute('tabindex', isActive ? '0' : '-1');
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');

    const tabTitle = document.createElement('div');
    tabTitle.textContent = item.title;
    tab.appendChild(tabTitle);

    tabList.appendChild(tab);

    // Create tab panel
    const panel = document.createElement('div');
    panel.id = panelId;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabId);
    panel.setAttribute('tabindex', '0');
    panel.className = `cmp-tabs__tabpanel${isActive ? ' cmp-tabs__tabpanel--active' : ''}`;
    if (!isActive) {
      panel.setAttribute('aria-hidden', 'true');
    }

    // Load fragment content if reference exists
    if (item.reference) {
      const fragmentLink = document.createElement('a');
      fragmentLink.href = item.reference;
      fragmentLink.textContent = item.reference;
      panel.appendChild(fragmentLink);

      // Load the fragment content
      loadFragment(item.reference, panel);
    }

    tabPanelsContainer.appendChild(panel);
  });

  tabsContainer.appendChild(tabList);
  block.appendChild(tabsContainer);
  block.appendChild(tabPanelsContainer);

  // Position slider line on the active tab after DOM is rendered
  const activeTab = tabList.querySelector('.nv-tabs__tab--active');
  if (activeTab) {
    // Use requestAnimationFrame to ensure DOM is fully rendered
    requestAnimationFrame(() => {
      updateSliderPosition(sliderLine, activeTab);
    });
  }

  // Add click event listeners to tabs
  const tabs = tabList.querySelectorAll('.cmp-tabs__tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      switchTab(tab, tabList, tabPanelsContainer, sliderLine);
    });

    tab.addEventListener('keydown', (e) => {
      handleKeyboardNavigation(e, tabs, tabList, tabPanelsContainer, sliderLine);
    });
  });

  // Add slider drag functionality
  let isDragging = false;
  let startX = 0;

  sliderLine.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    sliderLine.classList.remove('nv-tabs__trans--enabled');
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    const sliderRect = sliderLine.getBoundingClientRect();

    // Find which tab the slider is over
    tabs.forEach((tab) => {
      const tabRect = tab.getBoundingClientRect();
      const sliderCenter = sliderRect.left + sliderRect.width / 2 + deltaX;

      if (sliderCenter >= tabRect.left && sliderCenter <= tabRect.right) {
        if (!tab.classList.contains('nv-tabs__tab--active')) {
          switchTab(tab, tabList, tabPanelsContainer, sliderLine);
        }
      }
    });
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      sliderLine.classList.add('nv-tabs__trans--enabled');
    }
  });

  // Click on slider to navigate
  sliderLine.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Update slider position on window resize
  window.addEventListener('resize', () => {
    const activeTabElement = tabList.querySelector('.nv-tabs__tab--active');
    if (activeTabElement) {
      updateSliderPosition(sliderLine, activeTabElement);
    }
  });
}
