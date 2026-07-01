# Tomani Wear — Learning Notes

A running log of everything built and learned. Updated as we go.

---

## Session 1 — Project Setup

### What we built
- Created a Next.js 15 project using `create-next-app`
- TypeScript, Tailwind CSS, App Router, src/ directory structure

### Why this stack
- **Next.js** handles both frontend and backend in one project — no separate Express server needed
- **TypeScript** — Sherif already knows this from Playwright, so it's a strength not a burden
- **Tailwind CSS** — write styles directly in your HTML as class names, very fast for UI building
- **App Router** — the modern Next.js way of building pages (replaces the old Pages Router)

### Key concepts learned
- **Next.js = React + a server.** It's not just a frontend framework — it can run server-side code too
- **App Router** means your folder structure IS your routes. A file at `src/app/products/page.tsx` becomes the `/products` page automatically
- **`src/` directory** keeps your actual code separate from config files at the root

### Project structure
```
tomani-wear/
├── src/
│   └── app/
│       ├── layout.tsx     ← The shell that wraps every page (like a master template)
│       ├── page.tsx       ← The homepage (localhost:3000)
│       └── globals.css    ← Global styles
├── public/                ← Static files (images, icons)
├── next.config.ts         ← Next.js settings
├── tailwind.config.ts     ← Tailwind settings
├── tsconfig.json          ← TypeScript settings
└── package.json           ← Dependencies and scripts
```

### Commands to know
```bash
npm run dev      # Start development server → localhost:3000
npm run build    # Build for production
npm run start    # Run the production build
```

---

---

## Step 4 — Deployment, CMS & SSH Keys

### What we built
- Deployed live site to Vercel: https://tomani-wear.vercel.app
- Deployed Sanity Studio: https://tomanni-wear.sanity.studio
- Connected GitHub `dev` branch → Vercel auto-deploys on every push
- Set up Sanity webhook → calls `/api/revalidate` on every publish → live site refreshes automatically
- Replaced raw `imagePosition` text field in Sanity with visual **hotspot** focal point picker
- Set up SSH keys for passwordless GitHub authentication

### Why we built it this way

**Webhook instead of manual deploys**
Without a webhook, Tomiwa would publish a product and the live site wouldn't update until someone manually deployed. The webhook makes it automatic — publish in Sanity, live site updates within 5 seconds.

**Hotspot instead of text field**
Typing `center 25%` is not intuitive. Sanity's built-in hotspot lets Tomiwa click on the important part of the photo (face, product) and the site uses that point as the crop anchor on all screen sizes.

**SSH keys instead of tokens**
Tokens leak (one appeared in our own chat). SSH keys stay on your machine and never need to be copy-pasted anywhere.

### Key concepts learned

**Webhooks** — an automatic HTTP POST one service sends to another when something happens. Like a doorbell: Tomiwa presses Publish (rings bell) → Sanity calls our endpoint (door opens) → site refreshes.

**SSH key pair** — two files generated together:
- `~/.ssh/id_ed25519.pub` → the lock. Safe to share. Give to GitHub.
- `~/.ssh/id_ed25519` → the key. Never share. Stays on your Mac.
No password needed — your Mac and GitHub do a cryptographic handshake automatically.

**Sanity hotspot** — stores `{ x: 0.47, y: 0.31 }` (0–1 percentages). We convert to CSS:
```ts
`${hotspot.x * 100}% ${hotspot.y * 100}%`  // → "47% 31%"
```

**GROQ filters in webhooks** — Sanity's query language lets you say "only fire on product changes". We left it empty so it fires on everything.

---

## Session 2 — Hero Slides, Studio Tools & Product Schema Overhaul

### What we built

**Hero: per-device images with crop preview (`HeroFocalPreview`)**
- Each slide can now have up to 4 images: Mobile, Tablet, Desktop, Extra Large
- If you skip one, the site automatically falls back to the next smaller size (Desktop → Tablet → Mobile)
- Sanity Studio shows a visual crop preview per device — drag sliders to set where the camera "focuses" on each image
- The preview shows a yellow warning banner when displaying a fallback image, so Tomiwa knows he hasn't uploaded a dedicated image for that size yet

