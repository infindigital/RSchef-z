#!/usr/bin/env node
// =====================================================================
// RS Chef'z - The Kitchen Journal static generator.
// Reads the content model (site.mjs + articles/*.mjs) and emits the blog
// as static HTML into ../blog, plus a merged sitemap.xml at the repo root.
// Zero dependencies. Run:  node blog-src/build.mjs
// =====================================================================
import { readdir, readFile, writeFile, mkdir, copyFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE, NAV, CATEGORIES, PRODUCTS, BRAND_MARKS } from "./site.mjs";

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, "..");
const OUT = join(ROOT, "blog");

/* -------------------------------------------------- small utilities */
const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const stripTags = (s = "") => String(s).replace(/<[^>]+>/g, "");
const slugify = (s = "") => stripTags(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const abs = (p) => (p.startsWith("http") ? p : SITE.origin + p);
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function human(dateStr) { const d = new Date(dateStr + "T09:00:00+05:30"); return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`; }
const isoDT = (dateStr) => dateStr + "T09:00:00+05:30";
const dur = (m) => "PT" + m + "M";
const words = (s) => stripTags(String(s)).split(/\s+/).filter(Boolean).length;

/* ------------------------------------------------------------- icons */
const I = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  arrow: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  sep: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>',
  clock: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  bulb: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.2 1 2.5h6c0-1.3.3-1.8 1-2.5A6 6 0 0 0 12 3Z"/></svg>',
  menu: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
  wa: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.8-.6-3-1.3-5-4.4-5.1-4.6-.2-.2-1.3-1.7-1.3-3.2s.8-2.3 1.1-2.6c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .7.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.4c-.2.2-.3.4-.1.7.2.3.9 1.5 2 2.4 1.4 1.2 2.5 1.6 2.8 1.7.3.1.5.1.7-.1l.9-1.1c.2-.2.4-.2.6-.1l2.1 1c.3.2.5.2.5.4.1.2.1.8-.1 1.5Z"/></svg>',
  fb: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z"/></svg>',
  x: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-7 8 8.3 12h-6.5l-5-6.6L6 22H3l7.5-8.6L2 2h6.6l4.6 6.1L18.9 2Zm-1.1 18h1.7L7.3 3.8H5.5L17.8 20Z"/></svg>',
  link: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 15l6-6M10 6l1-1a4 4 0 0 1 6 6l-1 1M14 18l-1 1a4 4 0 0 1-6-6l1-1"/></svg>',
  share: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>',
};

/* -------------------------------------------------------- <head> */
function head({ title, description, canonical, image, type = "website", published, modified, jsonld = [], preloadImage, pageType }) {
  const img = abs(image || SITE.defaultOgImage);
  const ld = jsonld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#fff8ee">
<meta property="og:site_name" content="RS Chef'z">
<meta property="og:type" content="${type}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="en_IN">
${published ? `<meta property="article:published_time" content="${isoDT(published)}">` : ""}
${modified || published ? `<meta property="article:modified_time" content="${isoDT(modified || published)}">` : ""}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${img}">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" href="/icon.png">
<link rel="apple-touch-icon" href="/apple-icon.png">
${preloadImage ? `<link rel="preload" as="image" href="${preloadImage.src}"${preloadImage.srcset ? ` imagesrcset="${preloadImage.srcset}" imagesizes="${preloadImage.sizes || "100vw"}"` : ""} fetchpriority="high">` : ""}
<link rel="stylesheet" href="/blog/fonts.css">
<link rel="stylesheet" href="/blog/blog.css">
<link rel="stylesheet" href="/blog/site-chrome.css">
<script async src="https://www.googletagmanager.com/gtag/js?id=${SITE.gaId}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${SITE.gaId}');</script>
${ld}
</head>
<body data-page-type="${pageType || ""}">`;
}

/* ------------------------------------------------------ header/footer */
// The site navigation, reproduced exactly (same Navigation-module classes and
// markup as every other page) so the blog header is identical. It is rendered
// static: the pill always carries the .scrolled glass style for legibility, and
// the mobile overlay is toggled by blog.js instead of React/framer-motion.
const NB = "Navigation-module__yDraKW__";
function isActive(n, currentKey) {
  return n.key === "blog" ? currentKey === "blog" : false;
}
function header(currentKey) {
  const barLinks = NAV.map((n) => {
    const active = isActive(n, currentKey);
    return `<li><a class="${NB}link${active ? ` ${NB}linkActive` : ""}"${active ? ' aria-current="page"' : ""} href="${n.href}">${esc(n.label)}</a></li>`;
  }).join("");
  const overlayLinks = NAV.map((n) => {
    const active = isActive(n, currentKey);
    return `<li><a class="${NB}overlayLink"${active ? ' aria-current="page"' : ""} href="${n.href}" data-menu-close>${esc(n.label)}</a></li>`;
  }).join("");
  return `<a class="skip-link" href="#main">Skip to content</a>
<header class="${NB}header">
<nav aria-label="Main" class="${NB}bar ${NB}scrolled">
<a class="${NB}brand" aria-label="RS Chef'z, home" href="/"><img alt="RS Chef'z" width="1000" height="426" decoding="async" class="${NB}brandLogo" src="${SITE.logo}"></a>
<ul class="${NB}links">${barLinks}</ul>
<a class="${NB}buyNow" href="${SITE.amazon}" target="_blank" rel="noopener noreferrer">Buy Now</a>
<button type="button" class="${NB}menuButton" data-menu-toggle aria-expanded="false" aria-controls="kj-overlay" aria-label="Open menu"><span aria-hidden="true"></span><span aria-hidden="true"></span></button>
</nav>
</header>
<div class="${NB}overlay" id="kj-overlay" aria-hidden="true" data-menu-overlay>
<ul class="${NB}overlayLinks">${overlayLinks}<li><a class="${NB}overlayBuy" href="${SITE.amazon}" target="_blank" rel="noopener noreferrer" data-menu-close>Buy Now</a></li></ul>
</div>`;
}
// The site footer, reproduced exactly (same Footer/BuyButtons module classes and
// markup as every other page) so the blog footer is identical.
const FB = "Footer-module__3hUVsW__", BB = "BuyButtons-module__LvFKWW__";
const FICON = {
  wa: '<svg class="' + BB + 'icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39a9.87 9.87 0 0 0 4.74 1.21c5.46 0 9.9-4.44 9.9-9.9S17.5 2 12.04 2Zm0 18.03a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.07.8.82-3-.2-.31a8.08 8.08 0 0 1-1.24-4.31c0-4.48 3.64-8.12 8.12-8.12s8.12 3.64 8.12 8.12-3.64 8.13-8.12 8.13Zm4.45-6.08c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.53.06-.24-.12-1.03-.38-1.96-1.21a7.34 7.34 0 0 1-1.35-1.68c-.14-.24-.02-.38.1-.5.11-.11.25-.28.37-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.65.3-.22.24-.85.83-.85 2.03s.87 2.35 1 2.51c.12.16 1.72 2.62 4.16 3.68.58.25 1.03.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.05.14-1.16-.06-.1-.22-.16-.46-.28Z"></path></svg>',
  ext: '<svg class="' + BB + 'icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"></path><path d="M9 7h8v8"></path></svg>',
  packArrow: '<svg class="' + FB + 'packArrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h13"></path><path d="m12 5 7 7-7 7"></path></svg>',
  creditArrow: '<svg class="' + FB + 'creditArrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"></path><path d="M9 7h8v8"></path></svg>',
};
function packCard(url, shot, name, dishes) {
  return `<li><a class="${FB}packCard" href="${url}"><span class="${FB}packShot"><img alt="" loading="lazy" width="1094" height="1403" decoding="async" src="${shot}"/></span><span class="${FB}packText"><span class="${FB}packName">${esc(name)}</span><span class="${FB}packDishes">${esc(dishes)}</span></span>${FICON.packArrow}</a></li>`;
}
function footer() {
  return `<footer class="${FB}footer"><div class="${FB}cta"><h2 class="${FB}ctaTitle">Bring the restaurant home.</h2><p class="${FB}ctaSub">Two packs, every favourite. Delivered across India.</p><div class="${BB}row ${FB}ctaButtons"><a class="${BB}button ${BB}whatsapp" href="${SITE.whatsapp}" target="_blank" rel="noopener noreferrer">${FICON.wa}Buy on WhatsApp</a><a class="${BB}button ${BB}amazon" href="${SITE.amazon}" target="_blank" rel="noopener noreferrer">Shop on Amazon${FICON.ext}</a></div></div><div class="${FB}main"><div class="${FB}brandCol"><img alt="RS Chef'z" loading="lazy" width="1000" height="426" decoding="async" class="${FB}logo" src="${SITE.logo}"/><p class="${FB}tagline">Authentic Flavour. Crafted to Perfection.</p><ul class="${FB}promise"><li>No artificial colors</li><li>No preservatives</li><li>No artificial flavors</li></ul></div><nav aria-label="Products"><p class="${FB}colTitle">Products</p><ul class="${FB}packList">${packCard("/products/gobi-manchurian-masala", "/assets/products/gobi-manchurian/front.webp", "Gobi Manchurian Masala", "Gobi Manchurian · Mushroom Fry · Paneer Tikka")}${packCard("/products/chicken-65-masala", "/assets/products/three-in-one/front.webp", "3 in 1 Masala", "Chicken 65 · Fish Fry · Gobi Manchurian")}</ul></nav></div><div class="${FB}bottom"><p class="${FB}legal"><span>© 2026 RS Chef'z. All rights reserved.</span><span class="${FB}sep" aria-hidden="true"></span><span>FSSAI licensed. Product of India.</span></p><a class="${FB}credit" href="${SITE.credit}" target="_blank" rel="noopener"><span class="${FB}creditLabel">Developed by</span><span class="${FB}creditMark">In<span class="${FB}creditSlash">/</span>Fin</span>${FICON.creditArrow}</a></div></footer>
<script src="/blog/blog.js" defer></script>
</body></html>`;
}

/* ------------------------------------------------- content rendering */
function productCTA(a, block) {
  const p = PRODUCTS[block.product];
  const pos = block.position || "inline";
  return `<aside class="article-cta">
<img src="${p.image}" alt="RS Chef'z ${esc(p.name)} pack" width="84" height="84" loading="lazy" decoding="async">
<div class="article-cta__text"><strong>${esc(p.ctaHeading)}</strong><span>${esc(p.ctaText)}</span></div>
<a class="btn btn--ink link-cta" data-product-cta data-article="${a.slug}" data-product="${block.product}" data-position="${pos}" href="${p.url}">${esc(p.ctaButton)} ${I.arrow}</a>
</aside>`;
}
function recipeCard(r) {
  const facts = [["Prep", r.prepMin + " min"], ["Cook", r.cookMin + " min"], ["Total", r.totalMin + " min"], ["Serves", r.servings]];
  return `<div class="recipe-card">
<p class="eyebrow">Recipe Card</p>
<h2>${esc(r.name)}</h2>
<p>${esc(r.description)}</p>
<dl class="recipe-card__facts">${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
<h3>Ingredients</h3><ul>${r.ingredients.map((x) => `<li>${x}</li>`).join("")}</ul>
<h3>Instructions</h3><ol>${r.instructions.map((x) => `<li>${x}</li>`).join("")}</ol>
</div>`;
}
function renderContent(a) {
  let html = "", wc = 0, recipe = null;
  for (const b of a.content) {
    if (b.p) { html += `<p>${b.p}</p>`; wc += words(b.p); }
    else if (b.h2) { html += `<h2 id="${slugify(b.h2)}">${esc(b.h2)}</h2>`; wc += words(b.h2); }
    else if (b.h3) { html += `<h3 id="${slugify(b.h3)}">${esc(b.h3)}</h3>`; wc += words(b.h3); }
    else if (b.ul) { html += `<ul>${b.ul.map((x) => `<li>${x}</li>`).join("")}</ul>`; wc += b.ul.reduce((n, x) => n + words(x), 0); }
    else if (b.ol) { html += `<ol>${b.ol.map((x) => `<li>${x}</li>`).join("")}</ol>`; wc += b.ol.reduce((n, x) => n + words(x), 0); }
    else if (b.tip) { html += `<aside class="tip"><h4>${I.bulb} ${esc(b.tip.title)}</h4><p>${b.tip.body}</p></aside>`; wc += words(b.tip.title) + words(b.tip.body); }
    else if (b.img) {
      html += `<figure><img src="${b.img.src}"${b.img.srcset ? ` srcset="${b.img.srcset}" sizes="(max-width:820px) 100vw, 820px"` : ""} width="${b.img.w}" height="${b.img.h}" alt="${esc(b.img.alt)}" loading="lazy" decoding="async">${b.img.caption ? `<figcaption>${esc(b.img.caption)}</figcaption>` : ""}</figure>`;
    }
    else if (b.cta) { html += productCTA(a, b.cta); }
    else if (b.recipe) { recipe = b.recipe; html += recipeCard(b.recipe); wc += b.recipe.ingredients.reduce((n, x) => n + words(x), 0) + b.recipe.instructions.reduce((n, x) => n + words(x), 0) + words(b.recipe.description); }
  }
  return { html, wordCount: wc, recipe };
}

/* --------------------------------------------------------- cards */
function readingLabel(wc) { return Math.max(1, Math.round(wc / 225)) + " min read"; }
function catTag(catSlug) { return `<span class="tag" data-cat="${catSlug}">${esc(CATEGORIES[catSlug].name)}</span>`; }
function articleCard(a, delay) {
  const f = a.featuredImage;
  const srcset = `${f.base}-480.webp 480w, ${f.base}-800.webp 800w, ${f.base}.webp ${f.w}w`;
  const searchHay = [a.title, a.excerpt, CATEGORIES[a.category].name, ...(a.tags || []), a.primaryKeyword, ...(a.secondaryKeywords || [])].join(" ");
  return `<article class="card" data-reveal${delay ? ` data-delay="${delay}"` : ""} data-cat="${a.category}" data-search="${esc(searchHay)}">
<a class="card__link" data-article="${a.slug}" href="${a.url}" aria-label="${esc(a.title)}">
<div class="card__media">${catTag(a.category)}<img src="${f.base}-800.webp" srcset="${srcset}" sizes="(max-width:560px) 100vw, (max-width:1024px) 50vw, 33vw" width="${f.w}" height="${f.h}" alt="${esc(f.alt)}" loading="lazy" decoding="async"></div>
</a>
<div class="card__body">
<h3><a data-article="${a.slug}" href="${a.url}">${esc(a.title)}</a></h3>
<p class="card__excerpt">${esc(a.excerpt)}</p>
<div class="card__meta">${I.clock}<span>${a.readingLabel}</span><span class="dot"></span><time datetime="${a.publishedAt}">${a.humanDate}</time></div>
</div>
</article>`;
}

/* --------------------------------------------------- breadcrumbs */
function breadcrumb(trail) {
  const html = trail.map((t, i) => {
    const last = i === trail.length - 1;
    const node = last ? `<li aria-current="page">${esc(t.name)}</li>` : `<li><a href="${t.url}">${esc(t.name)}</a></li>`;
    const sep = last ? "" : `<li aria-hidden="true">${I.sep}</li>`;
    return node + sep;
  }).join("");
  return `<nav class="breadcrumb" aria-label="Breadcrumb"><div class="wrap"><ol>${html}</ol></div></nav>`;
}
function breadcrumbLD(trail) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, ...(t.url ? { item: abs(t.url) } : {}) })) };
}

