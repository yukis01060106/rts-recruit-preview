'use strict';
    // News filter
    (function() {
      const btns = document.querySelectorAll('.news-filter__btn');
      const cards = document.querySelectorAll('.news-card');
      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          btns.forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');
          const filter = btn.dataset.filter;
          cards.forEach(card => {
            const show = filter === 'all' || card.dataset.cat === filter;
            card.style.display = show ? '' : 'none';
          });
        });
      });
    })();
