# Milano – PageFly Installation Guide (Static Site)

A responsive, accessible HTML/CSS/JS site that walks new Shopify merchants through installing **PageFly** from the Shopify App Store.

## Features
- Semantic structure: hero, steps, features, FAQ
- Responsive layout (CSS Grid / Flexbox)
- Mobile navigation with accessible toggle
- FAQ accordion (ARIA-compliant)
- Back-to-top button
- Copy steps to clipboard utility
- Dark, modern UI with system font stack

## Quick Start
Just open `index.html` in your browser.

### Optionally serve locally (recommended for caching & relative paths)
On Windows PowerShell you can use Python quick server:
```powershell
python -m http.server 5500
# Then visit http://localhost:5500/index.html
```
If Python isn't installed, double-click the file or use a lightweight server extension in VS Code.

## Structure
```
Milano/
  index.html
  assets/
    css/styles.css
    js/main.js
  README.md
```

## Customization Tips
- Colors: Edit CSS variables at the top of `assets/css/styles.css`.
- Steps: Modify the `<ol>` in the `#steps` section.
- FAQ: Add more `.accordion-item` blocks below existing ones.
- Performance: Inline critical CSS (hero & header) if you want faster first paint.

## Accessibility Notes
- Focus outlines preserved
- Skip link implemented
- ARIA attributes for accordion & nav button
- Back-to-top is only visible after scrolling

## License
Provided as-is. You may adapt freely for your internal or client documentation.
