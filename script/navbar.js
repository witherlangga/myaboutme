(function () {
  const placeholder = document.getElementById('navbar');
  if (!placeholder) return;

  const isInPagesFolder = window.location.pathname.includes('/pages/');
  const componentPath = isInPagesFolder ? '../components/navbar.html' : 'components/navbar.html';

  async function loadNavbar() {
    try {
      const response = await fetch(componentPath, { cache: 'no-store' });
      if (!response.ok) throw new Error('Navbar component could not be loaded');

      const html = await response.text();
      placeholder.innerHTML = html;

      const menu = placeholder.querySelector('.menu');
      const dropdown = placeholder.querySelector('.dropdown');

      if (menu && dropdown) {
        menu.addEventListener('click', () => {
          dropdown.classList.toggle('show');
        });
      }

      if (isInPagesFolder) {
        placeholder.querySelector('[data-home-link]')?.setAttribute('href', '../index.html');
        placeholder.querySelector('[data-about-link]')?.setAttribute('href', '../index.html#aboutme');
        placeholder.querySelector('[data-song-link]')?.setAttribute('href', 'songoftheday.html');
        placeholder.querySelector('[data-special-link]')?.setAttribute('href', 'special.html');
        placeholder.querySelector('[data-songs-link]')?.setAttribute('href', 'songss.html');
        placeholder.querySelector('[data-flip-link]')?.setAttribute('href', 'flip.html');
        placeholder.querySelector('[data-tarots-link]')?.setAttribute('href', 'tarots.html');
        placeholder.querySelector('[data-we-link]')?.setAttribute('href', 'we.html');
      } else {
        placeholder.querySelector('[data-home-link]')?.setAttribute('href', '#');
        placeholder.querySelector('[data-about-link]')?.setAttribute('href', '#aboutme');
        placeholder.querySelector('[data-song-link]')?.setAttribute('href', 'pages/songoftheday.html');
        placeholder.querySelector('[data-special-link]')?.setAttribute('href', 'pages/special.html');
        placeholder.querySelector('[data-songs-link]')?.setAttribute('href', 'pages/songss.html');
        placeholder.querySelector('[data-flip-link]')?.setAttribute('href', 'pages/flip.html');
        placeholder.querySelector('[data-tarots-link]')?.setAttribute('href', 'pages/tarots.html');
        placeholder.querySelector('[data-we-link]')?.setAttribute('href', 'pages/we.html');
      }

      document.addEventListener('click', (event) => {
        if (!event.target.closest('.header')) {
          placeholder.querySelectorAll('.dropdown').forEach((item) => {
            item.classList.remove('show');
          });
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  document.addEventListener('DOMContentLoaded', loadNavbar);
})();
