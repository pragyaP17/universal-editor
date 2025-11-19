import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const quote = block.querySelector('p');
  const author = block.querySelector('p:last-child');
  
  // Create quote structure
  const blockquote = document.createElement('blockquote');
  const cite = document.createElement('cite');
  
  if (quote) {
    // Move the quote content to blockquote
    blockquote.innerHTML = quote.innerHTML;
    moveInstrumentation(quote, blockquote);
  }
  
  if (author && author !== quote) {
    // Move the author content to cite
    cite.textContent = author.textContent;
    moveInstrumentation(author, cite);
  }
  
  // Clear the block and add new structure
  block.textContent = '';
  block.append(blockquote);
  
  if (cite.textContent) {
    block.append(cite);
  }
}
