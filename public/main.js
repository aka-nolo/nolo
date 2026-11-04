/* NOLO — interactions. Vanilla + GSAP/ScrollTrigger + Lenis. */
(() => {
  "use strict";
  const D = window.NOLO;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const pad = (n) => String(n).padStart(2, "0");
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
  };
  document.documentElement.classList.add("js");
  document.body.classList.add("is-loading");
  gsap.registerPlugin(ScrollTrigger);

  /* ── Contact links ─────────────────────────────────────────── */
  // /showreel is the version linked from Upwork, Fiverr and Workana: those platforms forbid
  // off-platform contact before a contract, so it carries no WhatsApp, email or booking link.
  const PLATFORM = /\/showreel\/?$/.test(location.pathname);
  if (PLATFORM) {
    document.documentElement.classList.add("platform");
    $$(".js-wa, .js-mail, .footer__details").forEach((el) => el.parentNode.removeChild(el));
    $$(".js-call").forEach((a) => {
      const span = document.createElement("span");
      span.className = a.className.replace("js-call", "") + " btn--static";
      span.innerHTML = 'Message me on the platform <span class="btn__ico">✉</span>';
      a.replaceWith(span);
    });
  }
  $$(".js-call").forEach((a) => (a.href = D.contact.call));
  $$(".js-wa").forEach((a) => { a.href = D.contact.whatsapp; if (a.classList.contains("footer__phone")) a.textContent = D.contact.phoneLabel; });
  $$(".js-mail").forEach((a) => { a.href = D.contact.email; if (a.classList.contains("footer__mail")) a.textContent = D.contact.emailLabel; });
  $("#year").textContent = new Date().getFullYear();

  /* ── Sound (WebAudio, no files) ────────────────────────────── */
  const Sound = (() => {
    let ctx, master, pad, on = false;
    const ensure = () => {
      if (ctx) return;
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
      // ambient pad: two detuned saws through a slow low-pass
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 420; lp.Q.value = 6;
      const lfo = ctx.createOscillator(); lfo.frequency.value = 0.07;
      const lfoGain = ctx.createGain(); lfoGain.gain.value = 180; lfo.connect(lfoGain); lfoGain.connect(lp.frequency); lfo.start();
      pad = ctx.createGain(); pad.gain.value = 0.05;
      [55, 82.4, 110.3].forEach((f, i) => {
        const o = ctx.createOscillator(); o.type = i === 1 ? "triangle" : "sawtooth"; o.frequency.value = f; o.detune.value = (i - 1) * 7;
        o.connect(lp); o.start();
      });
      lp.connect(pad); pad.connect(master);
    };
    const tick = (freq = 1800, dur = 0.05, vol = 0.05) => {
      if (!on || !ctx) return;
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = "sine"; o.frequency.setValueAtTime(freq, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + dur);
      g.gain.setValueAtTime(vol, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      o.connect(g); g.connect(master); o.start(); o.stop(ctx.currentTime + dur + 0.02);
    };
    const pop = () => tick(520, 0.18, 0.12);
    const set = (v) => {
      on = v; ensure(); ctx.resume();
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(v ? 1 : 0, ctx.currentTime + (v ? 1.2 : 0.4));
      $$(".sound").forEach((b) => b.setAttribute("aria-pressed", String(v)));
      store.set("nolo-sound", v ? "1" : "0");
    };
    return { set, tick, pop, get on() { return on; } };
  })();
  $$(".sound").forEach((b) => b.addEventListener("click", () => { Sound.set(!Sound.on); Sound.pop(); }));
  document.addEventListener("pointerover", (e) => { if (e.target.closest("a, button, .thumb, .step, summary")) Sound.tick(); });

  /* ── Smooth scroll ─────────────────────────────────────────── */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  $$('a[href^="#"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const el = id === "#top" ? document.body : $(id);
      if (!el) return;
      e.preventDefault();
      lenis ? lenis.scrollTo(el, { offset: 0, duration: 1.4 }) : el.scrollIntoView({ behavior: "smooth" });
    })
  );

  /* ── Cursor ────────────────────────────────────────────────── */
  const cursor = $(".cursor"), cLabel = $(".cursor__label");
  if (finePointer) {
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3" });
    window.addEventListener("pointermove", (e) => { xTo(e.clientX); yTo(e.clientY); });
    document.addEventListener("pointerover", (e) => {
      const big = e.target.closest("[data-cursor]");
      const link = e.target.closest("a, button, summary, .step");
      cursor.classList.toggle("is-big", !!big);
      cursor.classList.toggle("is-link", !big && !!link);
      cLabel.textContent = big ? big.dataset.cursor : "";
    });
  }

  /* ── Nav: theme under it + hide on scroll down ─────────────── */
  const nav = $(".nav");
  const themed = $$("[data-theme]");
  let lastY = 0;
  const updateNav = () => {
    const y = window.scrollY;
    const probe = 30;
    const sec = themed.find((s) => { const r = s.getBoundingClientRect(); return r.top <= probe && r.bottom > probe; });
    nav.classList.toggle("on-dark", !!sec && sec.dataset.theme === "dark");
    nav.classList.toggle("is-hidden", y > lastY + 4 && y > 600);
    if (y < lastY - 4) nav.classList.remove("is-hidden");
    lastY = y;
  };
  window.addEventListener("scroll", updateNav, { passive: true });

  /* ── Loader → hero intro ───────────────────────────────────── */
  const intro = () => {
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    const count = { v: 0 };
    tl.from(".loader__logo img", { scale: 0.4, rotate: -12, duration: 1.1, ease: "elastic.out(1, 0.45)" })
      .to(count, { v: 100, duration: reduce ? 0.1 : 1.2, ease: "power2.inOut", onUpdate: () => ($("#loaderCount").textContent = Math.round(count.v)) }, 0)
      .to(".loader__logo img", { scaleX: 1.25, scaleY: 0.7, duration: 0.18, ease: "power2.in" }, ">-0.05")
      .to(".loader__logo img", { scaleX: 0.9, scaleY: 1.3, y: -40, duration: 0.25, ease: "power2.out" })
      .to(".loader", { yPercent: -100, duration: 1, ease: "expo.inOut" }, ">-0.05")
      .add(() => { document.body.classList.remove("is-loading"); lenis && lenis.start(); ScrollTrigger.refresh(); }, "<0.5")
      .from(".hero__title .word", { yPercent: 115, rotate: 6, duration: 1.2, stagger: 0.06 }, "<0.25")
      .from(".hero__portrait", { yPercent: 40, opacity: 0, duration: 1.4, ease: "elastic.out(1, 0.6)" }, "<0.15")
      .from(".hero__bglogo", { scale: 0.7, opacity: 0, duration: 1.8 }, "<")
      .from(".hero__intro, .hero__ctas .btn, .hero__tag, .disciplines__list li", { y: 24, opacity: 0, duration: 0.9, stagger: 0.05 }, "<0.25")
      .set(".loader", { display: "none" })
      .add(() => wobble());
  };
  const ready = Promise.all([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise((r) => { const img = $(".hero__portrait img"); img.complete ? r() : (img.onload = img.onerror = r); }),
  ]);
  Promise.race([ready, new Promise((r) => setTimeout(r, 2500))]).then(intro);
  if (store.get("nolo-sound") === "1") {
    // Browsers require a gesture before audio: arm it on the first interaction.
    const arm = () => { Sound.set(true); window.removeEventListener("pointerdown", arm); };
    window.addEventListener("pointerdown", arm);
  }

  /* ── Hero: playful pointer physics ─────────────────────────── */
  const hero = $(".hero"), portrait = $(".hero__portrait"), bgLogo = $(".hero__bglogo"), wink = $(".hero__wink");
  if (finePointer && !reduce) {
    const rx = gsap.quickTo(portrait, "rotationY", { duration: 0.8, ease: "power3" });
    const ry = gsap.quickTo(portrait, "rotationX", { duration: 0.8, ease: "power3" });
    const px = gsap.quickTo(portrait, "x", { duration: 1, ease: "power3" });
    const lx = gsap.quickTo(bgLogo, "x", { duration: 1.6, ease: "power3" });
    const ly = gsap.quickTo(bgLogo, "y", { duration: 1.6, ease: "power3" });
    const lr = gsap.quickTo(bgLogo, "rotation", { duration: 1.6, ease: "power3" });
    gsap.set(portrait, { transformPerspective: 900 });
    hero.addEventListener("pointermove", (e) => {
      const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
      rx(nx * 14); ry(-ny * 8); px(nx * 24);
      lx(-nx * 60); ly(-ny * 40); lr(nx * 3);
    });
  }
  // Click the portrait: squash & stretch + pop
  portrait.addEventListener("click", () => {
    Sound.pop();
    gsap.timeline()
      .to(portrait, { scaleY: 0.86, scaleX: 1.08, duration: 0.12, ease: "power2.in" })
      .to(portrait, { scaleY: 1.06, scaleX: 0.96, y: -30, duration: 0.22, ease: "power2.out" })
      .to(portrait, { scaleY: 1, scaleX: 1, y: 0, duration: 0.9, ease: "elastic.out(1, 0.35)" });
    gsap.fromTo(wink, { rotate: 0 }, { keyframes: [{ rotate: -8 }, { rotate: 6 }, { rotate: 0 }], duration: 0.6 });
  });
  // The word "people" keeps a lazy wobble
  const wobble = () => { if (!reduce) gsap.to(wink, { rotate: -3, y: -4, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: -1 }); };
  // Scroll: background logo drifts, title separates
  gsap.to(bgLogo, { yPercent: 30, scale: 1.12, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".hero__title", { yPercent: -14, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });

  /* ── Gap: "IDEA TO IMAGE" pinned reveal ────────────────────── */
  const gapImgs = D.GAP || D.RENDERS.slice(0, 4).map((r) => r.src);
  const gapImg = $(".gap__media img");
  const mm = gsap.matchMedia();
  mm.add("(min-width: 821px)", () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".gap__pin", start: "top top", end: "+=140%", scrub: 0.8, pin: true,
        onUpdate: (st) => { const i = Math.min(gapImgs.length - 1, Math.floor(st.progress * gapImgs.length)); if (!gapImg.src.endsWith(gapImgs[i])) gapImg.src = gapImgs[i]; },
      },
    });
    tl.to(".gap__a", { xPercent: -60, ease: "none" }, 0)
      .to(".gap__b", { xPercent: 40, ease: "none" }, 0)
      .to(".gap__media", { width: "44vw", height: "29vw", ease: "power2.inOut" }, 0)
      .to(".gap__media img", { filter: "brightness(.7)", ease: "none" }, 0.35)
      .from(".gap__copy", { opacity: 0, y: 30, ease: "none", duration: 0.3 }, 0.55);
  });
  mm.add("(max-width: 820px)", () => {
    gsap.from(".gap__media", { scale: 0.6, scrollTrigger: { trigger: ".gap__pin", start: "top bottom", end: "center center", scrub: true } });
  });

  /* ── Renders reel: auto sequence, play/stop, jump, enlarge ─── */
  const R = D.RENDERS;
  const frames = $(".reel__frames"), thumbs = $(".reel__thumbs");
  $("#renderTotal").textContent = pad(R.length);
  R.forEach((r, i) => {
    const f = document.createElement("div");
    f.className = "reel__frame";
    f.innerHTML = `<img src="${r.src}" alt="${r.project} — ${r.note}" decoding="async" />`;
    frames.appendChild(f);
    const t = document.createElement("button");
    t.className = "thumb"; t.type = "button"; t.setAttribute("role", "listitem"); t.setAttribute("aria-label", `Go to render ${i + 1}: ${r.project}`);
    t.innerHTML = `<img src="${r.src}" alt="" loading="lazy" />`;
    t.addEventListener("click", () => go(i, true));
    thumbs.appendChild(t);
  });
  const frameEls = $$(".reel__frame"), thumbEls = $$(".thumb");
  const bar = $(".reel__bar i"), playBtn = $(".ctrl--play");
  const DUR = 4.8;
  let cur = -1, playing = true, inView = false, barTween = null;
  const go = (i, user = false) => {
    i = (i + R.length) % R.length;
    if (cur >= 0) { frameEls[cur].classList.remove("is-active"); thumbEls[cur].classList.remove("is-active"); }
    cur = i;
    frameEls[i].classList.add("is-active"); thumbEls[i].classList.add("is-active");
    thumbEls[i].scrollIntoView({ block: "nearest", inline: "center", behavior: user ? "smooth" : "auto" });
    $(".reel__project").textContent = R[i].project;
    $(".reel__note").textContent = `${R[i].note} · ${R[i].year}`;
    $("#renderIdx").textContent = pad(i + 1);
    gsap.fromTo([".reel__project", ".reel__note"], { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "expo.out", stagger: 0.05 });
    if (user) Sound.tick(1200, 0.06, 0.06);
    run();
  };
  const run = () => {
    barTween && barTween.kill();
    gsap.set(bar, { scaleX: 0 });
    if (!playing || !inView) return;
    barTween = gsap.to(bar, { scaleX: 1, duration: DUR, ease: "none", onComplete: () => go(cur + 1) });
  };
  const setPlaying = (v) => { playing = v; playBtn.classList.toggle("is-paused", !v); playBtn.setAttribute("aria-label", v ? "Pause sequence" : "Play sequence"); run(); };
  $$(".reel__controls [data-act]").forEach((b) => b.addEventListener("click", () => {
    const a = b.dataset.act;
    if (a === "toggle") setPlaying(!playing);
    if (a === "prev") go(cur - 1, true);
    if (a === "next") go(cur + 1, true);
  }));
  new IntersectionObserver(([e]) => { inView = e.isIntersecting; run(); }, { threshold: 0.35 }).observe($(".reel__stage"));
  go(0);

  // Lightbox
  const lb = $(".lightbox"), lbImg = $(".lightbox__fig img"), lbCap = $(".lightbox__fig figcaption");
  let lbIdx = 0, wasPlaying = true;
  const lbShow = (i) => {
    lbIdx = (i + R.length) % R.length;
    lbImg.src = R[lbIdx].src; lbImg.alt = R[lbIdx].project;
    lbCap.textContent = `${pad(lbIdx + 1)} / ${pad(R.length)} — ${R[lbIdx].project} · ${R[lbIdx].note}`;
    gsap.fromTo(lbImg, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.5, ease: "expo.out" });
  };
  const lbOpen = () => { wasPlaying = playing; setPlaying(false); lb.hidden = false; lenis && lenis.stop(); lbShow(cur); $(".lightbox__close").focus(); Sound.pop(); };
  const lbClose = () => { lb.hidden = true; lenis && lenis.start(); go(lbIdx); setPlaying(wasPlaying); };
  $(".reel__stage").addEventListener("click", lbOpen);
  $(".lightbox__close").addEventListener("click", lbClose);
  $(".lightbox__prev").addEventListener("click", () => lbShow(lbIdx - 1));
  $(".lightbox__next").addEventListener("click", () => lbShow(lbIdx + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) lbClose(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") lbClose();
    if (e.key === "ArrowLeft") lbShow(lbIdx - 1);
    if (e.key === "ArrowRight") lbShow(lbIdx + 1);
  });
  let tx = null;
  lb.addEventListener("touchstart", (e) => (tx = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => { if (tx == null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 40) lbShow(lbIdx + (dx < 0 ? 1 : -1)); tx = null; });

  /* ── Websites: cover + the live site plays inside on hover (molde: works_home) ── */
  const sitesList = $(".sites__list");
  D.SITES.forEach((s, i) => {
    const host = new URL(s.url).host.replace(/^www\./, "");
    const el = document.createElement("article");
    el.className = "site rv";
    el.innerHTML = `
      <a class="site__screen" href="${s.url}" target="_blank" rel="noopener" data-cursor="visit">
        <img class="site__cover" src="${s.cover}" alt="${s.name}" loading="lazy" />
        <div class="site__shade"></div>
        <div class="site__player">
          <div class="site__chrome"><i></i><i></i><i></i><span class="mono">${host}</span></div>
          <video muted loop playsinline preload="none" poster="${s.poster}"><source src="${s.video}" type="video/mp4" /></video>
        </div>
        <span class="site__hint mono">(Hover to preview)</span>
      </a>
      <div class="site__info">
        <div class="site__index mono"><span>(${pad(i + 1)})</span><span>/${pad(D.SITES.length)}</span></div>
        <h3 class="site__name">${s.name}</h3>
        <p class="site__blurb">${s.blurb}</p>
        <p class="site__shows mono">▶ ${s.shows}</p>
        <dl class="site__meta">
          <div><dt>Services</dt><dd>${s.services.map((x) => `<span class="tag">${x}</span>`).join("")}</dd></div>
          <div><dt>Built with</dt><dd>${s.stack}</dd></div>
          <div><dt>Live</dt><dd><a href="${s.url}" target="_blank" rel="noopener">${host} ↗</a></dd></div>
          <div><dt>Year</dt><dd>${s.year}</dd></div>
        </dl>
      </div>`;
    sitesList.appendChild(el);
    const scr = $(".site__screen", el), video = $("video", el);
    const on = () => { scr.classList.add("is-playing"); video.play().catch(() => {}); };
    const off = () => { scr.classList.remove("is-playing"); video.pause(); };
    if (finePointer) {
      scr.addEventListener("pointerenter", on);
      scr.addEventListener("pointerleave", off);
      gsap.set(scr, { transformPerspective: 1200 });
      const rx = gsap.quickTo($(".site__player", el), "rotationY", { duration: 0.6, ease: "power3" });
      const ry = gsap.quickTo($(".site__player", el), "rotationX", { duration: 0.6, ease: "power3" });
      scr.addEventListener("pointermove", (e) => { const b = scr.getBoundingClientRect(); rx(((e.clientX - b.left) / b.width - 0.5) * 8); ry(-((e.clientY - b.top) / b.height - 0.5) * 8); });
    } else {
      // Touch: no hover, so the preview plays while the card is on screen.
      new IntersectionObserver(([e]) => (e.isIntersecting ? on() : off()), { threshold: 0.6 }).observe(scr);
    }
  });

  /* ── Brands & apps ─────────────────────────────────────────── */
  const grid = $(".brands__grid");
  D.APPS.forEach((a) => {
    const li = document.createElement("li");
    li.className = "brand rv";
    li.innerHTML = `
      <span class="brand__lock mono">Private demo</span>
      <div class="brand__mark"><img src="${a.logo}" alt="${a.name} logo" loading="lazy" /></div>
      <p class="brand__kind mono">${a.kind}</p>
      <h3 class="brand__name">${a.name}</h3>
      <p class="brand__line">${a.line}</p>`;
    grid.appendChild(li);
  });

  /* ── Director's showreel: sequential fragments ─────────────── */
  const F = D.FILMS;
  const FRAG = 9; // seconds per fragment
  const steps = $(".journey__steps"), prog = $(".journey__progress");
  const poster = $(".journey__poster"), player = $(".journey__player");
  F.forEach((f, i) => {
    const li = document.createElement("li");
    li.className = "step"; li.tabIndex = 0;
    li.innerHTML = `
      <span class="step__n mono">(${pad(i + 1)})</span>
      <h3 class="step__title">${f.title}</h3>
      <p class="step__meta mono"><span>${f.client}</span><span>${f.type}</span><span>${f.length}</span><span>${f.year}</span></p>
      <p class="step__brief">${f.brief}</p>
      <a class="btn btn--cream step__link" href="https://vimeo.com/${f.vimeo}" target="_blank" rel="noopener">Watch full film <span class="btn__ico">↗</span></a>`;
    li.addEventListener("click", (e) => { if (!e.target.closest("a")) play(i, true); });
    li.addEventListener("keydown", (e) => { if (e.key === "Enter") play(i, true); });
    steps.appendChild(li);
    const b = document.createElement("button");
    b.type = "button"; b.setAttribute("aria-label", `Play ${f.title}`); b.innerHTML = "<i></i>";
    b.addEventListener("click", () => play(i, true));
    prog.appendChild(b);
  });
  const stepEls = $$(".step"), progEls = $$(".journey__progress button");
  let fIdx = -1, vPlayer = null, fragTween = null, jInView = false, started = false;
  const hudNow = $(".journey__now"), hudTime = $(".journey__time");
  const play = (i, user = false) => {
    i = (i + F.length) % F.length;
    fIdx = i;
    const f = F[i];
    stepEls.forEach((s, k) => s.classList.toggle("is-active", k === i));
    progEls.forEach((b, k) => { b.classList.toggle("is-done", k < i); gsap.set($("i", b), { scaleX: k < i ? 1 : 0 }); });
    poster.src = f.poster; poster.alt = f.title; poster.style.opacity = 1;
    hudNow.textContent = `${pad(i + 1)} — ${f.title}`;
    player.classList.remove("is-on");
    if (vPlayer) { vPlayer.destroy().catch(() => {}); vPlayer = null; }
    player.innerHTML = "";
    if (user) Sound.tick(900, 0.08, 0.06);
    if (window.matchMedia("(max-width: 820px)").matches && user) {
      const top = $(".journey").getBoundingClientRect().top + scrollY + $(".journey__head").offsetHeight + 120;
      if (scrollY < top - 10) lenis ? lenis.scrollTo(top) : scrollTo({ top, behavior: "smooth" });
    }
    if (f.vimeo && window.Vimeo) {
      const iframe = document.createElement("iframe");
      iframe.allow = "autoplay; fullscreen; picture-in-picture";
      iframe.title = f.title;
      iframe.src = `https://player.vimeo.com/video/${f.vimeo}?autoplay=1&muted=1&controls=0&title=0&byline=0&portrait=0&dnt=1&playsinline=1#t=${f.start}s`;
      player.appendChild(iframe);
      vPlayer = new Vimeo.Player(iframe);
      vPlayer.on("play", () => { player.classList.add("is-on"); poster.style.opacity = 0; });
      vPlayer.on("timeupdate", (d) => (hudTime.textContent = new Date(d.seconds * 1000).toISOString().slice(14, 19)));
      if (Sound.on) vPlayer.setVolume(0.6).then(() => vPlayer.setMuted(false)).catch(() => {});
    }
    fragTween && fragTween.kill();
    fragTween = gsap.fromTo($("i", progEls[i]), { scaleX: 0 }, { scaleX: 1, duration: FRAG, ease: "none", paused: !jInView, onComplete: () => play(i + 1) });
    // Poster fallback gets a slow push-in so the frame never looks frozen
    gsap.fromTo(poster, { scale: 1.06 }, { scale: 1, duration: FRAG, ease: "none" });
  };
  new IntersectionObserver(([e]) => {
    jInView = e.isIntersecting;
    if (jInView && !started) { started = true; play(0); return; }
    if (!fragTween) return;
    if (jInView) { fragTween.resume(); vPlayer && vPlayer.play().catch(() => {}); }
    else { fragTween.pause(); vPlayer && vPlayer.pause().catch(() => {}); }
  }, { threshold: 0.3 }).observe($(".journey__frame"));

  /* ── FAQ: animated open/close ──────────────────────────────── */
  $$(".faq details").forEach((d) => {
    const body = $("div", d), sum = $("summary", d);
    sum.addEventListener("click", (e) => {
      e.preventDefault();
      if (d.open) {
        gsap.to(body, { height: 0, duration: 0.45, ease: "expo.out", onComplete: () => { d.open = false; gsap.set(body, { clearProps: "height" }); } });
      } else {
        $$(".faq details[open]").forEach((o) => { if (o !== d) $("summary", o).click(); });
        d.open = true;
        gsap.from(body, { height: 0, duration: 0.6, ease: "expo.out" });
      }
    });
  });

  /* ── CTA: lines slide against each other ───────────────────── */
  const ctaT = { trigger: ".cta", start: "top bottom", end: "bottom top", scrub: true };
  gsap.fromTo(".cta__l1", { xPercent: -18 }, { xPercent: 8, ease: "none", scrollTrigger: ctaT });
  gsap.fromTo(".cta__l2", { xPercent: 16 }, { xPercent: -6, ease: "none", scrollTrigger: ctaT });
  gsap.fromTo(".cta__l3", { xPercent: -14 }, { xPercent: 6, ease: "none", scrollTrigger: ctaT });
  gsap.fromTo(".cta__l4", { xPercent: 20 }, { xPercent: -4, ease: "none", scrollTrigger: ctaT });
  gsap.fromTo(".cta__media img", { yPercent: -10 }, { yPercent: 0, ease: "none", scrollTrigger: ctaT });
  if (!reduce) gsap.to(".cta__arrow", { x: 18, duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: -1 });

  /* ── Reveals ───────────────────────────────────────────────── */
  $$(".section-head > *, .journey__head > *, .faq__intro > *, .faq__list details").forEach((el) => el.classList.add("rv"));
  ScrollTrigger.batch(".rv", {
    start: "top 88%",
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, overwrite: true }),
  });

  /* ── Footer: the logo as particles that run from the pointer ─ */
  (() => {
    const canvas = $(".footer__canvas"), wrap = $(".footer__logo");
    const ctx = canvas.getContext("2d");
    let pts = [], w = 0, h = 0, dpr = Math.min(2, window.devicePixelRatio || 1), mouse = { x: -9999, y: -9999 }, raf = null, visible = false;
    const logo = new Image();
    logo.src = "brand/nolo-crema.svg";
    const build = () => {
      w = wrap.clientWidth; h = wrap.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const off = document.createElement("canvas"); off.width = w; off.height = h;
      const o = off.getContext("2d");
      const lw = w * 0.96, lh = lw * (logo.naturalHeight / logo.naturalWidth || 0.34);
      o.drawImage(logo, (w - lw) / 2, (h - lh) / 2, lw, lh);
      const data = o.getImageData(0, 0, w, h).data;
      const step = Math.max(5, Math.round(w / 190));
      pts = [];
      for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) {
        if (data[(y * w + x) * 4 + 3] > 128) pts.push({ ox: x, oy: y, x, y, vx: 0, vy: 0, r: step * 0.36 });
      }
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#fdf5ea";
      const R2 = 110 * 110;
      for (const p of pts) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < R2) { const f = (1 - d2 / R2) * 7; const d = Math.sqrt(d2) || 1; p.vx += (dx / d) * f; p.vy += (dy / d) * f; }
        p.vx += (p.ox - p.x) * 0.06; p.vy += (p.oy - p.y) * 0.06;
        p.vx *= 0.82; p.vy *= 0.82; p.x += p.vx; p.y += p.vy;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      }
      raf = visible ? requestAnimationFrame(draw) : null;
    };
    logo.onload = () => { build(); draw(); };
    window.addEventListener("resize", () => logo.complete && build());
    wrap.addEventListener("pointermove", (e) => { const b = canvas.getBoundingClientRect(); mouse.x = e.clientX - b.left; mouse.y = e.clientY - b.top; });
    wrap.addEventListener("pointerleave", () => (mouse = { x: -9999, y: -9999 }));
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf && pts.length) draw(); }).observe(wrap);
  })();

  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
