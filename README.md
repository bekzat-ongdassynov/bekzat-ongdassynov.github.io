# bekzat-ongdassynov.github.io

Personal site — static, no build step. Served by GitHub Pages from the repository root.

```
index.html    markup and content
styles.css    design tokens, layout, components
script.js     scroll spy, theme toggle, mobile nav, reveal animations
assets/       images
```

## Profile picture

Drop a square image at `assets/profile.jpg`. Until one exists, the avatar falls back
to an initials monogram, so the page never shows a broken image.

## Local preview

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.