/* ============================================================ PAGES */
function articlePage(a) {
  const { html, recipe } = a._rendered;
  const canonical = abs(a.url);
  const trail = [
    { name: "Home", url: "/" },
    { name: "The Kitchen Journal", url: SITE.blogBase + "/" },
    { name: CATEGORIES[a.category].name, url: `${SITE.blogBase}/category/${a.category}` },
    { name: a.title },
  ];
  const heroAbs = abs(a.heroImage.src);
  const blogPosting = {
    "@context": "https://schema.org", "@type": "BlogPosting",
    headline: a.title, description: a.metaDescription,
    image: [abs(a.ogImage), heroAbs],
    datePublished: isoDT(a.publishedAt), dateModified: isoDT(a.updatedAt || a.publishedAt),
    author: { "@type": "Organization", name: SITE.author.name, url: SITE.origin },
    publisher: { "@type": "Organization", name: "RS Chef'z", logo: { "@type": "ImageObject", url: abs(SITE.logo) } },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    articleSection: CATEGORIES[a.category].name,
    keywords: [a.primaryKeyword, ...(a.secondaryKeywords || [])].join(", "),
    wordCount: a._rendered.wordCount,
  };
  const jsonld = [blogPosting, breadcrumbLD(trail)];
  if (recipe) {
    jsonld.push({
      "@context": "https://schema.org", "@type": "Recipe",
      name: recipe.name, description: recipe.description, image: [heroAbs, abs(a.ogImage)],
      author: { "@type": "Organization", name: SITE.author.name },
      datePublished: isoDT(a.publishedAt),
      recipeCategory: recipe.category, recipeCuisine: recipe.cuisine, keywords: recipe.keywords,
      prepTime: dur(recipe.prepMin), cookTime: dur(recipe.cookMin), totalTime: dur(recipe.totalMin),
      recipeYield: recipe.yield,
      recipeIngredient: recipe.ingredients.map(stripTags),
      recipeInstructions: recipe.instructions.map((t) => ({ "@type": "HowToStep", text: stripTags(t) })),
    });
  }
  const related = (a.relatedArticles || []).map((s) => BY_SLUG[s]).filter(Boolean).slice(0, 3);
  const relatedHtml = related.length ? `<section class="block related"><div class="wrap">
<div class="section-head"><div><p class="eyebrow">Keep Reading</p><h2>You May Also Like</h2></div></div>
<div class="grid">${related.map((r, i) => articleCard(r, (i % 3) + 1)).join("")}</div>
</div></section>` : "";

  const updated = a.updatedAt ? ` <span class="dot"></span> Updated ${human(a.updatedAt)}` : "";
  return head({
    title: a.metaTitle, description: a.metaDescription, canonical, image: a.ogImage,
    type: "article", published: a.publishedAt, modified: a.updatedAt || a.publishedAt,
    jsonld, pageType: "article",
    preloadImage: { src: a.heroImage.src, srcset: a.heroImage.srcset, sizes: "(max-width:1080px) 100vw, 1080px" },
  }) + header("blog") + `<main id="main">
${breadcrumb(trail)}
<article class="article"><div class="wrap">
<header class="article__head">
${catTag(a.category)}
<h1>${esc(a.title)}</h1>
<p class="article__excerpt">${esc(a.excerpt)}</p>
<div class="article__meta"><span class="author">${esc(SITE.author.name)}</span><span class="dot"></span><time datetime="${a.publishedAt}">${a.humanDate}</time>${updated}<span class="dot"></span>${I.clock} ${a.readingLabel}</div>
</header>
<figure class="article__hero"><img src="${a.heroImage.src}" srcset="${a.heroImage.srcset}" sizes="(max-width:1080px) 100vw, 1080px" width="${a.heroImage.w}" height="${a.heroImage.h}" alt="${esc(a.heroImage.alt)}" fetchpriority="high" decoding="async"></figure>
<div class="prose">
${html}
</div>
${shareBar(a, canonical)}
${authorStrip()}
</div></article>
${relatedHtml}
</main>` + footer();
}

