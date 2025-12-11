import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

function createSVGSymbols() {
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('xmlns', svgNS);
  svg.classList.add('hide');
  svg.style.display = 'none';

  const symbols = {
    'n24-nvidia-logo': {
      viewBox: '0 0 108.472 20',
      content: `<title id="nvidia_logo_desktop">NVIDIA Home</title>
<desc>NVIDIA Home</desc>
<path id="nvidia-logo-reg" d="M1072.628,253.918v-.3h.192c.105,0,.248.008.248.136s-.073.163-.2.163h-.243m0,.211h.129l.3.524h.327l-.33-.545a.3.3,0,0,0,.311-.323c0-.285-.2-.377-.53-.377h-.482v1.245h.276v-.524m1.4-.1a1.2,1.2,0,1,0-1.2,1.157,1.14,1.14,0,0,0,1.2-1.157m-.347,0a.854.854,0,0,1-.855.891v0a.889.889,0,1,1,.855-.887Z" transform="translate(-965.557 -237.878)"></path>
<path id="nvidia-logo-NVIDIA" d="M463.9,151.934v13.127h3.707V151.934Zm-29.164-.018v13.145h3.74v-10.2l2.918.01a2.674,2.674,0,0,1,2.086.724c.586.625.826,1.632.826,3.476v5.995h3.624V157.8c0-5.183-3.3-5.882-6.536-5.882Zm35.134.018v13.127h6.013c3.2,0,4.249-.533,5.38-1.727a7.352,7.352,0,0,0,1.316-4.692,7.789,7.789,0,0,0-1.2-4.516c-1.373-1.833-3.352-2.191-6.306-2.191Zm3.677,2.858h1.594c2.312,0,3.808,1.039,3.808,3.733s-1.5,3.734-3.808,3.734h-1.594Zm-14.992-2.858-3.094,10.4-2.965-10.4h-4l4.234,13.127h5.343l4.267-13.127Zm25.749,13.127h3.708V151.935h-3.709ZM494.7,151.939l-5.177,13.117h3.656l.819-2.318h6.126l.775,2.318h3.969l-5.216-13.118Zm2.407,2.393,2.246,6.145h-4.562Z" transform="translate(-399.551 -148.155)"></path>
<path id="nvidia-logo-eye-mark" data-name="Eye Mark" d="M129.832,124.085v-1.807c.175-.013.353-.022.533-.028,4.941-.155,8.183,4.246,8.183,4.246s-3.5,4.863-7.255,4.863a4.553,4.553,0,0,1-1.461-.234v-5.478c1.924.232,2.31,1.082,3.467,3.01l2.572-2.169a6.81,6.81,0,0,0-5.042-2.462,9.328,9.328,0,0,0-1,.059m0-5.968v2.7c.177-.014.355-.025.533-.032,6.871-.232,11.348,5.635,11.348,5.635s-5.142,6.253-10.5,6.253a7.906,7.906,0,0,1-1.383-.122v1.668a9.1,9.1,0,0,0,1.151.075c4.985,0,8.59-2.546,12.081-5.559.578.463,2.948,1.591,3.435,2.085-3.319,2.778-11.055,5.018-15.44,5.018-.423,0-.829-.026-1.228-.064v2.344h18.947v-20Zm0,13.009v1.424c-4.611-.822-5.89-5.615-5.89-5.615a9.967,9.967,0,0,1,5.89-2.85v1.563h-.007a4.424,4.424,0,0,0-3.437,1.571s.845,3.035,3.444,3.908m-8.189-4.4a11.419,11.419,0,0,1,8.189-4.449v-1.463c-6.043.485-11.277,5.6-11.277,5.6s2.964,8.569,11.277,9.354v-1.555C123.731,133.451,121.643,126.728,121.643,126.728Z" transform="translate(-118.555 -118.117)" fill="#74b71b"></path>`,
    },
    'n24-menu': {
      viewBox: '0 0 24 24',
      content: `<title>Menu</title>
<desc>Menu icon</desc>
<line class="n24-icon-menu-stroke" x1="4.5" y1="7.5" x2="19.5" y2="7.5"></line>
<line class="n24-icon-menu-stroke" x1="4.5" y1="12" x2="19.5" y2="12"></line>
<line class="n24-icon-menu-stroke" x1="4.5" y1="16.5" x2="19.5" y2="16.5"></line>`,
    },
    'n24-close': {
      viewBox: '0 0 24 24',
      content: `<title>Close</title>
<desc>Close icon</desc>
<line class="n24-icon-close-cls-2" x1="4.5" y1="4.5" x2="19.5" y2="19.5"></line>
<line class="n24-icon-close-cls-2" x1="4.5" y1="19.5" x2="19.5" y2="4.5"></line>`,
    },
    'n24-search': {
      viewBox: '0 0 24 24',
      content: `<title>Search</title>
<desc>Search icon</desc>
<circle cx="9.9" cy="9.9" r="5.85" stroke="#666" stroke-width="1.5" fill="none"></circle>
<line x1="15" y1="15" x2="19.875" y2="19.875" stroke="#666" stroke-width="1.5"></line>`,
    },
  };

  Object.keys(symbols).forEach((id) => {
    const symbol = document.createElementNS(svgNS, 'symbol');
    symbol.setAttribute('id', id);
    symbol.setAttribute('viewBox', symbols[id].viewBox);
    symbol.innerHTML = symbols[id].content;
    svg.appendChild(symbol);
  });

  return svg;
}

