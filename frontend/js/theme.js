// Apply saved theme immediately on load (prevents flash)
const saved = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', saved);

export function initTheme() {
  const btn = document.getElementById('theme-toggle');
  const label = document.getElementById('theme-label');
  if (!btn) return;

  const update = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (label) label.textContent = theme === 'dark' ? '🌙' : '☀️';
  };

  update(localStorage.getItem('theme') || 'light');

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    update(current === 'dark' ? 'light' : 'dark');
  });
}
