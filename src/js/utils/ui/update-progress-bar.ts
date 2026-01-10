/**
 * Update progress bar element with percentage
 *
 * @param percent - Progress percentage (0-100)
 */
export function updateProgressBar(percent: number): void {
  //console.log("percent: ", percent)
  const progressBarElement = document.querySelector(".slides-loading-progress-bar");
  if (!progressBarElement) {
    return;
  }
  const progressBar = progressBarElement as HTMLElement;
  progressBar.style.width = percent + "%";
  progressBar.innerHTML = "<span style='text-align: center;'>Loading...(" + percent + "%)</span>";
}
