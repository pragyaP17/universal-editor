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
