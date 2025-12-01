export default function decorate(block) {
  /* ---------------------------------------
     1. Add base structure classes
  ---------------------------------------- */
  const [textCol, imageCol] = block.children;

  if (textCol) textCol.classList.add("banner-text");
  if (imageCol) imageCol.classList.add("banner-image");

  // Picture wrapper fix
  const pic = imageCol?.querySelector("picture");
  if (pic) pic.closest("div")?.classList.add("banner-img-wrapper");

  /* ---------------------------------------
     2. Normalize helper
  ---------------------------------------- */
  const normalize = (value) =>
    value.trim().toLowerCase().replace(/\s+/g, "-");

  /* ---------------------------------------
     3. Read the block-level metadata attributes
        created by the updated JSON model
  ---------------------------------------- */
  const alignment = block.dataset.alignment;
  const gridClass = block.dataset.gridclass;

  /* ---------------------------------------
     4. Apply classes if present
  ---------------------------------------- */
  if (alignment) {
    const normalized = normalize(alignment);
    block.classList.add(`banner-${normalized}`);
  }

  if (gridClass) {
    const normalized = normalize(gridClass);
    block.classList.add(`grid-${normalized}`);
  }

  /* ---------------------------------------
     5. CLEANUP: Remove leftover UE metadata divs
        (if they still appear due to caching)
  ---------------------------------------- */
  block
    .querySelectorAll('[data-aue-prop="alignment"], [data-aue-prop="gridClass"]')
    .forEach((el) => el.remove());
}