**Focal point sliders — why X only works for Mobile**
- The "horizontal crop" slider only makes a visible difference when the image overflows the container horizontally
- Portrait images on a wide Desktop/XL container fill the width completely — there's no overflow left/right, so horizontal dragging has no effect
- That's CSS physics (`object-fit: cover`), not a bug — we hide the X slider on Desktop/XL when showing a fallback portrait image, and show a hint explaining why

**HeroContentPreview — live text preview**
- In the "Content & Style" tab, there's now a live 16:7 preview showing exactly how the text overlay will look on the site
- Updates in real time as Tomiwa types — heading, subheading, label, button colour, and text position all reflect immediately
- Built with Sanity's `useFormValue` hook to read the document's images from outside the nested content object

**Text position sliders — vertical AND horizontal**
- Two sliders control where the text block sits on the image
- Vertical: 0 = top, 100 = bottom. Default 85 (near bottom)
- Horizontal: 0 = left, 50 = centre, 100 = right. Default 0 (left-aligned)
- The same CSS trick is used in both Studio preview and the live site: `top: Y%` + `translateY(-100%)` anchors the text block's bottom at that point; `left: X%` + `translateX(-X%)` centres the block around that point
- The sliders are built with a `makeSlider()` factory — a function that returns a function. This is like a function that creates a configured version of itself

**Settings "Untitled" fix**
- Root cause: the `global-settings` Sanity document had never been saved. Studio was always opening a fresh blank draft
- Fix: added a hidden `title` field with `initialValue: 'Settings'` to the Settings schema. Sanity applies `initialValue` to the form state for new unsaved documents, which is what `useDocumentTitle` reads
- Manual step required: Tomiwa needs to open Global Settings in Studio and click Publish once to save the document permanently

**Colour variants simplified → `colors[]`**
- Old: each colour had its own images and size list (complex, rarely needed)
- New: `colors` is just a name + hex code. Simple. Works like product tags
- Custom swatch picker UI built in `ProductEditor.tsx` — shows colour circles with × to remove, colour wheel picker + name input + Add button
- Key concept: the `<input type="color">` HTML element opens the browser's native colour picker — no library needed

**"Preview hero" button removed**
- This button opened a preview window, but it only works in local development (not in the deployed Studio)
- Removed to avoid confusion for Tomiwa

### Key concepts learned

**`useFormValue(['path'])`** — a Sanity hook that lets any component read any field in the document, even if the component is deeply nested. Like reaching up to a parent in a DOM tree.

**`makeSlider()` factory pattern** — higher-order function: a function that *returns* a component function with pre-configured settings baked in. The same pattern exists in Express: `express.Router()` creates a pre-configured router instance.

**GROQ `coalesce(a, b, c)`** — returns the first non-null value. Like `??` chaining in JavaScript but in query language. We use it so fields added after the initial build don't break old documents.

**CSS `object-fit: cover` physics** — the image fills the container, overflowing whichever axis has extra space. Crop only works on the axis that overflows. Portrait image in landscape container = only vertical overflow = only Y crop has visible effect.

**Slug vs ID** — slug (`/products/black-tee`) is the human-readable URL used in routes, SEO-friendly. `_id` is an internal UUID Sanity uses to identify the document. Always use slug for links, never `_id`.

**`<input type="color">`** — native HTML input that opens the OS colour picker. No library needed. Returns a hex string like `#c9a227`.

**Logger rule** — this project uses `pw-log` (from the shared test repo). Never use `console.log` — use the logger instead.

---

## Session 3 — Playwright CI Pipeline

### What we built
- Full Playwright e2e test infrastructure with Page Object Model
- Smoke test suite covering: Hero carousel, PDP (desktop + mobile), Cart empty state
- GitHub Actions workflow that runs smoke tests against the Vercel preview on every PR
- Custom reporters: `playwright-final-summary-reporter` (section summary table) and a live status reporter
- `pw-log` / `logr-kit` logger integrated into all page objects

### Key problems solved

