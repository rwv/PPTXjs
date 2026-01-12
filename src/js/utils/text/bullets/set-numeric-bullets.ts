import { getNumTypeNum } from "../get-num-type-num";

/**
 * Set numeric bullet numbers for elements with nested bullet lists
 *
 * This function processes DOM elements to assign proper numeric bullet indices
 * based on bullet type and level. It handles nested bullets by tracking the
 * bullet type and level hierarchy.
 *
 * @param elements - Array-like collection of DOM elements containing bullet spans
 *
 * @remarks
 * This function expects elements with class 'numeric-bullet-style' that have
 * data attributes 'bulltname' (bullet type) and 'bulltlvl' (bullet level).
 * It updates the HTML content of these spans with the appropriate number/letter.
 *
 * @example
 * // HTML structure expected:
 * // <div>
 * //   <span class="numeric-bullet-style" data-bulltname="arabicPeriod" data-bulltlvl="0"></span>
 * //   <span class="numeric-bullet-style" data-bulltname="arabicPeriod" data-bulltlvl="0"></span>
 * // </div>
 *
 * setNumericBullets(document.querySelectorAll(".paragraph-container"));
 */
export function setNumericBullets(elements: NodeListOf<Element> | Element[]) {
  const paragraphs = Array.from(elements);
  for (let i = 0; i < paragraphs.length; i++) {
    const bulletSpans = paragraphs[i]?.querySelectorAll(".numeric-bullet-style") ?? [];
    if (bulletSpans.length > 0) {
      let prevBulletType = "";
      let prevBulletLevel = "";
      let bulletIndex = 0;
      const levelCounters = new Array();
      let levelIndex = 0;
      const bulletTypeStack = new Array();

      for (let j = 0; j < bulletSpans.length; j++) {
        const bulletType = bulletSpans[j]?.getAttribute("data-bulltname") ?? "";
        const bulletLevel = bulletSpans[j]?.getAttribute("data-bulltlvl") ?? "";

        if (bulletIndex === 0) {
          prevBulletType = bulletType;
          prevBulletLevel = bulletLevel;
          levelCounters[levelIndex] = bulletIndex;
          bulletTypeStack[levelIndex] = bulletType;
          bulletIndex++;
        } else {
          if (bulletType === prevBulletType && bulletLevel === prevBulletLevel) {
            prevBulletType = bulletType;
            prevBulletLevel = bulletLevel;
            bulletIndex++;
            levelCounters[levelIndex] = bulletIndex;
            bulletTypeStack[levelIndex] = bulletType;
          } else if (bulletType !== prevBulletType && bulletLevel === prevBulletLevel) {
            prevBulletType = bulletType;
            prevBulletLevel = bulletLevel;
            levelIndex++;
            levelCounters[levelIndex] = bulletIndex;
            bulletTypeStack[levelIndex] = bulletType;
            bulletIndex = 1;
          } else if (
            bulletType !== prevBulletType &&
            Number(bulletLevel) > Number(prevBulletLevel)
          ) {
            prevBulletType = bulletType;
            prevBulletLevel = bulletLevel;
            levelIndex++;
            levelCounters[levelIndex] = bulletIndex;
            bulletTypeStack[levelIndex] = bulletType;
            bulletIndex = 1;
          } else if (
            bulletType !== prevBulletType &&
            Number(bulletLevel) < Number(prevBulletLevel)
          ) {
            prevBulletType = bulletType;
            prevBulletLevel = bulletLevel;
            levelIndex--;
            bulletIndex = levelCounters[levelIndex] + 1;
          }
        }

        const bulletLabel = getNumTypeNum({
          numberingType: bulletTypeStack[levelIndex],
          num: bulletIndex,
        });
        bulletSpans[j]!.innerHTML = bulletLabel;
      }
    }
  }
}
