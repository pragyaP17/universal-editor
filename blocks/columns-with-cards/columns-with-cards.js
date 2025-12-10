import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Process links and return a container with formatted links
 * @param {string} content Content that may contain links
 * @returns {Object} Object containing processed content and links container
 */
function processLinks(content) {
  // Create a temporary div to parse the content
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  
  // Find all links in the content
  const links = tempDiv.querySelectorAll('a');
  
  // Create links container
  const linksContainer = document.createElement('div');
  linksContainer.className = 'cmp-teaser__action-container';
  linksContainer.setAttribute('data-ctaexpand', 'false');
  
  // Process each link
  if (links.length > 0) {
    links.forEach(link => {
      // Create link with NVIDIA styling
      const formattedLink = document.createElement('a');
      formattedLink.className = 'cmp-teaser__action-link nv-teaser-text-link';
      formattedLink.href = link.href;
      formattedLink.target = link.target || '_self';
      formattedLink.textContent = link.textContent;
      
      // Add the arrow icon
      const iconSpan = document.createElement('span');
      iconSpan.className = 'cmp-teaser__action-link-icon fa-solid fa-angle-right';
      formattedLink.appendChild(iconSpan);
      
      // Add to container
      linksContainer.appendChild(formattedLink);
      
      // Remove the link from the original content
      link.remove();
    });
  }
  
  // Return both the processed content and links container
  return {
    processedContent: tempDiv.innerHTML,
    linksContainer
  };
}

export default function decorate(block) {
  // Set up the main container
  const mainContainer = document.createElement('div');
  mainContainer.className = 'columns-with-cards-container';
  
  // Get the content rows
  const rows = [...block.children];
  if (rows.length < 3) {
    // We need at least 3 rows: title/content, card1, card2
    console.warn('columns-with-cards block requires at least 3 rows');
    return;
  }

  // Create left column (content)
  const leftColumn = document.createElement('div');
  leftColumn.className = 'columns-with-cards-content general-container';
  
  // Extract title and content from first row
  const titleRow = rows[0];
  if (titleRow && titleRow.children.length >= 2) {
    const titleContent = titleRow.children[0].innerHTML;
    const mainContent = titleRow.children[1].innerHTML;
    
    // Create title element with appropriate HTML structure
    const titleEl = document.createElement('div');
    titleEl.className = 'columns-with-cards-title';
    
    // Create title container with proper text alignment classes
    const titleTextContainer = document.createElement('div');
    titleTextContainer.className = 'text-left lap-text-left tab-text-left mob-text-left';
    
    // Create and set the title heading
    const heading = document.createElement('h2');
    heading.className = 'title';
    heading.style.color = '#000000';
    heading.innerHTML = titleContent;
    
    titleTextContainer.appendChild(heading);
    titleEl.appendChild(titleTextContainer);
    
    // Create content element with proper structure
    const contentEl = document.createElement('div');
    contentEl.className = 'columns-with-cards-description';
    
    // Create text container with alignment classes
    const textContainer = document.createElement('div');
    textContainer.className = 'text-left lap-text-left tab-text-center mob-text-center';
    
    // Create description container
    const descContainer = document.createElement('div');
    descContainer.className = 'description';
    descContainer.innerHTML = mainContent;
    
    textContainer.appendChild(descContainer);
    contentEl.appendChild(textContainer);
    
    // Add title and content to left column
    leftColumn.appendChild(titleEl);
    leftColumn.appendChild(contentEl);
  }
  
  // Create right column (cards)
  const rightColumn = document.createElement('div');
  rightColumn.className = 'columns-with-cards-cards nv-flexbox d-col-1 l-col-1 t-col-2 p-col-1 d-justify-center l-justify-center t-justify-center p-justify-center flex-align-stretch';
  
  // Process card rows (rows 1 and 2)
  for (let i = 1; i < Math.min(rows.length, 3); i++) {
    const cardRow = rows[i];
    if (cardRow && cardRow.children.length >= 2) {
      const cardTitle = cardRow.children[0].innerHTML;
      const cardContent = cardRow.children[1].innerHTML;
      
      // Process content to extract links
      const { processedContent, linksContainer } = processLinks(cardContent);
      
      // Create card element with appropriate classes to match the original structure
      const card = document.createElement('div');
      card.className = 'columns-with-cards-card nv-teaser teaser nv-teaser--card nv-teaser--cta-column nv-teaser--bg-white';
      
      // Create teaser container
      const teaserContainer = document.createElement('div');
      teaserContainer.className = 'cmp-teaser';
      teaserContainer.setAttribute('data-title-style', 'manual');
      
      // Create holder div
      const holderDiv = document.createElement('div');
      holderDiv.className = 'nv-teaser--holder';
      
      // Create text container
      const textContainer = document.createElement('div');
      textContainer.className = 'general-container-text';
      
      // Create text alignment container
      const textAlignDiv = document.createElement('div');
      textAlignDiv.className = 'text-left lap-text-left tab-text-left mob-text-left';
      textAlignDiv.style.padding = '0px 20px';
      textAlignDiv.style.width = 'calc(100% - 40px)';
      
      // Create card title with proper structure
      const cardTitleEl = document.createElement('h2');
      cardTitleEl.className = 'cmp-teaser__title h--smaller';
      cardTitleEl.setAttribute('data-titlerow', 'One');
      cardTitleEl.setAttribute('data-titlerowlaptop', 'One');
      cardTitleEl.setAttribute('data-titlerowtablet', 'One');
      cardTitleEl.innerHTML = cardTitle;
      
      // Create card content container
      const cardContentEl = document.createElement('div');
      cardContentEl.className = 'cmp-teaser__description';
      cardContentEl.innerHTML = processedContent;
      
      // Assemble the card structure
      textAlignDiv.appendChild(cardTitleEl);
      textAlignDiv.appendChild(cardContentEl);
      textAlignDiv.appendChild(linksContainer);
      
      textContainer.appendChild(textAlignDiv);
      teaserContainer.appendChild(holderDiv);
      teaserContainer.appendChild(textContainer);
      card.appendChild(teaserContainer);
      
      // Add card to right column
      rightColumn.appendChild(card);
    }
  }
  
  // Add left and right columns to main container
  mainContainer.appendChild(leftColumn);
  mainContainer.appendChild(rightColumn);
  
  // Replace block content with our structure
  block.textContent = '';
  block.appendChild(mainContainer);
  
  // Add responsive classes
  block.classList.add('columns-with-cards-block');
}