**logr-kit had no compiled `dist/` in the GitHub repo**
`pw-log` is installed from `github:sherifopel/pw-log`. GitHub tarballs only include committed files — no `dist/`. Fix: added `"prepare": "tsc"` to pw-log's package.json (runs on install) and added it to `allowBuilds` in `pnpm-workspace.yaml` so pnpm permits the build script.

**CI showing 0 tests discovered**
Root cause: every spec imports `logr-kit`, which had no `dist/index.js` in CI → all spec files crashed at import → Playwright found 0 tests. Solved by the `prepare` script above.

**Vercel race condition — tests running against stale deployment**
The old CI wait step polled HTTP 200 on the branch preview URL. That URL already returns 200 from the *previous* deployment while the new one is building. Tests ran against the old code and failed even after fixes were merged.

Fix: poll the GitHub Statuses API (`/repos/{owner}/{repo}/statuses/{sha}`) for Vercel's commit status instead. Vercel posts `context: "Vercel", state: "success"` only once the new deployment is fully live.

Key gotcha: in `pull_request` events, `github.sha` is a **merge commit** GitHub creates internally — Vercel never knows about it. Use `github.event.pull_request.head.sha` (the actual branch HEAD commit) instead.

**PDP selectors broken by dual mobile/desktop rendering**
`ProductInteractive.tsx` renders the product name and price twice — once above the image (mobile, inside `md:hidden`) and once in the right column (desktop, with `hidden md:block`). This caused:
- `pdp-name` hidden on desktop (test was finding the mobile copy inside `display:none`)
- `pdp-price` strict mode violation (two elements with same testid in DOM)

Fix: gave both `<h1>` elements the same `pdp-name` testid, and added `:visible` to the selectors in the page object. Playwright's `:visible` pseudo-class filters to whichever copy is actually rendered for the current viewport — exactly one matches at a time.

---

## Session 4 — Mini Cart, Cart Page & UI Polish

### What we built

**`btn-wipe` animation (replaces `btn-collision`)**
- Two CSS pseudo-elements (`::before` from left, `::after` from right), both `width: 0` at rest
- On hover both expand to `width: 55%` simultaneously — they meet in the centre over 450ms
- The `z-index: -1` trick: pseudo-elements paint *above* the button's background but *below* the text. So the white fill slides in without covering the label
- Two variants: `btn-wipe` (black button → white fill) and `btn-wipe-white` (outlined → black fill)
- Used on: Add to Cart, Checkout button, Shop Now in hero

**Mini Cart drawer**
- Slides in from the right (`translate-x-full` → `translate-x-0`) over 300ms
- Overlay behind it (`opacity-40`) blocks the rest of the page
- Body scroll locked while open (`document.body.style.overflow = 'hidden'`)
- Escape key closes it
- Trigger points: cart icon in navbar AND after "Add to Cart" is tapped on PDP
- `miniCartOpen`, `openMiniCart`, `closeMiniCart` live in `CartContext` alongside the existing reducer state — both `useReducer` and `useState` can live in the same Context

**Cart page rewrite**
- Breadcrumbs, square product thumbnails, inline item layout
- Order summary hidden on mobile — replaced by a sticky bottom bar (`fixed bottom-0`) with Total + Checkout button
- `data-testid` on every interactive element in the order summary for Playwright tests
- `pb-28` on the page wrapper so content doesn't hide behind the sticky bar

**Navbar logo centering on mobile**
- Old: `grid-cols-[auto_1fr_auto]` — logo tried to centre within the 1fr column but left (burger) and right (icons) columns have unequal widths, so it wasn't truly centred
- Fix: `position: absolute; left: 50%; transform: translateX(-50%)` on mobile, `static` on desktop
- The logo is pulled out of grid flow on mobile so it centres relative to the full viewport width regardless of what's on either side

**Footer sticky-to-bottom fix**
- Root layout `<body>` has `min-h-full flex flex-col`
- Store layout wrapper needs `flex-1 flex flex-col` with `<main className="flex-1">` — otherwise the wrapper fills remaining height as a block but doesn't push the footer down; it just makes a huge whitespace gap

