/* ============================================================
   サイト共通の設定
   公式LINE（カジュアル面談の日程調整）のURLをここに入れると、
   全ページの追従ボタンとAI向井のチャットに反映されます。
   空のあいだは、エントリーページへ案内します。
   ============================================================ */
var RTS_LINE_URL = 'https://lin.ee/o2bAwTt' || 'entry-form.html';

/* ============================================================
   Rise Tech Solutions - 採用サイト
   script.js  — Artistic + Playful Edition
   ============================================================ */
'use strict';

/* ============================================================
   0. SCROLL PROGRESS BAR
   ============================================================ */
(function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = total > 0 ? (window.scrollY / total * 100) + '%' : '0%';
  }, { passive: true });
})();

/* ============================================================
   0b. BACK TO TOP
   ============================================================ */
(function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   1. CUSTOM CURSOR
   ============================================================ */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor || window.matchMedia('(max-width:767px)').matches) return;

  const dot  = cursor.querySelector('.cursor__dot');
  const ring = cursor.querySelector('.cursor__ring');

  let mx = 0, my = 0;   // mouse
  let rx = 0, ry = 0;   // ring (lagged)

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
  });

  // Ring follows with lag
  (function animRing() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
    requestAnimationFrame(animRing);
  })();

  // Hover state on interactive elements
  const hoverEls = document.querySelectorAll(
    'a, button, [data-modal], .p-people__item, .p-business__item, .p-welfare__item'
  );
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
  });

  document.addEventListener('mousedown', () => cursor.classList.add('is-click'));
  document.addEventListener('mouseup',   () => cursor.classList.remove('is-click'));
})();

/* ============================================================
   2. HEADER — scroll + hamburger
   ============================================================ */
(function initHeader() {
  const header    = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const gnav      = document.getElementById('gnav');

  window.addEventListener('scroll', () => {
    header.classList.toggle('is-scrolled', window.scrollY > 50);
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('is-open');
    gnav.classList.toggle('is-open', open);
    document.body.classList.toggle('is-menu-open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    document.body.style.overflow = open ? 'hidden' : '';
  });

  gnav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('is-open');
      gnav.classList.remove('is-open');
      document.body.classList.remove('is-menu-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Active nav on scroll
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.l-gnav__list li');

  new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navItems.forEach(item => {
        const a = item.querySelector('a');
        item.classList.toggle('is-active', a && a.getAttribute('href') === '#' + entry.target.id);
      });
    });
  }, { threshold: 0.35 }).observe && sections.forEach(s =>
    new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navItems.forEach(item => {
          const a = item.querySelector('a');
          item.classList.toggle('is-active', a && a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { threshold: 0.35 }).observe(s)
  );
})();

/* ============================================================
   3. HERO SLIDER
   ============================================================ */
(function initSlider() {
  const slides  = document.querySelectorAll('.p-mv__slide');
  const dots    = document.querySelectorAll('.p-mv__dot');
  const prevBtn = document.getElementById('mvPrev');
  const nextBtn = document.getElementById('mvNext');
  const playBtn = document.getElementById('mvPlay');
  if (!slides.length) return;

  let cur = 0, timer = null, playing = true;
  const INTERVAL = 5000;

  function goTo(idx) {
    slides[cur].classList.remove('is-active');
    dots[cur].classList.remove('is-active');
    cur = (idx + slides.length) % slides.length;
    slides[cur].classList.add('is-active');
    dots[cur].classList.add('is-active');
  }

  const next = () => goTo(cur + 1);
  const prev = () => goTo(cur - 1);

  function play()  { timer = setInterval(next, INTERVAL); playing = true;  playBtn.classList.add('is-playing'); }
  function pause() { clearInterval(timer);                 playing = false; playBtn.classList.remove('is-playing'); }

  nextBtn.addEventListener('click', () => { pause(); next(); });
  prevBtn.addEventListener('click', () => { pause(); prev(); });
  playBtn.addEventListener('click', () => playing ? pause() : play());

  dots.forEach(d => d.addEventListener('click', () => { pause(); goTo(+d.dataset.index); }));

  // Touch swipe
  let sx = 0;
  const mv = document.getElementById('mv');
  if (mv) {
    mv.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    mv.addEventListener('touchend', e => {
      const diff = sx - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { pause(); diff > 0 ? next() : prev(); }
    }, { passive: true });
  }

  play();
})();

