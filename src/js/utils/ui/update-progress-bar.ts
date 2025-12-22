/**
 * Update progress bar element with percentage
 *
 * @param percent - Progress percentage (0-100)
 */
export function updateProgressBar(percent: any): void {
  //console.log("percent: ", percent)
  var progressBarElemtnt = $(".slides-loading-progress-bar");
  progressBarElemtnt.width(percent + "%");
  progressBarElemtnt.html("<span style='text-align: center;'>Loading...(" + percent + "%)</span>");
}