### Key concepts learned

**`z-index` and stacking contexts** — `z-index: -1` on a pseudo-element makes it render *behind the element's own background paint* — but only if the element has `position: relative` and `z-index: 1` (or `auto` depending on context). This is why `btn-wipe` works: the button has `z-index: 1`, so its stacking context is the boundary — the `z-index: -1` pseudo sits above the page background but below the button's own content.

**React Context with multiple state types** — one Context can hold both `useReducer` state (complex cart logic) and `useState` booleans (UI flags like `miniCartOpen`). Both are just JavaScript values — combine them freely in the `value` object.

**`translate-x-full` drawer pattern** — `translate-x-full` shifts an element right by 100% of its own width (off-screen). `translate-x-0` returns it. Paired with `transition-transform duration-300` this is the standard slide-in drawer pattern used by Nike, Noble Panacea, and most high-end stores.

**`position: absolute` inside a CSS Grid** — an absolutely positioned child is removed from grid flow. It positions relative to the nearest `position: relative` ancestor (the grid container). Combined with `left-1/2 -translate-x-1/2` this gives true viewport-centre placement even when the grid columns on either side are unequal widths.

---

### Key concepts learned

**pnpm `allowBuilds`** — pnpm v10's supply chain policy: git-hosted packages can't run build scripts unless explicitly listed in `pnpm-workspace.yaml`. This is like CORS but for package builds. Must use the full tarball URL + commit hash as the key.

**`github.sha` vs `github.event.pull_request.head.sha`** — in PR events, GitHub auto-creates a merge commit to preview what would happen if the PR merged. `github.sha` is that merge commit, not your real commit. External services (Vercel, Codecov) post statuses to the real branch HEAD, which is `pull_request.head.sha`.

**GitHub Statuses API vs Check Runs API** — GitHub has two separate systems for posting CI results on commits. Old services use "statuses" (`/statuses/{sha}`), newer ones use "check-runs" (`/commits/{sha}/check-runs`). `gh pr checks` shows both. Vercel uses the old statuses API.

**Playwright `:visible` pseudo-class** — Playwright extends CSS with its own pseudo-classes. `:visible` matches elements that have a real bounding box and aren't hidden by CSS. Useful when a component renders the same testid twice for responsive layouts — scope to `:visible` and only the one shown for the current viewport will match.

---

## Session 5 — PLP, Design Standards & Mobile UX

### What we built

**Product Listing Page (`/products`)**
- Server component at `src/app/(store)/products/page.tsx`
- Reads `?category=X&sort=Y` from the URL as query params
- Fetches Sanity with category-specific query or all-products query depending on the param
- JS sort for price ascending/descending after the fetch
- Grid: 2 columns on mobile → 3 on tablet → 4 on desktop
- Cards: `aspect-[3/4]` image ratio, hover zoom, Sale/Sold Out badges with rounded corners
- Empty state with "View All" CTA if no products match the filter
- No page title — the filter + sort header is enough visual context
- "Showing X of Y products" count above the grid

**Filter & Sort controls**
- `FilterDropdown` component: desktop shows a dropdown panel; mobile shows a left-side drawer (like MiniCart but from the left) with a backdrop overlay and Escape key support
- `SortDropdown` component: closes on outside click via `useRef`; mobile shows compact "Sort" + icon, desktop shows "Sort by: [label]"
- Both components build hrefs that preserve the other param — filter preserves sort, sort preserves category
- State lives in the URL, not in React state — means shareable/bookmarkable links and no state-out-of-sync bugs

**Nav links updated to `/products?category=X`**
- Changed from separate `/men`, `/women` etc. routes to query params on the PLP
- Keeps one page, one component — the category just changes what Sanity returns

**Shared `<Breadcrumbs>` component**
- Lives at `src/components/Breadcrumbs.tsx`
- Has `hidden md:flex` baked in — desktop-only, always. Never write inline breadcrumb markup on a page
- Takes `crumbs` prop: array of `{ label, href? }`. Last crumb has no href (current page)
- All existing pages updated to use it: PDP, Cart, PLP

