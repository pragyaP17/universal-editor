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
                const itemLink = document.createElement('a');
                itemLink.textContent = link.textContent.replace(/\s+/g, ' ').trim();
                itemLink.href = '#';

                // Add right arrow
                const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                arrow.classList.add('right-arrow');
                arrow.setAttribute('width', '32');
                arrow.setAttribute('height', '32');
                arrow.setAttribute('viewBox', '0 0 24 24');
                const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                arrowPath.setAttribute('d', 'M9 6l6 6-6 6');
                arrowPath.setAttribute('fill', 'none');
                arrowPath.setAttribute('stroke', '#ccc');
                arrowPath.setAttribute('stroke-width', '2');
                arrow.appendChild(arrowPath);
                itemLink.appendChild(arrow);

                menuItem.appendChild(itemLink);

                // Create submenu
                const submenu = document.createElement('ul');
                submenu.className = 'submenu';

                // Back button
                const backItem = document.createElement('li');
                backItem.className = 'back';
                const backLink = document.createElement('a');
                backLink.href = '#';

                const backArrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                backArrow.classList.add('mobile-arrow-left');
                backArrow.setAttribute('width', '32');
                backArrow.setAttribute('height', '32');
                backArrow.setAttribute('viewBox', '0 0 24 24');
                const backPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                backPath.setAttribute('d', 'M15 18l-6-6 6-6');
                backPath.setAttribute('fill', 'none');
                backPath.setAttribute('stroke', '#ccc');
                backPath.setAttribute('stroke-width', '2');
                backArrow.appendChild(backPath);
                backLink.appendChild(backArrow);
                backLink.appendChild(document.createTextNode(' Back'));
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
                itemLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    menuItem.classList.add('active');
                });

                // Click handler for back button
                backLink.addEventListener('click', (e) => {
                    e.preventDefault();
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
