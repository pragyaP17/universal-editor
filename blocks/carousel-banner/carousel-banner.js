/**
 * Creates a carousel banner slide element
 * @param {Element} slide - The slide element containing data
 * @param {number} index - The slide index for alternating styles
 * @returns {Element} - The formatted slide element
 */
function createSlide(slide, index) {
  const slideWrapper = document.createElement('div');
  slideWrapper.className = 'carousel-banner__slide';

  // Add dark theme class to alternating slides (odd indices: 1, 3, 5...)
  if (index % 2 === 1) {
    slideWrapper.classList.add('carousel-banner__slide--dark');
  }

  const cells = slide.querySelectorAll(':scope > div');

  // Extract picture elements (already processed by EDS)
  const desktopPicture = cells[0]?.querySelector('picture');
  const tabletPicture = cells[1]?.querySelector('picture');
  const mobilePicture = cells[2]?.querySelector('picture');
  const imageAlt = cells[3]?.textContent.trim();
  const tagline = cells[4]?.textContent.trim();
  const title = cells[5]?.textContent.trim();
  const description = cells[6]?.innerHTML.trim();
  const paginationDescription = cells[7]?.textContent.trim();
  const ctaText = cells[8]?.textContent.trim();
  const ctaLink = cells[9]?.querySelector('a')?.href || cells[9]?.textContent.trim();

  // Create background image container with responsive picture element
  const imageContainer = document.createElement('div');
  imageContainer.className = 'carousel-banner__image';

  // Build a responsive picture element
  const picture = document.createElement('picture');

  // Desktop source (1350px and up)
  if (desktopPicture) {
    const desktopSource = desktopPicture.querySelector('source[media*="1350"]')
      || desktopPicture.querySelector('source:last-of-type');
    if (desktopSource) {
      const source = document.createElement('source');
      source.media = '(min-width: 1350px)';
      source.srcset = desktopSource.srcset;
      picture.appendChild(source);
    }
  }

  // Tablet source (640px to 1349px)
  if (tabletPicture) {
    const tabletSource = tabletPicture.querySelector('source[media*="640"]')
      || tabletPicture.querySelector('source:last-of-type');
    if (tabletSource) {
      const source = document.createElement('source');
      source.media = '(min-width: 640px)';
      source.srcset = tabletSource.srcset;
      picture.appendChild(source);
    }
  }

  // Mobile fallback (default img tag)
  const img = document.createElement('img');
  // LCP optimization: first slide gets eager + fetchpriority, others get lazy
  img.loading = index === 0 ? 'eager' : 'lazy';
  if (index === 0) {
    img.fetchPriority = 'high';
  }
  img.alt = imageAlt || '';

  if (mobilePicture) {
    const mobileImg = mobilePicture.querySelector('img');
    if (mobileImg) {
      img.src = mobileImg.src;
      img.srcset = mobileImg.srcset || '';
    }
  } else if (desktopPicture) {
    // Fallback to desktop if mobile not available
    const fallbackImg = desktopPicture.querySelector('img');
    if (fallbackImg) {
      img.src = fallbackImg.src;
      img.srcset = fallbackImg.srcset || '';
    }
  }

  picture.appendChild(img);
  imageContainer.appendChild(picture);

  // Create content container (split layout)
  const contentContainer = document.createElement('div');
  contentContainer.className = 'carousel-banner__content';

  // Left side - Text content
  const leftContent = document.createElement('div');
  leftContent.className = 'carousel-banner__text-content';

  if (tagline) {
    const taglineEl = document.createElement('div');
    taglineEl.className = 'carousel-banner__tagline';
    taglineEl.textContent = tagline;
    leftContent.appendChild(taglineEl);
  }

  if (title) {
    const titleEl = document.createElement('h2');
    titleEl.className = 'carousel-banner__title';
    titleEl.textContent = title;
    leftContent.appendChild(titleEl);
  }

  if (description) {
    const descEl = document.createElement('div');
    descEl.className = 'carousel-banner__description';
    descEl.innerHTML = description;
    leftContent.appendChild(descEl);
  }

  if (ctaText && ctaLink) {
    const ctaBtn = document.createElement('a');
    ctaBtn.className = 'carousel-banner__cta';
    ctaBtn.href = ctaLink;
    ctaBtn.textContent = ctaText;
    leftContent.appendChild(ctaBtn);
  }

  contentContainer.appendChild(leftContent);

  slideWrapper.appendChild(imageContainer);
  slideWrapper.appendChild(contentContainer);

  // Store pagination description for later use
  slideWrapper.dataset.paginationDesc = paginationDescription || title || '';

  return slideWrapper;
}

/**
 * Creates pagination indicators
 * @param {number} total - Total number of slides
 * @returns {Element} - The pagination container
 */