function shareBar(a, url) {
  const enc = encodeURIComponent(url), t = encodeURIComponent(a.title);
  return `<div class="share" data-share data-url="${url}" data-title="${esc(a.title)}">
<span>Share</span>
<button class="share-native" data-share-native hidden>${I.share} Share</button>
<a data-share-to="whatsapp" href="https://wa.me/?text=${t}%20${enc}" target="_blank" rel="noopener" aria-label="Share on WhatsApp">${I.wa}</a>
<a data-share-to="facebook" href="https://www.facebook.com/sharer/sharer.php?u=${enc}" target="_blank" rel="noopener" aria-label="Share on Facebook">${I.fb}</a>
<a data-share-to="x" href="https://twitter.com/intent/tweet?text=${t}&url=${enc}" target="_blank" rel="noopener" aria-label="Share on X">${I.x}</a>
<button data-share-copy aria-label="Copy link">${I.link}</button>
<span class="share__copied" data-copied role="status">Link copied</span>
</div>`;
}
function authorStrip() {
  return `<div class="author-strip"><span class="avatar" aria-hidden="true">${esc(SITE.author.initials)}</span><div><strong>${esc(SITE.author.name)}</strong><p>${esc(SITE.author.bio)}</p></div></div>`;
}

/* ---------------------------------------------------- product blocks */
function exploreProducts() {
  const cards = Object.entries(PRODUCTS).map(([id, p]) => `<a class="product-card" data-product-cta data-product="${id}" data-position="explore" data-article="index" href="${p.url}">
<img src="${p.image}" alt="RS Chef'z ${esc(p.name)} pack" width="96" height="96" loading="lazy" decoding="async">
<div><h3>${esc(p.name)}</h3><p>${esc(p.uses)}</p><span class="link-cta link-cta--chilli">Explore ${I.arrow}</span></div>
</a>`).join("");
  return `<section class="block block--tint" id="masalas"><div class="wrap">
<div class="section-head"><div><p class="eyebrow">From the Shelf</p><h2>Explore Our Masalas</h2></div></div>
<div class="products">${cards}</div>
</div></section>`;
}

