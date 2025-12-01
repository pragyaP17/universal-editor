export default function decorate(block) {
  /* ---------------------------------------
     1. Add base classes
  ---------------------------------------- */
  const [textCol, imageCol] = block.children;

  if (textCol) textCol.classList.add("banner-text");
  if (imageCol) imageCol.classList.add("banner-image");

  const pic = imageCol?.querySelector("picture");
  if (pic) pic.closest("div")?.classList.add("banner-img-wrapper");

  
}
