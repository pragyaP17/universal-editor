/**
 * Decorates the agreement header block
 * @param {Element} block The agreement header block element
 */
export default function decorate(block) {
  // Create main container
  const container = document.createElement('div');
  container.classList.add('agreement-header-container');

  // Create left content container
  const leftContainer = document.createElement('div');
  leftContainer.classList.add('agreement-left-content');

  // Create right content container
  const rightContainer = document.createElement('div');
  rightContainer.classList.add('agreement-right-content');

  // Process the block content
  const rows = [...block.children];
  
  if (rows.length >= 1) {
    // First row contains left content
    const leftRow = rows[0];
    if (leftRow.children.length > 0) {
      leftContainer.innerHTML = leftRow.children[0].innerHTML;
    }
  }
  
  if (rows.length >= 2) {
    // Second row contains right content
    const rightRow = rows[1];
    if (rightRow.children.length > 0) {
      rightContainer.innerHTML = rightRow.children[0].innerHTML;
    }
  }

  // Add containers to main container
  container.appendChild(leftContainer);
  container.appendChild(rightContainer);

  // Replace block content with decorated structure
  block.textContent = '';
  block.appendChild(container);
}