/* ----------------------------------------------------- index page */
function indexPage(published) {
  const featured = published.find((a) => a.featured) || published[0];
  const canonical = abs(SITE.blogBase + "/");
  const trail = [{ name: "Home", url: "/" }, { name: "The Kitchen Journal" }];
  const blogLD = {
    "@context": "https://schema.org", "@type": "Blog",
    name: SITE.title, description: SITE.subtitle, url: canonical, inLanguage: "en-IN",
    publisher: { "@type": "Organization", name: "RS Chef'z", logo: { "@type": "ImageObject", url: abs(SITE.logo) } },
    blogPost: published.map((a) => ({ "@type": "BlogPosting", headline: a.title, url: abs(a.url), datePublished: isoDT(a.publishedAt), image: abs(a.ogImage) })),
  };
  // The grid holds everything except the featured article. Search + category
  // filters only appear when there is more than one article / category to sift.
  const rest = published.filter((a) => a !== featured);
  const presentCats = Object.keys(CATEGORIES).filter((s) => published.some((a) => a.category === s));
  const showGrid = rest.length > 0;
  const showFilter = presentCats.length > 1;
  const filters = showFilter ? `<div class="filter" role="group" aria-label="Filter articles by category">
<button data-filter="all" aria-pressed="true">All</button>
${presentCats.map((s) => `<button data-filter="${s}" aria-pressed="false">${esc(CATEGORIES[s].name)}</button>`).join("")}
</div>` : "";
  const heroSearch = showGrid ? `<div class="blog-hero__search"><div class="search">${I.search}<label class="sr-only" for="blog-search">Search articles</label><input id="blog-search" type="search" placeholder="Search recipes, masalas &amp; cooking ideas..." autocomplete="off"></div></div>` : "";
  const latest = showGrid ? `
<section class="block block--tint" id="latest"><div class="wrap">
<div class="section-head"><div><p class="eyebrow">The Journal</p><h2>Latest from the Kitchen</h2></div></div>
${filters}
<div class="grid" id="article-grid">${rest.map((a, i) => articleCard(a, (i % 3) + 1)).join("")}</div>
<p class="empty" id="grid-empty" hidden>No articles match your search yet. Try another word, or <a href="${SITE.blogBase}/">browse all articles</a>.</p>
</div></section>` : "";
  const heroSrcset = "/assets/blog/gobi-manchurian-recipe-rs-chefz-1200.webp 1200w, /assets/blog/gobi-manchurian-recipe-rs-chefz.webp 1600w";
  return head({
    title: "The Kitchen Journal | Recipes, Cooking Tips & Masala Ideas | RS Chef'z",
    description: "Recipes, cooking tips and masala ideas from RS Chef'z. Learn to make restaurant-style Indian starters, Gobi Manchurian, Chicken 65, Fish Fry and more, at home.",
    canonical, image: SITE.defaultOgImage, jsonld: [blogLD, breadcrumbLD(trail)], pageType: "blog_home",
    preloadImage: { src: "/assets/blog/gobi-manchurian-recipe-rs-chefz-1200.webp", srcset: heroSrcset, sizes: "100vw" },
  }) + header("blog") + `<main id="main">
<section class="blog-hero" aria-label="The Kitchen Journal">
<div class="blog-hero__media"><img src="/assets/blog/gobi-manchurian-recipe-rs-chefz-1200.webp" srcset="${heroSrcset}" sizes="100vw" width="1600" height="900" alt="Crispy restaurant-style Gobi Manchurian in a bowl" fetchpriority="high" decoding="async"></div>
<div class="wrap">
<p class="eyebrow">RS Chef'z</p>
<h1>The Kitchen Journal</h1>
<p>${esc(SITE.subtitle)}</p>
${heroSearch}
</div>
</section>

<section class="block"><div class="wrap">
<div class="section-head"><div><p class="eyebrow">Featured</p><h2>This Week in the Kitchen</h2></div></div>
<article class="featured" data-reveal>
<a class="featured__media" data-article="${featured.slug}" href="${featured.url}" aria-label="${esc(featured.title)}"><img src="${featured.featuredImage.base}-800.webp" srcset="${featured.featuredImage.base}-800.webp 800w, ${featured.featuredImage.base}.webp ${featured.featuredImage.w}w" sizes="(max-width:860px) 100vw, 55vw" width="${featured.featuredImage.w}" height="${featured.featuredImage.h}" alt="${esc(featured.featuredImage.alt)}" loading="lazy" decoding="async"></a>
<div class="featured__body">
${catTag(featured.category)}
<h3><a data-article="${featured.slug}" href="${featured.url}">${esc(featured.title)}</a></h3>
<p>${esc(featured.excerpt)}</p>
<div class="meta">${I.clock}<span>${featured.readingLabel}</span><span class="dot"></span><time datetime="${featured.publishedAt}">${featured.humanDate}</time></div>
<p style="margin-top:18px"><a class="link-cta link-cta--chilli" data-article="${featured.slug}" href="${featured.url}">Read Recipe ${I.arrow}</a></p>
</div>
</article>
</div></section>
${latest}

${exploreProducts()}
</main>` + footer();
}