**Quantity selector as dropdown**
- Changed from stepper buttons (`+ / −`) to a `<select>` with options 1–5
- Simpler, more mobile-friendly, no accidental taps

**Sticky Add to Cart (mobile only)**
- `md:hidden fixed bottom-0` bar with ATC button always visible on mobile PDP
- Desktop: inline row in the product info column (unchanged)
- Scroll-to-error: if the user taps ATC without selecting a size, `sizeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })` brings the size selector into view

**Mobile header freeze**
- `StickyHeader` no longer collapses the announcement bar on mobile — only on desktop
- Guard: `(suppressCompact && isDesktop) ? '0' : '3rem'` — `isDesktop` is `window.innerWidth >= 768`
- On mobile the full header (announcement bar + logo row) stays locked at the top at all times

**Mini cart removed on mobile**
- Cart icon on mobile is now a `<Link href="/cart">` — no drawer
- `NavCartButton` renders two completely separate elements: Link for mobile (`md:hidden`), button for desktop (`hidden md:flex`)
- MiniCart drawer and backdrop: `hidden md:block` / `hidden md:flex` — never rendered on mobile
- Body scroll lock guarded: `if (window.innerWidth < 768) return` so it never fires on mobile

**Logo shine animation**
- `.logo-shine` CSS class on the wordmark link
- `::after` pseudo-element: diagonal white gradient, starts off-screen left (`left: -120%`), slides right on hover (`left: 160%`) over 0.55s
- `overflow: hidden` on the parent clips the gradient so it doesn't bleed outside the text bounds
- Pure CSS — no JavaScript

**Design standards added to CLAUDE.md**
- Page layout: `max-w-7xl mx-auto px-6` — every page body uses this
- Breadcrumbs: always use the shared component, always desktop-only
- Typography: `var(--font-sans)` token, changed in `layout.tsx` only
- CTA animations: `btn-wipe` (black button) / `btn-wipe-white` (outlined/white button)
- Border radius: `rounded` (4px) default everywhere, `rounded-md` for cards/images
- Data test IDs: every element must have one in `[page]-[element]` format
- No perfect squares — all corners rounded

### Key concepts learned

**URL as state** — instead of `useState` for filter/sort, the value lives in `?category=X&sort=Y`. This means: refresh the page and the state survives; copy the URL and share it with someone; the browser Back button works as expected. Use this pattern for any UI that represents "what are you looking at" rather than "what are you doing".

**`grid-cols-[auto_1fr_auto]` in Tailwind** — custom bracket syntax lets you write any valid CSS grid template. `auto` = the column takes only as much space as its content. `1fr` = take all remaining space. Used in the Navbar: burger/region tag on left (auto), logo in middle (1fr), icons on right (auto).

**`currentColor` in SVGs** — SVG `stroke="currentColor"` inherits the text colour from CSS. If an ancestor has a light colour set, the icon becomes invisible. Fix: add `text-black` to the icons container so the stroke always inherits black regardless of ancestors.

**Two pseudo-elements, same element** — CSS `::before` and `::after` both exist on every element. `btn-wipe` uses both: `::before` expands from the left, `::after` from the right. They meet in the middle. This is why the wipe animation feels like a collision.

**`overflow: hidden` on a link** — when you put a positioned `::after` inside a link element, `overflow: hidden` clips it at the link's boundaries. This is how the logo shine works: the gradient streak sweeps across but can't spill outside the wordmark.

**Payment providers (Nigeria → Pan-Africa)**
- **Paystack** — Nigeria-first, naira-native, free to set up. Handles NGN well. Used for MVP.
- **Flutterwave** — built for all of Africa, supports 30+ currencies. When Tomanni Wear expands beyond Nigeria, payment logic is isolated to one component — swap Paystack for Flutterwave there only.
- **Stripe** — great globally but no Nigerian payouts. Not viable for a Lagos-based business.

**Tickets created: TW-29 (Checkout page) and TW-30 (Paystack integration)**

## TW-36 — Hero video support + production release v0.2.0

