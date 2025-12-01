export default function decorate(block) {
  const [textCol, imageCol] = block.children;

  textCol.classList.add("banner-text");
  imageCol.classList.add("banner-image");

  // Ensure nested picture wrapper becomes full flex element
  const pic = imageCol.querySelector("picture");
  if (pic) {
    pic.closest("div").classList.add("banner-img-wrapper");
  }

  // Process alignment and gridClass properties
  console.log('Banner block:', block);
  console.log('Block dataset:', block.dataset);
  console.log('Block innerHTML:', block.innerHTML);
  
  // First check for data attributes on the block itself
  if (block.dataset.alignment) {
    console.log('Found block.dataset.alignment:', block.dataset.alignment);
    block.classList.add(block.dataset.alignment);
  }
  
  if (block.dataset.gridClass) {
    console.log('Found block.dataset.gridClass:', block.dataset.gridClass);
    block.classList.add(`grid-${block.dataset.gridClass}`);
  }
  
  // Define valid values from banner configuration
  const validAlignments = ['align-left', 'align-center', 'align-right', 'align-top', 'align-mid', 'align-bottom'];
  const validGridClasses = ['40-60', '50-50', '60-40'];
  
  // Check for alignment and grid values in child divs
  const allDivs = [...block.querySelectorAll('div > div > p')];
  console.log('All p elements found:', allDivs);
  
  allDivs.forEach(p => {
    const text = p.textContent.trim();
    console.log('Checking text content:', text);
    
    // Check if it's a valid alignment value
    if (validAlignments.includes(text)) {
      console.log('Found valid alignment:', text);
      block.classList.add(text);
    }
    
    // Check if it's a valid grid class value
    if (validGridClasses.includes(text)) {
      console.log('Found valid grid class:', text);
      block.classList.add(`grid-${text}`);
    }