function parseNavFragment(fragment) {
  const navData = [];
  const rightMenuData = [];

  if (!fragment) {
    return { navData, rightMenuData };
  }

  const sections = fragment.querySelectorAll('div');
  if (sections[0]) {
    const navList = sections[0].querySelector('ul');
    if (navList) {
      const topLevelItems = navList.querySelectorAll(':scope > li');

      topLevelItems.forEach((topItem) => {
        let title = '';
        let href = '#';

        const firstParagraph = topItem.querySelector(':scope > p');
        if (firstParagraph) {
          const link = firstParagraph.querySelector('a');
          if (link) {
            title = link.textContent.trim();
            href = link.href;
          } else {
            title = firstParagraph.textContent.trim();
          }
        }

        if (!title) {
          const directLink = topItem.querySelector(':scope > a');
          if (directLink) {
            title = directLink.textContent.trim();
            href = directLink.href;
          } else {
            const strong = topItem.querySelector(':scope > strong');
            if (strong) {
              title = strong.textContent.trim();
            }
          }
        }

        const navItem = {
          title,
          href,
          categories: [],
        };

        const categoriesUl = topItem.querySelector(':scope > ul');
        if (categoriesUl) {
          const categoryItems = categoriesUl.querySelectorAll(':scope > li');

          categoryItems.forEach((catItem) => {
            const catTitle = catItem.querySelector(':scope > p > strong, :scope > strong, :scope > p, :scope > a');
            const categoryName = catTitle ? catTitle.textContent.trim() : '';

            const catLink = catItem.querySelector(':scope > p > strong > a, :scope > strong > a, :scope > a');
            const categoryHref = catLink ? catLink.href : '';

            const categoryObj = {
              title: categoryName,
              href: categoryHref,
              items: [],
            };

            const itemsUl = catItem.querySelector(':scope > ul');
            if (itemsUl) {
              const items = itemsUl.querySelectorAll(':scope > li');
              items.forEach((item) => {
                const link = item.querySelector(':scope > strong > a, :scope > p > a, :scope > a');
                if (link) {
                  let description = '';

                  const descUl = item.querySelector(':scope > ul');
                  if (descUl) {
                    const descLi = descUl.querySelector(':scope > li');
                    if (descLi) {
                      description = descLi.textContent.trim();
                    }
                  }

                  if (!description) {
                    const descP = item.querySelector(':scope > p:not(:has(a))');
                    if (descP) {
                      description = descP.textContent.trim();
                    }
                  }

                  categoryObj.items.push({
                    title: link.textContent.trim(),
                    href: link.href,
                    description,
                  });
                }
              });
            }

            if (categoryObj.items.length > 0 || categoryName) {
              navItem.categories.push(categoryObj);
            }
          });
        }

        navData.push(navItem);
      });
    }
  }

  const iconItems = [];
  if (sections[2]) {
    const rightList = sections[2].querySelector('ul');
    if (rightList) {
      const rightItems = rightList.querySelectorAll(':scope > li');
      rightItems.forEach((item) => {
        const link = item.querySelector('strong > a, a');
        const icon = item.querySelector('.icon');

        if (link && link.textContent.trim()) {
          rightMenuData.push({
            title: link.textContent.trim(),
            href: link.href,
          });
        } else if (icon) {
          iconItems.push({
            icon: icon.cloneNode(true),
            text: item.textContent.trim(),
          });
        }
      });
    }
  }

  return { navData, rightMenuData, iconItems };
}

