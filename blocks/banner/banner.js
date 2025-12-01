export default function decorate(block) {
  const [textCol, imageCol] = block.children;

  textCol.classList.add("banner-text");
  imageCol.classList.add("banner-image");

  // Ensure nested picture wrapper becomes full flex element
  const pic = imageCol.querySelector("picture");
  if (pic) {
    pic.closest("div").classList.add("banner-img-wrapper");
  }
}
