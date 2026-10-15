(function () {
  "use strict";

  /* --- Theme ------------------------------------------------- */
  var root = document.documentElement;
  var toggle = document.getElementById("themeToggle");
  var label = document.getElementById("themeLabel");
  var stored = null;

  try { stored = localStorage.getItem("theme"); } catch (e) {}

  var prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  applyTheme(stored || (prefersLight ? "light" : "dark"));

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (label) label.textContent = theme === "light" ? "Dark" : "Light";
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  /* --- Avatar fallback --------------------------------------- */
  var avatar = document.getElementById("avatarImg");
  if (avatar) {
    var hideAvatar = function () { avatar.hidden = true; };
    avatar.addEventListener("error", hideAvatar);
    if (avatar.complete && avatar.naturalWidth === 0) hideAvatar();
  }

  /* --- Mobile navigation ------------------------------------- */
  var sidebar = document.getElementById("sidebar");
  var navToggle = document.getElementById("navToggle");
  var isMobile = function () { return window.matchMedia("(max-width: 900px)").matches; };

  function setMenu(open) {
    sidebar.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  }

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      setMenu(!sidebar.classList.contains("is-open"));
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });

  window.addEventListener("resize", function () {
    if (!isMobile()) setMenu(false);
  });

  /* --- Scroll spy -------------------------------------------- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
  var marker = document.getElementById("navMarker");
  var sections = links
    .map(function (link) {
      return { link: link, el: document.querySelector(link.getAttribute("href")) };
    })
    .filter(function (item) { return item.el; });

  links.forEach(function (link) {
    link.addEventListener("click", function () {
      if (isMobile()) setMenu(false);
    });
  });

  function moveMarker(link) {
    if (!marker) return;
    marker.style.height = link.offsetHeight - 12 + "px";
    marker.style.transform = "translateY(" + (link.offsetTop + 6) + "px)";
    marker.style.opacity = "1";
  }

  function syncNav() {
    var threshold = window.scrollY + window.innerHeight * 0.28;
    var current = sections[0] || null;

    sections.forEach(function (item) {
      if (item.el.offsetTop <= threshold) current = item;
    });

    // Pin the final section once the page bottom is reached.
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
      current = sections[sections.length - 1];
    }

    links.forEach(function (link) {
      link.classList.toggle("is-active", !!current && link === current.link);
    });

    if (current) moveMarker(current.link);
    else if (marker) marker.style.opacity = "0";
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      syncNav();
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", syncNav);
  window.addEventListener("load", syncNav);
  syncNav();

  /* --- Reveal on scroll -------------------------------------- */
  var targets = document.querySelectorAll(".entry, .card, .intro, .section__head, .statement, .skills__group");

  if (!("IntersectionObserver" in window)) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
  );

  Array.prototype.forEach.call(targets, function (el, i) {
    el.classList.add("reveal");
    el.style.transitionDelay = Math.min(i % 4, 3) * 60 + "ms";
    observer.observe(el);
  });
})();
