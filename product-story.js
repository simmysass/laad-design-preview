(() => {
  const product = document.querySelector('.product, .product-section');
  const capture = document.getElementById('product-capture');
  const caption = document.getElementById('product-caption');
  const toggle = document.getElementById('product-toggle');
  if (!product || !capture || !caption) return;

  const buttons = [...product.querySelectorAll('[data-product-view]')];
  const [webmSource, mp4Source] = capture.querySelectorAll('source');
  // Every path is written out in full: the single-file build swaps each one for its embedded copy.
  const views = {
    introduction: {
      webm: 'assets/product-demo/04-question-reveals-person-he.webm',
      mp4: 'assets/product-demo/04-question-reveals-person-he.mp4',
      poster: 'assets/product-demo/04-question-reveals-person-he.webp',
      alt: 'צילום מממשק הדמו של לעד: ההיכרות עם נועה, בת 29, לאחר חשיפת התמונה הראשונה',
      caption: 'ההיכרות שלך'
    },
    match: {
      webm: 'assets/product-demo/06-mutual-match-he.webm',
      mp4: 'assets/product-demo/06-mutual-match-he.mp4',
      poster: 'assets/product-demo/06-mutual-match-he.webp',
      alt: 'צילום מממשק הדמו של לעד: ההתאמה ההדדית בין נועה ודניאל',
      caption: 'יש התאמה!'
    },
    chat: {
      webm: 'assets/product-demo/07-first-conversation-he.webm',
      mp4: 'assets/product-demo/07-first-conversation-he.mp4',
      poster: 'assets/product-demo/07-first-conversation-he.webp',
      alt: 'צילום מממשק הדמו של לעד: השיחה בין נועה ודניאל לאחר ההתאמה',
      caption: 'לפתוח את השיחה'
    }
  };

  // The clip plays only while it is on screen. Visitors who asked for reduced motion,
  // or who pressed Pause, keep the still poster until they press Play themselves.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let onScreen = false;
  let userPaused = false;

  function playIfAllowed() {
    if (onScreen && !userPaused && !reduceMotion.matches) capture.play().catch(() => {});
  }

  function syncToggle() {
    if (!toggle) return;
    toggle.dataset.state = capture.paused ? 'paused' : 'playing';
    toggle.setAttribute('aria-label', capture.paused ? 'הפעלת ההדגמה' : 'השהיית ההדגמה');
  }

  function showView(name) {
    const view = views[name];
    if (!view) return;
    if (capture.dataset.view !== name) {
      capture.pause();
      capture.dataset.view = name;
      capture.poster = view.poster;
      webmSource.src = view.webm;
      mp4Source.src = view.mp4;
      capture.load();
    }
    capture.setAttribute('aria-label', view.alt);
    caption.textContent = view.caption;
    buttons.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.productView === name));
    });
    syncToggle();
    playIfAllowed();
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      userPaused = false;
      showView(button.dataset.productView);
    });
  });

  if (toggle) {
    toggle.addEventListener('click', () => {
      if (capture.paused) {
        userPaused = false;
        capture.play().catch(() => {});
      } else {
        userPaused = true;
        capture.pause();
      }
    });
  }
  capture.addEventListener('play', syncToggle);
  capture.addEventListener('pause', syncToggle);

  if ('IntersectionObserver' in window) {
    let postersWarmed = false;
    new IntersectionObserver(entries => {
      onScreen = entries[entries.length - 1].isIntersecting;
      if (onScreen) {
        if (!postersWarmed) {
          // Fetch the other two posters now so switching views never shows an empty screen.
          postersWarmed = true;
          Object.values(views).forEach(view => { new Image().src = view.poster; });
        }
        playIfAllowed();
      } else {
        capture.pause();
      }
    }, { threshold: 0.5 }).observe(capture);
  } else {
    onScreen = true;
  }

  const initial = buttons.find(button => button.getAttribute('aria-pressed') === 'true');
  const initialView = initial?.dataset.productView;
  showView(views[initialView] ? initialView : 'introduction');
})();
