/* RS Chef'z - adds "The Kitchen Journal" to the existing (React-hydrated)
   site navigation on the homepage and product pages, without touching the
   pre-rendered markup or the Flight stream. It clones the "3 in 1" nav item
   so the new link inherits the exact styling, and re-heals after React
   re-renders (e.g. when the mobile overlay opens), because that overlay is
   created on demand and would otherwise drop an injected node. */
(function () {
  "use strict";
  var HREF = "/blog/", LABEL = "The Kitchen Journal", REF = 'a[href="/products/chicken-65-masala"]';

  // Only a genuine navigation list: a <ul> that also holds the Home ("/") and
  // Gobi links. This excludes product-showcase cards and footer links that
  // also point at the 3-in-1 product page.
  function navList(ref) {
    var ul = ref.closest && ref.closest("ul");
    if (!ul) return null;
    if (ul.querySelector('a[href="/"]') && ul.querySelector('a[href="/products/gobi-manchurian-masala"]')) return ul;
    return null;
  }
  function inject(ref) {
    var list = navList(ref);
    if (!list || list.querySelector("[data-kj]")) return;
    var unit = (ref.closest && ref.closest("li")) || ref;
    var clone = unit.cloneNode(true);
    var a = clone.matches && clone.matches("a") ? clone : clone.querySelector("a");
    if (!a) return;
    a.setAttribute("href", HREF);
    a.textContent = LABEL;
    a.removeAttribute("aria-current");
    a.setAttribute("data-kj", "");
    a.className = (a.className || "").split(/\s+/).filter(function (c) { return c && !/Active/i.test(c); }).join(" ");
    unit.after(clone);
  }
  function scan() {
    var refs = document.querySelectorAll(REF);
    for (var i = 0; i < refs.length; i++) inject(refs[i]);
  }

  function start() {
    scan();
    if (!("MutationObserver" in window)) return;
    var w, mo = new MutationObserver(function () { clearTimeout(w); w = setTimeout(scan, 60); });
    mo.observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
