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
  if (!Number.isFinite(percent)) {
    return;
  }
  const normalizedPercent = Math.min(100, Math.max(0, percent));
  const progressBar = progressBarElement as HTMLElement;
  progressBar.style.width = normalizedPercent + "%";
  progressBar.innerHTML =
    "<span style='text-align: center;'>Loading...(" + normalizedPercent + "%)</span>";
}
