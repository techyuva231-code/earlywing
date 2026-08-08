# EarlyWing — Marketing Site

Static marketing site for EarlyWing (by Biltaiys), a compliance &amp; risk platform for the trades.

## Project structure

```
earlywing/
├── index.html          # Page markup
├── css/
│   └── style.css        # All styles (design tokens in :root)
├── js/
│   └── script.js        # Mode-toggle widget, mobile nav, FAQ accordion
└── README.md
```

No build step, no dependencies beyond two Google Fonts loaded via `<link>`. Open `index.html` directly in a browser, or serve the folder with any static file server:

```bash
cd earlywing
python3 -m http.server 8000
# visit http://localhost:8000
```

## What changed from the original single-file draft

**Bugs fixed**
- Mobile nav previously just *hid* the link list with nothing to replace it — under 880px there was no way to reach Modes/Product/Pricing. Added a hamburger menu with a full-screen link panel.
- The hero widget auto-swapped between EarlyBird/NightOwl every 7s even after a visitor manually clicked a mode, yanking them back mid-read. Manual clicks now pin the mode and pause auto-rotation; hovering the widget also pauses it.
- No `prefers-reduced-motion` handling — the widget now renders its end state immediately and skips auto-rotation for users who've asked for reduced motion.
- Dead `href="#"` links: nav "Industries" now points to a real section; footer "Contact" and the Enterprise "Talk to sales" button are real `mailto:` links (swap in your actual sales inbox/CRM link).
- Missing `<meta name="description">`, a favicon, and visible `:focus-visible` outlines for keyboard users.

**New sections**
- **Industries** (`#industries`) — four trade-specific cards (HVAC, Plumbing, Electrical, Labs), giving the nav's "Industries" link and the hero eyebrow something to actually point to.
- **Testimonials** (`#testimonials`) — three short customer quotes for social proof ahead of pricing.
- **FAQ** (`#faq`) — five common pre-signup questions as an accordion.

**Responsiveness**
- Added a hamburger + slide-down mobile menu (previous version had no mobile nav at all).
- New breakpoint at 560px on top of the existing 880px one: tighter section padding, single-column industry/hero-CTA stacking, smaller `.wrap` gutters.
- Headline and section-title sizes now use `clamp()` instead of fixed breakpoint values, so type scales smoothly between the two.

**Copy**
- Original hero/features/pricing copy kept as-is (it was already tight and on-brand).
- New sections written in the same voice: short sentences, concrete numbers, "act early / stay ahead" framing.

## Deploying

This is a static site — any static host works. A couple of the fastest options:

**Netlify / Vercel**: drag-and-drop the `earlywing/` folder in their dashboard, or connect a git repo and set the publish directory to `earlywing/` (no build command needed).

**GitHub Pages**: push this folder to a repo, then in *Settings → Pages* set the source to the branch/folder containing `index.html`.

## Before going live

- Replace the placeholder `sales@earlywing.example` / `hello@earlywing.example` addresses in `index.html` with real inboxes, or swap those `mailto:` links for a real contact form / CRM link.
- Wire "Start free trial" and "Log in" up to your actual signup and auth flows — they're currently anchor links to the pricing section.
- Swap the testimonial names/quotes for real customers once you have them, and add real logos to the trust strip if available.
