'use strict';
    // Show float CTA after scrolling past hero
    (function() {
      const cta = document.getElementById('floatCta');
      if (!cta) return;
      const hero = document.querySelector('.recruit-hero');
      if (!hero) return;
      new IntersectionObserver(entries => {
        const gone = !entries[0].isIntersecting;
        cta.classList.toggle('is-visible', gone);
        cta.setAttribute('aria-hidden', String(!gone));
      }, { threshold: 0 }).observe(hero);
    })();

    // Recruit nav active on scroll
    (function() {
      const items = document.querySelectorAll('.recruit-nav__item');
      const sections = ['beginner','experienced','sales','marketing','flow'].map(id => document.getElementById(id));

      window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        sections.forEach((sec, i) => {
          if (!sec) return;
          const top = sec.getBoundingClientRect().top + scrollY - 200;
          const bottom = top + sec.offsetHeight;
          if (scrollY >= top && scrollY < bottom) {
            items.forEach(el => el.classList.remove('is-active'));
            if (items[i]) items[i].classList.add('is-active');
          }
        });
      }, { passive: true });
    })();
