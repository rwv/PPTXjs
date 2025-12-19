import { getNumTypeNum } from "../get-num-type-num";

/**
 * Set numeric bullet numbers for elements with nested bullet lists
 *
 * This function processes DOM elements to assign proper numeric bullet indices
 * based on bullet type and level. It handles nested bullets by tracking the
 * bullet type and level hierarchy.
 *
 * @param elem - Array-like collection of DOM elements containing bullet spans
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
 * setNumericBullets($('.paragraph-container'));
 */
export function setNumericBullets(elem: any) {
  const prgrphs_arry = elem;
  for (let i = 0; i < prgrphs_arry.length; i++) {
    const buSpan = $(prgrphs_arry[i]).find(".numeric-bullet-style");
    if (buSpan.length > 0) {
      let prevBultTyp = "";
      let prevBultLvl = "";
      let buletIndex = 0;
      const tmpArry = new Array();
      let tmpArryIndx = 0;
      const buletTypSrry = new Array();

      for (let j = 0; j < buSpan.length; j++) {
        const bult_typ = $(buSpan[j]).data("bulltname");
        const bult_lvl = $(buSpan[j]).data("bulltlvl");

        if (buletIndex == 0) {
          prevBultTyp = bult_typ;
          prevBultLvl = bult_lvl;
          tmpArry[tmpArryIndx] = buletIndex;
          buletTypSrry[tmpArryIndx] = bult_typ;
          buletIndex++;
        } else {
          if (bult_typ == prevBultTyp && bult_lvl == prevBultLvl) {
            prevBultTyp = bult_typ;
            prevBultLvl = bult_lvl;
            buletIndex++;
            tmpArry[tmpArryIndx] = buletIndex;
            buletTypSrry[tmpArryIndx] = bult_typ;
          } else if (bult_typ != prevBultTyp && bult_lvl == prevBultLvl) {
            prevBultTyp = bult_typ;
            prevBultLvl = bult_lvl;
            tmpArryIndx++;
            tmpArry[tmpArryIndx] = buletIndex;
            buletTypSrry[tmpArryIndx] = bult_typ;
            buletIndex = 1;
          } else if (
            bult_typ != prevBultTyp &&
            Number(bult_lvl) > Number(prevBultLvl)
          ) {
            prevBultTyp = bult_typ;
            prevBultLvl = bult_lvl;
            tmpArryIndx++;
            tmpArry[tmpArryIndx] = buletIndex;
            buletTypSrry[tmpArryIndx] = bult_typ;
            buletIndex = 1;
          } else if (
            bult_typ != prevBultTyp &&
            Number(bult_lvl) < Number(prevBultLvl)
          ) {
            prevBultTyp = bult_typ;
            prevBultLvl = bult_lvl;
            tmpArryIndx--;
            buletIndex = tmpArry[tmpArryIndx] + 1;
          }
        }

        const numIdx = getNumTypeNum(buletTypSrry[tmpArryIndx], buletIndex);
        $(buSpan[j]).html(numIdx);
      }
    }
  }
}
