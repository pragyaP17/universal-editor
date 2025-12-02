export default function decorate(block) {
  // Process each card row
  const cards = [...block.children];
  const cardItems = [];

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
            cardData.image = picture.cloneNode(true);
            cardData.imageAlt = img?.alt || '';
          } else if (img) {
            cardData.image = img.cloneNode(true);
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
          // CTA Link
          const link = cell.querySelector('a');
          if (link && link.href) {
            cardData.ctaLink = link.href;
            // If link has text, use it as fallback
            if (link.textContent.trim()) {
              cardData.ctaText = link.textContent.trim();
            }
          } else {
            // If no link element, might be plain text URL
            const cellText = cell.textContent.trim();
            if (cellText && (cellText.startsWith('http') || cellText.startsWith('/'))) {
              cardData.ctaLink = cellText;
            }
          }
          break;
        }
        case 5: {
          // CTA Text - this should override any text from the link
          const cellText = cell.textContent.trim();
          if (cellText) {
            cardData.ctaText = cellText;
          }
          break;
        }
        default:
          break;
      }
    });

    // Build card structure
    card.innerHTML = '';
    card.className = 'card-item';

    // Add image if available
    if (cardData.image) {
      card.appendChild(cardData.image);
    }

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.setAttribute('aria-label', 'Close expanded view');
    card.appendChild(closeButton);

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

    // Add CTA - only if both link and text exist
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
    cardItems.push(card);
  });

  // Add click event handlers for card expansion
  cardItems.forEach((cardItem) => {
    const closeButton = cardItem.querySelector('.close-button');

    // Click on card to expand
    cardItem.addEventListener('click', (e) => {
      // Don't expand if clicking on CTA link or close button
      if (e.target.closest('.card-cta') || e.target.closest('.close-button')) {
        return;
      }

      const isExpanded = cardItem.classList.contains('expanded');
      const isMobile = window.innerWidth <= 600;

      if (!isExpanded) {
        // Collapse any other expanded cards
        cardItems.forEach((item) => {
          item.classList.remove('expanded');
          item.classList.remove('hidden');
        });

        // Hide other cards only on desktop/tablet (not mobile)
        if (!isMobile) {
          // Find first card that will be hidden
          const firstHiddenCard = cardItems.find((item) => item !== cardItem);
          if (firstHiddenCard) {
            // Listen for transition end on the first hidden card
            const expandAfterHide = (event) => {
              if (event.propertyName === 'opacity') {
                cardItem.classList.add('expanded');
                firstHiddenCard.removeEventListener('transitionend', expandAfterHide);
              }
            };
            firstHiddenCard.addEventListener('transitionend', expandAfterHide);
          }

          // Hide other cards
          cardItems.forEach((item) => {
            if (item !== cardItem) {
              item.classList.add('hidden');
            }
          });
        } else {
          // On mobile, expand immediately
          cardItem.classList.add('expanded');
        }
      }
    });

    // Click on close button to collapse
    if (closeButton) {
      closeButton.addEventListener('click', (e) => {
        e.stopPropagation();

        // Collapse the card
        cardItem.classList.remove('expanded');

        // Show all cards
        cardItems.forEach((item) => {
          item.classList.remove('hidden');
        });
      });
    }
  });
}
