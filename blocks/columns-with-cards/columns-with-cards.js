/**
 * Explore AI Robotics Block
 * Creates a two-column layout with text content on the left and article cards on the right
 * Features fade-in animations and hover effects
 */

/**
 * Creates intersection observer for fade-in animation on scroll
 * @param {HTMLElement} block - The block element
 */
function initScrollAnimation(block) {
  const cards = block.querySelectorAll('.columns-with-cards');

  const observerOptions = {
    threshold: 0.2, // Trigger when 20% of the card is visible
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add staggered delay for multiple cards
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, index * 150); // 150ms delay between cards

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  cards.forEach(card => observer.observe(card));
}

/**
 * Processes card data and creates card element
 * @param {Object} cardData - Card data object with title, body, and CTA info
 * @returns {HTMLElement} Card element
 */
function createCard(cardData) {
  const card = document.createElement('div');
  card.className = 'columns-with-cards';

  // Card title
  const title = document.createElement('h3');
  title.className = 'columns-with-cards-title';
  title.textContent = cardData.cardTitle || '';

  // Card description
  const description = document.createElement('div');
  description.className = 'columns-with-cards-description';
  description.innerHTML = cardData.cardBody || '';

  // CTA links container
  const ctasContainer = document.createElement('div');
  ctasContainer.className = 'columns-with-cards-ctas';

  // Create CTA links (up to 2)
  if (cardData.cta1Label && cardData.cta1URL) {
    const cta1 = document.createElement('a');
    cta1.className = 'columns-with-cards-cta';
    cta1.href = cardData.cta1URL;
    cta1.textContent = cardData.cta1Label;
    ctasContainer.appendChild(cta1);
  }

  if (cardData.cta2Label && cardData.cta2URL) {
    const cta2 = document.createElement('a');
    cta2.className = 'columns-with-cards-cta';
    cta2.href = cardData.cta2URL;
    cta2.textContent = cardData.cta2Label;
    ctasContainer.appendChild(cta2);
  }

  // Assemble card
  card.appendChild(title);
  card.appendChild(description);
  card.appendChild(ctasContainer);

  return card;
}

/**
 * Main decorate function for the block
 * @param {HTMLElement} block - The block element
 */
export default function decorate(block) {
  // Extract the data from the block
  const rows = [...block.children];

  if (rows.length < 2) {
    console.warn('columns-with-cards block requires at least 2 rows (headline/body and cards)');
    return;
  }

  // Create main container
  const container = document.createElement('div');
  container.className = 'columns-with-cards-container';

  // Left column - Content
  const contentColumn = document.createElement('div');
  contentColumn.className = 'columns-with-cards-content';

  // Extract headline and body from first row
  const contentRow = rows[0];
  if (contentRow && contentRow.children.length >= 2) {
    const headlineText = contentRow.children[0].textContent.trim();
    const bodyHTML = contentRow.children[1].innerHTML;

    // Create headline
    const headline = document.createElement('h2');
    headline.className = 'columns-with-cards-headline';
    headline.textContent = headlineText;

    // Create body
    const body = document.createElement('div');
    body.className = 'columns-with-cards-body';
    body.innerHTML = bodyHTML;

    contentColumn.appendChild(headline);
    contentColumn.appendChild(body);
  }

  // Right column - Cards
  const cardsColumn = document.createElement('div');
  cardsColumn.className = 'columns-with-cardss';

  // Process card rows (remaining rows after first)
  for (let i = 1; i < rows.length; i++) {
    const cardRow = rows[i];
    if (cardRow && cardRow.children.length >= 2) {
      // Extract card data from row
      const cardData = {
        cardTitle: cardRow.children[0]?.textContent.trim() || '',
        cardBody: cardRow.children[1]?.innerHTML || ''
      };

      // Extract CTAs if present (columns 2-5 for CTA labels and URLs)
      if (cardRow.children.length >= 4) {
        cardData.cta1Label = cardRow.children[2]?.textContent.trim() || '';
        cardData.cta1URL = cardRow.children[3]?.textContent.trim() || '';
      }

      if (cardRow.children.length >= 6) {
        cardData.cta2Label = cardRow.children[4]?.textContent.trim() || '';
        cardData.cta2URL = cardRow.children[5]?.textContent.trim() || '';
      }

      const card = createCard(cardData);
      cardsColumn.appendChild(card);
    }
  }

  // Assemble the block
  container.appendChild(contentColumn);
  container.appendChild(cardsColumn);

  // Replace block content
  block.textContent = '';
  block.appendChild(container);

  // Initialize scroll animation
  initScrollAnimation(block);
}
