/* RS Chef'z - The Kitchen Journal. Progressive enhancement only:
   pages are fully readable and crawlable without JS. ~4 KB, no deps. */
(function () {
  "use strict";
  var doc = document;
  function on(el, ev, fn, o) { if (el) el.addEventListener(ev, fn, o || false); }
  function ga(name, params) {
    try { if (typeof window.gtag === "function") window.gtag("event", name, params || {}); } catch (e) {}
  }

  /* -------- Mobile menu: toggles the same overlay the site uses -------- */
  var body = doc.body;
  var toggle = doc.querySelector("[data-menu-toggle]");
  var overlay = doc.getElementById("kj-overlay");
  var OPEN_BTN = "Navigation-module__yDraKW__menuButtonOpen";
  function setMenu(open) {
    if (overlay) overlay.classList.toggle("is-open", open);
    if (overlay) overlay.setAttribute("aria-hidden", open ? "false" : "true");
    if (toggle) { toggle.classList.toggle(OPEN_BTN, open); toggle.setAttribute("aria-expanded", open ? "true" : "false"); toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu"); }
    body.classList.toggle("kj-noscroll", open);
    if (open && overlay) { var f = overlay.querySelector("a,button"); if (f) f.focus(); }
    else if (toggle) toggle.focus();
  }
  on(toggle, "click", function () { setMenu(!(overlay && overlay.classList.contains("is-open"))); });
  doc.querySelectorAll("[data-menu-close]").forEach(function (b) { on(b, "click", function () { setMenu(false); }); });
  if (overlay) on(overlay, "click", function (e) { if (e.target === overlay) setMenu(false); });
  on(doc, "keydown", function (e) { if (e.key === "Escape" && overlay && overlay.classList.contains("is-open")) setMenu(false); });

  /* -------- Scroll reveal ------------------------------------------- */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = doc.querySelectorAll("[data-reveal]");
  if (reduce || !("IntersectionObserver" in window)) {
    // No animation: leave content visible (default state), nothing to do.
  } else {
    // Enable the hidden-then-reveal behaviour only now that we know it works.
    doc.documentElement.classList.add("reveal-on");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* -------- Blog index: search + category filter -------------------- */
  var grid = doc.getElementById("article-grid");
  if (grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".card"));
    var search = doc.getElementById("blog-search");
    var chips = Array.prototype.slice.call(doc.querySelectorAll("[data-filter]"));
    var empty = doc.getElementById("grid-empty");
    var activeCat = "all";
    var q = "";
    var t;

    function apply() {
      var shown = 0;
      cards.forEach(function (c) {
        var catOk = activeCat === "all" || c.getAttribute("data-cat") === activeCat;
        var hay = (c.getAttribute("data-search") || "").toLowerCase();
        var qOk = !q || hay.indexOf(q) !== -1;
        var vis = catOk && qOk;
        c.classList.toggle("is-hidden", !vis);
        if (vis) shown++;
      });
      if (empty) empty.hidden = shown !== 0;
    }
    chips.forEach(function (chip) {
      on(chip, "click", function () {
        activeCat = chip.getAttribute("data-filter");
        chips.forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
        ga("category_click", { category: activeCat, location: "blog_index" });
        apply();
      });
    });
    on(search, "input", function () {
      clearTimeout(t);
      q = search.value.trim().toLowerCase();
      t = setTimeout(function () { apply(); if (q.length > 2) ga("search", { search_term: q }); }, 180);
    });
    grid.querySelectorAll("a[data-article]").forEach(function (a) {
      on(a, "click", function () { ga("article_click", { article_slug: a.getAttribute("data-article"), location: "blog_index" }); });
    });
  }

  /* -------- Share (article pages) ----------------------------------- */
  var share = doc.querySelector("[data-share]");
  if (share) {
    var url = share.getAttribute("data-url");
    var title = share.getAttribute("data-title") || doc.title;
    var nativeBtn = share.querySelector("[data-share-native]");
    if (nativeBtn) {
      if (navigator.share) {
        nativeBtn.hidden = false;
        on(nativeBtn, "click", function () {
          navigator.share({ title: title, url: url }).then(function () { ga("share_click", { method: "native", article: url }); }).catch(function () {});
        });
      }
    }
    share.querySelectorAll("[data-share-to]").forEach(function (b) {
      on(b, "click", function () { ga("share_click", { method: b.getAttribute("data-share-to"), article: url }); });
    });
    var copyBtn = share.querySelector("[data-share-copy]");
    var copied = share.querySelector("[data-copied]");
    on(copyBtn, "click", function () {
      var done = function () { if (copied) { copied.classList.add("show"); setTimeout(function () { copied.classList.remove("show"); }, 1800); } ga("share_click", { method: "copy", article: url }); };
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(done).catch(done);
      else { var ta = doc.createElement("textarea"); ta.value = url; doc.body.appendChild(ta); ta.select(); try { doc.execCommand("copy"); } catch (e) {} doc.body.removeChild(ta); done(); }
    });
  }

  /* -------- Product CTA event tracking ------------------------------ */
  doc.querySelectorAll("[data-product-cta]").forEach(function (a) {
    on(a, "click", function () {
      ga("blog_product_cta_click", {
        article_slug: a.getAttribute("data-article") || "",
        product: a.getAttribute("data-product") || "",
        position: a.getAttribute("data-position") || ""
      });
    });
  });

  /* -------- blog_view page signal ----------------------------------- */
  var pt = doc.body.getAttribute("data-page-type");
  if (pt) ga("blog_view", { page_type: pt, path: location.pathname });
})();
