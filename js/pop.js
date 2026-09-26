/* ============================================================
   POP TECH Edition — トップページ用の小さな動き
   ============================================================ */

/* 1日のスケジュール: タブ切り替え */
(function initDayTabs() {
  const tabs = document.querySelectorAll('.x-day__tab');
  if (!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        const on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
      });
      document.querySelectorAll('.x-day__panel').forEach(p => {
        p.classList.toggle('is-active', p.id === tab.getAttribute('aria-controls'));
      });
    });
  });
})();

/* スクロールで出現 */
(function initPopReveal() {
  const els = document.querySelectorAll('.x-in');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 3) * 0.08}s`;
    io.observe(el);
  });
})();

/* ヒーローのコラージュ: マウスに合わせて少し動かす */
(function initHeroParallax() {
  const collage = document.querySelector('.x-hero__collage');
  if (!collage || window.matchMedia('(max-width: 1024px), (prefers-reduced-motion: reduce)').matches) return;
  const items = collage.querySelectorAll('[data-depth]');
  document.querySelector('.x-hero').addEventListener('mousemove', e => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    items.forEach(el => {
      const d = parseFloat(el.dataset.depth);
      el.style.translate = `${x * d}px ${y * d}px`;
    });
  });
})();

/* 公式LINE（カジュアル面談の日程調整）への追従ボタン — 全ページ共通 */
(function initLineFab() {
  if (document.querySelector('.x-line-fab')) return;
  const url = window.RTS_LINE_URL || 'entry-form';
  const isLine = /line\.me|lin\.ee/.test(url);
  const a = document.createElement('a');
  a.className = 'x-line-fab' + (isLine ? '' : ' x-line-fab--fallback');
  a.href = url;
  a.setAttribute('aria-label', isLine ? '公式LINEでカジュアル面談を予約する（新しいタブで開きます）' : 'まずは話を聞いてみる');
  if (isLine) { a.target = '_blank'; a.rel = 'noopener'; }
  a.innerHTML = `
    <span class="x-line-fab__icon" aria-hidden="true">${isLine ? '' : '→'}<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 5.64 2 10.1c0 4 3.55 7.35 8.35 7.99.33.07.77.22.88.5.1.25.07.65.03.9l-.14.85c-.04.25-.2.99.87.54 1.07-.45 5.76-3.39 7.86-5.8C21.3 13.5 22 11.9 22 10.1 22 5.64 17.52 2 12 2z"/></svg></span>
    <span class="x-line-fab__text"><small>カジュアル面談の日程調整</small><b class="is-pc">${isLine ? '公式LINEで予約する' : 'まずは話を聞いてみる'}</b><b class="is-sp">${isLine ? 'LINEで面談予約' : '話を聞いてみる'}</b></span>`;
  document.body.appendChild(a);

  // 表示のタイミング
  // ・トップは最初の画面（写真）を隠さないよう、少しスクロールしてから出す
  // ・スマホは下へ読み進めている間は引っ込み、止まるか上に戻ると出てくる
  // ・エントリー欄やフッターが見えている間は、そちらのボタンに任せて隠す
  const hero = document.querySelector('.x-hero');
  const mobile = window.matchMedia('(max-width: 767px)');
  const ends = [...document.querySelectorAll('#entry, .l-footer')];
  let endVisible = false;
  if (ends.length && 'IntersectionObserver' in window) {
    const seen = new Set();
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
      endVisible = seen.size > 0;
      sync();
    }, { threshold: 0.15 });
    ends.forEach((el) => io.observe(el));
  }
  let lastY = window.scrollY;
  let tucked = false;
  let idle;
  function sync() {
    const past = !hero || window.scrollY > window.innerHeight * 0.55;
    a.classList.toggle('is-visible', past && !endVisible);
    a.classList.toggle('is-tucked', tucked && mobile.matches);
  }
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (Math.abs(y - lastY) > 6) { tucked = y > lastY; lastY = y; }
    clearTimeout(idle);
    idle = setTimeout(() => { tucked = false; sync(); }, 900);
    sync();
  }, { passive: true });
  setTimeout(sync, 600);
})();

/* 「Let's Rise together.」を1文字ずつに分けて動かす */
(function initHeroBig() {
  const big = document.querySelector('.x-hero__big');
  if (!big || big.dataset.split) return;
  big.dataset.split = '1';
  let i = 0;
  const splitWord = (word, inRise) => {
    const w = document.createElement('span');
    w.className = 'w';
    w.setAttribute('aria-hidden', 'true');
    [...word].forEach((ch, j) => {
      const c = document.createElement('span');
      c.className = 'c';
      c.textContent = ch;
      c.style.setProperty('--i', i++);
      if (inRise) c.style.setProperty('--j', j);
      w.appendChild(c);
    });
    return w;
  };
  const frag = document.createDocumentFragment();
  big.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        frag.appendChild(/\s/.test(part) ? document.createTextNode(' ') : splitWord(part, false));
      });
    } else {
      const rise = node.cloneNode(false);
      rise.appendChild(splitWord(node.textContent, true));
      const up = document.createElement('i');
      up.className = 'x-hero__up';
      up.setAttribute('aria-hidden', 'true');
      rise.appendChild(up);
      frag.appendChild(rise);
    }
  });
  big.textContent = '';
  big.appendChild(frag);
})();

/* 「RTSってなにしてる会社？」チャット: スクロールに合わせてメッセージが届く */
(function initScrollChat() {
  const section = document.querySelector('.x-what');
  const track = section && section.querySelector('.x-chat-track');
  const chat = track && track.querySelector('.x-chat');
  if (!chat || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const body = chat.querySelector('.x-chat__body');
  const msgs = [...body.querySelectorAll('.x-chat__msg')];
  const hint = document.createElement('p');
  hint.className = 'x-chat__hint';
  hint.textContent = '↓ スクロールで会話がすすみます';
  body.prepend(hint);
  const typing = document.createElement('div');
  typing.className = 'x-chat__typing';
  typing.setAttribute('aria-hidden', 'true');
  typing.innerHTML = '<i></i><i></i><i></i>';
  body.appendChild(typing);

  // 全メッセージを出した状態の高さで、枠の大きさを固定（届くたびに枠が伸び縮みしないように）
  const bodyH = body.scrollHeight;
  section.style.setProperty('--chat-body-h', Math.min(bodyH, window.innerHeight - 220) + 'px');
  section.classList.add('is-scrolly');
  section.style.setProperty('--chat-h', chat.offsetHeight + 'px');

  const N = msgs.length;
  const at = k => 0.04 + (k / N) * 0.9;   // k通目が届くスクロール位置（0〜1）
  const TYPE = 0.07;                      // 届く直前に「入力中…」を出す幅

  let last = -1;
  function update() {
    const r = track.getBoundingClientRect();
    const stickyTop = parseFloat(getComputedStyle(chat).top) || 0;
    const p = Math.min(1, Math.max(0, (stickyTop - r.top) / (r.height - chat.offsetHeight)));
    let shown = 0;
    msgs.forEach((m, k) => { if (p >= at(k)) shown = k + 1; });
    if (shown !== last) {
      msgs.forEach((m, k) => {
        m.classList.toggle('is-shown', k < shown);
        const next = msgs[k + 1];
        m.classList.toggle('is-read', m.classList.contains('x-chat__msg--you') && !!next && k + 1 < shown);
      });
      hint.classList.toggle('is-shown', shown === 0);
      last = shown;
    }
    // 会話を読んでいるあいだは、右下のAI向井アイコンを隠してチャットに重ならないようにする
    const reading = r.top < window.innerHeight * 0.6 && r.bottom > window.innerHeight * 0.4;
    document.body.classList.toggle('is-reading-chat', reading);
    const next = msgs[shown];
    typing.classList.toggle('is-shown', !!next && next.classList.contains('x-chat__msg--rts') && p >= at(shown) - TYPE);
  }
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

/* キャリア例: 東京本社 / 熊本支店のタブ切り替え */
(function initCareerTabs() {
  const tabs = document.querySelectorAll('.x-career__tab');
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => {
      const on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
    });
    document.querySelectorAll('.x-career__panel').forEach(p => {
      p.classList.toggle('is-active', p.id === tab.getAttribute('aria-controls'));
    });
  }));
})();

/* ============================================================
   体験型スクロール（トップページ）
   ・左の章ナビ：いま読んでいる章を表示
   ・AI向井が、章に入るたびに話しかけてくる
   ・ステッカーがスクロールに少し遅れてついてくる
   ============================================================ */
(function initScrollExperience() {
  if (!document.getElementById('what')) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const LINE = window.RTS_LINE_URL || 'entry-form';

  const CHAPTERS = [
    { id: 'song',      label: 'イメージソング',    talk: 'RTSのイメージソング、3曲あるんです🎵 BGMにしながら見てみてください！' },
    { id: 'what',      label: 'RTSってどんな会社？' },
    { id: 'message',   label: 'メッセージ',        talk: 'ここは代表の想いが、ぎゅっと詰まってるところです🔥' },
    { id: 'mission',   label: '向き合っていること', talk: '「地方を、テクノロジーで守りたい」。これがRTSの原点なんです。' },
    { id: 'why',       label: 'RTSを選ぶ理由',      talk: '正直に、3つだけ。いちばん気になるのはどれですか？' },
    { id: 'workstyle', label: '数字で見るRTS',      talk: '休日・有休・働き方のこと、数字でまとめています📊' },
    { id: 'day',       label: '社員の1日',          talk: 'タブを押すと、職種ごとの1日がのぞけますよ👆' },
    { id: 'people',    label: '働く仲間',           talk: '異業種から来た人ばかりなんです。インタビュー、ぜひ読んでみて！' },
    { id: 'gallery',   label: 'RTSの日常',          talk: 'ふだんの私たちです📷 写真は押すと大きくなります。' },
    { id: 'office',    label: '働く環境',          talk: '熊本オフィスは、ドリンクサーバーが飲み放題なんです🥤（月10回までですけど笑）' },
    { id: 'ceo',       label: '代表メッセージ',     talk: '代表の節賀です。面談でも気さくに話してくれますよ。' },
    { id: 'stories',   label: '読みもの',           talk: 'もっと深く知りたい人は、記事もどうぞ。' },
    { id: 'faq',       label: '選考とよくある質問', talk: 'カジュアル面談は、わたし（本物の向井）が担当します！気軽に来てくださいね。' },
    { id: 'news',      label: 'お知らせ' },
    { id: 'entry',     label: 'エントリー',         talk: 'ここまで読んでくれて、ありがとう！まずは話を聞くだけでも大歓迎です😊', cta: true },
  ].filter(c => document.getElementById(c.id));

  /* ---------- 章ナビ ---------- */
  const rail = document.createElement('nav');
  rail.className = 'x-rail';
  rail.setAttribute('aria-label', 'トップページの章');
  rail.innerHTML = `
    <p class="x-rail__num"><b>01</b><span>/${String(CHAPTERS.length).padStart(2, '0')}</span></p>
    <p class="x-rail__label"></p>
    <ol class="x-rail__dots">${CHAPTERS.map((c, i) =>
      `<li><a href="#${c.id}" aria-label="${i + 1}. ${c.label}"></a></li>`).join('')}</ol>`;
  document.body.appendChild(rail);
  const railNum = rail.querySelector('.x-rail__num b');
  const railLabel = rail.querySelector('.x-rail__label');
  const railDots = [...rail.querySelectorAll('.x-rail__dots a')];

  /* ---------- AI向井の話しかけ ---------- */
  document.body.classList.add('has-talk');
  const talk = document.createElement('div');
  talk.className = 'x-talk';
  talk.setAttribute('role', 'status');
  talk.setAttribute('aria-live', 'polite');
  talk.innerHTML = `
    <img class="x-talk__avatar" src="images/assistant/mukai.png" alt="">
    <div class="x-talk__bubble">
      <p class="x-talk__name">AI 向井</p>
      <p class="x-talk__text"></p>
      <span class="x-talk__typing" aria-hidden="true"><i></i><i></i><i></i></span>
      <a class="x-talk__cta" href="${LINE}" target="_blank" rel="noopener">公式LINEで面談を予約する</a>
    </div>
    <button class="x-talk__close" aria-label="閉じる">×</button>`;
  document.body.appendChild(talk);
  const talkText = talk.querySelector('.x-talk__text');
  let talkTimers = [];
  let muted = false;
  const clearTalk = () => { talkTimers.forEach(clearTimeout); talkTimers = []; };
  const hideTalk = () => { clearTalk(); talk.classList.remove('is-visible', 'is-typing', 'has-cta'); };
  talk.querySelector('.x-talk__close').addEventListener('click', () => { muted = true; hideTalk(); });

  function say(ch) {
    if (muted || !ch.talk) return;
    if (document.querySelector('.ai-concierge.is-open')) return;
    clearTalk();
    talkText.textContent = '';
    talk.classList.toggle('has-cta', !!ch.cta);
    talk.classList.add('is-visible', 'is-typing');
    talkTimers.push(setTimeout(() => {
      talk.classList.remove('is-typing');
      talkText.textContent = ch.talk;
    }, reduce ? 0 : 900));
    talkTimers.push(setTimeout(hideTalk, ch.cta ? 12000 : 6500));
  }

  /* ---------- いまの章を判定 ---------- */
  const said = new Set();
  let current = -1;
  function update() {
    const mid = window.innerHeight * 0.45;
    let idx = -1;
    CHAPTERS.forEach((c, i) => {
      const r = document.getElementById(c.id).getBoundingClientRect();
      if (r.top <= mid) idx = i;
    });
    const heroGone = document.getElementById('mv').getBoundingClientRect().bottom < mid;
    rail.classList.toggle('is-visible', heroGone && idx >= 0);
    if (idx === current || idx < 0) return;
    current = idx;
    railNum.textContent = String(idx + 1).padStart(2, '0');
    railLabel.textContent = CHAPTERS[idx].label;
    railDots.forEach((d, i) => {
      d.classList.toggle('is-active', i === idx);
      d.classList.toggle('is-done', i < idx);
    });
    const ch = CHAPTERS[idx];
    if (!said.has(ch.id)) { said.add(ch.id); say(ch); }
  }

  /* ---------- ステッカーの奥行き ---------- */
  const floaters = reduce ? [] :
    [...document.querySelectorAll('main .x-sec .x-sticker, main .x-sec .x-stamp')];
  function parallax() {
    const vh = window.innerHeight;
    floaters.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const off = (r.top + r.height / 2 - vh / 2) * -0.12;
      el.style.translate = `0 ${off.toFixed(1)}px`;
    });
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); parallax(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', update);
  update(); parallax();
})();

/* イメージソングのプレーヤー */
(function initSongPlayer() {
  const sec = document.querySelector('.x-song');
  if (!sec) return;
  const audio = sec.querySelector('.x-song__audio');
  const playBtn = sec.querySelector('.x-song__play');
  const seek = sec.querySelector('.x-song__seek');
  const cur = sec.querySelector('.x-song__cur');
  const dur = sec.querySelector('.x-song__dur');
  const cover = sec.querySelector('.x-song__cover');
  const title = sec.querySelector('.x-song__title');
  const desc = sec.querySelector('.x-song__desc');
  const tracks = [...sec.querySelectorAll('.x-song__track')];
  const lyricsBox = sec.querySelector('.x-song__lyrics');
  const lyricsBtn = sec.querySelector('.x-song__lyrics-btn');
  const lyricsTitle = sec.querySelector('.x-song__lyrics-title');
  const fmt = t => isFinite(t) ? `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}` : '0:00';

  const mini = document.createElement('div');
  mini.className = 'x-mini is-paused';
  mini.innerHTML = '<img src="" alt=""><p><small>NOW PLAYING</small><span></span></p><button aria-label="再生／一時停止"><svg viewBox="0 0 24 24" width="16" height="16"><polygon points="7,4 20,12 7,20" fill="currentColor"/></svg></button>';
  document.body.appendChild(mini);
  const miniBtn = mini.querySelector('button');
  mini.querySelector('p').addEventListener('click', () => window.__lenis ? window.__lenis.scrollTo(sec, { offset: -90 }) : sec.scrollIntoView({ behavior: 'smooth' }));
  mini.querySelector('p').style.cursor = 'pointer';

  function syncState() {
    const playing = !audio.paused;
    sec.classList.toggle('is-playing', playing);
    playBtn.setAttribute('aria-label', playing ? '一時停止' : '再生');
    mini.classList.toggle('is-paused', !playing);
    miniBtn.innerHTML = playing ? '<svg viewBox="0 0 24 24" width="16" height="16"><rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/></svg>' : '<svg viewBox="0 0 24 24" width="16" height="16"><polygon points="7,4 20,12 7,20" fill="currentColor"/></svg>';
    updateMini();
  }
  function updateMini() {
    const r = sec.getBoundingClientRect();
    const away = r.bottom < 80 || r.top > window.innerHeight;
    const started = audio.currentTime > 0;
    mini.classList.toggle('is-visible', away && started);
  }
  const toggle = () => { audio.paused ? audio.play() : audio.pause(); };
  playBtn.addEventListener('click', toggle);
  miniBtn.addEventListener('click', toggle);
  audio.addEventListener('play', syncState);
  audio.addEventListener('pause', syncState);
  audio.addEventListener('loadedmetadata', () => { dur.textContent = fmt(audio.duration); });
  audio.addEventListener('timeupdate', () => {
    cur.textContent = fmt(audio.currentTime);
    if (audio.duration) seek.value = (audio.currentTime / audio.duration) * 100;
  });
  seek.addEventListener('input', () => {
    if (audio.duration) audio.currentTime = (seek.value / 100) * audio.duration;
  });
  audio.addEventListener('ended', () => {
    const i = tracks.findIndex(t => t.classList.contains('is-active'));
    select(tracks[(i + 1) % tracks.length], true);
  });

  function select(btn, autoplay) {
    tracks.forEach(t => t.classList.toggle('is-active', t === btn));
    audio.src = btn.dataset.src;
    cover.src = btn.dataset.cover;
    title.textContent = btn.dataset.title;
    desc.textContent = btn.dataset.desc;
    dur.textContent = btn.dataset.dur;
    cur.textContent = '0:00'; seek.value = 0;
    lyricsTitle.textContent = btn.dataset.title;
    sec.querySelectorAll('.x-song__lyrics-body').forEach(b => { b.hidden = b.id !== btn.dataset.lyrics; });
    mini.querySelector('img').src = btn.dataset.cover;
    mini.querySelector('span').textContent = btn.dataset.title;
    if (autoplay) audio.play();
  }
  tracks.forEach(t => t.addEventListener('click', () => select(t, true)));
  select(tracks[0], false);

  lyricsBtn.addEventListener('click', () => {
    const open = lyricsBox.hidden;
    lyricsBox.hidden = !open;
    lyricsBtn.setAttribute('aria-expanded', String(open));
    lyricsBtn.textContent = open ? '歌詞を閉じる' : '歌詞を見る ♪';
    if (open) lyricsBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  window.addEventListener('scroll', updateMini, { passive: true });
})();

/* スマホ・タブレットのメニュー: 中の一覧を開閉するボタン */
(function initSubMenus() {
  document.querySelectorAll('.l-gnav__has-dropdown').forEach((li, i) => {
    const dd = li.querySelector('.l-gnav__dropdown');
    if (!dd || li.querySelector('.l-gnav__sub-toggle')) return;
    dd.id = dd.id || `gnavSub${i}`;
    const label = li.querySelector(':scope > a .ja')?.textContent || 'メニュー';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'l-gnav__sub-toggle';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', dd.id);
    btn.setAttribute('aria-label', `${label}の一覧を開く`);
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>';
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const open = li.classList.toggle('is-sub-open');
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', `${label}の一覧を${open ? '閉じる' : '開く'}`);
    });
    li.insertBefore(btn, dd);
  });
})();

/* スマホ・タブレットのメニューに、公式LINEの予約ボタンを追加 */
(function addLineToMenu() {
  const btns = document.querySelector('.l-gnav__btns');
  if (!btns || btns.querySelector('.l-gnav__line')) return;
  const a = document.createElement('a');
  a.className = 'l-gnav__line';
  a.href = window.RTS_LINE_URL || 'entry-form';
  a.target = '_blank';
  a.rel = 'noopener';
  a.textContent = '公式LINEでカジュアル面談を予約';
  btns.prepend(a);
})();
