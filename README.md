# HeartGift Web / 心意提醒网页版

HeartGift Web is a dependency-free static PWA for relationship reminders and gift ideas.

## Run Locally

```zsh
cd /Users/yuc/Documents/software/HeartGiftWeb
python3 -m http.server 5173
```

Open:

```text
http://localhost:5173/
```

## What It Includes

- Interactive relationship reminder and gift idea tool.
- localStorage-only data model.
- Installable PWA manifest and service worker.
- 10 static Chinese gift-guide SEO pages.
- Privacy and about pages.
- Generated visual asset at `assets/gift-still-life.png`.

## Free Publishing Options

Cloudflare Pages:

- Project root: `/Users/yuc/Documents/software/HeartGiftWeb`
- Build command: leave empty
- Output directory: `/`

GitHub Pages:

- Push this folder to a GitHub repository.
- Enable Pages from the repository root.

## Monetization Notes

Do not add live AdSense code until the site is public and approved. For affiliate links, replace relevant gift suggestions inside the guide pages with disclosed affiliate links.
