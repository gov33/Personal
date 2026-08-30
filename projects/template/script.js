// Starter Template Demo Logic
document.addEventListener('DOMContentLoaded', () => {
  let count = 0;
  const countEl = document.getElementById('count-display');
  const incrementBtn = document.getElementById('btn-increment');
  const resetBtn = document.getElementById('btn-reset');

  if (incrementBtn && countEl) {
    incrementBtn.addEventListener('click', () => {
      count++;
      countEl.textContent = count;
    });
  }

  if (resetBtn && countEl) {
    resetBtn.addEventListener('click', () => {
      count = 0;
      countEl.textContent = count;
    });
  }
});
