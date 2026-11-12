(() => {
  const hero = document.querySelector('.hero');
  const film = document.getElementById('courtyard-film');
  const photoButton = document.getElementById('mode-photo');
  const motionButton = document.getElementById('mode-motion');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!hero || !film) return;
  film.muted = true;
  film.loop = true;
  let mode = 'photo';

  function playFilm() {
    film.play().catch(error => {
      if (error.name !== 'AbortError') showPhoto();
    });
  }

  function showPhoto() {
    mode = 'photo';
    film.pause();
    hero.classList.remove('is-motion');
    photoButton?.setAttribute('aria-pressed', 'true');
    motionButton?.setAttribute('aria-pressed', 'false');
  }

  function showMotion() {
    mode = 'motion';
    if (film.ended) film.currentTime = 0;
    if (motionButton) motionButton.textContent = 'Motion';
    photoButton?.setAttribute('aria-pressed', 'false');
    motionButton?.setAttribute('aria-pressed', 'true');
    hero.classList.add('is-motion');
    playFilm();
  }

  photoButton?.addEventListener('click', showPhoto);
  motionButton?.addEventListener('click', showMotion);
  film.addEventListener('error', () => {
    showPhoto();
    if (motionButton) {
      motionButton.disabled = true;
      motionButton.textContent = 'Unavailable';
    }
  });
  reduce.addEventListener('change', () => {
    if (reduce.matches) showPhoto();
  });

  const visibility = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) {
      film.pause();
    } else if (mode === 'motion') {
      playFilm();
    }
  }, { threshold: 0.1 });
  visibility.observe(hero);
  if (!reduce.matches) showMotion();
})();
