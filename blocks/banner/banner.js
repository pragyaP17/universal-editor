export default function decorate(block) {
  const [textCol, imageCol] = block.children;

  // Base classes
  if (textCol) textCol.classList.add('banner-text');
  if (imageCol) imageCol.classList.add('banner-image');

  // Find all pictures in the block (desktop + mobile)
  const pictures = block.querySelectorAll('picture');

  pictures.forEach((pic, index) => {
    const wrapper = pic.closest('div');
    if (wrapper) wrapper.classList.add('banner-img-wrapper');

    const img = pic.querySelector('img');
    const prop = img?.dataset?.aueProp;

    // Check for data-aue-prop attributes first
    if (prop === 'imageDesktop') {
      wrapper?.classList.add('banner-img-desktop');
    } else if (prop === 'imageMobile') {
      wrapper?.classList.add('banner-img-mobile');
    } else if (index === 0) {
      // If no data-aue-prop, assign based on order
      // First image = desktop, second image = mobile
      wrapper?.classList.add('banner-img-desktop');
    } else if (index === 1) {
      wrapper?.classList.add('banner-img-mobile');
    }
  });

  // If there's only one image and no data-aue-prop, make it responsive for both
  if (pictures.length === 1) {
    const wrapper = pictures[0].closest('div');
    const img = pictures[0].querySelector('img');
    const prop = img?.dataset?.aueProp;

    if (!prop) {
      // Remove any existing classes and make it show on all devices
      wrapper?.classList.remove('banner-img-desktop', 'banner-img-mobile');
      wrapper?.classList.add('banner-img-responsive');
    }
  }
}
