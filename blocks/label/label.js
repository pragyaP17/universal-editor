/**
 * Decorates the label block
 * @param {Element} block The label block element
 */
export default function decorate(block) {
  // Extract configuration from block content
  const config = {
    weight: 'regular',
    text: '',
  };

  // Parse block content for configuration
  const rows = [...block.children];
  if (rows.length > 0) {
    const firstRow = rows[0];
    const cells = [...firstRow.children];

    // Extract text and weight from cells
    cells.forEach((cell, index) => {
      const text = cell.textContent.trim();
      if (text) {
        switch (index) {
          case 0:
            config.text = text;
            break;
          case 1:
            if (['regular', 'medium', 'semibold'].includes(text.toLowerCase())) {
              config.weight = text.toLowerCase();
            }
            break;
          default:
            break;
        }
      }
    });
  }

  // Clear existing content
  block.innerHTML = '';

  // Create the label element
  const label = document.createElement('label');
  label.textContent = config.text;

  // Add weight class if not regular
  if (config.weight !== 'regular') {
    label.classList.add(config.weight);
  }

  // Add the label to the block
  block.appendChild(label);

  // Add the label-block class for styling
  block.classList.add('label-block');
}
