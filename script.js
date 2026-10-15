(function () {
  "use strict";

  var avatar = document.getElementById("avatarImg");
  if (avatar) {
    var hideAvatar = function () { avatar.hidden = true; };
    avatar.addEventListener("error", hideAvatar);
    if (avatar.complete && avatar.naturalWidth === 0) hideAvatar();
  }

  var sidebar = document.getElementById("sidebar");
  var navToggle = document.getElementById("navToggle");
  var backdrop = document.getElementById("navBackdrop");
  var toggleLabel = navToggle ? navToggle.querySelector(".nav-toggle__label") : null;
  var isMobile = function () { return window.matchMedia("(max-width: 960px)").matches; };

  function setMenu(open) {
    if (!sidebar || !navToggle) return;
    var show = open && isMobile();
    sidebar.classList.toggle("is-open", show);
    document.body.classList.toggle("menu-open", show);
    if (backdrop) {
      if (show) backdrop.removeAttribute("hidden");
      else backdrop.setAttribute("hidden", "");
    }
    navToggle.setAttribute("aria-expanded", String(show));
    navToggle.setAttribute("aria-label", show ? "Close menu" : "Open menu");
    if (toggleLabel) toggleLabel.textContent = show ? "Close" : "Menu";
  }

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      setMenu(!sidebar.classList.contains("is-open"));
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });

  document.addEventListener("click", function (e) {
    if (!isMobile() || !sidebar.classList.contains("is-open")) return;
    if (!sidebar.contains(e.target)) setMenu(false);
  });

  window.addEventListener("resize", function () {
    if (!isMobile()) setMenu(false);
  });

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
    if (!marker || isMobile()) {
      if (marker) marker.style.opacity = "0";
      return;
    }
    marker.style.height = Math.max(link.offsetHeight - 16, 12) + "px";
    marker.style.transform = "translateY(" + (link.offsetTop + 8) + "px)";
    marker.style.opacity = "1";
  }

  function syncNav() {
    var threshold = window.scrollY + window.innerHeight * 0.28;
    var current = sections[0] || null;

    sections.forEach(function (item) {
      if (item.el.offsetTop <= threshold) current = item;
    });

    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
      current = sections[sections.length - 1];
    }

    links.forEach(function (link) {
      if (current && link === current.link) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });

    if (current) moveMarker(current.link);
    else if (marker) marker.style.opacity = "0";
  }

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      syncNav();
      ticking = false;
    });
  }, { passive: true });

  window.addEventListener("resize", syncNav);
  window.addEventListener("load", syncNav);
  syncNav();
})();
