/**
 * Decorates the agreement header block
 * @param {Element} block The agreement header block element
 */
export default function decorate(block) {
  // Create container for buttons
  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('agreement-buttons');

  // Process each row in the block (each row represents a button)
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    
    if (cells.length >= 3) {
      const buttonName = cells[0].textContent.trim();
      const buttonLink = cells[1].textContent.trim();
      const buttonType = cells[2].textContent.trim().toLowerCase();

      // Create button element
      const button = document.createElement('a');
      button.href = buttonLink;
      button.textContent = buttonName;
      button.classList.add('agreement-button');
      
      // Add type class (primary or secondary)
      if (buttonType === 'primary' || buttonType === 'secondary') {
        button.classList.add(buttonType);
      } else {
        // Default to primary if type is not specified or invalid
        button.classList.add('primary');
      }

      // Add button to container
      buttonsContainer.appendChild(button);
    }
  });

  // Replace block content with decorated buttons
  block.textContent = '';
  block.appendChild(buttonsContainer);
}