### What we built
- Hero slides can now use an optional looping video instead of (or alongside) device images
- Unified Studio UX: one media section inside the existing device-images component, with a "Still Images / Video" tab toggle — never two separate upload areas
- Main Heading is optional (text-only headline no longer forced); Mobile Image is no longer required once a video is set; the legacy single-image field was deleted entirely
- Fixed a white gap under the mobile hero by measuring the real header height with `ResizeObserver` and exposing it as `--header-height`, instead of guessing a fixed rem value
- Added mobile-only CSS scroll-snap (`snap-section` class + `scroll-snap-type: y mandatory` under 768px) so one swipe from the hero lands cleanly on New Arrivals
- Merged `feat/TW-36-hero-video-gif` → `dev` → `main`, tagged the result `v0.2.0`

### Why we built it that way
- Two separate upload areas (one for images, one for video) confused the editing flow in Studio — collapsing them into one tabbed component matches how the live site treats them: mutually exclusive, video takes priority when present
- Hardcoded header heights break the moment the announcement bar toggles or the header collapses — measuring the actual DOM height keeps every height-dependent calc correct without manual tuning
- Scroll-snap was scoped to mobile only via a media query so desktop's free-scroll feel is untouched

### Key concept learned
**Git tagging for production releases** — this repo had no tags before now. Tags are immutable pointers to a specific commit, separate from branches (which move). `git tag -a v0.2.0 -m "..."` + `git push origin v0.2.0` marks "this exact commit is what's live in production." Going forward: every `dev` → `main` merge gets a new tag bump (`v0.2.1`, `v0.3.0`, etc.) so we always have a rollback point and a changelog anchor without digging through commit history.

## TW-XX — Sub-nav dropdowns + Members-only carousel

### What we built
- Shared `src/lib/nav-links.ts` — single source of truth for all nav links, with optional `children` arrays for sub-categories (Men, Women, Accessories, Collections)
- Desktop dropdown: hovering a nav item reveals floating black bricks, one per sub-link. No panel background — each brick is its own independent element with solid black bg and white text, readable over any hero image
- Mobile accordion: tapping the chevron expands sub-links inline below the parent; tapping the label still navigates directly to the category page
- Sanity **Members** group in Settings: toggle on/off, carousel title, and a list of product references
- `MembersCarousel.tsx` — Embla carousel on a dark background, gold title with lock icons, only rendered when a user is logged in
- Homepage fetches `auth()` server-side and conditionally renders the carousel — guests see nothing

### Why we built it this way
- **One shared `NAV_LINKS` constant** prevents Navbar and MobileMenu from drifting out of sync — add a new category once and both update automatically
- **Floating bricks instead of a panel** — avoids the dropdown feeling like a separate page element. Each brick stands alone, making the nav feel lighter and more editorial
- **Solid black background on bricks** — transparent/frosted glass looked great on dark hero slides but washed out on light ones. Solid black is consistent regardless of what image is behind it
- **Server-side auth check on the homepage** — the carousel is never sent to the browser for a logged-out user. There's no client-side toggle that a guest could bypass with DevTools

### Key concepts learned

**Named groups in Tailwind** — `group/navitem` and `group-hover/navitem:` let you scope hover behaviour to a specific ancestor, so nested groups don't interfere with each other. Think of it like giving the hover event a name so only the right parent triggers it.

**The invisible bridge trick** — a `h-3 w-full` empty div sits between the nav link and the dropdown. It's part of the hovered element, so the cursor can cross the visual gap between link and dropdown without the hover state dropping. Without this, moving the cursor diagonally toward the dropdown would close it.

**GROQ `->` dereferencing** — in Sanity's query language, `membersCarouselProducts[]->{ name, price }` follows the reference and pulls fields from the linked document. It's the equivalent of MongoDB's `populate()` or a SQL JOIN.

**`bg-white/[0.02]` in Tailwind** — square bracket syntax lets you use arbitrary values inside utility classes. `bg-white/10` = 10% opacity white, `bg-white/[0.02]` = 2% opacity white. Useful for fine-grained transparency control.
