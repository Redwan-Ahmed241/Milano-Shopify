// Milano interactive behaviors
(function() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const backToTop = document.getElementById('backToTop');
  const yearEl = document.getElementById('year');
  const accordionTriggers = document.querySelectorAll('.accordion-trigger');

  // Black Friday countdown and spots
  const timerEl = document.getElementById('bf-timer');
  const stateEl = document.getElementById('timer-state');
  const tDays = document.getElementById('t-days');
  const tHours = document.getElementById('t-hours');
  const tMins = document.getElementById('t-mins');
  const tSecs = document.getElementById('t-secs');
  const lpSpotsEl = document.getElementById('lp-spots');
  const drSpotsEl = document.getElementById('dr-spots');

  // Configurator elements
  const fabricButtons = document.querySelectorAll('.select-fabric');
  const steps = Array.from(document.querySelectorAll('.config-step'));
  const nextButtons = document.querySelectorAll('.next-step');
  const prevButtons = document.querySelectorAll('.prev-step');
  const silkToggle = document.getElementById('silkLapel');
  const lapelWidth = document.getElementById('lapelWidth');
  const embroideryToggle = document.getElementById('embroideryToggle');
  const embroideryField = document.getElementById('embroideryField');
  const reserveCta = document.getElementById('reserveCta');

  const form = {
    fabric: null,
    model: null,
    lapel: null,
    silk: false,
    lapelWidth: null,
    lining: null,
    embroidery: '',
    addons: [],
    name: '',
    email: '',
    phone: ''
  };

  // Set current year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navMenu.classList.toggle('open');
    });

    // Close on outside click (mobile only)
    document.addEventListener('click', (e) => {
      if (window.innerWidth > 860) return; // only mobile
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }

  // Smooth scroll focus restoration for anchor links
  document.addEventListener('click', (e) => {
    if (e.target instanceof HTMLAnchorElement) {
      const href = e.target.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const el = document.querySelector(href);
        if (el) {
          el.addEventListener('transitionend', () => el.focus(), { once: true });
        }
      }
    }
  });

  // Back to top visibility
  const onScroll = () => {
    if (!backToTop) return;
    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Countdown setup
  if (timerEl && tDays && tHours && tMins && tSecs && stateEl) {
    const startAttr = timerEl.getAttribute('data-start');
    const endAttr = timerEl.getAttribute('data-end');
    let start, end;
    if (startAttr && endAttr) {
      start = new Date(startAttr);
      end = new Date(endAttr);
    } else {
      // Default: next Friday 00:00 to following Sunday 00:00 local time
      const now = new Date();
      const friday0 = nextWeekdayAt(5, 0, 0); // Friday 00:00
      const sunday0 = new Date(friday0);
      sunday0.setDate(friday0.getDate() + 2); // Sunday 00:00
      start = friday0; end = sunday0;
    }
    const tick = () => {
      const now = new Date();
      if (now < start) {
        updateTimer(diffMs(now, start));
        stateEl.textContent = 'Starts in';
      } else if (now >= start && now < end) {
        updateTimer(diffMs(now, end));
        stateEl.textContent = 'Ends in';
      } else {
        tDays.textContent = '0'; tHours.textContent = '0'; tMins.textContent = '0'; tSecs.textContent = '0';
        stateEl.textContent = 'Offer ended';
      }
    };
    tick();
    setInterval(tick, 1000);
  }

  function nextWeekdayAt(weekday, hour, minute) {
    const now = new Date();
    const result = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);
    const day = now.getDay();
    let delta = weekday - day;
    if (delta <= 0) delta += 7;
    result.setDate(result.getDate() + delta);
    return result;
  }

  function diffMs(a, b) {
    let ms = Math.max(0, b - a);
    const days = Math.floor(ms / 86400000); ms -= days * 86400000;
    const hours = Math.floor(ms / 3600000); ms -= hours * 3600000;
    const mins = Math.floor(ms / 60000); ms -= mins * 60000;
    const secs = Math.floor(ms / 1000);
    return { days, hours, mins, secs };
  }

  function updateTimer({ days, hours, mins, secs }) {
    tDays.textContent = String(days);
    tHours.textContent = String(hours).padStart(2, '0');
    tMins.textContent = String(mins).padStart(2, '0');
    tSecs.textContent = String(secs).padStart(2, '0');
  }

  // Spots counters (localStorage persistence)
  const SPOTS_LP_KEY = 'spots_lp';
  const SPOTS_DR_KEY = 'spots_dr';
  let spotsLP = Number(localStorage.getItem(SPOTS_LP_KEY) || '10');
  let spotsDR = Number(localStorage.getItem(SPOTS_DR_KEY) || '20');
  function renderSpots() {
    if (lpSpotsEl) lpSpotsEl.textContent = String(spotsLP);
    if (drSpotsEl) drSpotsEl.textContent = String(spotsDR);
  }
  renderSpots();

  // Configurator logic
  fabricButtons.forEach(btn => btn.addEventListener('click', () => {
    form.fabric = btn.getAttribute('data-fabric');
    showStep(2);
    scrollToTop();
  }));

  nextButtons.forEach(btn => btn.addEventListener('click', () => {
    const next = Number(btn.getAttribute('data-next'));
    captureStepData(next - 1); // capture current step before moving
    showStep(next);
    scrollToTop();
  }));
  prevButtons.forEach(btn => btn.addEventListener('click', () => {
    const prev = Number(btn.getAttribute('data-prev'));
    showStep(prev);
    scrollToTop();
  }));

  if (silkToggle && lapelWidth) {
    silkToggle.addEventListener('change', () => {
      form.silk = silkToggle.checked;
      lapelWidth.hidden = !silkToggle.checked;
    });
  }
  if (embroideryToggle && embroideryField) {
    embroideryToggle.addEventListener('change', () => {
      embroideryField.hidden = !embroideryToggle.checked;
    });
  }

  if (reserveCta) {
    reserveCta.addEventListener('click', (e) => {
      // Collect final data
      form.name = (document.getElementById('custName')?.value || '').trim();
      form.email = (document.getElementById('custEmail')?.value || '').trim();
      form.phone = (document.getElementById('custPhone')?.value || '').trim();
      if (!form.name || !form.email || !form.phone) {
        e.preventDefault();
        alert('Please complete Name, Email and Phone to continue.');
        return;
      }
      // Decrement spots locally based on fabric
      if (form.fabric === 'loro' && spotsLP > 0) {
        spotsLP -= 1; localStorage.setItem(SPOTS_LP_KEY, String(spotsLP));
      } else if (form.fabric === 'drapers' && spotsDR > 0) {
        spotsDR -= 1; localStorage.setItem(SPOTS_DR_KEY, String(spotsDR));
      }
      renderSpots();

      // Build redirect URL by fabric
      const base = form.fabric === 'loro' ? '/products/mtm-reservation-deposit-loro-piana' : '/products/mtm-reservation-deposit-drapers';
      const params = new URLSearchParams({
        name: form.name, email: form.email, phone: form.phone
      });
      reserveCta.setAttribute('href', `${base}?${params.toString()}`);
    });
  }

  function captureStepData(currentStep) {
    switch (currentStep) {
      case 2: {
        const model = document.querySelector('input[name="model-choice"]:checked');
        form.model = model ? model.value : form.model; break;
      }
      case 3: {
        const lapel = document.querySelector('input[name="lapel"]:checked');
        form.lapel = lapel ? lapel.value : form.lapel;
        form.lapelWidth = silkToggle?.checked ? lapelWidth?.value : null;
        break;
      }
      case 4: {
        const lining = document.querySelector('input[name="lining"]:checked');
        form.lining = lining ? lining.value : form.lining;
        form.embroidery = document.getElementById('embroideryText')?.value || '';
        break;
      }
      case 5: {
        form.addons = Array.from(document.querySelectorAll('input[name="addons"]:checked')).map(el => el.value);
        break;
      }
    }
  }

  function showStep(n) {
    steps.forEach(s => s.hidden = true);
    const target = document.querySelector(`.config-step[data-step="${n}"]`);
    if (target) {
      target.hidden = false;
      target.classList.remove('fade-in');
      // trigger reflow for restarting animation
      void target.offsetWidth;
      target.classList.add('fade-in');
      setTimeout(() => target.classList.remove('fade-in'), 400);
    }
  }

  function scrollToTop() {
    window.scrollTo({ top: document.getElementById('configure')?.offsetTop || 0, behavior: 'smooth' });
  }

  // Accordion behavior (ARIA) with keyboard support
  accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => toggleAccordion(trigger));
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleAccordion(trigger);
      }
    });
  });

  function toggleAccordion(trigger) {
    const expanded = trigger.getAttribute('aria-expanded') === 'true';
    const panelId = trigger.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) return;
    trigger.setAttribute('aria-expanded', String(!expanded));
    if (expanded) {
      panel.hidden = true;
    } else {
      panel.hidden = false;
    }
  }

  // Trap focus inside open mobile nav (optional accessibility enhancement)
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    if (!navMenu.classList.contains('open')) return;
    const focusable = navMenu.querySelectorAll('a, button');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
})();
