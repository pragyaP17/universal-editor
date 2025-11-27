
import { loadFragment } from '../fragment/fragment.js';

export default async function decorate(block) {

  const link = block.querySelector('a');
  const path = link ? link.getAttribute('href') : block.textContent.trim();
  const fragment = await loadFragment(path);
  if (fragment) {
    const fragmentSection = fragment.querySelector(':scope .section');
    if (fragmentSection) {
      block.classList.add(...fragmentSection.classList);
      block.classList.remove('section');
      block.replaceChildren(...fragmentSection.childNodes);
    }
  }
/*
    wrapCardBodies(block);

    toggleQuickLinksarrow(block);

    initHorizontalScroller(
        ".horizontal-scroller-wrapper .horizontal-scroller",
        ".default-content-wrapper .icon-chevron-left",
        ".default-content-wrapper .icon-chevron-right",
        410 // scroll px amount (adjust)
      );*/
  }