/* ============================================================
   5. 3D CARD TILT (people cards)
   ============================================================ */
(function initTilt() {
  if (window.matchMedia('(max-width:767px)').matches) return;

  document.querySelectorAll('.p-people__item').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;  // -0.5 ~ 0.5
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale(1.04)`;
      card.style.transition = 'transform .08s linear, box-shadow .3s';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .5s cubic-bezier(0.34,1.56,0.64,1), box-shadow .3s';
    });
  });
})();

/* ============================================================
   6. MAGNETIC BUTTON
   ============================================================ */
(function initMagnetic() {
  if (window.matchMedia('(max-width:767px)').matches) return;

  document.querySelectorAll('.js-magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) * 0.35;
      const dy = (e.clientY - cy) * 0.35;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform .5s cubic-bezier(0.34,1.56,0.64,1), box-shadow .3s';
    });
  });
})();

/* ============================================================
   7. BUSINESS TABS
   ============================================================ */
(function initBusinessTabs() {
  const tabs   = document.querySelectorAll('.p-business__nav-list li');
  const panels = document.querySelectorAll('.p-business__panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('is-active'));
      panels.forEach(p => p.classList.remove('is-active'));
      tab.classList.add('is-active');
      const target = document.getElementById('tab-' + tab.dataset.tab);
      if (target) {
        target.classList.add('is-active');
        // re-trigger reveals
        target.querySelectorAll('.js-reveal').forEach(el => {
          el.classList.remove('is-visible');
          setTimeout(() => el.classList.add('is-visible'), 80);
        });
      }
    });
  });
})();

/* ============================================================
   8. ENVIRONMENT TABS
   ============================================================ */
(function initEnvTabs() {
  const tabs   = document.querySelectorAll('.p-environment__nav-list li');
  const panels = document.querySelectorAll('.p-environment__panel');
  if (!tabs.length) return;

  function activate(tab) {
    tabs.forEach(t => t.classList.remove('is-active'));
    panels.forEach(p => p.classList.remove('is-active'));
    tab.classList.add('is-active');
    const target = document.getElementById('env-' + tab.dataset.env);
    if (target) {
      target.classList.add('is-active');
      target.querySelectorAll('.js-reveal').forEach((el, i) => {
        el.classList.remove('is-visible');
        setTimeout(() => el.classList.add('is-visible'), 80 + i * 60);
      });
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activate(tab));
  });

  // #env-xxx へのリンクで該当タブを直接開く（メガメニュー等からの遷移用）
  const hashId = location.hash.replace('#', '');
  if (hashId.startsWith('env-')) {
    const matchTab = document.querySelector(`.p-environment__nav-list li[data-env="${hashId.slice(4)}"]`);
    if (matchTab) {
      activate(matchTab);
      setTimeout(() => document.getElementById(hashId)?.scrollIntoView(), 100);
    }
  }
})();

/* ============================================================
   9. MODALS
   ============================================================ */
(function initModals() {
  document.querySelectorAll('[data-modal]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const modal = document.getElementById(trigger.dataset.modal);
      if (!modal) return;
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });

  document.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', e => {
      if (el.classList.contains('c-modal__overlay') && e.target !== el) return;
      const modal = el.closest('.c-modal');
      if (!modal) return;
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.c-modal.is-open').forEach(m => {
      m.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });
})();

/* ============================================================
   10. COUNT-UP with bounce
   ============================================================ */
(function initCountUp() {
  const counters = document.querySelectorAll('.count');
  if (!counters.length) return;

  function easeOutBack(t) {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  function animateCount(el) {
    const target = parseInt(el.dataset.target, 10);
    const dur = 2000;
    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / dur, 1);
      el.textContent = Math.floor(easeOutBack(t) * target);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }

  new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      entry.target.closest('.p-about__stat')?.classList.add('is-counted');
    });
  }, { threshold: 0.6 }).observe
  && counters.forEach(c =>
    new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
      });
    }, { threshold: 0.6 }).observe(c)
  );
})();

/* ============================================================
   11. SCROLL REVEAL — with direction variety
   ============================================================ */
(function initReveal() {
  // Map of selector → reveal direction
  const map = [
    ['.p-intro__lead',            'up'],
    ['.p-intro__text',            'up'],
    ['.p-story__img',             'left'],
    ['.p-message__story-text',    'left'],
    ['.p-intro__movie-col',       'right'],
    ['.p-mission__lead',          'up'],
    ['.p-mission__card',          'scale'],
    ['.p-reasons__item',          'up'],
    ['.p-business__item',         'left'],
    ['.p-bizfeature__row:not(.p-bizfeature__row--rev)', 'left'],
    ['.p-bizfeature__row--rev',   'right'],
    ['.p-about__stat',            'scale'],
    ['.p-about__table-row',       'left'],
    ['.p-about__message-img',     'left'],
    ['.p-about__message-body',    'right'],
    ['.p-people__item',           'rotate'],
    ['.p-welfare__item',          'up'],
    ['.p-training__step',         'left'],
    ['.p-career__step',           'up'],
    ['.p-office__item',           'scale'],
    ['.p-message__left',          'left'],
    ['.p-message__body',          'right'],
    ['.p-reasons__head',          'up'],
    ['.p-roundtable__q-block',    'up'],
    ['.p-roundtable__answer',     'right'],
    ['.p-news__item',             'left'],
    ['.p-entry__item',            'up'],
    ['.job-detail__block',        'up'],
    ['.flow-item',                'up'],
    ['.benefit-card',             'up'],
  ];

  map.forEach(([selector, dir]) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('js-reveal', `js-reveal--${dir}`);
      if (i % 4 > 0) el.classList.add(`js-reveal-d${i % 4}`);
    });
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

  document.querySelectorAll('.js-reveal').forEach(el => io.observe(el));
})();

/* ============================================================
   12. PARALLAX — subtle on hero image
   ============================================================ */
(function initParallax() {
  if (window.matchMedia('(max-width:767px)').matches) return;

  const mvSlides = document.querySelectorAll('.p-mv__slide-img');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > window.innerHeight) return;
    const offset = y * 0.35;
    mvSlides.forEach(img => {
      img.style.transform = `scale(1) translateY(${offset}px)`;
    });
    // override active scale
    document.querySelector('.p-mv__slide.is-active .p-mv__slide-img')
      ?.style.setProperty('transform', `scale(1) translateY(${offset}px)`);
  }, { passive: true });
})();

/* ============================================================
   13. SMOOTH SCROLL
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const headerH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-h') || '100', 10
      );
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - headerH, behavior: 'smooth' });
    });
  });
})();

/* ============================================================
   14. ENTRY LIST — stagger on first view
   ============================================================ */
(function initEntryStagger() {
  const items = document.querySelectorAll('.p-entry__item');
  let fired = false;

  new IntersectionObserver(entries => {
    if (fired || !entries.some(e => e.isIntersecting)) return;
    fired = true;
    items.forEach((item, i) => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(-20px)';
      setTimeout(() => {
        item.style.transition = 'opacity .5s, transform .5s cubic-bezier(0.34,1.56,0.64,1)';
        item.style.opacity = '1';
        item.style.transform = '';
      }, i * 100);
    });
  }, { threshold: 0.2 }).observe(document.querySelector('.p-entry__list') || document.body);
})();

/* ============================================================
   15. FLOATING CTA — show after scrolling past hero
   ============================================================ */
(function initFloatCta() {
  const cta = document.getElementById('floatCta');
  if (!cta) return;

  const mv = document.querySelector('.p-mv, .x-hero');
  if (!mv) return;

  const obs = new IntersectionObserver(entries => {
    const gone = !entries[0].isIntersecting;
    cta.classList.toggle('is-visible', gone);
    cta.setAttribute('aria-hidden', String(!gone));
  }, { threshold: 0 });

  obs.observe(mv);
})();

/* ============================================================
   16. 3D BACKGROUND — ワイヤーフレーム多面体＋奥行きパーティクル
   （依存ライブラリなし・Canvas 2Dに透視投影で描画。複数セクションで再利用）
   ============================================================ */
function initWireframe3D(canvas, opts) {
  if (!canvas) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');
  const TEAL = opts.teal || '20,210,192';
  const BLUE = opts.blue || '90,140,255';
  const particleCount = opts.particleCount || 70;
  const primary = opts.primary || { cx: 0.56, cy: 0.34, scale: 0.16 };
  const secondary = opts.secondary || { cx: 0.16, cy: 0.78, scale: 0.07 };

  let W = 0, H = 0, DPR = 1;
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  /* ---- 正20面体（icosahedron）の頂点とエッジ ---- */
  const PHI = (1 + Math.sqrt(5)) / 2;
  const V = [
    [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
    [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
    [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1],
  ].map(v => {
    const len = Math.hypot(v[0], v[1], v[2]);
    return [v[0] / len, v[1] / len, v[2] / len];
  });
  const EDGES = [];
  for (let i = 0; i < V.length; i++) {
    for (let j = i + 1; j < V.length; j++) {
      const d = Math.hypot(V[i][0]-V[j][0], V[i][1]-V[j][1], V[i][2]-V[j][2]);
      if (d < 1.1) EDGES.push([i, j]); // 隣接頂点のみ結ぶ
    }
  }

  /* ---- 奥行きパーティクル ---- */
  const PARTICLES = Array.from({ length: particleCount }, () => ({
    x: Math.random() * 2 - 1,
    y: Math.random() * 2 - 1,
    z: Math.random(),            // 0(奥) 〜 1(手前)
    s: Math.random() * 0.35 + 0.08, // 流れる速さ
  }));

  /* ---- マウスパララックス ---- */
  let targetRX = 0, targetRY = 0, curRX = 0, curRY = 0;
  window.addEventListener('pointermove', e => {
    targetRY = (e.clientX / window.innerWidth - 0.5) * 0.5;
    targetRX = (e.clientY / window.innerHeight - 0.5) * 0.35;
  }, { passive: true });

  function project(p, rx, ry, cx, cy, scale) {
    // Y軸回転 → X軸回転 → 透視投影
    let [x, y, z] = p;
    let x1 = x * Math.cos(ry) + z * Math.sin(ry);
    let z1 = -x * Math.sin(ry) + z * Math.cos(ry);
    let y1 = y * Math.cos(rx) - z1 * Math.sin(rx);
    let z2 = y * Math.sin(rx) + z1 * Math.cos(rx);
    const persp = 3 / (3 + z2);
    return [cx + x1 * scale * persp, cy + y1 * scale * persp, persp];
  }

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    curRX += (targetRX - curRX) * 0.04;
    curRY += (targetRY - curRY) * 0.04;

    /* --- パーティクル（奥から手前に流れる） --- */
    for (const p of PARTICLES) {
      p.z += p.s * 0.0016;
      if (p.z > 1) { p.z -= 1; p.x = Math.random() * 2 - 1; p.y = Math.random() * 2 - 1; }
      const persp = 0.25 + p.z * 0.75;
      const px = W / 2 + (p.x + curRY * 0.6) * W * 0.55 * persp;
      const py = H / 2 + (p.y + curRX * 0.6) * H * 0.55 * persp;
      const r = 0.6 + p.z * 1.8;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.z > 0.6 ? TEAL : BLUE},${0.06 + p.z * 0.2})`;
      ctx.fill();
    }

    /* --- 正20面体（メイン） --- */
    const cx = W * primary.cx, cy = H * primary.cy;
    const scale = Math.min(W, H) * primary.scale;
    const rx = curRX + t * 0.12, ry = curRY + t * 0.18;
    const pts = V.map(v => project(v, rx, ry, cx, cy, scale));

    for (const [a, b] of EDGES) {
      const depth = (pts[a][2] + pts[b][2]) / 2; // 手前ほど濃く
      ctx.beginPath();
      ctx.moveTo(pts[a][0], pts[a][1]);
      ctx.lineTo(pts[b][0], pts[b][1]);
      ctx.strokeStyle = `rgba(${TEAL},${0.05 + (depth - 0.75) * 0.55})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    for (const [x, y, persp] of pts) {
      ctx.beginPath();
      ctx.arc(x, y, 1.6 * persp, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${TEAL},${0.25 * persp})`;
      ctx.fill();
    }

    /* --- 小さい相方（逆回転） --- */
    const cx2 = W * secondary.cx, cy2 = H * secondary.cy;
    const scale2 = Math.min(W, H) * secondary.scale;
    const pts2 = V.map(v => project(v, -rx * 0.8, -ry * 0.8 - t * 0.1, cx2, cy2, scale2));
    for (const [a, b] of EDGES) {
      const depth = (pts2[a][2] + pts2[b][2]) / 2;
      ctx.beginPath();
      ctx.moveTo(pts2[a][0], pts2[a][1]);
      ctx.lineTo(pts2[b][0], pts2[b][1]);
      ctx.strokeStyle = `rgba(${BLUE},${0.04 + (depth - 0.75) * 0.4})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  /* ---- 省エネ制御：画面外・非表示タブでは止める ---- */
  let running = false, rafId = null;
  function loop() {
    t += 0.016;
    draw();
    rafId = requestAnimationFrame(loop);
  }
  function start() { if (!running) { running = true; rafId = requestAnimationFrame(loop); } }
  function stop() { running = false; if (rafId) cancelAnimationFrame(rafId); }

  if (reduceMotion) {
    draw(); // 静止画として1フレームだけ描く
    return;
  }

  new IntersectionObserver(entries => {
    entries[0].isIntersecting ? start() : stop();
  }, { threshold: 0 }).observe(canvas);

  document.addEventListener('visibilitychange', () => {
    document.hidden ? stop() : start();
  });
}

initWireframe3D(document.getElementById('mvCanvas'), {
  primary: { cx: 0.56, cy: 0.34, scale: 0.16 },
  secondary: { cx: 0.16, cy: 0.78, scale: 0.07 },
});

initWireframe3D(document.getElementById('messageCanvas'), {
  particleCount: 50,
  primary: { cx: 0.62, cy: 0.32, scale: 0.15 },
  secondary: { cx: 0.88, cy: 0.82, scale: 0.08 },
});

/* ============================================================
   17. LIGHTBOX — ギャラリー写真のクリック拡大
   ============================================================ */
(function initLightbox() {
  const targets = document.querySelectorAll('.p-gallery__track img, .p-gallery__feature-item img, .x-snap__item img');
  if (!targets.length) return;

  const box = document.createElement('div');
  box.className = 'c-lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.innerHTML = `
    <button class="c-lightbox__close" aria-label="閉じる">×</button>
    <img src="" alt="">
    <p class="c-lightbox__caption"></p>
  `;
  document.body.appendChild(box);

  const img = box.querySelector('img');
  const caption = box.querySelector('.c-lightbox__caption');

  function openLightbox(src, alt, cap) {
    img.src = src;
    img.alt = alt || '';
    caption.textContent = cap || '';
    box.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    box.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  targets.forEach(el => {
    el.addEventListener('click', () => {
      // フィーチャー写真は figcaption をキャプションとして表示
      const fig = el.closest('figure');
      const cap = fig ? (fig.querySelector('figcaption')?.textContent || '') : '';
      openLightbox(el.src, el.alt, cap.trim());
    });
  });

  box.addEventListener('click', e => {
    if (e.target !== img) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
})();

/* ============================================================
   18. AI CONCIERGE — AI向井（自動案内。カジュアル面談は本人が担当）
   ページに応じた案内＋よくある質問への定型応答（スクリプト式・要API連携なし）
   ============================================================ */
(function initAiConcierge() {
  const AVATAR = 'images/assistant/mukai.png';
  const NAME = 'AI 向井';

  const page = (location.pathname.split('/').pop() || 'index.html');

  const GREETINGS = {
    'index.html': 'はじめまして！AI向井です。カジュアル面談は、本物の向井が担当します。その前に気になることがあれば、なんでも聞いてくださいね。',
    'about.html': '会社のことが気になりますか？経営理念や会社概要、代表挨拶まで、気軽に聞いてください。',
    'business.html': 'RTSの事業について案内します。4事業部それぞれ雰囲気が違うので、気になるところを聞いてくださいね。',
    'business-solution.html': '受託開発・SESのソリューション事業部です。技術面で気になることがあれば聞いてくださいね。',
    'business-product.html': '自社SaaS「En Root」を育てているプロダクト事業部です。詳しく知りたいことがあれば聞いてください。',
    'business-consulting.html': 'CSO伴走・経営コンサルのチームです。事業の雰囲気で気になるところを聞いてくださいね。',
    'business-bpo.html': 'バックオフィスと1on1メンタリングを担うBPO事業部です。気になることがあれば聞いてください。',
    'people.html': '仲間たちのこと、もっと知りたいですか？未経験・異業種出身のメンバーも多いんですよ。',
    'culture.html': '福利厚生やキャリアパス、オフィスの雰囲気まで。気になるタブから見てみてくださいね。',
    'workstyle.html': '残業時間も休日も、正直な数字で出しています。気になることがあれば聞いてくださいね。',
    'recruit.html': '気になる求人は見つかりましたか？給与や働き方のことも、遠慮なく聞いてください。',
    'shinsotsu.html': '新卒向けページは準備中です。気になる方はお気軽にお問い合わせくださいね。',
    'entry-form.html': '公式LINEから気軽に面談を予約してくださいね。「まず話を聞くだけ」でも大歓迎です。',
    'people-02.html': '先輩たちのリアルな声、参考になっていますか？他の先輩のことも紹介できますよ。',
    'people-03.html': '先輩たちのリアルな声、参考になっていますか？他の先輩のことも紹介できますよ。',
    'news.html': '最新のお知らせをチェック中ですね。会社のことで気になる点があれば聞いてください。',
    'news-detail.html': 'このニュース、気になりますか？関連して会社のことも案内できます。',
  };
  const DEFAULT_GREETING = 'はじめまして！AI向井です。カジュアル面談は、本物の向井が担当します。その前に気になることがあれば、なんでも聞いてくださいね。';

  const FAQ = [
    {
      q: 'カジュアル面談を予約したい',
      a: `ありがとうございます！カジュアル面談は、本物の向井が担当します。日程調整は公式LINEからどうぞ。「まず話を聞くだけ」でも大歓迎です。<br><a class="ai-concierge__line" href="${RTS_LINE_URL}" target="_blank" rel="noopener">公式LINEで日程を調整する</a>`
    },
    {
      q: '未経験でも大丈夫？',
      a: 'はい、大丈夫です！入社前3ヶ月の集中研修＋メンター1:1サポートがあるので、未経験入社の先輩の9割が3ヶ月で現場デビューしています。'
    },
    {
      q: '給与はどれくらい？',
      a: '未経験エンジニアは月給22〜28万円、経験者エンジニアは年収450〜850万円、営業は年収380〜650万円+インセンティブです。ポジションごとの詳細は求人情報ページにまとめています。'
    },
    {
      q: '残業や休日は？',
      a: '月平均残業は14.2時間（直近1年実績）、年間休日125日、有休取得率85%です。「終電まで」が常態化しない働き方を大事にしています。'
    },
    {
      q: '福利厚生は？',
      a: '書籍・Udemy・勉強会などの学習費は会社負担、フレックスタイム制、副業もOKです。詳しくは「環境を知る」セクションにまとめています。'
    },
    {
      q: '選考の流れは？',
      a: '気軽に応募 → 書類確認 → カジュアル面談 → 最終面接 → 内定・入社、というシンプルな流れです。まずは話を聞くだけでも大歓迎です！'
    },
  ];

  const root = document.createElement('div');
  root.className = 'ai-concierge';
  root.id = 'aiConcierge';
  root.innerHTML = `
    <button class="ai-concierge__toggle" aria-label="AI向井に質問する" aria-expanded="false">
      <img src="${AVATAR}" alt="${NAME}">
    </button>
    <span class="ai-concierge__badge" aria-hidden="true">AI 向井</span>
    <div class="ai-concierge__scroll-tip" id="aiConciergeScrollTip" aria-hidden="true"></div>
    <div class="ai-concierge__panel" role="dialog" aria-label="AI向井の自動案内チャット">
      <div class="ai-concierge__header">
        <img src="${AVATAR}" alt="${NAME}">
        <div class="ai-concierge__header-text">
          <strong>${NAME}</strong>
          <span>人事・DXコンサル 向井のAI｜面談は本人が担当</span>
        </div>
        <button class="ai-concierge__close" aria-label="閉じる">×</button>
      </div>
      <div class="ai-concierge__body" id="aiConciergeBody"></div>
    </div>
  `;
  document.body.appendChild(root);

  const toggleBtn = root.querySelector('.ai-concierge__toggle');
  const closeBtn = root.querySelector('.ai-concierge__close');
  const body = root.querySelector('#aiConciergeBody');

  function scrollToBottom() {
    body.scrollTop = body.scrollHeight;
  }

  function addBotMessage(text) {
    const row = document.createElement('div');
    row.className = 'ai-concierge__row';
    row.innerHTML = `<img src="${AVATAR}" alt=""><div class="ai-concierge__msg">${text}</div>`;
    body.appendChild(row);
    scrollToBottom();
  }

  function addUserMessage(text) {
    const row = document.createElement('div');
    row.className = 'ai-concierge__row ai-concierge__row--user';
    row.innerHTML = `<div class="ai-concierge__msg">${text}</div>`;
    body.appendChild(row);
    scrollToBottom();
  }

  function addTyping() {
    const row = document.createElement('div');
    row.className = 'ai-concierge__row ai-concierge__typing-row';
    row.innerHTML = `<img src="${AVATAR}" alt=""><div class="ai-concierge__msg ai-concierge__typing"><span></span><span></span><span></span></div>`;
    body.appendChild(row);
    scrollToBottom();
    return row;
  }

  function renderChips() {
    const wrap = document.createElement('div');
    wrap.className = 'ai-concierge__chips';
    wrap.id = 'aiConciergeChips';
    FAQ.forEach(item => {
      const chip = document.createElement('button');
      chip.className = 'ai-concierge__chip';
      chip.textContent = item.q;
      chip.addEventListener('click', () => handleChipClick(item, chip));
      wrap.appendChild(chip);
    });
    const cta = document.createElement('a');
    cta.className = 'ai-concierge__chip ai-concierge__chip--cta';
    cta.href = 'entry-form.html';
    cta.textContent = 'エントリーする';
    wrap.appendChild(cta);
    body.appendChild(wrap);
    scrollToBottom();
  }

  function handleChipClick(item, chipEl) {
    const chipsWrap = document.getElementById('aiConciergeChips');
    if (chipsWrap) chipsWrap.remove();

    addUserMessage(item.q);
    const typingRow = addTyping();

    setTimeout(() => {
      typingRow.remove();
      addBotMessage(item.a);
      renderFollowUpChips();
    }, 550);
  }

  function renderFollowUpChips() {
    const wrap = document.createElement('div');
    wrap.className = 'ai-concierge__chips';
    wrap.id = 'aiConciergeChips';

    const more = document.createElement('button');
    more.className = 'ai-concierge__chip';
    more.textContent = '他の質問を見る';
    more.addEventListener('click', () => { wrap.remove(); renderChips(); });
    wrap.appendChild(more);

    const cta = document.createElement('a');
    cta.className = 'ai-concierge__chip ai-concierge__chip--cta';
    cta.href = 'entry-form.html';
    cta.textContent = 'エントリーする';
    wrap.appendChild(cta);

    body.appendChild(wrap);
    scrollToBottom();
  }

  let initialized = false;
  function openPanel() {
    root.classList.add('is-open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    if (!initialized) {
      initialized = true;
      addBotMessage(GREETINGS[page] || DEFAULT_GREETING);
      renderChips();
    }
  }
  function closePanel() {
    root.classList.remove('is-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
  }

  toggleBtn.addEventListener('click', () => {
    root.classList.contains('is-open') ? closePanel() : openPanel();
  });
  closeBtn.addEventListener('click', closePanel);

  /* スクロール中はアイコンを控えめにして、下のコンテンツを隠しすぎないようにする */
  let scrollDimTimer = null;
  window.addEventListener('scroll', () => {
    root.classList.add('is-scrolling');
    clearTimeout(scrollDimTimer);
    scrollDimTimer = setTimeout(() => root.classList.remove('is-scrolling'), 500);
  }, { passive: true });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && root.classList.contains('is-open')) closePanel();
  });

  /* ---- スクロール連動のひとことコメント ---- */
  const SECTION_COMMENTS = {
    message: '本気で挑みたい人、待ってます！',
    business: 'RTSの事業、4つあるんです',
    about: '会社のこと、もっと知りたいですか？',
    people: '先輩たち、みんな個性的なんですよ',
    gallery: 'オフィスの雰囲気、伝わりますか？',
    workstyle: '数字で見る働き方、正直に出してます',
    environment: '福利厚生も、ちゃんと聞いてくださいね',
    stories: '社員のリアルな記事もあります',
    news: '最新のお知らせもチェックしてみて',
    entry: '気になったら、気軽にエントリーしてくださいね！',
    beginner: '未経験の方、まずはここを読んでみて',
    experienced: '経験者の方向けの求人はこちらです',
    sales: '営業職、気になりますか？',
    marketing: 'マーケティング担当の仕事はこちら',
    flow: '選考の流れ、シンプルにしてます',
  };

  const scrollTip = document.getElementById('aiConciergeScrollTip');
  let tipTimer = null;

  function showScrollTip(text) {
    if (root.classList.contains('is-open')) return;
    scrollTip.textContent = text;
    scrollTip.classList.add('is-visible');
    clearTimeout(tipTimer);
    tipTimer = setTimeout(() => scrollTip.classList.remove('is-visible'), 4200);
  }

  const shownSections = new Set();
  const sectionEls = Object.keys(SECTION_COMMENTS)
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if (sectionEls.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        if (shownSections.has(id)) return;
        shownSections.add(id);
        showScrollTip(SECTION_COMMENTS[id]);
      });
    }, { threshold: 0.5 });
    sectionEls.forEach(el => sectionObserver.observe(el));
  }
})();
