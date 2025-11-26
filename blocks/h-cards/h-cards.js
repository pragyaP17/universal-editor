import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Convert block children into a list of cards
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'h-cards-card-image';
      else div.className = 'h-cards-card-body';
    });
    ul.append(li);
  });

  // Optimize images and, if a link exists in the card, make the image clickable by placing it inside the link
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));

    const pictureEl = img.closest('picture');
    // Replace the original picture with the optimized one. If the picture was wrapped by an <a>, the anchor will now wrap the optimized picture.
    pictureEl.replaceWith(optimizedPic);

    // Try to find a link associated with this card. Prefer the anchor that originally wrapped the image.
    const originalAnchor = img.closest('a');
    const li = optimizedPic.closest('li');
    const fallbackAnchor = li ? (li.querySelector('a[href]') || li.querySelector('a')) : null;
    const anchor = originalAnchor || fallbackAnchor;

    // If a link exists but doesn't contain the picture, move the picture inside the link so it becomes clickable
    if (anchor && !anchor.contains(optimizedPic)) {
      anchor.insertBefore(optimizedPic, anchor.firstChild);
    }
  });

  block.textContent = '';
  block.append(ul);
}

