(() => {
  const product = document.querySelector('.product, .product-section');
  const capture = document.getElementById('product-capture');
  const caption = document.getElementById('product-caption');
  if (!product || !capture || !caption) return;

  const buttons = [...product.querySelectorAll('[data-product-view]')];
  const views = {
    introduction: {
      src: 'assets/product-demo/noa-introduction-he.png',
      alt: 'צילום מממשק הדמו של לעד: ההיכרות עם נועה, בת 29, לאחר חשיפת התמונה הראשונה',
      caption: 'ההיכרות שלך'
    },
    match: {
      src: 'assets/product-demo/noa-daniel-match-he.png',
      alt: 'צילום מממשק הדמו של לעד: ההתאמה ההדדית בין נועה ודניאל',
      caption: 'יש התאמה!'
    },
    chat: {
      src: 'assets/product-demo/noa-daniel-chat-he.png',
      alt: 'צילום מממשק הדמו של לעד: השיחה בין נועה ודניאל לאחר ההתאמה',
      caption: 'לפתוח את השיחה'
    }
  };

  function showView(name) {
    const view = views[name];
    if (!view) return;
    capture.dataset.view = name;
    capture.src = view.src;
    capture.alt = view.alt;
    caption.textContent = view.caption;
    buttons.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.productView === name));
    });
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => showView(button.dataset.productView));
  });

  const initial = buttons.find(button => button.getAttribute('aria-pressed') === 'true');
  const initialView = initial?.dataset.productView;
  showView(views[initialView] ? initialView : 'introduction');
})();
