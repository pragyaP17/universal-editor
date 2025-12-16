import { decorateIcons } from '../../scripts/aem.js';

export default function decorate(block) {
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

        // Create a clone of the existing list for desktop navigation
        const desktopList = existingList.cloneNode(true);

        // Create tablet dropdown for the last 3 links - using three dots menu as shown in screenshot
        const tabletDropdownToggle = document.createElement('button');
        tabletDropdownToggle.className = 'agreement-tablet-toggle';
        tabletDropdownToggle.innerHTML = '<span class="dots">•••</span>';

        const tabletDropdown = document.createElement('div');
        tabletDropdown.className = 'agreement-tablet-dropdown';

        // Get all navigation links
        const allLinks = desktopList.querySelectorAll('li');
        const totalLinks = allLinks.length;

        // Create tablet dropdown manually with specific items
        // We'll hard-code the last three links as per the screenshot
        const dropdownItems = [
            { href: '#partners', text: 'Partners' },
            { href: '#resources', text: 'Resources' },
            { href: '#next-steps', text: 'Next Steps' }
        ];

        dropdownItems.forEach((item) => {
            const dropdownItem = document.createElement('a');
            dropdownItem.className = 'tablet-dropdown-item';
            dropdownItem.href = item.href;
            dropdownItem.textContent = item.text;
            tabletDropdown.appendChild(dropdownItem);
        });

        // Mark the corresponding items in the main nav as tablet-hidden if they exist
        const navTexts = dropdownItems.map(item => item.text);
        Array.from(allLinks).forEach(li => {
            const linkText = li.querySelector('a')?.textContent;
            if (linkText && navTexts.includes(linkText)) {
                li.classList.add('tablet-hidden');
            }
        });

        // Add click event listener for tablet toggle
        tabletDropdownToggle.addEventListener('click', () => {
            tabletDropdownToggle.classList.toggle('expanded');
            tabletDropdown.classList.toggle('open');
        });

        // Add the desktop list to the desktop row
        desktopRow.appendChild(desktopList);

        // Add tablet dropdown toggle and dropdown - will be hidden in desktop view via CSS
        const tabletContainer = document.createElement('div');
        tabletContainer.className = 'tablet-only-container';
        tabletContainer.appendChild(tabletDropdownToggle);
        tabletContainer.appendChild(tabletDropdown);
        desktopRow.appendChild(tabletContainer);

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

        // Add click event listener for mobile toggle to show/hide dropdown
        mobileToggle.addEventListener('click', () => {
            // Toggle expanded class on the button for arrow rotation
            mobileToggle.classList.toggle('expanded');
            // Toggle open class on the dropdown to show/hide it
            dropdown.classList.toggle('open');
        });

        // Create mobile dropdown with all navigation items
        const dropdown = document.createElement('div');
        dropdown.className = 'agreement-dropdown';

        // Helper function for smooth scrolling with offset
        const handleSmoothScroll = (e) => {
            const link = e.currentTarget;
            const href = link.getAttribute('href');

            // Close dropdowns if they are open (unconditionally for any link click)
            if (mobileToggle.classList.contains('expanded')) {
                mobileToggle.classList.remove('expanded');
                dropdown.classList.remove('open');
            }

            if (tabletDropdownToggle.classList.contains('expanded')) {
                tabletDropdownToggle.classList.remove('expanded');
                tabletDropdown.classList.remove('open');
            }

            // Only handle internal links for smooth scrolling
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    // Update URL without jump
                    history.pushState(null, null, href);

                    // Use a forced approach to ensure reliable scrolling:

                    // 1. Get header offset based on screen width
                    const headerOffset = window.innerWidth >= 1024 ? 181 : 151;

                    // 2. Get absolute position of the element
                    const elementRect = targetElement.getBoundingClientRect();
                    const absoluteTop = elementRect.top + window.pageYOffset;

                    // 3. First scroll - perform initial smooth scroll
                    window.scrollTo({
                        top: absoluteTop - headerOffset,
                        behavior: "smooth"
                    });

                    // 4. Forced correction after animation with multiple checks
                    const checkAndAdjust = () => {
                        // Get element's position again after previous scroll
                        const newRect = targetElement.getBoundingClientRect();

                        // Calculate how far off we are from desired position
                        const offset = newRect.top - headerOffset;

                        // If position is off by more than 2px, make immediate adjustment
                        if (Math.abs(offset) > 2) {
                            window.scrollTo(0, window.pageYOffset + offset);

                            // Schedule another check for any residual offset
                            setTimeout(checkAndAdjust, 100);
                        }
                    };

                    // Start position checks after initial scroll animation
                    setTimeout(checkAndAdjust, 750);

                    // Make a final adjustment after everything is fully loaded
                    setTimeout(checkAndAdjust, 1500);

                    // Update active state in all navigations
                    updateActiveLinks(targetId);
                }
            }

            // Handle active state for dropdown items is now handled by updateActiveLinks
        };

        const navLinks = existingList.querySelectorAll('a');
        navLinks.forEach((link, index) => {
            const dropdownItem = document.createElement('a');
            dropdownItem.className = 'dropdown-item';
            if (index === 0) dropdownItem.classList.add('active');
            dropdownItem.href = link.href;
            dropdownItem.title = link.title;
            dropdownItem.textContent = link.textContent;

            // Add click event listener for smooth scroll and closing dropdown
            dropdownItem.addEventListener('click', handleSmoothScroll);

            dropdown.appendChild(dropdownItem);
        });

        // Make first desktop link active by default
        const firstDesktopLink = desktopList.querySelector('li:first-child a');
        if (firstDesktopLink) {
            firstDesktopLink.classList.add('active');
        }

        // Add smooth scroll to desktop links as well
        desktopList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', handleSmoothScroll);
        });

        // Add smooth scroll to tablet dropdown items
        tabletDropdown.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', handleSmoothScroll);
        });

        // Helper function to update active state in all navigation menus
        const updateActiveLinks = (sectionId) => {
            // First, remove active class from all navigation links
            const allNavLinks = [
                ...desktopList.querySelectorAll('a'),
                ...dropdown.querySelectorAll('a'),
                ...tabletDropdown.querySelectorAll('a')
            ];

            // Find the corresponding text for this section
            let sectionText = '';
            allNavLinks.forEach(link => {
                const linkHref = link.getAttribute('href') || '';
                if (linkHref.endsWith(`#${sectionId}`)) {
                    sectionText = link.textContent;
                }
            });

            // Update classes on all links
            allNavLinks.forEach(link => {
                link.classList.remove('active');
                const linkHref = link.getAttribute('href') || '';
                // If this is the link that points to the current section, add active class
                if (linkHref.endsWith(`#${sectionId}`)) {
                    link.classList.add('active');
                }
            });

            // Always update mobile toggle text with current section
            if (sectionText) {
                mobileToggle.querySelector('.text').textContent = sectionText;
            }

            // For desktop view, we need to find the li elements and update their a elements
            const desktopLinkElements = desktopList.querySelectorAll('li a');
            desktopLinkElements.forEach(link => {
                const linkHref = link.getAttribute('href') || '';
                if (linkHref.endsWith(`#${sectionId}`)) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        };

        // Setup Intersection Observer to detect when sections are in view
        const setupSectionObserver = () => {
            // Get all section IDs from the navigation links
            const sectionIds = new Set();
            const allLinks = [
                ...desktopList.querySelectorAll('a'),
                ...tabletDropdown.querySelectorAll('a')
            ];

            allLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    sectionIds.add(href.substring(1));
                }
            });

            // Setup observer with options
            const observerOptions = {
                root: null, // viewport
                rootMargin: window.innerWidth >= 1024 ? '-181px 0px 0px 0px' : '-151px 0px 0px 0px', // adjust based on header height
                threshold: 0.1 // trigger when at least 10% of the target is visible
            };

            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // When section enters viewport
                    if (entry.isIntersecting) {
                        // Get section text from links for this section
                        const sectionId = entry.target.id;
                        updateActiveLinks(sectionId);

                        // Update URL without causing scroll (only if user is actually scrolling, not clicking)
                        if (!window.isNavigatingByClick) {
                            history.replaceState(null, null, `#${sectionId}`);

                            // Force update of the mobile toggle text
                            const allNavLinks = [
                                ...desktopList.querySelectorAll('a'),
                                ...dropdown.querySelectorAll('a'),
                                ...tabletDropdown.querySelectorAll('a')
                            ];

                            let sectionText = '';
                            allNavLinks.forEach(link => {
                                const linkHref = link.getAttribute('href') || '';
                                if (linkHref.endsWith(`#${sectionId}`)) {
                                    sectionText = link.textContent;
                                }
                            });

                            if (sectionText) {
                                mobileToggle.querySelector('.text').textContent = sectionText;
                            }
                        }
                    }
                });
            }, observerOptions);

            // Observe all sections
            sectionIds.forEach(id => {
                const section = document.getElementById(id);
                if (section) {
                    sectionObserver.observe(section);
                }
            });
        };

        // Set up a flag to differentiate between scrolling and clicking
        window.isNavigatingByClick = false;
        const originalHandleSmoothScroll = handleSmoothScroll;

        // Wrap the original function to set the flag
        const wrappedHandleSmoothScroll = (e) => {
            window.isNavigatingByClick = true;
            originalHandleSmoothScroll(e);
            setTimeout(() => {
                window.isNavigatingByClick = false;
            }, 1000); // Reset after animation completes
        };

        // Replace click handlers with wrapped version
        desktopList.querySelectorAll('a').forEach(link => {
            link.removeEventListener('click', handleSmoothScroll);
            link.addEventListener('click', wrappedHandleSmoothScroll);
        });

        dropdown.querySelectorAll('a').forEach(link => {
            link.removeEventListener('click', handleSmoothScroll);
            link.addEventListener('click', wrappedHandleSmoothScroll);
        });

        tabletDropdown.querySelectorAll('a').forEach(link => {
            link.removeEventListener('click', handleSmoothScroll);
            link.addEventListener('click', wrappedHandleSmoothScroll);
        });

        // Initialize the section observer when DOM is fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setupSectionObserver();

                // Check if there's a hash in the URL on load
                if (window.location.hash) {
                    const sectionId = window.location.hash.substring(1);
                    updateActiveLinks(sectionId);
                }
            });
        } else {
            setupSectionObserver();

            // Check if there's a hash in the URL on load
            if (window.location.hash) {
                const sectionId = window.location.hash.substring(1);
                updateActiveLinks(sectionId);
            }
        }

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
            right.appendChild(stayInformedBtn);

            // Modal HTML (pixel-perfect NVIDIA match)
            const modalHTML = '<div class="nv-modalcontainer" style="display:none;">'
                + '<div class="nv-modal-overlay"></div>'
                + '<div class="nv-modal">'
                + '<button class="nv-modal-close" aria-label="Close">&times;</button>'
                + '<div class="nv-modal-header">'
                + '<h2 class="nv-modal-title">Get The Latest Robotics News</h2>'
                + '<div class="nv-modal-subtitle">Sign up for latest enterprise news, announcements, and more from NVIDIA.</div>'
                + '</div>'
                + '<form class="nv-modal-form" novalidate>'
                + '<div class="nv-modal-row">'
                + '<div class="nv-modal-field">'
                + '<input type="text" id="nv-firstname" name="firstname" placeholder="First Name" autocomplete="given-name" required />'
                + '<div class="nv-modal-error"></div>'
                + '</div>'
                + '<div class="nv-modal-field">'
                + '<input type="text" id="nv-lastname" name="lastname" placeholder="Last Name" autocomplete="family-name" required />'
                + '<div class="nv-modal-error"></div>'
                + '</div>'
                + '</div>'
                + '<div class="nv-modal-row">'
                + '<div class="nv-modal-field">'
                + '<input type="email" id="nv-email" name="email" placeholder="Business Email Address" autocomplete="email" required />'
                + '<div class="nv-modal-error"></div>'
                + '</div>'
                + '<div class="nv-modal-field">'
                + '<input type="text" id="nv-organization" name="organization" placeholder="Organization/University Name" autocomplete="organization" required />'
                + '<div class="nv-modal-error"></div>'
                + '</div>'
                + '</div>'
                + '<div class="nv-modal-row">'
                + '<div class="nv-modal-field">'
                + '<select id="nv-industry" name="industry" required>'
                + '<option value="">Industry</option>'
                + '<option value="aerospace">Aerospace</option>'
                + '<option value="automotive">Automotive</option>'
                + '<option value="education">Education</option>'
                + '<option value="energy">Energy</option>'
                + '<option value="finance">Finance</option>'
                + '<option value="government">Government</option>'
                + '<option value="healthcare">Healthcare</option>'
                + '<option value="manufacturing">Manufacturing</option>'
                + '<option value="retail">Retail</option>'
                + '<option value="technology">Technology</option>'
                + '<option value="other">Other</option>'
                + '</select>'
                + '<div class="nv-modal-error"></div>'
                + '</div>'
                + '<div class="nv-modal-field">'
                + '<select id="nv-jobtitle" name="jobtitle" required>'
                + '<option value="">Job Title</option>'
                + '<option value="ceo">CEO</option>'
                + '<option value="cto">CTO</option>'
                + '<option value="engineer">Engineer</option>'
                + '<option value="manager">Manager</option>'
                + '<option value="student">Student</option>'
                + '<option value="other">Other</option>'
                + '</select>'
                + '<div class="nv-modal-error"></div>'
                + '</div>'
                + '</div>'
                + '<div class="nv-modal-row">'
                + '<div class="nv-modal-field">'
                + '<select id="nv-location" name="location" required>'
                + '<option value="">Location</option>'
                + '<option value="IN">India</option>'
                + '<option value="US">United States</option>'
                + '<option value="GB">United Kingdom</option>'
                + '<option value="CN">China</option>'
                + '<option value="JP">Japan</option>'
                + '<option value="DE">Germany</option>'
                + '<option value="FR">France</option>'
                + '<option value="other">Other</option>'
                + '</select>'
                + '<div class="nv-modal-error"></div>'
                + '</div>'
                + '<div class="nv-modal-field">'
                + '<select id="nv-language" name="language" required>'
                + '<option value="">Preferred Language</option>'
                + '<option value="en-in">English (India)</option>'
                + '<option value="en-us">English (US)</option>'
                + '<option value="zh-cn">Chinese (Simplified)</option>'
                + '<option value="zh-tw">Chinese (Traditional)</option>'
                + '<option value="ja-jp">Japanese</option>'
                + '<option value="de-de">German</option>'
                + '<option value="fr-fr">French</option>'
                + '<option value="other">Other</option>'
                + '</select>'
                + '<div class="nv-modal-error"></div>'
                + '</div>'
                + '</div>'
                + '<div class="nv-modal-row nv-modal-bottom">'
                + '<div class="nv-modal-policy">'
                + '<a href="https://www.nvidia.com/en-in/about-nvidia/privacy-policy/" target="_blank" class="nv-modal-policy-link">NVIDIA Privacy Policy</a>'
                + '</div>'
                + '<div class="nv-modal-submit">'
                + '<button type="submit" class="nv-modal-submit-btn">Submit</button>'
                + '</div>'
                + '</div>'
                + '</form>'
                + '</div>'
                + '</div>';

            // Inject modal into DOM
            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = modalHTML;
            document.body.appendChild(modalContainer.firstElementChild);

            const modal = document.querySelector('.nv-modalcontainer');
            const closeBtn = modal.querySelector('.nv-modal-close');
            const form = modal.querySelector('.nv-modal-form');

            // Modal open/close logic
            stayInformedBtn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });

            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                }
            });

            document.addEventListener('keydown', (e) => {
                if (modal.style.display === 'flex' && e.key === 'Escape') {
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                }
            });

            // Real-time error clearing - clear errors as user types/selects
            form.querySelectorAll('input').forEach(input => {
                input.addEventListener('input', function () {
                    if (this.classList.contains('nv-modal-error-border')) {
                        this.classList.remove('nv-modal-error-border');
                        const errorEl = this.parentElement.querySelector('.nv-modal-error');
                        if (errorEl) {
                            errorEl.textContent = '';
                        }
                    }
                });
            });

            form.querySelectorAll('select').forEach(select => {
                select.addEventListener('change', function () {
                    if (this.classList.contains('nv-modal-error-border')) {
                        this.classList.remove('nv-modal-error-border');
                        const errorEl = this.parentElement.querySelector('.nv-modal-error');
                        if (errorEl) {
                            errorEl.textContent = '';
                        }
                    }
                });
            });

            // Validation logic
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                let valid = true;

                // Remove previous errors and error borders
                form.querySelectorAll('.nv-modal-error').forEach(el => el.textContent = '');
                form.querySelectorAll('input, select').forEach(el => el.classList.remove('nv-modal-error-border'));

                // Validate required fields
                const fields = [
                    { id: 'nv-firstname', error: 'This field is required.' },
                    { id: 'nv-lastname', error: 'This field is required.' },
                    { id: 'nv-email', error: 'An email address is required.' },
                    { id: 'nv-organization', error: 'This field is required.' },
                    { id: 'nv-industry', error: 'This field is required.' },
                    { id: 'nv-jobtitle', error: 'This field is required.' },
                    { id: 'nv-location', error: 'This field is required.' },
                    { id: 'nv-language', error: 'This field is required.' }
                ];

                fields.forEach(fieldObj => {
                    const field = form.querySelector('#' + fieldObj.id);
                    const errorEl = field.parentElement.querySelector('.nv-modal-error');

                    if (!field.value.trim() || (field.tagName === 'SELECT' && field.value === '')) {
                        errorEl.textContent = fieldObj.error;
                        field.classList.add('nv-modal-error-border');
                        valid = false;
                    }

                    // Email format validation
                    if (fieldObj.id === 'nv-email' && field.value.trim()) {
                        const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
                        if (!emailPattern.test(field.value)) {
                            errorEl.textContent = 'Please enter a valid email address.';
                            field.classList.add('nv-modal-error-border');
                            valid = false;
                        }
                    }
                });

                if (valid) {
                    // Success logic here (AJAX or form submit)
                    console.log('Form submitted successfully');
                    form.reset();
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                }
            });
        }

        // Append the left and right containers to wrapper
        wrapper.appendChild(left);
        wrapper.appendChild(right);

        // Replace the original content with our built structure
        block.innerHTML = '';
        block.appendChild(wrapper);
    }

    // Decorate icons after DOM is built
    decorateIcons(block);
}
