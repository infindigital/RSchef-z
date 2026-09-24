// RS Chef'z - Kitchen Journal site configuration.
// Single source of truth for brand, navigation, taxonomy and products.
// Portable to any CMS (Sanity/Contentful/WP/Strapi/Supabase) later - the
// article files carry only content + references to these ids.

export const SITE = {
  name: "RS Chef'z",
  origin: "https://rschefz.com",
  blogBase: "/blog",
  title: "The Kitchen Journal",
  subtitle: "Recipes, cooking inspiration and simple ideas to bring restaurant-style flavour into your kitchen.",
  logo: "/assets/brand/rschefz-logo.png",
  defaultOgImage: "/og-cover.png",
  gaId: "G-SCZ3QJVZ7S",
  amazon: "https://www.amazon.in/stores/RSChefz/page/55B0C3F8-FE1A-4327-BE19-97F52D44C69D?lp_asin=B0D5CP554F&ref_=ast_bln&store_ref=bl_ast_dp_brandlogo_sto",
  whatsapp: "https://wa.me/918548043650?text=Hi%20RS%20Chef'z%2C%20I%20would%20like%20to%20order%20your%20masalas.",
  credit: "https://www.infindigital.in/?utm_source=RSchef%27z&utm_medium=website&utm_campaign=Rschefz_website",
  author: {
    name: "RS Chef'z Editorial Team",
    bio: "Recipes and cooking notes from the RS Chef'z kitchen, written to help you cook restaurant-style dishes at home.",
    initials: "RS",
  },
};

// Primary navigation (used by the blog's own header).
export const NAV = [
  { label: "Home", href: "/" },
  { label: "Gobi Manchurian", href: "/products/gobi-manchurian-masala" },
  { label: "3 in 1", href: "/products/chicken-65-masala" },
  { label: "The Kitchen Journal", href: "/blog/", key: "blog" },
];

// Blog categories -> crawlable /blog/category/<slug> pages.
export const CATEGORIES = {
  "recipes": {
    name: "Recipes",
    title: "Recipes | The Kitchen Journal | RS Chef'z",
    metaDescription: "Restaurant-style Indian recipes you can make at home, crispy starters, fries and classic favourites, step by step, from the RS Chef'z Kitchen Journal.",
    intro: "Step-by-step recipes for the restaurant-style dishes people love most, crispy starters, fries and family favourites, written to work in a home kitchen with everyday ingredients.",
  },
  "cooking-tips": {
    name: "Cooking Tips",
    title: "Cooking Tips | The Kitchen Journal | RS Chef'z",
    metaDescription: "Practical cooking tips from the RS Chef'z kitchen, how to get crispier fries, better coatings and restaurant-style flavour in your everyday home cooking.",
    intro: "Small, practical techniques that make a big difference, how to get a crisp coating, balance a sauce and bring restaurant-style flavour into everyday cooking.",
  },
  "masala-guides": {
    name: "Masala Guides",
    title: "Masala Guides | The Kitchen Journal | RS Chef'z",
    metaDescription: "Get more from every pack. RS Chef'z masala guides show you the many dishes you can make with a single blend, plus how and when to use it.",
    intro: "Get more from every pack. These guides show the range of dishes a single RS Chef'z blend can make, and how to use it for the best results.",
  },
  "food-inspiration": {
    name: "Food Inspiration",
    title: "Food Inspiration | The Kitchen Journal | RS Chef'z",
    metaDescription: "Ideas for what to cook next, popular Indian starters, comparisons and pairings to inspire your next restaurant-style meal at home, from RS Chef'z.",
    intro: "Ideas for what to cook next, the starters worth trying, how the classics compare and simple ways to build a restaurant-style spread at home.",
  },
};

// Products (real, existing URLs - never invented).
export const PRODUCTS = {
  "gobi-manchurian-masala": {
    name: "Gobi Manchurian Masala",
    url: "/products/gobi-manchurian-masala",
    image: "/assets/products/gobi-manchurian/front.webp",
    accent: "#e63324",
    uses: "Gobi Manchurian · Mushroom Fry · Paneer Tikka",
    ctaHeading: "Bring restaurant-style flavour home.",
    ctaText: "Explore RS Chef'z Gobi Manchurian Masala.",
    ctaButton: "Explore Gobi Manchurian Masala",
  },
  "three-in-one-masala": {
    name: "3 in 1 Masala",
    url: "/products/chicken-65-masala",
    image: "/assets/products/three-in-one/front.webp",
    accent: "#f2860d",
    uses: "Chicken 65 · Fish Fry · Gobi Manchurian",
    ctaHeading: "One masala, every favourite.",
    ctaText: "Explore RS Chef'z 3 in 1 Masala.",
    ctaButton: "Explore 3 in 1 Masala",
  },
};

export const BRAND_MARKS = ["No artificial colors", "No preservatives", "No artificial flavors"];
