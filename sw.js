const CACHE_NAME = "heartgift-web-v4";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/styles.css",
  "/app.js",
  "/manifest.webmanifest",
  "/assets/heartgift-mark.svg",
  "/assets/gift-still-life.png",
  "/privacy.html",
  "/about.html",
  "/en/",
  "/en/about.html",
  "/en/privacy.html",
  "/en/guides/",
  "/en/guides/gifts-for-mom-birthday.html",
  "/en/guides/gifts-for-girlfriend-birthday.html",
  "/en/guides/anniversary-gift-ideas.html",
  "/guides/",
  "/guides/mom-birthday-gifts.html",
  "/guides/dad-birthday-gifts.html",
  "/guides/girlfriend-birthday-gifts.html",
  "/guides/boyfriend-birthday-gifts.html",
  "/guides/anniversary-gifts.html",
  "/guides/teacher-gifts.html",
  "/guides/spring-festival-visiting-gifts.html",
  "/guides/first-meet-parents.html",
  "/guides/elder-gift-mistakes.html",
  "/guides/budget-thoughtful-gifts.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)))
    )
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
