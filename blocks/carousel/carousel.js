import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  if (!rows.length) return;

  // Helper function to recursively check if an element has any non-empty text content
  function hasContent(element) {
    if (!element) return false;

    // Get all text content recursively, trim whitespace
    const textContent = element.textContent?.trim();
    if (textContent) return true;

    // Check if it has any child elements with content
    return Array.from(element.children).some((child) => hasContent(child));
  }

  // Helper function to recursively find a picture element
  function hasPicture(element) {
    if (!element) return false;

    // Direct check
    if (element.querySelector('picture')) return true;

    // Check all nested children
    return Array.from(element.children).some((child) => hasPicture(child));
  }

  // Helper function to recursively find a link element
  function hasLink(element) {
    if (!element) return false;

    // Direct check
    if (element.querySelector('a')) return true;

    // Check all nested children
    return Array.from(element.children).some((child) => hasLink(child));
  }

  // Validate that all required fields are filled
  let allFieldsFilled = true;

  rows.forEach((row) => {
    const cells = [...row.children];
    const cellCount = cells.length;

    if (cellCount === 4) {
      // Info component: title (0), description (1) are required
      if (!hasContent(cells[0]) || !hasContent(cells[1])) {
        allFieldsFilled = false;
      }
    } else if (cellCount >= 5) {
      // Card component: image (0), tagline (1), title (2), description (3), link (4) are required
      if (!hasPicture(cells[0])
          || !hasContent(cells[1])
          || !hasContent(cells[2])
          || !hasContent(cells[3])
          || !hasLink(cells[4])) {
        allFieldsFilled = false;
      }
    }
  });

  // Don't render if any fields are empty
  if (!allFieldsFilled) return;

  // Detect if this is a mixed carousel (info + cards) or standalone component
  // Check all rows to determine the structure
  const cellCounts = rows.map((row) => row.children.length);
  const hasInfoRow = cellCounts.includes(4);
  const hasCardRows = cellCounts.some((count) => count >= 5);

  // If only info row (4 cells), render standalone info
  if (hasInfoRow && !hasCardRows && rows.length === 1) {
    const cells = [...rows[0].children];
    const title = cells[0]?.textContent.trim() || '';
    const description = cells[1]?.innerHTML || '';
    const quickLinks = cells[3]?.querySelector('ul');

    // Create header
    const header = document.createElement('div');
    header.className = 'carousel-header carousel-header-info';

    const headerTitle = document.createElement('h2');
    headerTitle.className = 'carousel-header-title';
    headerTitle.textContent = title;
    header.appendChild(headerTitle);

    // Create info slide
    const infoSlide = document.createElement('div');
    infoSlide.className = 'carousel-info-slide';

    const content = document.createElement('div');
    content.className = 'carousel-info-content';

    const descElement = document.createElement('div');
    descElement.className = 'carousel-info-description';
    descElement.innerHTML = description;
    content.appendChild(descElement);

    // Add quick links if available
    if (quickLinks) {
      const quickLinksContainer = document.createElement('div');
      quickLinksContainer.className = 'carousel-quick-links';

      const toggle = document.createElement('button');
      toggle.className = 'carousel-quick-links-toggle';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '<span class="quick-links-text">Quick Links</span><span class="quick-links-icon"></span>';

      const quickLinksContent = document.createElement('div');
      quickLinksContent.className = 'carousel-quick-links-content';
      quickLinksContent.style.maxHeight = '0';
      quickLinksContent.appendChild(quickLinks.cloneNode(true));

      toggle.addEventListener('click', () => {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!isExpanded));
        quickLinksContainer.classList.toggle('expanded', !isExpanded);
        quickLinksContent.style.maxHeight = isExpanded ? '0' : `${quickLinksContent.scrollHeight}px`;
      });

      quickLinksContainer.append(toggle, quickLinksContent);
      content.appendChild(quickLinksContainer);
    }

    infoSlide.appendChild(content);

    // Replace block content
    block.textContent = '';
    block.append(header, infoSlide);
    return;
  }

  // Render full carousel (with or without info slide)
  const carouselContainer = document.createElement('div');
  carouselContainer.className = 'carousel-slides-container';

  const carouselTrack = document.createElement('div');
  carouselTrack.className = 'carousel-track';

  const slides = [];
  let headerTitle = '';

  // Process each row
  rows.forEach((row, index) => {
    const cells = [...row.children];
    const cellCount = cells.length;

    // Info slide (4 cells)
    if (cellCount === 4) {
      const slide = document.createElement('div');
      slide.className = 'carousel-slide carousel-info-slide';

      const content = document.createElement('div');
      content.className = 'carousel-info-content';

      // Extract title for header
      if (cells[0]) {
        headerTitle = cells[0].textContent.trim();
      }

      // Description
      if (cells[1]) {
        const desc = document.createElement('div');
        desc.className = 'carousel-info-description';
        desc.innerHTML = cells[1].innerHTML;
        content.appendChild(desc);
      }

      // Quick Links
      if (cells[3] && cells[3].querySelector('ul')) {
        const quickLinksContainer = document.createElement('div');
        quickLinksContainer.className = 'carousel-quick-links';

        const toggle = document.createElement('button');
        toggle.className = 'carousel-quick-links-toggle';
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = '<span class="quick-links-text">Quick Links</span><span class="quick-links-icon"></span>';

        const quickLinksContent = document.createElement('div');
        quickLinksContent.className = 'carousel-quick-links-content';
        quickLinksContent.style.maxHeight = '0';
        quickLinksContent.appendChild(cells[3].querySelector('ul').cloneNode(true));

        toggle.addEventListener('click', () => {
          const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
          toggle.setAttribute('aria-expanded', String(!isExpanded));
          quickLinksContainer.classList.toggle('expanded', !isExpanded);
          quickLinksContent.style.maxHeight = isExpanded ? '0' : `${quickLinksContent.scrollHeight}px`;
        });

        quickLinksContainer.append(toggle, quickLinksContent);
        content.appendChild(quickLinksContainer);
      }

      slide.appendChild(content);
      slides.push(slide);
    } else if (cellCount >= 5) {
      // Card slide (5+ cells)
      // Use first card title as header if no info slide
      if (!headerTitle && cells[2]) {
        headerTitle = cells[2].textContent.trim();
      }

      const slide = document.createElement('div');
      slide.className = 'carousel-slide carousel-card-slide';
      slide.dataset.slideIndex = index;

      const card = document.createElement('div');
      card.className = 'carousel-card';

      // Image (first cell)
      if (cells[0] && cells[0].querySelector('picture')) {
        const imageContainer = document.createElement('div');
        imageContainer.className = 'carousel-card-image';
        const picture = cells[0].querySelector('picture');
        imageContainer.appendChild(picture);
        card.appendChild(imageContainer);
      }

      // Card content
      const cardContent = document.createElement('div');
      cardContent.className = 'carousel-card-content';

      // Tagline (second cell)
      if (cells[1]) {
        const tagline = document.createElement('div');
        tagline.className = 'carousel-card-tagline';
        tagline.textContent = cells[1].textContent.trim();
        cardContent.appendChild(tagline);
      }

      // Title (third cell)
      if (cells[2]) {
        const title = document.createElement('h3');
        title.className = 'carousel-card-title';
        title.textContent = cells[2].textContent.trim();
        cardContent.appendChild(title);
      }

      // Description (fourth cell)
      if (cells[3]) {
        const desc = document.createElement('div');
        desc.className = 'carousel-card-description';
        desc.innerHTML = cells[3].innerHTML;
        cardContent.appendChild(desc);
      }

      card.appendChild(cardContent);

      // Link overlay (fifth cell)
      if (cells[4] && cells[4].querySelector('a')) {
        const link = cells[4].querySelector('a');
        const overlay = document.createElement('a');
        overlay.href = link.href;
        overlay.className = 'carousel-card-link-overlay';
        overlay.setAttribute('aria-label', cells[2]?.textContent.trim() || 'View content');
        card.appendChild(overlay);
      }

      slide.appendChild(card);
      slides.push(slide);
    }
  });

  // Add slides to track
  slides.forEach((slide) => carouselTrack.appendChild(slide));
  carouselContainer.appendChild(carouselTrack);

  // Create sticky header with title and navigation
  const header = document.createElement('div');
  header.className = 'carousel-header';

  const headerTitleElement = document.createElement('h2');
  headerTitleElement.className = 'carousel-header-title';
  headerTitleElement.textContent = headerTitle;

  // Create navigation controls
  const controls = document.createElement('div');
  controls.className = 'carousel-controls';

  const prevButton = document.createElement('button');
  prevButton.className = 'carousel-nav-button carousel-nav-prev';
  prevButton.setAttribute('type', 'button');
  prevButton.setAttribute('aria-label', 'Previous');
  prevButton.innerHTML = `
    <span class="carousel-nav-icon"></span>
    <span class="carousel-nav-text">Previous</span>
  `;

  const nextButton = document.createElement('button');
  nextButton.className = 'carousel-nav-button carousel-nav-next';
  nextButton.setAttribute('type', 'button');
  nextButton.setAttribute('aria-label', 'Next');
  nextButton.innerHTML = `
    <span class="carousel-nav-icon"></span>
    <span class="carousel-nav-text">Next</span>
  `;

  controls.appendChild(prevButton);
  controls.appendChild(nextButton);

  header.appendChild(headerTitleElement);
  header.appendChild(controls);

  // Create scrollbar
  const scrollbarContainer = document.createElement('div');
  scrollbarContainer.className = 'carousel-scrollbar';

  const scrollbarTrack = document.createElement('div');
  scrollbarTrack.className = 'carousel-scrollbar-track';

  const scrollbarThumb = document.createElement('div');
  scrollbarThumb.className = 'carousel-scrollbar-thumb';

  scrollbarTrack.appendChild(scrollbarThumb);
  scrollbarContainer.appendChild(scrollbarTrack);

  // Clear block and add new structure
  block.textContent = '';
  block.appendChild(header);
  block.appendChild(carouselContainer);
  block.appendChild(scrollbarContainer);

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Carousel scroll functionality
  function updateScrollbar() {
    const { scrollLeft, scrollWidth, clientWidth } = carouselContainer;
    const maxScroll = scrollWidth - clientWidth;
    const scrollPercentage = maxScroll > 0 ? (scrollLeft / maxScroll) : 0;

    const trackWidth = scrollbarTrack.clientWidth;
    const thumbWidthRatio = (clientWidth / scrollWidth) * trackWidth;
    const thumbWidth = Math.max(50, thumbWidthRatio);
    const thumbPosition = scrollPercentage * (trackWidth - thumbWidth);

    scrollbarThumb.style.width = `${thumbWidth}px`;
    scrollbarThumb.style.transform = `translateX(${thumbPosition}px)`;

    // Buttons are always enabled for looping behavior
    prevButton.disabled = false;
    nextButton.disabled = false;
  }

  // Scroll by one card width with looping
  function scrollByCard(direction) {
    const { scrollLeft, scrollWidth, clientWidth } = carouselContainer;
    const maxScroll = scrollWidth - clientWidth;
    const cardWidth = 420; // Increased scroll distance (card width + gap)

    if (direction === 'next') {
      // If at the end, loop to beginning
      if (scrollLeft >= maxScroll - 1) {
        carouselContainer.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        carouselContainer.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
      return;
    }

    // If at the beginning, loop to end
    if (scrollLeft <= 0) {
      carouselContainer.scrollTo({ left: maxScroll, behavior: 'smooth' });
    } else {
      carouselContainer.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  }

  prevButton.addEventListener('click', () => scrollByCard('prev'));
  nextButton.addEventListener('click', () => scrollByCard('next'));

  // Scrollbar drag functionality
  let isDragging = false;
  let startX = 0;
  let startScrollLeft = 0;

  scrollbarThumb.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startScrollLeft = carouselContainer.scrollLeft;
    scrollbarThumb.classList.add('dragging');
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    const trackWidth = scrollbarTrack.clientWidth;
    const thumbWidth = scrollbarThumb.clientWidth;
    const scrollWidth = carouselContainer.scrollWidth - carouselContainer.clientWidth;

    const scrollDelta = (deltaX / (trackWidth - thumbWidth)) * scrollWidth;
    carouselContainer.scrollLeft = startScrollLeft + scrollDelta;
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      scrollbarThumb.classList.remove('dragging');
    }
  });

  // Click on track to jump
  scrollbarTrack.addEventListener('click', (e) => {
    if (e.target === scrollbarThumb) return;

    const trackRect = scrollbarTrack.getBoundingClientRect();
    const clickPosition = e.clientX - trackRect.left;
    const trackWidth = scrollbarTrack.clientWidth;
    const maxScroll = carouselContainer.scrollWidth - carouselContainer.clientWidth;
    const { clientWidth } = carouselContainer;

    const scrollRatio = clickPosition / trackWidth;
    const targetScroll = (scrollRatio * (maxScroll + clientWidth)) - (clientWidth / 2);
    carouselContainer.scrollTo({ left: targetScroll, behavior: 'smooth' });
  });

  // Update scrollbar on scroll
  carouselContainer.addEventListener('scroll', updateScrollbar);

  // Handle window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateScrollbar();
    }, 100);
  });

  // Initialize
  setTimeout(updateScrollbar, 100);
}
