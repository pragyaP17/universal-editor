// Secondary Header Mobile Menu JavaScript
export function initSecondaryHeaderMobile(retryCount = 0) {
    console.log(`Initializing secondary header mobile menu (Attempt ${retryCount + 1})...`);

    const secondaryHeader = document.querySelector('.sub-brand-nav');
    if (!secondaryHeader) {
        if (retryCount < 10) {
            setTimeout(() => initSecondaryHeaderMobile(retryCount + 1), 100);
        } else {
            console.warn('Secondary header not found after multiple retries.');
        }
        return;
    }

    const hamburgerIcon = secondaryHeader.querySelector('.ic-menu');
    const brandNavLeft = secondaryHeader.querySelector('.brand-nav-left');

    if (!hamburgerIcon) {
        console.warn('Hamburger icon not found');
        return;
    }

    if (!brandNavLeft) {
        console.warn('Brand nav left not found');
        return;
    }

    // Expose for manual debugging
    window.initSecondaryHeaderMobile = initSecondaryHeaderMobile;

    // Create mobile menu container if it doesn't exist
    let mobileMenuContainer = secondaryHeader.querySelector('.mobile-menu-container');
    if (!mobileMenuContainer) {
        mobileMenuContainer = document.createElement('div');
        mobileMenuContainer.className = 'mobile-menu-container';

        // Create main mobile menu
        const mobileMenu = document.createElement('ul');
        mobileMenu.className = 'mobile-menu';

        // Clone navigation items for mobile
        const navItems = brandNavLeft.querySelectorAll('.sub-brand-item');
        navItems.forEach((item) => {
            const menuItem = document.createElement('li');
            menuItem.className = 'hasChild';

            const link = item.querySelector('.sub-brand-link');
            const dropdown = item.querySelector('.dropdown-menu');

            if (link && dropdown) {
                // Right arrow (Sibling to link)
                const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                arrow.classList.add('right-arrow');
                arrow.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                arrow.setAttribute('viewBox', '0 0 32 32');
                const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                arrowPath.classList.add('a');
                arrowPath.setAttribute('d', 'M11.45,22.12,17.56,16,11.45,9.88,13.33,8l8,8-8,8Z');
                arrow.appendChild(arrowPath);
                menuItem.appendChild(arrow);

                const itemLink = document.createElement('a');
                itemLink.textContent = link.textContent.replace(/\s+/g, ' ').trim();
                itemLink.href = '#';
                menuItem.appendChild(itemLink);

                // Create submenu
                const submenu = document.createElement('ul');
                submenu.className = 'submenu';

                // Back button
                const backItem = document.createElement('li');
                backItem.className = 'back';

                // Back Arrow Container
                const backArrowDiv = document.createElement('div');
                backArrowDiv.className = 'mobile-arrow-left';

                const backArrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                backArrow.classList.add('left-arrow');
                backArrow.setAttribute('version', '1.1');
                backArrow.setAttribute('viewBox', '0 0 512 512');
                backArrow.setAttribute('xml:space', 'preserve');
                backArrow.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

                const backPolygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                backPolygon.setAttribute('points', '352,128.4 319.7,96 160,256 160,256 160,256 319.7,416 352,383.6 224.7,256');
                backArrow.appendChild(backPolygon);
                backArrowDiv.appendChild(backArrow);

                backItem.appendChild(backArrowDiv);

                const backLink = document.createElement('a');
                backLink.href = '#';
                backLink.textContent = 'Back';
                backItem.appendChild(backLink);

                submenu.appendChild(backItem);

                // Menu title
                const titleItem = document.createElement('li');
                titleItem.className = 'menu-title';
                const titleLink = document.createElement('a');
                titleLink.textContent = link.textContent.replace(/\s+/g, ' ').trim();
                titleLink.href = '#';
                titleItem.appendChild(titleLink);
                submenu.appendChild(titleItem);

                // Add submenu items
                const dropdownLinks = dropdown.querySelectorAll('a');
                dropdownLinks.forEach((dLink) => {
                    const subItem = document.createElement('li');
                    const subLink = document.createElement('a');
                    subLink.href = dLink.href;
                    subLink.textContent = dLink.textContent.trim();
                    subItem.appendChild(subLink);
                    submenu.appendChild(subItem);
                });

                menuItem.appendChild(submenu);

                // Click handler for opening submenu
                // Trigger on li click (covers arrow) but ignore submenu clicks
                menuItem.addEventListener('click', (e) => {
                    if (e.target.closest('.submenu')) return;
                    e.preventDefault();
                    menuItem.classList.add('active');
                });

                // Click handler for back button
                // Click on the whole item triggers back
                backItem.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation(); // Stop propagation to menuItem
                    menuItem.classList.remove('active');
                });
            }

            mobileMenu.appendChild(menuItem);
        });

        mobileMenuContainer.appendChild(mobileMenu);
        secondaryHeader.appendChild(mobileMenuContainer);
    }

    // Remove existing listeners to avoid duplicates if re-initialized
    // (Ideally we'd use named functions but cloning is a quick dirty way to clear listeners)
    const newHamburger = hamburgerIcon.cloneNode(true);
    hamburgerIcon.parentNode.replaceChild(newHamburger, hamburgerIcon);

    // Toggle mobile menu
    newHamburger.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Hamburger menu clicked');
        mobileMenuContainer.classList.toggle('active');
        secondaryHeader.classList.toggle('menu-open');

        // Update opacity
        if (mobileMenuContainer.classList.contains('active')) {
            mobileMenuContainer.style.opacity = '1';
        } else {
            mobileMenuContainer.style.opacity = '0';
        }
    });

    // Create lightbox background for tablet
    let lightbox = secondaryHeader.querySelector('.lightbox-background');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.className = 'lightbox-background tablet-only';
        secondaryHeader.appendChild(lightbox);

        lightbox.addEventListener('click', () => {
            mobileMenuContainer.classList.remove('active');
            secondaryHeader.classList.remove('menu-open');
            mobileMenuContainer.style.opacity = '0';
        });
    }
}
