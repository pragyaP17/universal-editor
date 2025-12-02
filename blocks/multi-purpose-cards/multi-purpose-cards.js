/**
 * Decorate function for multi-purpose-cards block
 * Handles 5 card variations: linked, cta, simple-linked, video, simple-cta
 */

/**
 * Decorate function for multi-purpose-cards block
 * Handles 5 card variations: linked, cta, simple-linked, video, simple-cta
 */

function createVideoModal(videoUrl) {
  const modal = document.createElement('div');
  modal.className = 'video-modal active';
  modal.innerHTML = `
    <div class="video-modal-content">
      <button class="video-modal-close" aria-label="Close video"></button>
      <div class="video-container">
              <iframe 
                src='${videoUrl.replace('watch?v=', 'embed/')}?autoplay=1' 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
              </iframe>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  const closeModal = () => {
    modal.classList.remove('active');
    setTimeout(() => {
      document.body.removeChild(modal);
      document.body.style.overflow = '';
    }, 300);
  };

  modal
    .querySelector('.video-modal-close')
    .addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Close on Escape key
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
}

function determineCardType(cells) {
  // Linked Card: 6 fields with Customer/Products in description
  if (cells.length === 6 && cells[4].textContent.includes('Customer:')) {
    return 'linked';
  }
  // CTA Card: 6 cells, <ul> in cell 3, and a link in cell 5
  if (
    cells.length === 6
    && cells[3].querySelector('ul')
    && cells[5].querySelector && cells[5].querySelector('a')
  ) {
    return 'cta';
  }
  // Video Card: 6 cells, YouTube link in cell 3
  if (
    cells.length === 6
    && cells[3].querySelector('a')?.href.includes('youtube.com')
  ) {
    return 'video';
  }
  // Simple Linked Card: 5 cells, date pattern in cell 1
  if (
    cells.length === 5
    && /[A-Z][a-z]+ \d+, \d{4}/.test(cells[1].textContent)
  ) {
    return 'simple-linked';
  }
  // Simple CTA Card: 5 cells
  if (cells.length === 5) {
    return 'simple-cta';
  }
  return 'unknown';
}

function buildLinkedCard(cells, card) {
  const image = cells[0].querySelector('picture') || cells[0].querySelector('img');
  const isFeatured = cells[1].textContent.trim().toLowerCase() === 'true';
  const tagline = cells[2].textContent.trim();
  const title = cells[3].textContent.trim();
  const description = cells[4].innerHTML;
  const cardLink = cells[5].querySelector('a')?.href || '';

  card.className = 'nv-teaser teaser nv-teaser-card nv-teaser-bg-white mpc-linked-card';
  card.innerHTML = '';

  const linkWrapper = document.createElement('a');
  linkWrapper.className = 'cmp-image-link';
  linkWrapper.href = cardLink;
  linkWrapper.target = '_self';

  const teaserDiv = document.createElement('div');
  teaserDiv.className = 'cmp-teaser';

  // Image
  if (image) {
    const imageDiv = document.createElement('div');
    imageDiv.className = 'cmp-teaser-image';
    imageDiv.appendChild(image.cloneNode(true));
    teaserDiv.appendChild(imageDiv);
  }

  // Content container
  const textContainer = document.createElement('div');
  textContainer.className = 'general-container-text';

  const textWrapper = document.createElement('div');
  textWrapper.className = 'text-left lap-text-left tab-text-left mob-text-left';
  textWrapper.style.width = 'unset';
  textWrapper.style.paddingBottom = '30px';

  // Featured badge + Tagline
  if (isFeatured || tagline) {
    const pretitleDiv = document.createElement('div');
    pretitleDiv.className = 'cmp-teaser-pretitle';

    if (isFeatured) {
      const badge = document.createElement('div');
      badge.className = 'featured-badge';
      badge.innerHTML = '<span class="p--small" style="padding: 5px;">Featured</span>';
      pretitleDiv.appendChild(badge);
    }

    if (tagline) {
      const taglineP = document.createElement('p');
      taglineP.className = 'p--small GWkvaBMW1y7Ro1IYoj1C dJN8vhFRwlvJh56wuFX5';
      taglineP.style.color = 'rgb(102, 102, 102)';
      taglineP.textContent = tagline;
      pretitleDiv.appendChild(taglineP);
    }

    textWrapper.appendChild(pretitleDiv);
  }

  // Title
  const titleH3 = document.createElement('h3');
  titleH3.className = 'cmp-teaser-title h-smallest nb3vEKWHDGzTyquyoor7';
  titleH3.textContent = title;
  textWrapper.appendChild(titleH3);

  // Description
  if (description) {
    const descDiv = document.createElement('div');
    descDiv.className = 'cmp-teaser-description';
    descDiv.innerHTML = description;
    textWrapper.appendChild(descDiv);
  }

  textContainer.appendChild(textWrapper);
  teaserDiv.appendChild(textContainer);
  linkWrapper.appendChild(teaserDiv);
  card.appendChild(linkWrapper);
}

function buildCtaCard(cells, card) {
  const image = cells[0].querySelector('picture') || cells[0].querySelector('img');
  const title = cells[1].textContent.trim();
  const bulletPoints = cells[3].querySelector('ul');
  const ctaText = cells[4].textContent.trim();
  const ctaLink = cells[5].querySelector('a')?.href || '';

  card.className = 'nv-teaser teaser nv-teaser-card nv-teaser-bg-white mpc-cta-card';
  card.innerHTML = '';

  const teaserDiv = document.createElement('div');
  teaserDiv.className = 'cmp-teaser';

  const holder = document.createElement('div');
  holder.className = 'nv-teaser-holder';

  // Image
  if (image) {
    const imageDiv = document.createElement('div');
    imageDiv.className = 'cmp-teaser-image';
    imageDiv.appendChild(image.cloneNode(true));
    holder.appendChild(imageDiv);
  }

  // Content container
  const textContainer = document.createElement('div');
  textContainer.className = 'general-container-text';

  const textWrapper = document.createElement('div');
  textWrapper.className = 'text-left lap-text-left tab-text-left mob-text-left';
  textWrapper.style.padding = '0px 20px';
  textWrapper.style.width = 'calc(100% - 40px)';

  // Title
  const titleH3 = document.createElement('h3');
  titleH3.className = 'cmp-teaser-title h-smallest';
  titleH3.textContent = title;
  textWrapper.appendChild(titleH3);

  // Description (bullet points)
  if (bulletPoints) {
    const descDiv = document.createElement('div');
    descDiv.className = 'cmp-teaser-description';
    descDiv.appendChild(bulletPoints.cloneNode(true));
    textWrapper.appendChild(descDiv);
  }

  // CTA
  if (ctaText && ctaLink) {
    const ctaContainer = document.createElement('div');
    ctaContainer.className = 'cmp-teaser-action-container';

    const ctaLinkEl = document.createElement('a');
    ctaLinkEl.className = 'nv-teaser-secondary-button';
    ctaLinkEl.href = ctaLink;
    ctaLinkEl.textContent = ctaText;

    // Add green chevron span after text
    const chevron = document.createElement('span');
    chevron.className = 'chevron';
    chevron.textContent = '\u203A'; // Unicode for single right-pointing angle quotation mark
    ctaLinkEl.appendChild(chevron);

    ctaContainer.appendChild(ctaLinkEl);
    textWrapper.appendChild(ctaContainer);
  }

  textContainer.appendChild(textWrapper);
  holder.appendChild(textContainer);
  teaserDiv.appendChild(holder);
  card.appendChild(teaserDiv);
}

function buildSimpleLinkedCard(cells, card) {
  const image = cells[0].querySelector('picture') || cells[0].querySelector('img');
  const tagline = cells[1].textContent.trim();
  const title = cells[2].textContent.trim();
  const description = cells[3].textContent.trim();
  const cardLink = cells[4].querySelector('a')?.href || '';

  card.className = 'latest-news-item mpc-simple-linked-card';
  card.innerHTML = '';

  // Image
  if (image) {
    const imageDiv = document.createElement('div');
    imageDiv.className = 'latest-news-item-key-visual';
    const linkEl = document.createElement('a');
    linkEl.href = cardLink;
    linkEl.target = '_blank';
    linkEl.appendChild(image.cloneNode(true));
    imageDiv.appendChild(linkEl);
    card.appendChild(imageDiv);
  }

  // Content
  const contentLink = document.createElement('a');
  contentLink.href = cardLink;
  contentLink.target = '_blank';

  const bodyDiv = document.createElement('div');
  bodyDiv.className = 'latest-news-item-body';

  const dateDiv = document.createElement('div');
  dateDiv.className = 'latest-news-item-body-date';
  dateDiv.textContent = tagline;
  bodyDiv.appendChild(dateDiv);

  const titleDiv = document.createElement('div');
  titleDiv.className = 'latest-news-item-body-title';
  titleDiv.textContent = title;
  bodyDiv.appendChild(titleDiv);

  const descDiv = document.createElement('div');
  descDiv.className = 'latest-news-item-body-description';
  descDiv.textContent = description;
  bodyDiv.appendChild(descDiv);

  contentLink.appendChild(bodyDiv);
  card.appendChild(contentLink);
}

function buildVideoCard(cells, card) {
  const image = cells[0].querySelector('picture') || cells[0].querySelector('img');
  const title = cells[1].textContent.trim();
  const description = cells[2].textContent.trim();
  const videoUrl = cells[3].querySelector('a')?.href || '';
  const ctaText = cells[4].textContent.trim();
  const ctaLink = cells[5].querySelector('a')?.href || '';

  card.className = 'nv-teaser teaser nv-teaser-card nv-teaser-bg-white mpc-video-card';
  card.innerHTML = '';

  const teaserDiv = document.createElement('div');
  teaserDiv.className = 'cmp-teaser';

  const holder = document.createElement('div');
  holder.className = 'nv-teaser-holder';

  // Image (clickable for video)
  if (image) {
    const imageDiv = document.createElement('div');
    imageDiv.className = 'cmp-teaser-image';
    const imageLink = document.createElement('a');
    imageLink.className = 'cmp-image-link';
    imageLink.href = '#';
    imageLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (videoUrl) createVideoModal(videoUrl, card);
    });
    imageLink.appendChild(image.cloneNode(true));
    imageDiv.appendChild(imageLink);
    holder.appendChild(imageDiv);
  }

  // Content container
  const textContainer = document.createElement('div');
  textContainer.className = 'general-container-text';

  const textWrapper = document.createElement('div');
  textWrapper.className = 'text-left lap-text-left tab-text-left mob-text-left';
  textWrapper.style.padding = '0px 20px';
  textWrapper.style.width = 'calc(100% - 40px)';

  // Title
  const titleH3 = document.createElement('h3');
  titleH3.className = 'cmp-teaser-title h-smaller';
  titleH3.textContent = title;
  textWrapper.appendChild(titleH3);

  // Description
  if (description) {
    const descDiv = document.createElement('div');
    descDiv.className = 'cmp-teaser-description';
    const descP = document.createElement('p');
    descP.textContent = description;
    descDiv.appendChild(descP);
    textWrapper.appendChild(descDiv);
  }

  // CTA
  if (ctaText) {
    const ctaContainer = document.createElement('div');
    ctaContainer.className = 'cmp-teaser-action-container';

    const ctaLinkEl = document.createElement('a');
    ctaLinkEl.className = 'nv-teaser-secondary-button';
    ctaLinkEl.href = ctaLink || '#';
    ctaLinkEl.textContent = ctaText;
    ctaLinkEl.addEventListener('click', (e) => {
      if (!ctaLink && videoUrl) {
        e.preventDefault();
        createVideoModal(videoUrl, card);
      }
    });

    const chevron = document.createElement('span');
    chevron.className = 'chevron';
    chevron.textContent = '\u203A';
    ctaLinkEl.appendChild(chevron);

    ctaContainer.appendChild(ctaLinkEl);
    textWrapper.appendChild(ctaContainer);
  }

  textContainer.appendChild(textWrapper);
  holder.appendChild(textContainer);
  teaserDiv.appendChild(holder);
  card.appendChild(teaserDiv);
}

function buildSimpleCtaCard(cells, card) {
  const image = cells[0].querySelector('picture') || cells[0].querySelector('img');
  const title = cells[1].textContent.trim();
  const description = cells[2].textContent.trim();
  const ctaText = cells[3].textContent.trim();
  const ctaLink = cells[4].querySelector('a')?.href || '';

  card.className = 'nv-teaser teaser nv-teaser-card nv-teaser-bg-white mpc-simple-cta-card';
  card.innerHTML = '';

  const teaserDiv = document.createElement('div');
  teaserDiv.className = 'cmp-teaser';

  const holder = document.createElement('div');
  holder.className = 'nv-teaser-holder';

  // Image
  if (image) {
    const imageDiv = document.createElement('div');
    imageDiv.className = 'cmp-teaser-image';
    imageDiv.appendChild(image.cloneNode(true));
    holder.appendChild(imageDiv);
  }

  // Content container
  const textContainer = document.createElement('div');
  textContainer.className = 'general-container-text';

  const textWrapper = document.createElement('div');
  textWrapper.className = 'text-left lap-text-left tab-text-left mob-text-left';
  textWrapper.style.padding = '0px 28px';
  textWrapper.style.width = 'calc(100% - 56px)';

  // Title
  const titleH3 = document.createElement('h3');
  titleH3.className = 'cmp-teaser-title h-smaller';
  titleH3.textContent = title;
  textWrapper.appendChild(titleH3);

  // Description
  if (description) {
    const descDiv = document.createElement('div');
    descDiv.className = 'cmp-teaser-description';
    const descP = document.createElement('p');
    descP.textContent = description;
    descDiv.appendChild(descP);
    textWrapper.appendChild(descDiv);
  }

  // CTA
  if (ctaText && ctaLink) {
    const ctaContainer = document.createElement('div');
    ctaContainer.className = 'cmp-teaser-action-container';

    const ctaLinkEl = document.createElement('a');
    ctaLinkEl.className = 'nv-teaser-secondary-button';
    ctaLinkEl.href = ctaLink;
    ctaLinkEl.textContent = ctaText;

    const chevron = document.createElement('span');
    chevron.className = 'chevron';
    chevron.textContent = '\u203A';
    ctaLinkEl.appendChild(chevron);

    ctaContainer.appendChild(ctaLinkEl);
    textWrapper.appendChild(ctaContainer);
  }

  textContainer.appendChild(textWrapper);
  holder.appendChild(textContainer);
  teaserDiv.appendChild(holder);
  card.appendChild(teaserDiv);
}

export default function decorate(block) {
  const cards = [...block.children];

  cards.forEach((card) => {
    const cells = [...card.children];
    const cardType = determineCardType(cells);

    switch (cardType) {
      case 'linked':
        buildLinkedCard(cells, card);
        break;
      case 'cta':
        buildCtaCard(cells, card);
        break;
      case 'simple-linked':
        buildSimpleLinkedCard(cells, card);
        break;
      case 'video':
        buildVideoCard(cells, card);
        break;
      case 'simple-cta':
        buildSimpleCtaCard(cells, card);
        break;
      default:
        // console.warn('Unknown card type for multi-purpose-cards', cells);
    }
  });

  // Block is already a flex container via CSS
}