/* --------------------------------------------------- category page */
function categoryPage(slug, list) {
  const c = CATEGORIES[slug];
  const canonical = abs(`${SITE.blogBase}/category/${slug}`);
  const trail = [{ name: "Home", url: "/" }, { name: "The Kitchen Journal", url: SITE.blogBase + "/" }, { name: c.name }];
  const collLD = {
    "@context": "https://schema.org", "@type": "CollectionPage",
    name: c.name + ", The Kitchen Journal", description: c.metaDescription, url: canonical, inLanguage: "en-IN",
    isPartOf: { "@type": "Blog", name: SITE.title, url: abs(SITE.blogBase + "/") },
    hasPart: list.map((a) => ({ "@type": "BlogPosting", headline: a.title, url: abs(a.url) })),
  };
  const grid = list.length
    ? `<div class="grid">${list.map((a, i) => articleCard(a, (i % 3) + 1)).join("")}</div>`
    : `<p class="empty">New ${esc(c.name.toLowerCase())} are on the way. Meanwhile, <a href="${SITE.blogBase}/">browse all articles</a>.</p>`;
  return head({
    title: c.title, description: c.metaDescription, canonical, image: SITE.defaultOgImage,
    jsonld: [collLD, breadcrumbLD(trail)], pageType: "blog_category",
  }) + header("blog") + `<main id="main">
${breadcrumb(trail)}
<section class="block"><div class="wrap">
<div class="section-head"><div><p class="eyebrow">Category</p><h1 style="font-family:var(--font-heading);font-weight:700;font-size:clamp(1.9rem,5vw,2.8rem);letter-spacing:-.02em;margin:.1em 0 0">${esc(c.name)}</h1></div></div>
<p style="max-width:60ch;color:var(--ink-soft);font-size:1.1rem;margin:0 0 30px">${esc(c.intro)}</p>
${filtersFor(slug)}
<h2 class="sr-only">Articles in ${esc(c.name)}</h2>
${grid}
</div></section>
${exploreProducts()}
</main>` + footer();
}
function filtersFor(active) {
  // Only link categories that actually have a generated page; hide the bar
  // entirely when there is nothing to switch between.
  if (PRESENT_CATS.length < 2) return "";
  return `<div class="filter" aria-label="Browse categories"><a href="${SITE.blogBase}/"${active === "all" ? ' aria-current="page"' : ""}>All</a>${PRESENT_CATS.map((s) => `<a href="${SITE.blogBase}/category/${s}"${s === active ? ' aria-current="page"' : ""}>${esc(CATEGORIES[s].name)}</a>`).join("")}</div>`;
}

