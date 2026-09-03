/* =====================================================================
   NIRMANA VENTURES — main.js
   Cinematic interactions: preloader, split-text, reveals, parallax,
   counters, magnetic buttons, custom cursor, lightbox, timeline, forms.
   Vanilla JS — no dependencies.
   ===================================================================== */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  /* ------------------------------------------------------------------
     1. Split text (words) — used by hero + page-hero titles
  ------------------------------------------------------------------ */
  function splitWords(el) {
    if (!el || el.dataset.split === "done") return;
    let i = 0;
    const wrap = (text, cls) => {
      const frag = document.createDocumentFragment();
      text.split(/(\s+)/).forEach((tok) => {
        if (!tok) return;
        if (/^\s+$/.test(tok)) {
          frag.appendChild(document.createTextNode(" "));
          return;
        }
        const w = document.createElement("span");
        w.className = "w";
        const wi = document.createElement("span");
        wi.className = "wi" + (cls ? " " + cls : "");
        wi.style.setProperty("--i", i++);
        wi.textContent = tok;
        w.appendChild(wi);
        frag.appendChild(w);
      });
      return frag;
    };
    const nodes = Array.from(el.childNodes);
    el.textContent = "";
    nodes.forEach((n) => {
      if (n.nodeType === 3) el.appendChild(wrap(n.textContent, ""));
      else if (n.nodeName === "BR") el.appendChild(document.createElement("br"));
      else {
        const holder = document.createElement(n.nodeName.toLowerCase());
        holder.appendChild(wrap(n.textContent, ""));
        el.appendChild(holder);
      }
    });
    el.dataset.split = "done";
  }
  $$(".split").forEach(splitWords);

  /* ------------------------------------------------------------------
     2. Preloader (full on first visit per session, quick afterwards)
  ------------------------------------------------------------------ */
  const preloader = $("#preloader");
  const body = document.body;
  const seen = sessionStorage.getItem("nv_seen");

  function finishLoad() {
    body.classList.add("is-loaded");
    body.classList.remove("is-locked");
    if (preloader) preloader.classList.add("is-done");
    sessionStorage.setItem("nv_seen", "1");
  }

  if (preloader && !seen && !reduceMotion) {
    body.classList.add("is-locked");
    const bar = $(".preloader__bar i", preloader);
    const count = $(".preloader__count", preloader);
    let p = 0;
    const tick = () => {
      p += Math.random() * 14 + 4;
      if (p >= 100) p = 100;
      if (bar) bar.style.transform = `scaleX(${p / 100})`;
      if (count) count.textContent = String(Math.round(p)).padStart(3, "0");
      if (p < 100) setTimeout(tick, 90 + Math.random() * 120);
      else setTimeout(finishLoad, 500);
    };
    setTimeout(tick, 350);
  } else {
    if (preloader) {
      preloader.style.transition = "none";
      preloader.classList.add("is-done");
    }
    requestAnimationFrame(() => requestAnimationFrame(() => body.classList.add("is-loaded")));
  }

  /* ------------------------------------------------------------------
     3. Page transitions (internal links)
  ------------------------------------------------------------------ */
  const transition = $("#page-transition");
  if (transition && !reduceMotion) {
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a[href]");
      if (!a) return;
      const href = a.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("http") ||
        a.target === "_blank" ||
        a.hasAttribute("download") ||
        e.metaKey ||
        e.ctrlKey
      )
        return;
      e.preventDefault();
      body.classList.remove("nav-open");
      transition.classList.add("is-active");
      setTimeout(() => (window.location.href = href), 650);
    });
    window.addEventListener("pageshow", (e) => {
      if (e.persisted) transition.classList.remove("is-active");
    });
  }

  /* ------------------------------------------------------------------
     4. Header behaviour + mobile nav
  ------------------------------------------------------------------ */
  const header = $("#header");
  let lastY = window.scrollY;
  function onScrollHeader() {
    const y = window.scrollY;
    if (!header) return;
    header.classList.toggle("is-scrolled", y > 40);
    if (y > 300 && y > lastY + 6 && !body.classList.contains("nav-open")) header.classList.add("is-hidden");
    else if (y < lastY - 6 || y < 300) header.classList.remove("is-hidden");
    lastY = y;
  }
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  const burger = $("#burger");
  if (burger) {
    burger.addEventListener("click", () => {
      const open = body.classList.toggle("nav-open");
      body.classList.toggle("is-locked", open);
      burger.setAttribute("aria-expanded", String(open));
    });
    $$(".nav__link").forEach((l) =>
      l.addEventListener("click", () => {
        body.classList.remove("nav-open");
        body.classList.remove("is-locked");
      })
    );
  }

  /* ------------------------------------------------------------------
     5. Scroll reveal (IntersectionObserver)
  ------------------------------------------------------------------ */
  const revealTargets = $$("[data-reveal], [data-stagger], .img-reveal, .tl-step, .split:not(.hero__title):not(.page-hero__title), .eyebrow");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-in"));
  }

  /* ------------------------------------------------------------------
     6. Counters
  ------------------------------------------------------------------ */
  const counters = $$("[data-count]");
  if (counters.length) {
    const ease = (t) => 1 - Math.pow(1 - t, 4);
    const run = (el) => {
      const target = parseFloat(el.dataset.count);
      if (reduceMotion) {
        el.textContent = target.toLocaleString("en-IN");
        return;
      }
      const dur = 1800;
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / dur);
        el.textContent = Math.round(target * ease(t)).toLocaleString("en-IN");
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            run(en.target);
            cio.unobserve(en.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => cio.observe(c));
  }

  /* ------------------------------------------------------------------
     7. Parallax (data-parallax="0.3") — rAF driven
  ------------------------------------------------------------------ */
  const parallaxEls = $$("[data-parallax]");
  if (parallaxEls.length && !reduceMotion && !isTouch) {
    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      parallaxEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const speed = parseFloat(el.dataset.parallax) || 0.2;
        const center = r.top + r.height / 2 - vh / 2;
        el.style.transform = `translate3d(0, ${center * speed * -0.3}px, 0)`;
      });
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
    update();
  }

  /* ------------------------------------------------------------------
     8. Magnetic buttons
  ------------------------------------------------------------------ */
  if (!isTouch && !reduceMotion) {
    $$(".magnetic").forEach((btn) => {
      const strength = 0.35;
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transition = "transform 0.6s cubic-bezier(.22,1,.36,1)";
        btn.style.transform = "";
        setTimeout(() => (btn.style.transition = ""), 600);
      });
    });
  }

  /* ------------------------------------------------------------------
     9. Custom cursor
  ------------------------------------------------------------------ */
  const cursor = $("#cursor");
  const ring = $("#cursor-ring");
  if (cursor && ring && !isTouch && !reduceMotion) {
    let mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      body.classList.add("has-cursor");
    });
    document.addEventListener("mouseleave", () => body.classList.remove("has-cursor"));
    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      cursor.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    };
    loop();
    const hoverSel = "a, button, .filter, label, input, textarea, select";
    document.addEventListener("mouseover", (e) => {
      const view = e.target.closest("[data-cursor='view']");
      body.classList.toggle("cursor-view", !!view);
      body.classList.toggle("cursor-hover", !view && !!e.target.closest(hoverSel));
    });
  }

  /* ------------------------------------------------------------------
     10. Tilt on cards
  ------------------------------------------------------------------ */
  if (!isTouch && !reduceMotion) {
    $$("[data-tilt]").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-6px)`;
      });
      card.addEventListener("mouseleave", () => (card.style.transform = ""));
    });
  }

  /* ------------------------------------------------------------------
     11. Project filters (projects page)
  ------------------------------------------------------------------ */
  const filters = $$(".filter");
  if (filters.length) {
    const items = $$("[data-category]");
    filters.forEach((f) =>
      f.addEventListener("click", () => {
        filters.forEach((x) => x.classList.remove("is-active"));
        f.classList.add("is-active");
        const cat = f.dataset.filter;
        items.forEach((it, i) => {
          const show = cat === "all" || it.dataset.category === cat;
          it.classList.toggle("is-hidden", !show);
          if (show) {
            it.style.animation = "none";
            void it.offsetWidth;
            it.style.animation = `fadeUp .7s cubic-bezier(.22,1,.36,1) ${i * 0.05}s both`;
          }
        });
      })
    );
    const style = document.createElement("style");
    style.textContent = "@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}";
    document.head.appendChild(style);
  }

  /* ------------------------------------------------------------------
     12. Lightbox (projects)
  ------------------------------------------------------------------ */
  const lightbox = $("#lightbox");
  if (lightbox) {
    const media = $(".lightbox__media", lightbox);
    const cap = $(".lightbox__cap", lightbox);
    const projects = $$(".project[data-lightbox]");
    let idx = 0;
    const show = (i) => {
      idx = (i + projects.length) % projects.length;
      const p = projects[idx];
      const src = p.dataset.src || (p.querySelector("img") && p.querySelector("img").getAttribute("src"));
      const title = p.dataset.title || "";
      const catText = p.dataset.cat || "";
      media.innerHTML = "";
      if (src) {
        const img = new Image();
        img.alt = title;
        img.onerror = () => window.imgFallback && window.imgFallback(img, title);
        img.src = src;
        media.appendChild(img);
      }
      cap.innerHTML = `<b>${title}</b><span>${catText}</span>`;
    };
    const open = (i) => {
      show(i);
      lightbox.classList.add("is-open");
      body.classList.add("is-locked");
    };
    const close = () => {
      lightbox.classList.remove("is-open");
      body.classList.remove("is-locked");
    };
    projects.forEach((p, i) => p.addEventListener("click", (e) => { e.preventDefault(); open(i); }));
    $(".lightbox__close", lightbox).addEventListener("click", close);
    $(".lightbox__prev", lightbox).addEventListener("click", () => show(idx - 1));
    $(".lightbox__next", lightbox).addEventListener("click", () => show(idx + 1));
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) close(); });
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  /* ------------------------------------------------------------------
     13. Timeline progress (process page)
  ------------------------------------------------------------------ */
  const timeline = $("#timeline");
  const progress = $(".timeline__progress");
  if (timeline && progress) {
    const upd = () => {
      const r = timeline.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.6;
      const pct = Math.min(1, Math.max(0, (start - r.top) / r.height));
      progress.style.height = `${pct * 100}%`;
    };
    window.addEventListener("scroll", upd, { passive: true });
    window.addEventListener("resize", upd);
    upd();
  }

  /* ------------------------------------------------------------------
     14. Contact form → WhatsApp / Email (no backend required)
  ------------------------------------------------------------------ */
  const form = $("#contact-form");
  if (form) {
    const status = $(".form__status", form);
    const build = () => {
      const d = Object.fromEntries(new FormData(form).entries());
      const lines = [
        `Hello Nirmana Ventures, I would like to enquire about a project.`,
        ``,
        `Name: ${d.name || "-"}`,
        `Phone: ${d.phone || "-"}`,
        `Email: ${d.email || "-"}`,
        `Service: ${d.service || "-"}`,
        `Location: ${d.location || "-"}`,
        `Budget: ${d.budget || "-"}`,
        ``,
        `Message:`,
        `${d.message || "-"}`,
      ];
      return { d, text: lines.join("\n") };
    };
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const { d, text } = build();
      const subject = encodeURIComponent(`Project Enquiry — ${d.name || "Website"}`);
      window.location.href = `mailto:poornimahc.nirmana@gmail.com?subject=${subject}&body=${encodeURIComponent(text)}`;
      if (status) {
        status.textContent = "Your email app should open with the enquiry pre-filled. If it doesn't, use the WhatsApp button or call us directly.";
        status.classList.add("is-visible");
      }
    });
    const wa = $("#send-whatsapp");
    if (wa)
      wa.addEventListener("click", () => {
        if (!form.reportValidity()) return;
        const { text } = build();
        window.open(`https://wa.me/919606075204?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      });
  }

  /* ------------------------------------------------------------------
     15. Back to top + year
  ------------------------------------------------------------------ */
  const toTop = $("#to-top");
  if (toTop) {
    window.addEventListener("scroll", () => toTop.classList.toggle("is-visible", window.scrollY > 600), { passive: true });
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ------------------------------------------------------------------
     16. Active nav link
  ------------------------------------------------------------------ */
  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  $$(".nav__link").forEach((l) => {
    const href = (l.getAttribute("href") || "").toLowerCase();
    l.classList.toggle("is-active", href === page || (page === "" && href === "index.html"));
  });
})();