function createDesktopNav(navData, rightMenuData, iconItems) {
  const desktopNav = document.createElement('div');
  desktopNav.className = 'nav-header desktop-nav';

  const skipLink = document.createElement('a');
  skipLink.className = 'skip-main';
  skipLink.href = '#page-content';
  skipLink.innerHTML = '<span>Skip to main content</span>';
  desktopNav.appendChild(skipLink);

  const navHeaderContainer = document.createElement('div');
  navHeaderContainer.className = 'nav-header-container';

  const brandContainer = document.createElement('div');
  brandContainer.className = 'brand-container';

  const logoLink = document.createElement('a');
  logoLink.className = 'brand-link pull-left nvidia-logo';
  logoLink.href = '/en-us';
  logoLink.setAttribute('aria-labelledby', 'nvidia_logo_desktop');
  logoLink.title = 'NVIDIA';

  const logoSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  logoSvg.setAttribute('width', '108.472');
  logoSvg.setAttribute('height', '20');
  const logoUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  logoUse.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#n24-nvidia-logo');
  logoSvg.appendChild(logoUse);
  logoLink.appendChild(logoSvg);
  brandContainer.appendChild(logoLink);
  navHeaderContainer.appendChild(brandContainer);

  const navOverlay = document.createElement('div');
  navOverlay.className = 'navoverlay';
  navHeaderContainer.appendChild(navOverlay);

  const nvNavContainer = document.createElement('div');
  nvNavContainer.className = 'nv-nav-container nv-menu';

  const menuList = document.createElement('ul');
  menuList.id = 'main-menu-navigation';
  menuList.className = 'nv-menu-list left';
  menuList.setAttribute('role', 'menu');
  menuList.setAttribute('aria-label', 'Main navigation');

  navData.slice(0, 3).forEach((item, index) => {
    const menuItem = document.createElement('li');
    menuItem.className = 'nv-menu-item tmenu';
    menuItem.setAttribute('data-num', index + 1);
    menuItem.setAttribute('role', 'menuitem');
    menuItem.setAttribute('aria-haspopup', item.categories.length > 0 ? 'true' : 'false');
    menuItem.setAttribute('aria-expanded', 'false');

    if (item.categories.length > 0) {
      const button = document.createElement('button');
      button.className = 'nv-menu-button menu-level-1';
      button.textContent = item.title;
      button.setAttribute('type', 'button');
      button.setAttribute('aria-label', `${item.title} menu`);
      menuItem.appendChild(button);

      const megaMenuContainer = document.createElement('div');
      megaMenuContainer.className = 'nv-n-n25';

      const menuContainer = document.createElement('div');
      menuContainer.className = 'nv-menu3-container';

      const navRowContainer = document.createElement('div');
      navRowContainer.className = 'nav-row-container';

      const isIndustries = item.title.toLowerCase() === 'industries';

      if (isIndustries) {
        const industriesContainer = document.createElement('div');
        industriesContainer.className = 'menu3-items-container active';
        industriesContainer.id = `menu${index}-tab0`;
        industriesContainer.style.display = 'block';

        const titleSpan = document.createElement('span');
        titleSpan.className = 'h2-style';
        titleSpan.textContent = item.title;
        industriesContainer.appendChild(titleSpan);

        const industriesGrid = document.createElement('div');
        industriesGrid.className = 'menu3-item';

        item.categories.forEach((category) => {
          const categoryLink = document.createElement('a');
          categoryLink.href = category.href || category.items[0]?.href || '#';
          categoryLink.className = 'industry-link';
          const linkText = document.createElement('span');
          linkText.textContent = category.title;
          categoryLink.appendChild(linkText);

          const chevron = document.createElement('span');
          chevron.className = 'chevron';
          categoryLink.appendChild(chevron);

          industriesGrid.appendChild(categoryLink);
        });

        industriesContainer.appendChild(industriesGrid);
        navRowContainer.appendChild(industriesContainer);
      } else {
        const levelMenu = document.createElement('div');
        levelMenu.className = 'level-menu3';

        const categoriesDiv = document.createElement('div');
        categoriesDiv.className = 'menu3-categories';

        const itemsContainersDiv = document.createElement('div');
        itemsContainersDiv.className = 'menu3-items';

        item.categories.forEach((category, catIndex) => {
          const categoryBtn = document.createElement('button');
          categoryBtn.className = 'menu3-title-btn';
          categoryBtn.setAttribute('data-tab', `menu${index}-tab${catIndex}`);
          categoryBtn.textContent = category.title;

          if (catIndex === 0) {
            categoryBtn.classList.add('active');
          }

          categoryBtn.addEventListener('click', (e) => {
            e.preventDefault();
            categoriesDiv.querySelectorAll('.menu3-title-btn').forEach((btn) => btn.classList.remove('active'));
            categoryBtn.classList.add('active');
            const tabId = categoryBtn.getAttribute('data-tab');
            itemsContainersDiv.querySelectorAll('.menu3-items-container').forEach((container) => {
              container.style.display = 'none';
            });
            const activeContainer = itemsContainersDiv.querySelector(`#${tabId}`);
            if (activeContainer) {
              activeContainer.style.display = 'block';
            }
          });

          categoriesDiv.appendChild(categoryBtn);
        });

        levelMenu.appendChild(categoriesDiv);

        const divider = document.createElement('div');
        divider.className = 'menu3-divider';
        levelMenu.appendChild(divider);

        item.categories.forEach((category, catIndex) => {
          const itemsContainer = document.createElement('div');
          itemsContainer.id = `menu${index}-tab${catIndex}`;
          itemsContainer.className = 'menu3-items-container';
          itemsContainer.style.display = catIndex === 0 ? 'block' : 'none';

          const categoryTitle = document.createElement('span');
          categoryTitle.className = 'h2-style';
          categoryTitle.textContent = category.title;
          itemsContainer.appendChild(categoryTitle);

          const itemsWrapper = document.createElement('div');
          itemsWrapper.className = 'menu3-item';

          category.items.forEach((subItem) => {
            const itemCard = document.createElement('a');
            itemCard.className = 'menu3-item-card';
            itemCard.href = subItem.href;
            itemCard.setAttribute('target', '_self');

            const cardContent = document.createElement('div');
            cardContent.className = 'menu3-item-card-content';

            const btnContainer = document.createElement('div');
            btnContainer.className = 'nv-button button nv-button-text nv-button-caret';

            const btnContent = document.createElement('div');
            btnContent.className = 'btn-content btncta';

            const btnText = document.createElement('span');
            btnText.className = 'btn-text';
            btnText.textContent = subItem.title;

            const chevron = document.createElement('span');
            chevron.className = 'chevron';

            btnContent.appendChild(btnText);
            btnContent.appendChild(chevron);
            btnContainer.appendChild(btnContent);
            cardContent.appendChild(btnContainer);

            if (subItem.description) {
              const desc = document.createElement('p');
              desc.textContent = subItem.description;
              cardContent.appendChild(desc);
            }

            itemCard.appendChild(cardContent);
            itemsWrapper.appendChild(itemCard);
          });

          itemsContainer.appendChild(itemsWrapper);
          itemsContainersDiv.appendChild(itemsContainer);
        });

        levelMenu.appendChild(itemsContainersDiv);
        navRowContainer.appendChild(levelMenu);
      }

      menuContainer.appendChild(navRowContainer);
      megaMenuContainer.appendChild(menuContainer);
      menuItem.appendChild(megaMenuContainer);

      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isExpanded = menuItem.getAttribute('aria-expanded') === 'true';

        menuList.querySelectorAll('.nv-menu-item').forEach((navItem) => {
          navItem.setAttribute('aria-expanded', 'false');
        });

        if (!isExpanded) {
          menuItem.setAttribute('aria-expanded', 'true');
          navOverlay.classList.add('active');
        } else {
          menuItem.setAttribute('aria-expanded', 'false');
          navOverlay.classList.remove('active');
        }
      });
    } else {
      const link = document.createElement('a');
      link.href = item.href;
      link.className = 'menu-button menu-level-1';
      link.textContent = item.title;
      menuItem.appendChild(link);
    }

    menuList.appendChild(menuItem);
  });

  nvNavContainer.appendChild(menuList);

  const rightMenu = document.createElement('ul');
  rightMenu.className = 'nv-menu-list right';
  rightMenu.setAttribute('role', 'menu');
  rightMenu.setAttribute('aria-label', 'Secondary navigation');

  rightMenuData.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'nv-menu-item';
    li.setAttribute('role', 'none');
    const a = document.createElement('a');
    a.href = item.href;
    a.className = 'menu-button-link menu-level-1';
    a.setAttribute('role', 'menuitem');
    a.setAttribute('target', '_self');
    a.textContent = item.title;
    li.appendChild(a);
    rightMenu.appendChild(li);
  });

  iconItems.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'nv-menu-item';
    li.setAttribute('role', 'none');

    const iconName = item.icon.className.split('icon-')[1];

    if (iconName === 'search') {
      li.className = 'nv-menu-item search-item';
      const searchLink = document.createElement('a');
      searchLink.href = '#';
      searchLink.className = 'nav-search-link';
      searchLink.setAttribute('role', 'menuitem');
      searchLink.setAttribute('aria-label', 'Search');
      searchLink.appendChild(item.icon);
      li.appendChild(searchLink);
    } else if (iconName === 'globe') {
      li.className = 'nv-menu-item region-item';
      const regionLink = document.createElement('a');
      regionLink.href = '#';
      regionLink.className = 'nav-region-link';
      regionLink.setAttribute('role', 'menuitem');
      regionLink.setAttribute('aria-label', 'Region selector');
      regionLink.appendChild(item.icon);
      if (item.text) {
        const textSpan = document.createElement('span');
        textSpan.className = 'cs-loc-txt';
        textSpan.textContent = item.text.replace(/\s/g, '');
        regionLink.appendChild(textSpan);
      }
      li.appendChild(regionLink);
    } else if (iconName === 'profile') {
      li.className = 'nv-menu-item user-item';
      const userLink = document.createElement('a');
      userLink.href = '#';
      userLink.className = 'nav-user-link';
      userLink.setAttribute('role', 'menuitem');
      userLink.appendChild(item.icon);
      if (item.text) {
        const textSpan = document.createElement('span');
        textSpan.className = 'user-text';
        textSpan.textContent = item.text;
        userLink.appendChild(textSpan);
      }
      li.appendChild(userLink);
    }

    rightMenu.appendChild(li);
  });

  nvNavContainer.appendChild(rightMenu);
  navHeaderContainer.appendChild(nvNavContainer);
  desktopNav.appendChild(navHeaderContainer);

  const closeMegaMenus = () => {
    menuList.querySelectorAll('.nv-menu-item').forEach((menuItem) => {
      menuItem.setAttribute('aria-expanded', 'false');
    });
    navOverlay.classList.remove('active');
  };

  navOverlay.addEventListener('click', closeMegaMenus);

  document.addEventListener('click', (e) => {
    if (!desktopNav.contains(e.target)) {
      closeMegaMenus();
    }
  });

  return desktopNav;
}