/* --------------------------------------------------------- 404 */
function notFoundPage() {
  return head({
    title: "Page Not Found | The Kitchen Journal | RS Chef'z",
    description: "The page you were looking for could not be found. Head back to The Kitchen Journal for recipes and cooking ideas.",
    canonical: abs(SITE.blogBase + "/404"), image: SITE.defaultOgImage, pageType: "blog_404",
  }).replace('name="robots" content="index, follow, max-image-preview:large"', 'name="robots" content="noindex, follow"')
    + header() + `<main id="main"><section class="block"><div class="wrap"><div class="blog-404">
<div><p class="eyebrow">404</p><h1>Recipe not found</h1>
<p>Looks like this recipe took a different route. The page you're after may have moved or never existed.</p>
<div class="btns"><a class="btn btn--ink" href="${SITE.blogBase}/">Back to The Kitchen Journal</a><a class="btn btn--solid" href="${PRODUCTS["gobi-manchurian-masala"].url}">Explore Our Masalas</a></div>
</div></div></div></section></main>` + footer();
}

/* ============================================================ build */
let BY_SLUG = {};
let PRESENT_CATS = [];
async function main() {
  // load articles
  const files = (await readdir(join(__dir, "articles"))).filter((f) => f.endsWith(".mjs"));
  let articles = [];
  for (const f of files) {
    const mod = await import("./articles/" + f);
    articles.push(mod.default);
  }
  // derive fields
  for (const a of articles) {
    a.url = `${SITE.blogBase}/${a.slug}`;
    a.humanDate = human(a.publishedAt);
    a._rendered = renderContent(a);
    a.readingLabel = readingLabel(a._rendered.wordCount);
  }
  articles.sort((x, y) => (x.publishedAt < y.publishedAt ? 1 : -1));
  BY_SLUG = Object.fromEntries(articles.map((a) => [a.slug, a]));
  PRESENT_CATS = Object.keys(CATEGORIES).filter((s) => articles.some((a) => a.category === s));

  // clean & recreate output (preserve nothing stale, but keep dir)
  if (existsSync(OUT)) await rm(OUT, { recursive: true, force: true });
  await mkdir(join(OUT, "category"), { recursive: true });

  // static assets
  for (const s of ["blog.css", "site-chrome.css", "blog.js", "fonts.css", "nav-inject.js"]) {
    await copyFile(join(__dir, "static", s), join(OUT, s));
  }
  // scoped 404 for the blog subtree
  await writeFile(join(OUT, ".htaccess"), "ErrorDocument 404 /blog/404.html\n");

  // pages
  await writeFile(join(OUT, "index.html"), indexPage(articles));
  await writeFile(join(OUT, "404.html"), notFoundPage());
  for (const a of articles) await writeFile(join(OUT, a.slug + ".html"), articlePage(a));
  // Only emit category pages that actually have at least one article, so the
  // blog never links to thin or empty pages.
  const catUrls = [];
  for (const slug of Object.keys(CATEGORIES)) {
    const list = articles.filter((a) => a.category === slug);
    if (!list.length) continue;
    await writeFile(join(OUT, "category", slug + ".html"), categoryPage(slug, list));
    catUrls.push({ loc: `${SITE.origin}${SITE.blogBase}/category/${slug}`, pr: "0.5" });
  }

  // sitemap: keep existing product URLs, add blog URLs
  const today = new Date().toISOString();
  const urls = [
    { loc: `${SITE.origin}/`, pr: "1.0", cf: "monthly" },
    { loc: `${SITE.origin}/products/gobi-manchurian-masala`, pr: "0.8", cf: "monthly" },
    { loc: `${SITE.origin}/products/chicken-65-masala`, pr: "0.8", cf: "monthly" },
    { loc: `${SITE.origin}${SITE.blogBase}/`, pr: "0.9", cf: "weekly" },
    ...catUrls.map((c) => ({ ...c, cf: "weekly" })),
    ...articles.map((a) => ({ loc: `${SITE.origin}${a.url}`, pr: "0.7", cf: "monthly", lastmod: isoDT(a.updatedAt || a.publishedAt) })),
  ];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `<url>
<loc>${u.loc}</loc>
<lastmod>${u.lastmod || today}</lastmod>
<changefreq>${u.cf}</changefreq>
<priority>${u.pr}</priority>
</url>`).join("\n")}
</urlset>
`;
  await writeFile(join(ROOT, "sitemap.xml"), sitemap);

  console.log(`Built ${articles.length} articles, ${catUrls.length} categories, index + 404.`);
  console.log("Articles:", articles.map((a) => `${a.slug} (${a.readingLabel})`).join("\n          "));
}
main().catch((e) => { console.error(e); process.exit(1); });
