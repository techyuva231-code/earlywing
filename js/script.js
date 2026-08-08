/* ============================================
   EarlyWing — Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mode-toggling clipboard widget ---------- */
  const birdData = {
    who: "Riverbend HVAC &amp; Air",
    sub: "CREW OF 11 · UPCOMING THIS MONTH",
    items: [
      {label:"OSHA 10-hour cards on file", tag:"OSHA"},
      {label:"State HVAC licenses current", tag:"LICENSE"},
      {label:"EPA 608 refrigerant certs", tag:"EPA"},
      {label:"Vehicle &amp; liability insurance", tag:"INSURANCE"},
      {label:"Annual safety training logged", tag:"SAFETY"}
    ],
    stampText:"AUDIT READY"
  };
  const owlData = {
    who: "Riverbend HVAC &amp; Air",
    sub: "CREW OF 11 · CONTINUOUS MONITORING",
    items: [
      {label:"J. Reyes — EPA cert expired 6 days ago", tag:"EPA"},
      {label:"Van #3 — insurance lapsed", tag:"INSURANCE"},
      {label:"Site B — safety log overdue", tag:"SAFETY"}
    ],
    stampText:"3 FLAGGED"
  };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const AUTO_INTERVAL = 7000;

  let currentMode = 'bird';
  let timers = [];
  let autoTimer = null;
  let autoPaused = false;

  const clipboard = document.getElementById('clipboard');
  const checklist = document.getElementById('checklist');
  const scoreEl = document.getElementById('scoreNum');
  const stamp = document.getElementById('stamp');
  const autoNote = document.getElementById('autoNote');
  const clipboardWrap = document.querySelector('.clipboard-wrap');

  function clearTimers(){ timers.forEach(t => clearTimeout(t)); timers = []; }

  function render(mode){
    clearTimers();
    const data = mode === 'bird' ? birdData : owlData;

    document.getElementById('clipWho').innerHTML = data.who;
    document.getElementById('clipSub').textContent = data.sub;
    clipboard.classList.toggle('owl-theme', mode === 'owl');
    stamp.classList.toggle('watch', mode === 'owl');
    stamp.textContent = data.stampText;
    stamp.classList.remove('show');

    checklist.innerHTML = data.items.map((it, idx) => `
      <div class="clip-item" id="item-${idx}">
        <div class="check" id="check-${idx}">
          ${mode === 'bird'
            ? '<svg width="11" height="9" viewBox="0 0 11 9"><path d="M1 4.5L4 7.5L10 1.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
            : '<div class="dot-pulse"></div>'}
        </div>
        <div class="label">${it.label}</div>
        <div class="tag">${it.tag}</div>
      </div>
    `).join('');

    // Respect reduced-motion: show end state immediately, skip staggered animation.
    if(prefersReducedMotion){
      data.items.forEach((it, idx) => {
        const itemEl = document.getElementById('item-'+idx);
        const checkEl = document.getElementById('check-'+idx);
        if(mode === 'bird'){ itemEl.classList.add('done'); checkEl.classList.add('done'); }
        else { itemEl.classList.add('flag'); checkEl.classList.add('flag'); }
      });
      scoreEl.style.color = mode === 'bird' ? '#2E7D5B' : '#8C8FE0';
      scoreEl.textContent = mode === 'bird' ? '100%' : String(data.items.length);
      stamp.classList.add('show');
      return;
    }

    if(mode === 'bird'){
      scoreEl.style.color = '#3D5A73';
      scoreEl.textContent = '0%';
      data.items.forEach((it, idx) => {
        timers.push(setTimeout(() => {
          document.getElementById('item-'+idx).classList.add('done');
          document.getElementById('check-'+idx).classList.add('done');
          const pct = Math.round(((idx+1) / data.items.length) * 100);
          scoreEl.textContent = pct + '%';
          if(pct === 100){
            scoreEl.style.color = '#2E7D5B';
            timers.push(setTimeout(() => stamp.classList.add('show'), 250));
          }
        }, 500 + idx * 550));
      });
    } else {
      scoreEl.style.color = '#8C8FE0';
      scoreEl.textContent = String(data.items.length);
      data.items.forEach((it, idx) => {
        timers.push(setTimeout(() => {
          document.getElementById('item-'+idx).classList.add('flag');
          document.getElementById('check-'+idx).classList.add('flag');
        }, 400 + idx * 400));
      });
      timers.push(setTimeout(() => stamp.classList.add('show'), 400 + data.items.length * 400 + 200));
    }
  }

  function setMode(mode, opts){
    opts = opts || {};
    currentMode = mode;
    document.querySelectorAll('.mode-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.mode === mode);
      b.setAttribute('aria-pressed', b.dataset.mode === mode ? 'true' : 'false');
    });
    render(mode);
    // A manual click pauses auto-rotation permanently so a visitor reading
    // a mode isn't yanked into the other one mid-read (fixes prior bug).
    if(opts.manual){
      pauseAuto();
    }
  }
  window.setMode = setMode; // used by inline onclick handlers

  function startAuto(){
    if(prefersReducedMotion) return; // never auto-rotate for reduced-motion users
    autoTimer = setInterval(() => {
      currentMode = currentMode === 'bird' ? 'owl' : 'bird';
      setMode(currentMode);
    }, AUTO_INTERVAL);
  }

  function pauseAuto(){
    if(autoTimer){ clearInterval(autoTimer); autoTimer = null; }
    autoPaused = true;
    if(autoNote){ autoNote.classList.add('paused'); autoNote.querySelector('.txt').textContent = 'Auto-preview paused · click a mode to switch'; }
  }

  // pause on hover/focus so a reader isn't interrupted mid-hover either
  if(clipboardWrap){
    clipboardWrap.addEventListener('mouseenter', () => { if(autoTimer){ clearInterval(autoTimer); autoTimer = null; } });
    clipboardWrap.addEventListener('mouseleave', () => { if(!autoPaused) startAuto(); });
  }

  setMode('bird');
  if(!prefersReducedMotion){
    startAuto();
  } else if(autoNote){
    autoNote.querySelector('.txt').textContent = 'Auto-preview off (reduced motion)';
    autoNote.classList.add('paused');
  }

  /* ---------- Mobile nav ---------- */
  const burger = document.getElementById('navburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if(burger && mobileMenu){
    burger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    btn.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => {
        o.classList.remove('open');
        o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if(!wasOpen){
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

});
