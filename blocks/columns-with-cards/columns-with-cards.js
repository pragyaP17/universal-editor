/**
 * Columns with Cards Block
 * Creates a two-column layout with text content on the left and cards on the right
 * Matches the NVIDIA robotics page design
 *
 * This block expects multiple instances within the same section container.
 * The first block contains the headline and body text (left column).
 * Subsequent blocks contain cards (right column).
 */

/**
 * Create a card from a block
 * @param {HTMLElement} block - The block element
 * @returns {HTMLElement} The card element
 */
function createCard(block) {
  const card = document.createElement('div');
  card.className = 'columns-with-cards-card';

  const rows = block.querySelectorAll(':scope > div');

  // Title from first row
  if (rows[0]) {
    const titleCell = rows[0].querySelector('div');
    if (titleCell) {
      const title = document.createElement('h3');
      title.className = 'columns-with-cards-card-title';
      title.textContent = titleCell.textContent.trim();
      card.appendChild(title);
    }
  }

  // Description and CTAs from second row
  if (rows[1]) {
    const contentCell = rows[1].querySelector('div');
    if (contentCell) {
      // Description
      const description = document.createElement('div');
      description.className = 'columns-with-cards-card-description';

      const paragraphs = contentCell.querySelectorAll('p:not(.button-container)');
      paragraphs.forEach((p) => {
        const newP = document.createElement('p');
        newP.innerHTML = p.innerHTML;
        description.appendChild(newP);
      });

      if (description.children.length > 0) {
        card.appendChild(description);
      }

      // CTAs
      const ctaContainer = document.createElement('div');
      ctaContainer.className = 'columns-with-cards-card-ctas';

      const buttonContainers = contentCell.querySelectorAll('.button-container');
      buttonContainers.forEach((container) => {
        const link = container.querySelector('a');
        if (link) {
          const cta = document.createElement('a');
          cta.className = 'columns-with-cards-card-cta';
          cta.href = link.href;
          cta.textContent = link.textContent.trim();
          if (link.target) cta.target = link.target;

          ctaContainer.appendChild(cta);
        }
      });

      if (ctaContainer.children.length > 0) {
        card.appendChild(ctaContainer);
      }
    }
  }

  return card;
}

/**
 * Decorate function for the columns-with-cards block
 * @param {HTMLElement} block - The block element
 */
export default function decorate(block) {
  const section = block.closest('.section');
  if (!section) return;

  // Check if this section has already been restructured
  if (section.querySelector('.columns-with-cards-grid')) {
    return;
  }

  // Get all blocks in this section
  const allBlocks = Array.from(section.querySelectorAll('.columns-with-cards'));

  // We need at least 2 blocks (1 for content, 1+ for cards)
  if (allBlocks.length < 2) {
    return;
  }

  // Only process this once from the last block's perspective
  const isLastBlock = block === allBlocks[allBlocks.length - 1];
  if (!isLastBlock) {
    return;
  }

  // Create the grid structure
  const grid = document.createElement('div');
  grid.className = 'columns-with-cards-grid';

  // Left column - Main content from first block
  const leftColumn = document.createElement('div');
  leftColumn.className = 'columns-with-cards-left';

  const firstBlock = allBlocks[0];
  const firstBlockRows = firstBlock.querySelectorAll(':scope > div');

  // Extract headline (first row, first cell)
  if (firstBlockRows[0]) {
    const headlineCell = firstBlockRows[0].querySelector('div');
    if (headlineCell) {
      const headline = document.createElement('h2');
      headline.className = 'columns-with-cards-headline';
      headline.textContent = headlineCell.textContent.trim();
      leftColumn.appendChild(headline);
    }
  }

  // Extract body (second row, first cell)
  if (firstBlockRows[1]) {
    const bodyCell = firstBlockRows[1].querySelector('div');
    if (bodyCell) {
      const body = document.createElement('div');
      body.className = 'columns-with-cards-body';
      body.innerHTML = bodyCell.innerHTML;
      leftColumn.appendChild(body);
    }
  }

  // Right column - Cards from remaining blocks
  const rightColumn = document.createElement('div');
  rightColumn.className = 'columns-with-cards-right';

  for (let i = 1; i < allBlocks.length; i += 1) {
    const cardBlock = allBlocks[i];
    const card = createCard(cardBlock);
    if (card) {
      rightColumn.appendChild(card);
    }
  }

  // Assemble grid
  grid.appendChild(leftColumn);
  grid.appendChild(rightColumn);

  // Replace section content
  // The section itself has the columns-with-cards-container class
  if (section.classList.contains('columns-with-cards-container')) {
    section.innerHTML = '';
    section.appendChild(grid);
  }
}
