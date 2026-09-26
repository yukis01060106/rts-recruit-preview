/* ============================================================
   motion.js — サイト全体の「体験型」の動き
   ・ページ切り替えの幕（離れるとき）
   ・下層ページの出現演出（自動付与）
   ・下層ページ大見出しの文字せり上がり＋文字の帯
   ・写真のパララックス（奥行き）
   ・カードの 3D チルト
   ・英字ラベルのタイプ演出
   「動きを減らす」設定のときは何もしない
   ============================================================ */
(function () {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  document.documentElement.classList.add('has-motion');
  if (reduce) {
    document.documentElement.classList.add('is-reduced');
    return;
  }

  /* ---------- 1. ページ切り替えの幕 ---------- */
  const curtain = document.querySelector('.x-curtain');
  if (curtain) {
    const isInternal = (a) => {
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return false;
      const href = a.getAttribute('href') || '';
      if (!href || href.startsWith('#') || /^(mailto:|tel:|javascript:)/.test(href)) return false;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return false;
      if (url.pathname === location.pathname && url.hash) return false; // 同じページ内の移動
      if (/\.(jpg|jpeg|png|webp|mp3|pdf)$/i.test(url.pathname)) return false;
      return true;
    };
    document.addEventListener('click', (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest('a');
      if (!isInternal(a)) return;
      e.preventDefault();
      curtain.classList.add('is-leaving');
      setTimeout(() => { location.href = a.href; }, 520);
    });
    // 戻るボタンでキャッシュから復元されたときは幕を開けておく
    window.addEventListener('pageshow', (e) => { if (e.persisted) curtain.classList.remove('is-leaving'); });
  }

  /* ---------- 2. 出現演出の自動付与（下層ページ） ---------- */
  const AUTO = [
    '.sub-hero__lead', '.biz-section__lead', '.biz-detail-card', '.biz-case', '.p-business__visual',
    '.about-message', '.exec-card', '.about-overview', '.history-item', '.about-vision__item',
    '.person-profile__item', '.qa-item', '.schedule-item', '.person-message', '.people-nav',
    '.p-people__category', '.news-card', '.article-body > *', '.job-summary', '.job-section__head',
    '.job-section__photo', '.job-day', '.job-team', '.benefit-card', '.x-career', '.x-career-link',
    '.p-environment__panel-ttl', '.p-environment__panel-lead', '.p-office__item', '.p-roundtable__q-block',
    '.x-city__head', '.x-city__shot', '.x-drink', '.x-floor', '.x-skill', '.x-training-photos',
    '.p-workstyle__item', '.ws-philosophy__text', '.enroot-showcase', '.p-welfare__item'
  ].join(',');
  const skip = (el) => el.closest('.x-in, .js-reveal, .l-header, .l-footer, .c-modal, .ai-concierge') ||
    el.classList.contains('x-in') || el.classList.contains('js-reveal');
  const autoEls = [...document.querySelectorAll(AUTO)].filter((el) => !skip(el));
  autoEls.forEach((el) => el.classList.add('x-auto'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      // 同じ親の中で順番に少しずつ遅らせる
      const sibs = [...el.parentElement.children].filter((c) => c.classList.contains('x-auto'));
      el.style.transitionDelay = `${Math.min(sibs.indexOf(el), 5) * 0.07}s`;
      el.classList.add('is-in');
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  autoEls.forEach((el) => io.observe(el));

  /* ---------- 3. 大見出しの文字せり上がり ＋ 文字の帯 ---------- */
  const splitChars = (el, twoTone) => {
    if (!el || el.dataset.split) return;
    el.dataset.split = '1';
    const text = el.textContent;
    // 2トーン見出し：前半 58% の文字を濃色、残りをアクセント色に（グラデーションの代わり）
    const cut = Math.round([...text].length * 0.58);
    if (twoTone) el.classList.add('is-split');
    el.setAttribute('aria-label', text.trim());
    el.textContent = '';
    // 単語ごとにまとめ、単語の途中では改行しないようにする
    let idx = 0;
    text.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) { el.appendChild(document.createTextNode(' ')); idx += part.length; return; }
      const word = document.createElement('span');
      word.className = 'x-word';
      [...part].forEach((ch) => {
        const w = document.createElement('span');
        w.className = 'x-ch';
        w.setAttribute('aria-hidden', 'true');
        const c = document.createElement('span');
        if (twoTone) c.className = idx < cut ? 'is-a' : 'is-b';
        c.textContent = ch;
        c.style.setProperty('--i', idx);
        w.appendChild(c);
        word.appendChild(w);
        idx += 1;
      });
      el.appendChild(word);
    });
  };
  document.querySelectorAll('.sub-hero__en').forEach((el) => splitChars(el, true));
  document.querySelectorAll('.person-hero__name-en').forEach((el) => splitChars(el, false));

  const hero = document.querySelector('.sub-hero, .recruit-hero, .person-hero, .p-entry-hero');
  if (hero && !document.querySelector('.x-hero')) {
    const words = (document.querySelector('.sub-hero__en, .recruit-hero__en, .person-hero__name, .p-entry-hero__label') || {}).textContent || 'RISE TECH SOLUTIONS';
    const band = document.createElement('div');
    band.className = 'x-marquee x-marquee--sub';
    band.setAttribute('aria-hidden', 'true');
    const items = [words.trim(), 'LET’S RISE TOGETHER', 'WE ARE HIRING'];
    const html = [...items, ...items, ...items, ...items].map((t) => `<span>${t.replace(/[<>&]/g, '')}</span>`).join('');
    band.innerHTML = `<div class="x-marquee__track">${html}</div>`;
    hero.after(band);
  }

  /* ---------- 4. 写真のパララックス ---------- */
  const PARA = '.x-city__hero .x-photo, .x-mukai__photo .x-photo, .x-ceo__photo .x-photo, .x-interview__photo .x-photo, .sol-block__photo .x-photo, .x-day__visual .x-photo, .x-message__photos .x-photo, .p-business__visual, .job-section__photo, .x-biz__img';
  const paraEls = [...document.querySelectorAll(PARA)];
  paraEls.forEach((el) => el.classList.add('x-para'));
  const visible = new Set();
  const pio = new IntersectionObserver((ents) => ents.forEach((en) => en.isIntersecting ? visible.add(en.target) : visible.delete(en.target)), { rootMargin: '100px' });
  paraEls.forEach((el) => pio.observe(el));
  let ticking = false;
  const para = () => {
    const vh = window.innerHeight;
    visible.forEach((el) => {
      const r = el.getBoundingClientRect();
      const p = (r.top + r.height / 2 - vh / 2) / vh; // -1〜1 くらい
      const img = el.querySelector('img');
      if (img) img.style.translate = `0 ${(p * -28).toFixed(1)}px`;
    });
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(para); } }, { passive: true });
  para();

  /* ---------- 5. カードの 3D チルト ---------- */
  if (finePointer) {
    const TILT = '.x-what__list a, .x-job, .x-story, .x-apply__card, .sol-rule, .x-office__card, .x-aud, .benefit-card, .biz-detail-card, .news-card, .exec-card, .x-flow__step, .x-city__shot';
    document.querySelectorAll(TILT).forEach((card) => {
      card.classList.add('x-tilt');
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`);
        card.style.setProperty('--ry', `${(x * 8).toFixed(2)}deg`);
        card.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`);
        card.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ---------- 6. 英字ラベルのタイプ演出 ---------- */
  const labels = [...document.querySelectorAll('.x-head__label, .c-section-head__en ~ .c-section-head__ja')].filter((l) => l.classList.contains('x-head__label'));
  const tio = new IntersectionObserver((ents) => {
    ents.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      tio.unobserve(el);
      const full = el.textContent;
      el.setAttribute('aria-label', full);
      let n = 0;
      el.textContent = '';
      el.classList.add('is-typing');
      const tick = () => {
        n += 1;
        el.textContent = full.slice(0, n);
        if (n < full.length) setTimeout(tick, 28);
        else el.classList.remove('is-typing');
      };
      setTimeout(tick, 200);
    });
  }, { threshold: 0.6 });
  labels.forEach((l) => tio.observe(l));

  /* ---------- 7. 数字のカウントアップ ---------- */
  const COUNT = '.p-workstyle__num, .sol-rule__num, .x-career__pay, .x-data__num';
  const countEls = [...document.querySelectorAll(COUNT)].filter((el) => !el.querySelector('.count'));
  const cio = new IntersectionObserver((ents) => {
    ents.forEach((en) => {
      if (!en.isIntersecting) return;
      cio.unobserve(en.target);
      // 先頭の数字（テキストノード）だけを数え上げる。単位の <em> などはそのまま
      const node = [...en.target.childNodes].find((n) => n.nodeType === 3 && /\d/.test(n.textContent));
      if (!node) return;
      const m = node.textContent.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/s);
      if (!m) return;
      const [, pre, numStr, post] = m;
      const target = parseFloat(numStr);
      const dec = (numStr.split('.')[1] || '').length;
      const start = performance.now();
      const dur = 1400;
      const step = (now) => {
        const t = Math.min((now - start) / dur, 1);
        const e = 1 - Math.pow(1 - t, 3);
        node.textContent = pre + (target * e).toFixed(dec) + post;
        if (t < 1) requestAnimationFrame(step);
        else node.textContent = pre + numStr + post;
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  countEls.forEach((el) => cio.observe(el));

  /* ---------- 8. ボタンの吸い寄せ ---------- */
  if (finePointer) {
    document.querySelectorAll('.x-btn, .btn-entry, .x-line-fab, .x-song__play').forEach((btn) => {
      if (btn.classList.contains('js-magnetic')) return; // 既存の吸い寄せと重ねない
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.18;
        const y = (e.clientY - r.top - r.height / 2) * 0.28;
        btn.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.translate = ''; });
    });
  }

  /* ---------- 9. スクロールの速さで、文字の帯が加速して傾く ---------- */
  const bands = [...document.querySelectorAll('.x-marquee__track')];
  if (bands.length) {
    let lastY = window.scrollY;
    let vel = 0;
    const loop = () => {
      const y = window.scrollY;
      vel += ((y - lastY) - vel) * 0.12;
      lastY = y;
      const speed = 1 + Math.min(Math.abs(vel) / 6, 5);
      const skew = Math.max(-8, Math.min(8, vel * 0.25));
      bands.forEach((t) => {
        t.getAnimations().forEach((a) => { a.playbackRate = vel < -0.5 ? -speed : speed; });
        t.style.setProperty('--skew', `${skew.toFixed(2)}deg`);
      });
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
})();