function createPagination(total, slides) {
  const paginationWrapper = document.createElement('div');
  paginationWrapper.className = 'carousel-banner__pagination-wrapper';

  const paginationContainer = document.createElement('div');
  paginationContainer.className = 'carousel-banner__pagination-container';

  for (let i = 0; i < total; i += 1) {
    const progressBox = document.createElement('div');
    progressBox.className = 'carousel-banner__progress-box';
    if (i === 0) progressBox.classList.add('active');
    progressBox.dataset.slideIndex = i;

    // Add dark theme class to pagination for odd slides (1, 3, 5...)
    if (i % 2 === 1) {
      progressBox.classList.add('carousel-banner__progress-box--dark');
    }

    // Progress bar wrapper (at the top)
    const progressWrapper = document.createElement('div');
    progressWrapper.className = 'carousel-banner__progress-wrapper';

    const progressFilled = document.createElement('div');
    progressFilled.className = 'carousel-banner__progress-filled';

    progressWrapper.appendChild(progressFilled);
    progressBox.appendChild(progressWrapper);

    // Label (tagline)
    const tagline = slides[i]?.querySelector('.carousel-banner__tagline')?.textContent || '';
    if (tagline) {
      const label = document.createElement('div');
      label.className = 'carousel-banner__progress-label';
      label.textContent = tagline;
      progressBox.appendChild(label);
    }

    // Description
    const paginationDesc = slides[i]?.dataset.paginationDesc || '';
    if (paginationDesc) {
      const desc = document.createElement('div');
      desc.className = 'carousel-banner__progress-desc';
      const descP = document.createElement('p');
      descP.textContent = paginationDesc;
      desc.appendChild(descP);
      progressBox.appendChild(desc);
    }

    paginationContainer.appendChild(progressBox);
  }

  paginationWrapper.appendChild(paginationContainer);
  return paginationWrapper;
}

/**
 * Decorates the carousel banner block
 * @param {Element} block - The block element
 */
export default function decorate(block) {
  const slides = [...block.children];
  const slidesWrapper = document.createElement('div');
  slidesWrapper.className = 'carousel-banner__slides';

  // Create slide elements
  const slideElements = slides.map((slide, index) => {
    const slideEl = createSlide(slide, index);
    // Make first slide active by default
    if (index === 0) {
      slideEl.classList.add('active');
    }
    return slideEl;
  });
  slideElements.forEach((slideEl) => {
    slidesWrapper.appendChild(slideEl);
  });

  // Clear original content
  block.innerHTML = '';

  // Add slides wrapper
  block.appendChild(slidesWrapper);

  // Add pagination
  const pagination = createPagination(slideElements.length, slideElements);
  block.appendChild(pagination);

  // Carousel state
  let currentSlide = 0;
  const autoplayDelay = 7000; // 7 seconds per slide

  // Declare functions using function declarations for proper hoisting
  /**
   * Advances to the next slide
   */
  function nextSlide() {
    const nextIndex = (currentSlide + 1) % slideElements.length;
    // eslint-disable-next-line no-use-before-define
    goToSlide(nextIndex);
  }

  /**
   * Updates the active slide
   * @param {number} index - The index of the slide to activate
   */
  function goToSlide(index) {
    const allSlides = slidesWrapper.querySelectorAll('.carousel-banner__slide');
    const allProgressBoxes = pagination.querySelectorAll('.carousel-banner__progress-box');
    const allProgressBars = pagination.querySelectorAll('.carousel-banner__progress-filled');

    // Remove active states and clear animations
    allSlides.forEach((s) => s.classList.remove('active'));
    allProgressBoxes.forEach((p) => p.classList.remove('active'));

    // Clear all progress bar animations
    allProgressBars.forEach((pb) => {
      pb.style.animation = 'none';
      // eslint-disable-next-line no-unused-expressions
      pb.offsetWidth; // Force reflow
    });

    // Add active state to current slide
    currentSlide = index;
    allSlides[currentSlide].classList.add('active');
    allProgressBoxes[currentSlide].classList.add('active');

    // Toggle dark theme on pagination container for odd slides
    const paginationContainer = pagination.querySelector('.carousel-banner__pagination-container');
    if (currentSlide % 2 === 1) {
      paginationContainer.classList.add('carousel-banner__pagination-container--dark');
    } else {
      paginationContainer.classList.remove('carousel-banner__pagination-container--dark');
    }

    // Start progress bar animation with auto-advance
    const progressBar = allProgressBars[currentSlide];
    progressBar.style.animation = `progress-bar ${autoplayDelay}ms linear`;

    // Auto-advance to next slide when progress completes
    progressBar.addEventListener('animationend', () => {
      nextSlide();
    }, { once: true });
  }

  // Pagination click handlers
  const progressBoxes = pagination.querySelectorAll('.carousel-banner__progress-box');
  progressBoxes.forEach((box) => {
    box.addEventListener('click', () => {
      const index = parseInt(box.dataset.slideIndex, 10);
      goToSlide(index);
    });
  });

  // Initialize first slide and start autoplay
  goToSlide(0);
}