function createMobileNav(navData, rightMenuData, iconItems) {
  const mobileNav = document.createElement('div');
  mobileNav.className = 'mobile-nav';

  const navHeader = document.createElement('div');
  navHeader.className = 'nav-header';

  const skipLink = document.createElement('a');
  skipLink.className = 'skip-main';
  skipLink.href = '#page-content';
  skipLink.innerHTML = '<span>Skip to main content</span>';
  navHeader.appendChild(skipLink);

  const navHeaderContainer = document.createElement('div');
  navHeaderContainer.className = 'nav-header-container';

  const navToolsContainer = document.createElement('div');
  navToolsContainer.className = 'nav-tools-container';

  const navHeaderList = document.createElement('ul');
  navHeaderList.className = 'nav-header-list';
  navHeaderList.setAttribute('role', 'list');

  const menuButtonItem = document.createElement('li');
  menuButtonItem.className = 'nav-header-item mobile-menu-button-item';
  menuButtonItem.setAttribute('role', 'listitem');

  const menuButton = document.createElement('button');
  menuButton.id = 'menu-toggle';
  menuButton.className = 'menu-button mobile-menu-button toplevel';
  menuButton.setAttribute('tabindex', '0');
  menuButton.setAttribute('aria-controls', 'mobile-menu-navigation');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Main Menu');

  const menuIconSpan = document.createElement('span');
  menuIconSpan.id = 'mega-nav-open-menu-icon';
  const menuIconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  menuIconSvg.classList.add('n24-icon', 'mega-nav-open-menu-icon');
  menuIconSvg.setAttribute('width', '24');
  menuIconSvg.setAttribute('height', '24');
  const menuIconUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  menuIconUse.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#n24-menu');
  menuIconSvg.appendChild(menuIconUse);
  menuIconSpan.appendChild(menuIconSvg);
  menuButton.appendChild(menuIconSpan);

  const closeIconSpan = document.createElement('span');
  closeIconSpan.id = 'mega-nav-close-menu-icon';
  closeIconSpan.classList.add('hide');
  const closeIconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  closeIconSvg.classList.add('n24-icon', 'mega-nav-close-menu-icon');
  closeIconSvg.setAttribute('width', '24');
  closeIconSvg.setAttribute('height', '24');
  const closeIconUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  closeIconUse.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#n24-close');
  closeIconSvg.appendChild(closeIconUse);
  closeIconSpan.appendChild(closeIconSvg);
  menuButton.appendChild(closeIconSpan);

  menuButtonItem.appendChild(menuButton);
  navHeaderList.appendChild(menuButtonItem);

  const searchItem = document.createElement('li');
  searchItem.className = 'nav-header-item search-item';
  searchItem.setAttribute('role', 'listitem');
  searchItem.setAttribute('tabindex', '0');
  searchItem.id = 'nv-search-box-mobile';
  const searchLink = document.createElement('a');
  searchLink.className = 'toplevel';
  searchLink.href = '#';
  searchLink.setAttribute('aria-haspopup', 'true');
  searchLink.setAttribute('aria-label', 'Search NVIDIA');
  const searchIconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  searchIconSvg.classList.add('n24-icon', 'nav-search-icon');
  searchIconSvg.setAttribute('width', '24');
  searchIconSvg.setAttribute('height', '24');
  const searchIconUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  searchIconUse.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#n24-search');
  searchIconSvg.appendChild(searchIconUse);
  searchLink.appendChild(searchIconSvg);
  searchItem.appendChild(searchLink);
  navHeaderList.appendChild(searchItem);

  const brandItem = document.createElement('li');
  brandItem.className = 'nav-header-item brand-container';
  brandItem.setAttribute('role', 'listitem');

  const logoLink = document.createElement('a');
  logoLink.className = 'brand-link pull-left nvidia-logo toplevel';
  logoLink.href = '/';
  logoLink.title = 'NVIDIA';
  logoLink.setAttribute('aria-labelledby', 'nvidia_logo_desktop');

  const logoSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  logoSvg.classList.add('n24-nvidia-logo');
  logoSvg.setAttribute('aria-labelledby', 'nvidia_logo');
  logoSvg.setAttribute('width', '90');
  logoSvg.setAttribute('height', '17');
  const logoUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  logoUse.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#n24-nvidia-logo');
  logoSvg.appendChild(logoUse);
  logoLink.appendChild(logoSvg);
  brandItem.appendChild(logoLink);
  navHeaderList.appendChild(brandItem);

  iconItems.forEach((item) => {
    const iconName = item.icon.className.split('icon-')[1];

    if (iconName === 'globe') {
      const csItem = document.createElement('li');
      csItem.className = 'nav-header-item cs-item cs-right-padding';
      csItem.id = 'nv-cs-item-mob';
      csItem.setAttribute('role', 'listitem');
      const csLink = document.createElement('a');
      csLink.setAttribute('aria-expanded', 'false');
      csLink.setAttribute('aria-haspopup', 'true');
      csLink.setAttribute('aria-label', 'Country Selector');
      csLink.className = 'nav-cs-link menu-level-1';
      csLink.href = '#';
      csLink.appendChild(item.icon.cloneNode(true));
      if (item.text) {
        const textSpan = document.createElement('span');
        textSpan.className = 'cs-loc-txt';
        textSpan.textContent = item.text.replace(/\s/g, '');
        csLink.appendChild(textSpan);
      }
      csItem.appendChild(csLink);
      navHeaderList.appendChild(csItem);
    } else if (iconName === 'profile') {
      const profileItem = document.createElement('li');
      profileItem.className = 'nav-header-item profile-item account-icon';
      profileItem.id = 'acc-menu-dropdown-container-mob';
      profileItem.setAttribute('role', 'listitem');
      const profileLink = document.createElement('a');
      profileLink.id = 'nv-login-mob';
      profileLink.title = item.text || 'Sign In';
      profileLink.className = 'nav-profile-link toplevel';
      const accountDiv = document.createElement('div');
      accountDiv.className = 'account-icon-anonuser';
      accountDiv.appendChild(item.icon.cloneNode(true));
      if (item.text) {
        const labelSpan = document.createElement('span');
        labelSpan.id = 'account-icon-anonuser-mobile-label';
        labelSpan.textContent = item.text;
        accountDiv.appendChild(labelSpan);
      }
      profileLink.appendChild(accountDiv);
      profileItem.appendChild(profileLink);
      navHeaderList.appendChild(profileItem);
    }
  });

  navToolsContainer.appendChild(navHeaderList);
  navHeaderContainer.appendChild(navToolsContainer);
  navHeader.appendChild(navHeaderContainer);
  mobileNav.appendChild(navHeader);

  const megaNav = document.createElement('div');
  megaNav.id = 'mega-nav';
  megaNav.className = 'mega-nav';
  megaNav.setAttribute('role', 'navigation');

  const megaMenu = document.createElement('div');
  megaMenu.className = 'mega-menu';

  const accordionMenu = document.createElement('nav');
  accordionMenu.className = 'accordion-menu';
  accordionMenu.setAttribute('aria-label', 'Accordion Navigation');

  navData.slice(0, 3).forEach((item, index) => {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item l1-item';

    if (item.categories.length > 0) {
      const accordionBtn = document.createElement('button');
      accordionBtn.className = 'accordion-btn l1-accordion-btn';
      accordionBtn.setAttribute('aria-expanded', 'false');
      accordionBtn.setAttribute('aria-controls', `l1-submenu-${index}`);
      accordionBtn.id = `l1-menu-btn-${index}`;

      const btnText = document.createElement('span');
      btnText.textContent = item.title;
      accordionBtn.appendChild(btnText);

      const caret = document.createElement('span');
      caret.className = 'accordion-chevron';
      caret.setAttribute('aria-hidden', 'true');
      accordionBtn.appendChild(caret);
      menuItem.appendChild(accordionBtn);
      const l1Submenu = document.createElement('div');
      l1Submenu.className = 'submenu l1-submenu';
      l1Submenu.id = `l1-submenu-${index}`;
      l1Submenu.setAttribute('role', 'group');
      l1Submenu.setAttribute('aria-labelledby', `l1-menu-btn-${index}`);
      l1Submenu.setAttribute('aria-labelledby', `l1-menu-btn-${index}`);

      const isIndustries = item.title.toLowerCase() === 'industries';

      if (isIndustries) {
        const industriesContainer = document.createElement('div');
        industriesContainer.className = 'mobile-industries-container';

        item.categories.forEach((category) => {
          const categoryLink = document.createElement('a');
          categoryLink.href = category.href || category.items[0]?.href || '#';
          categoryLink.className = 'mobile-industry-link';

          const linkContent = document.createElement('div');
          linkContent.className = 'mobile-industry-content';

          const linkText = document.createElement('span');
          linkText.className = 'mobile-industry-text';
          linkText.textContent = category.title;
          linkContent.appendChild(linkText);

          const chevron = document.createElement('span');
          chevron.className = 'industries-chevron';
          linkContent.appendChild(chevron);

          categoryLink.appendChild(linkContent);
          industriesContainer.appendChild(categoryLink);
        });

        l1Submenu.appendChild(industriesContainer);
      } else {
        item.categories.forEach((category, catIndex) => {
          const l2MenuItem = document.createElement('div');
          l2MenuItem.className = 'menu-item l2-item';

          const l2AccordionBtn = document.createElement('button');
          l2AccordionBtn.className = 'accordion-btn l2-accordion-btn';
          l2AccordionBtn.setAttribute('aria-expanded', 'false');
          l2AccordionBtn.setAttribute('aria-controls', `l2-submenu-${index}-${catIndex}`);
          l2AccordionBtn.id = `l2-menu-btn-${index}-${catIndex}`;

          const l2BtnText = document.createElement('span');
          l2BtnText.textContent = category.title;
          l2AccordionBtn.appendChild(l2BtnText);

          const l2Caret = document.createElement('span');
          l2Caret.className = 'accordion-chevron';
          l2Caret.setAttribute('aria-hidden', 'true');
          l2AccordionBtn.appendChild(l2Caret);

          l2MenuItem.appendChild(l2AccordionBtn);

          const l2Submenu = document.createElement('div');
          l2Submenu.className = 'submenu l2-submenu';
          l2Submenu.id = `l2-submenu-${index}-${catIndex}`;
          l2Submenu.setAttribute('role', 'group');
          l2Submenu.setAttribute('aria-labelledby', `l2-menu-btn-${index}-${catIndex}`);

          const l2ItemsList = document.createElement('div');
          l2ItemsList.className = 'l2-items-list';

          category.items.forEach((subItem) => {
            const itemCard = document.createElement('a');
            itemCard.className = 'mobile-item-card';
            itemCard.href = subItem.href;

            const cardContent = document.createElement('div');
            cardContent.className = 'mobile-item-card-content';

            const btnContainer = document.createElement('div');
            btnContainer.className = 'mobile-item-cta';

            const itemBtnText = document.createElement('span');
            itemBtnText.className = 'mobile-item-text';
            itemBtnText.textContent = subItem.title;
            btnContainer.appendChild(itemBtnText);

            const chevron = document.createElement('span');
            chevron.className = 'mobile-cta-chevron';
            btnContainer.appendChild(chevron);

            cardContent.appendChild(btnContainer);

            if (subItem.description) {
              const desc = document.createElement('p');
              desc.className = 'mobile-item-description';
              desc.textContent = subItem.description;
              cardContent.appendChild(desc);
            }

            itemCard.appendChild(cardContent);
            l2ItemsList.appendChild(itemCard);
          });

          l2Submenu.appendChild(l2ItemsList);
          l2MenuItem.appendChild(l2Submenu);

          l2AccordionBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = l2AccordionBtn.getAttribute('aria-expanded') === 'true';
            const l2Btns = l1Submenu.querySelectorAll('.accordion-btn.l2-accordion-btn');
            const l2Submenus = l1Submenu.querySelectorAll('.submenu.l2-submenu');
            l2Btns.forEach((btn, idx) => {
              btn.setAttribute('aria-expanded', 'false');
              l2Submenus[idx].classList.remove('open');
            });
            if (!isExpanded) {
              l2AccordionBtn.setAttribute('aria-expanded', 'true');
              l2Submenu.classList.add('open');
            }
          });

          l1Submenu.appendChild(l2MenuItem);
        });
      }

      menuItem.appendChild(l1Submenu);

      accordionBtn.addEventListener('click', () => {
        const isExpanded = accordionBtn.getAttribute('aria-expanded') === 'true';
        const l1Btns = accordionMenu.querySelectorAll('.accordion-btn.l1-accordion-btn');
        const l1Submenus = accordionMenu.querySelectorAll('.submenu.l1-submenu');
        l1Btns.forEach((btn, idx) => {
          btn.setAttribute('aria-expanded', 'false');
          l1Submenus[idx].classList.remove('open');
        });
        if (!isExpanded) {
          accordionBtn.setAttribute('aria-expanded', 'true');
          l1Submenu.classList.add('open');
        }
      });
    } else {
      const link = document.createElement('a');
      link.href = item.href;
      link.className = 'menu-item-link';
      link.textContent = item.title;
      menuItem.appendChild(link);
    }

    accordionMenu.appendChild(menuItem);
  });

  rightMenuData.forEach((item) => {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item right-menu-item';
    const link = document.createElement('a');
    link.href = item.href;
    link.className = 'menu-item-link';
    link.textContent = item.title;
    menuItem.appendChild(link);
    accordionMenu.appendChild(menuItem);
  });

  megaMenu.appendChild(accordionMenu);
  megaNav.appendChild(megaMenu);
  mobileNav.appendChild(megaNav);

  menuButton.addEventListener('click', () => {
    const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', !isExpanded);
    megaNav.classList.toggle('open');
    menuIconSpan.classList.toggle('hide');
    closeIconSpan.classList.toggle('hide');
  });

  return mobileNav;
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  const { navData, rightMenuData, iconItems } = parseNavFragment(fragment);

  block.textContent = '';

  const header = document.createElement('header');
  header.id = 'main-header';

  const navigationWrapper = document.createElement('div');
  navigationWrapper.className = 'meganavigation navigation';

  const svgSymbols = createSVGSymbols();
  navigationWrapper.appendChild(svgSymbols);

  const globalNav = document.createElement('nav');
  globalNav.className = 'global-nav';
  globalNav.id = 'meganavigation';

  const desktopNav = createDesktopNav(navData, rightMenuData, iconItems);
  globalNav.appendChild(desktopNav);

  const mobileNav = createMobileNav(navData, rightMenuData, iconItems);
  globalNav.appendChild(mobileNav);

  navigationWrapper.appendChild(globalNav);
  header.appendChild(navigationWrapper);
  block.appendChild(header);
}
