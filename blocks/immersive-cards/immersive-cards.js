export default function decorate(block) {
  // Process each card row
  const cards = [...block.children];

  cards.forEach((card) => {
    // Extract data from cells
    const cells = [...card.children];
    const cardData = {
      image: null,
      imageAlt: '',
      title: '',
      tagline: '',
      description: '',
      ctaLink: '',
      ctaText: '',
    };

    cells.forEach((cell, index) => {
      switch (index) {
        case 0: {
          // Image cell
          const picture = cell.querySelector('picture');
          const img = cell.querySelector('img');
          if (picture) {
            cardData.image = picture;
            cardData.imageAlt = img?.alt || '';
          } else if (img) {
            cardData.image = img;
            cardData.imageAlt = img.alt || '';
          }
          break;
        }
        case 1:
          // Title
          cardData.title = cell.textContent.trim();
          break;
        case 2:
          // Tagline
          cardData.tagline = cell.textContent.trim();
          break;
        case 3:
          // Description
          cardData.description = cell.textContent.trim();
          break;
        case 4: {
          // CTA
          const link = cell.querySelector('a');
          if (link) {
            cardData.ctaLink = link.href;
            cardData.ctaText = link.textContent.trim();
          }
          break;
        }
        default:
          break;
      }
    });

    // Build card structure
    card.innerHTML = '';

    // Add image if available
    if (cardData.image) {
      card.appendChild(cardData.image);
    }

    // Create overlay container
    const overlay = document.createElement('div');
    overlay.className = 'card-overlay';

    // Add title
    if (cardData.title) {
      const title = document.createElement('h3');
      title.textContent = cardData.title;
      overlay.appendChild(title);
    }

    // Add tagline
    if (cardData.tagline) {
      const tagline = document.createElement('p');
      tagline.className = 'card-tagline';
      tagline.textContent = cardData.tagline;
      overlay.appendChild(tagline);
    }

    // Add description
    if (cardData.description) {
      const description = document.createElement('p');
      description.className = 'card-description';
      description.textContent = cardData.description;
      overlay.appendChild(description);
    }

    // Add CTA
    if (cardData.ctaLink && cardData.ctaText) {
      const ctaContainer = document.createElement('div');
      ctaContainer.className = 'card-cta';

      const ctaLink = document.createElement('a');
      ctaLink.href = cardData.ctaLink;
      ctaLink.textContent = cardData.ctaText;

      ctaContainer.appendChild(ctaLink);
      overlay.appendChild(ctaContainer);
    }

    card.appendChild(overlay);
  });
}
