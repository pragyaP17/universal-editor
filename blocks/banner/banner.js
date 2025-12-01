export default function decorate(block) {
  /* ---------------------------------------
     1. Add base structure classes
  ---------------------------------------- */
  const [textCol, imageCol] = block.children || [];

  if (textCol) textCol.classList.add("banner-text");
  if (imageCol) imageCol.classList.add("banner-image");

  // Ensure picture wrapper gets appropriate class
  const pic = imageCol?.querySelector("picture");
  if (pic) {
    pic.closest("div")?.classList.add("banner-img-wrapper");
  }

  /* ---------------------------------------
     2. Normalization helper
  ---------------------------------------- */
  const normalize = (value) =>
    value?.trim()?.toLowerCase()?.replace(/\s+/g, "-");

  /* ---------------------------------------
     3. Read block-level metadata
        (from JSON metadata config)
  ---------------------------------------- */
  const alignment = normalize(block.dataset.alignment);
  const gridClass = normalize(block.dataset.gridclass);

  /* ---------------------------------------
     4. Apply CSS classes
  ---------------------------------------- */
  if (alignment) {
    block.classList.add(`banner-${alignment}`);
  }

  if (gridClass) {
    block.classList.add(`grid-${gridClass}`);
  }

  /* ---------------------------------------
     5. Remove any leftover UE metadata nodes
        (may remain until cache resets)
  ---------------------------------------- */
  block.querySelectorAll("[data-aue-prop]").forEach((el) => el.remove());
}
