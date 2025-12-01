export default function decorate(block) {
  /* ---------------------------------------
     1. Add base classes
  ---------------------------------------- */
  const [textCol, imageCol] = block.children;

  if (textCol) textCol.classList.add("banner-text");
  if (imageCol) imageCol.classList.add("banner-image");

  const pic = imageCol?.querySelector("picture");
  if (pic) pic.closest("div")?.classList.add("banner-img-wrapper");

  /* ---------------------------------------
     2. Utility: normalize class names
  ---------------------------------------- */
  const normalize = (str) =>
    str
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")        // spaces → hyphens
      .replace(/[^a-z0-9-]/g, ""); // remove invalid characters

  /* ---------------------------------------
     3. Read values from data attributes
  ---------------------------------------- */
  const dataAlignment = block.dataset.alignment;
  const dataGrid = block.dataset.gridClass;

  if (dataAlignment) {
    block.classList.add(`banner-${normalize(dataAlignment)}`);
  }

  if (dataGrid) {
    block.classList.add(`grid-${normalize(dataGrid)}`);
  }

  /* ---------------------------------------
     4. Read AUE <div data-aue-prop="...">
  ---------------------------------------- */
  const alignmentDiv = block.querySelector('[data-aue-prop="alignment"]');
  const gridDiv = block.querySelector('[data-aue-prop="gridClass"]');

  const alignment = alignmentDiv?.textContent?.trim();
  const gridClass = gridDiv?.textContent?.trim();

  if (alignment) {
    block.classList.add(`banner-${normalize(alignment)}`);
  }

  if (gridClass) {
    block.classList.add(`grid-${normalize(gridClass)}`);
  }

  /* ---------------------------------------
     5. Remove the AUE config divs from DOM
     (optional but recommended)
  ---------------------------------------- */
  alignmentDiv?.remove();
  gridDiv?.remove();
}
