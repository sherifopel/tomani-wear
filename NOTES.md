# Tomani Wear — Learning Notes

A running log of everything built and learned. Updated as we go.

---

## React & Next.js — Building Blocks

Before anything else — here's how React actually works, explained simply.

---

### 1. What is React?

In vanilla JavaScript (what you know), you write code like:
```js
const div = document.createElement('div')
div.textContent = 'Hello'
document.body.appendChild(div)
```
You tell the browser **exactly what to do**, step by step.

React flips this. Instead of telling the browser what to do, you describe **what the page should look like**, and React figures out the steps itself.

```jsx
function Greeting() {
  return <div>Hello</div>
}
```

That's it. React takes your description and handles the DOM. When something changes, React figures out the minimum number of DOM updates needed — you never touch the DOM directly.

**Think of it like:** In Express, you write `res.send(html)` and Express handles the HTTP protocol. In React, you write JSX and React handles the DOM.

---

### 2. Components — The Building Blocks

A **component** is just a JavaScript function that returns some HTML (called JSX).

```tsx
function ProductCard() {
  return (
    <div>
      <img src="/shoe.jpg" alt="Shoe" />
      <p>Air Max — ₦45,000</p>
    </div>
  )
}
```

Rules:
- Function name **must start with a capital letter** (`ProductCard`, not `productCard`) — this is how React tells your components apart from regular HTML tags
- Must return **one root element** (wrap siblings in a `<div>` or empty `<>...</>` fragment)
- You use components like HTML tags: `<ProductCard />`

**Think of it like:** A component is like an Express route handler — a function you define once and call many times. The difference is it returns JSX instead of `res.send()`.

---

### 3. JSX — HTML Inside JavaScript

JSX looks like HTML but it's not — it's JavaScript. Two things to remember:

| HTML | JSX |
|---|---|
| `class="btn"` | `className="btn"` (`class` is a reserved JS word) |
| `<img>` | `<img />` (must self-close) |
| `onclick="fn()"` | `onClick={fn}` (camelCase, curly braces, no quotes) |

Curly braces `{}` let you drop JavaScript into JSX:
```tsx
const name = 'Sherif'
return <p>Hello {name}</p>      // → Hello Sherif
return <p>{2 + 2}</p>           // → 4
return <p>{inStock ? 'In Stock' : 'Sold Out'}</p>
```

---

### 4. Props — Passing Data Into Components

Props are how you pass data into a component. Like function arguments, but for components.

```tsx
// Define the component — it receives props
function ProductCard({ name, price }: { name: string; price: number }) {
  return (
    <div>
      <p>{name}</p>
      <p>₦{price.toLocaleString()}</p>
    </div>
  )
}

// Use the component — pass props like HTML attributes
<ProductCard name="Air Max" price={45000} />
<ProductCard name="Joggers" price={25000} />
```

Same component, different data. This is the whole point — write once, reuse many times.

**Think of it like:** Props are like the arguments you pass into an Express middleware function. The middleware is the same function every time; what changes is the data you hand it.

---

### 5. State — Components That Remember Things

A component re-renders (redraws itself) whenever its **state** changes. State is data that belongs to a component and can change over time.

```tsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)  // start at 0

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  )
}
```

- `useState(0)` — creates a piece of state, starting at `0`
- `count` — the current value (read this in JSX)
- `setCount` — the function to update it (calling this triggers a re-render)

**Never do `count = count + 1` directly** — React won't know the value changed and won't re-render. Always use the setter function (`setCount`).

**Think of it like:** State is like a session variable in Express (`req.session.count`). It persists across "requests" (re-renders) and changing it triggers a response (a new render).

---

### 6. Hooks — Special React Functions

Hooks are functions that start with `use`. They let you tap into React features from inside a component.

| Hook | What it does |
|---|---|
| `useState` | Stores a value that triggers re-renders when it changes |
| `useEffect` | Runs side effects (fetch data, set up timers, read the DOM) after the component renders |
| `useRef` | Stores a value that does NOT trigger re-renders (e.g. a reference to a DOM element) |
| `useContext` | Reads a value from a Context (shared global state — like a database connection pool) |

Rules for hooks:
- Only call them **at the top level** of a component — never inside an `if` or a loop
- Only call them **inside React components** (or custom hooks)

---

### 7. Server vs Client Components (Next.js specific)

This is where Next.js adds something React alone doesn't have.

| | Server Component | Client Component |
|---|---|---|
| **Runs on** | The server (Node.js) | The browser |
| **Can use** | `async/await`, databases, secrets | `useState`, `useEffect`, event handlers |
| **File** | Default — any `.tsx` file | Add `'use client'` at the top |
| **Example** | Fetching products from Sanity | Cart drawer open/close |

**The rule:** Make everything a Server Component by default. Only add `'use client'` when you need interactivity (clicks, state, effects).

**Think of it like:** Server components are like Express route handlers — they run on the server, fetch data, and return HTML. Client components are like the JavaScript you'd put in a `<script>` tag — they run in the browser and handle user interaction.

---

### 8. How Next.js App Router Works

The folder structure **is** the routes:

```
src/app/
├── page.tsx                    → /
├── layout.tsx                  → wraps every page (navbar, footer)
├── (store)/
│   └── products/
│       ├── page.tsx            → /products
│       └── [slug]/
│           └── page.tsx        → /products/black-tee  ← [slug] = dynamic segment
```

- `layout.tsx` — runs on every page. Like Express middleware that wraps every route.
- `page.tsx` — the content for that specific URL.
- `[slug]` — a dynamic segment. Next.js passes whatever is in the URL as a prop: `params.slug`.
- `(store)` — a group folder (in parentheses). Doesn't add to the URL — just organises files.

---

### 9. Data Flow — One Direction Only

React data flows **down**, never up.

```
Parent passes props ↓
  └── Child reads props
        └── Grandchild reads props
```

If a child needs to tell a parent something, it does it through a **function passed as a prop**:

```tsx
// Parent
function Parent() {
  const [open, setOpen] = useState(false)
  return <Child onOpen={() => setOpen(true)} />
}

// Child — calls the function, parent handles the state
function Child({ onOpen }: { onOpen: () => void }) {
  return <button onClick={onOpen}>Open</button>
}
```

When state needs to be shared between siblings, **lift it up** to the nearest common parent. When it needs to be shared across the whole app (like cart items or the logged-in user), use **Context** (`useContext`).

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

---

## Session 6 — Home Page Builder, Search, Nav Polish & Mid Banner Removal

### What we built

**Home Page Builder (replaces fixed Hero slides)**
- Tomiwa can now stack as many "Hero + Carousel" sections as he likes from Sanity Studio, in any order
- Each section is an object in a `sections[]` array on the `homePage` singleton document — drag to reorder, tick "Show Section" to hide without deleting
- Each section has: per-device images (Mobile / Tablet / Desktop / XL), two optional portrait/landscape videos, banner height + fit controls, full text overlay (heading, sub, label, button, per-device position sliders), and a product carousel below
- The GROQ query uses `^.filter` (parent scope reference) to filter products inside a nested sub-query — like referencing a variable from an outer function scope, but in query language

**Per-device media strategy**
- Mobile: portrait video preferred → mobile image fallback
- Tablet: tablet image → desktop video → mobile video
- Desktop: desktop image → desktop video → mobile video
- XL: XL image → desktop image → desktop video → mobile video
- Each breakpoint picks independently — so you can have a video on mobile and a still image on desktop in the same section
- On wide screens, use the "blur letterbox" technique: ffmpeg blurs and darkens the portrait video, centres it on a blurred background fill — full subject visible at any width without cropping

**SearchControl component (Noble Panacea style)**
- Desktop: search icon button in the navbar — hover reveals an oval pill that expands in from the right via `clip-path` animation (`inset(0 0 0 100% round 9999px)` → `inset(0 0 0 0%)`)
- The form is `position: absolute` so it floats over the layout — the navbar grid columns don't reflow and the logo never moves
- Mobile: tapping the icon opens a full-screen overlay with a blurred backdrop

**Nav links updated**
- Accessories: added Shoes and Boots
- All dropdowns: alphabetised (Men, Women, Accessories, Collections)
- Trousers & Joggers split into separate entries for both Men and Women

**Mid Banner removed entirely**
- Deleted: `MidBanner.tsx`, `midBanner.ts` schema, `MidBannerContentPreview.tsx`, `MID_BANNER_QUERY`, `midBannerEnabled` settings field, Studio structure item
- Root cause of Studio crash ("Schema type for 'midBanner' not found"): `sanity.config.ts` still had a hardcoded `S.document().schemaType('midBanner')` item even after the schema was deleted. Fix: remove the list item AND register the new `homePage` schema in its place

**Carousel background consistency**
- Both carousel styles (horizontal scroll strip and 2×4 grid) now have `bg-[#f9f9f9]` on the image container
- Text is always below the image — never overlaid on it

### Key concepts learned

**Sanity `^.filter` in GROQ** — when you write a sub-query inside a projection, `^` refers to the parent scope. `^.filter` reads the `filter` field of the carousel object that's currently being projected, not the product. It's how you pass a variable into a nested query — like closure variables in JavaScript.

**`position: absolute` in a CSS Grid cell** — when you remove an element from grid flow with `position: absolute`, it no longer takes up space in the grid. Other columns don't expand to fill it. The absolute element positions itself relative to the nearest `position: relative` ancestor. This is how the search form can be 320px wide while its grid cell stays icon-sized — the form grows outside its cell without pushing anything.

**`clip-path: inset()` animation** — `inset(top right bottom left)` clips a rectangle. `inset(0 0 0 100%)` clips everything from the right, hiding the element. Animating the left value from `100%` to `0%` reveals it left-to-right. Adding `round 9999px` keeps the pill shape throughout. This technique works for any shape you want to reveal without a mask image.

**Art direction vs CSS fit** — when you have fundamentally different compositions for different devices (portrait video on mobile, landscape photo on desktop), don't try to use one asset — use separate `<Image>` / `<video>` elements per breakpoint hidden with Tailwind (`block md:hidden`, `hidden md:block`). CSS `object-fit` alone can't fix a composition mismatch.

**ffmpeg blur letterbox** — portrait video on a landscape screen: instead of cropping or adding black bars, scale the video to fill the width (blurred, darkened), then overlay the original centred in the correct aspect ratio. Command: `ffmpeg -i input.mp4 -filter_complex "[0:v]scale=W:H,boxblur=20:5,colorchannelmixer=.3:.3:.3:.3:.3:.3:.3:.3:.3[bg]; [0:v]scale=-1:H[fg]; [bg][fg]overlay=(W-w)/2:(H-h)/2" output.mp4`

**Sanity singleton + Studio structure** — a "singleton" document is a Sanity document with a fixed `_id` (e.g. `home-page-singleton`). In `sanity.config.ts`, you register it as `S.document().schemaType('homePage').documentId('home-page-singleton')` so Studio always opens the same document, not a list of many. Combined with `S.defaultInitialValueTemplateItems()` filtering it out of New Document, it behaves like a settings page.

---

## Session 7 — Checkout Overhaul, Delivery Fees, Domain Launch & v0.6.0

### What we built

**Checkout page full layout overhaul**
- Layout now matches a premium editorial style (Noble Panacea reference): large `text-2xl font-light` section headings, two-column desktop grid (`1fr 380px`), mobile-first single column
- Mobile: Order Summary appears first (before the form), achieved with `order-1`/`order-2` CSS on flex children — no DOM reordering needed
- Desktop: left column = form, right column = sticky Order Summary card (`lg:sticky lg:top-24 lg:self-start`)
- Order Summary is wrapped in a bordered card (`border border-gray-200 rounded p-6`) on all viewports
- All form fields are full-width (no side-by-side layout) for clean mobile UX

**Payment section at the bottom of the form**
- Replaced the old Pay CTA inside the Order Summary card with a dedicated Payment section at the bottom of the left column
- Contains: a short trust message ("You'll be taken to Paystack..."), the Pay button, and "Secured by Paystack · 256-bit SSL" micro-copy
- One CTA on the page regardless of viewport — no sticky bottom bar, no duplicate buttons

**Nigerian delivery fee calculation by state**
- Three delivery zones defined in a `DELIVERY_ZONES` array at the top of `CheckoutForm.tsx`:
  - Lagos: ₦2,500 (same city)
  - Interstate (most states): ₦4,000
  - Remote (Adamawa, Bauchi, Borno, Gombe, Taraba, Yobe): ₦7,000
- `getDeliveryFee(state: string): number | null` — returns `null` if the field is empty (shows "Enter your state"), otherwise matches the state string against zone arrays
- Fee updates live as the user types their state
- Grand total = subtotal + delivery fee, updates in real time

**Product slug fix — no more 404s**
- 3 products had spaces in their slugs (e.g. `wind breaker jacket` → URL-encoded as `wind%20breaker%20jacket` → 404)
- Added a custom `slugify` function to the Sanity `slug` field options so all new slugs auto-hyphenate on Generate
- Existing broken slugs: Tomiwa needs to open each in Studio and click Generate to regenerate with the correct format

**MiniCart auto-close timer**
- Empty cart: closes automatically after 2 seconds
- Cart with items: closes after 10 seconds (resets on pointer interaction, pauses on hover)

**Domain `tomanni.com` launched**
- Purchased via Cloudflare Registrar (at-cost pricing, no markup)
- DNS records added manually in Cloudflare:
  - A record: `@` → `76.76.21.21` (Vercel IP), proxy OFF (grey cloud)
  - CNAME: `www` → `cname.vercel-dns.com`, proxy OFF (grey cloud)
- Vercel picked up both records; SSL certificate generated automatically
- `tomani-wear.vercel.app` remains valid as a fallback

**Release v0.6.0**
- Merged `dev` → `main` (no-ff), tagged `v0.6.0`, pushed to GitHub
- Vercel deployed automatically from the `main` branch push

### Why we built it this way

**CSS `order` for mobile reordering** — changing `order-1`/`order-2` on flex children reorders them visually without touching the HTML structure. This matters because the DOM order affects keyboard navigation and screen readers — the form should still be first in the DOM even if Order Summary appears first visually on mobile.

**Delivery zones as a flat array** — a simple array of `{ states, fee, label }` objects is easier to update than a switch statement or nested if-else. Add a new zone by adding one object. The `getDeliveryFee` function loops through it with `.some()` for a fuzzy match (handles typos like "Abuja" vs "FCT").

**Cloudflare proxy OFF** — when Cloudflare's orange cloud is ON, it proxies all traffic through Cloudflare's servers. Vercel can't verify domain ownership (it only sees Cloudflare's IP), so SSL cert issuance fails. Grey cloud = DNS only, traffic goes straight to Vercel, SSL works.

### Key concepts learned

**DNS (Domain Name System)** — the internet's phone book. Translates `tomanni.com` → `76.76.21.21`. When you type a domain, your browser asks DNS servers for the IP behind it, then connects to that IP.
- **A record** = domain → IP address (used for the apex domain `@`)
- **CNAME record** = domain → another hostname (used for `www`, points to `cname.vercel-dns.com`)
- **TTL** = Time To Live — how long DNS servers cache the record before re-checking. "Auto" lets Cloudflare decide.

**CSS `order` property** — every flex child has an implicit `order: 0`. Lower numbers appear first. `order-1` (CSS `order: 1`) appears after `order-2` would be wrong — lower `order` value = appears earlier. In Tailwind: `order-1` = appears first, `order-2` = appears second. You can flip visual order on mobile with `flex-col` + different `order` values, then restore DOM order on desktop with `lg:grid`.

**`lg:sticky lg:top-24 lg:self-start`** — three classes work together for a sticky sidebar:
- `sticky` — sticks inside its scroll container (unlike `fixed` which is viewport-relative)
- `top-24` — sticks 96px from the top of the viewport (clears the fixed navbar)
- `self-start` — tells the element to be only as tall as its content (in a grid/flex row, items stretch to match the tallest sibling by default — `self-start` prevents this so `sticky` actually kicks in)

**Lesson: buy domains through Vercel** — purchasing a domain via Vercel auto-configures DNS with zero manual steps. Third-party registrars (Cloudflare, Namecheap) require manually adding A and CNAME records. Use Vercel for future domains unless the TLD isn't available there.

---

## Session 8 — Paystack Verification, Admin Orders & Mobile Nav UX

### What we built

**Paystack server-side payment verification**
- Before saving any order to the database, the server calls Paystack's verify API: `GET https://api.paystack.co/transaction/verify/{reference}`
- Only saves the order if `data.status === 'success'` AND the amount matches
- Prevents anyone calling `/api/orders` with a fake or recycled reference
- Secret key lives in `.env.local` only — never committed to git

**Admin orders dashboard (`/admin/orders`)**
- Protected route — only emails listed in `ADMIN_EMAILS` env var can access
- Lists all orders with customer name, email, items, total, payment status, fulfilment status
- Per-order page (`/admin/orders/[id]`): status dropdown (pending → processing → shipped → delivered) + tracking number input
- PATCH route at `/api/orders/[id]` handles status updates
- `updatedAt` column added via Prisma migration using `DEFAULT NOW()` to handle existing rows

**Mobile nav UX improvements**
- Changed `>` arrows to `+` / `−` accordion icons in MobileMenu — clearer for Nigerian users unfamiliar with chevron conventions
- Accordion text set to black for readability
- iOS Safari scroll lock fix: `overflow: hidden` on body is ignored by iOS Safari. Fix: save `window.scrollY`, set `position: fixed; top: -${scrollY}px; width: 100%` on open, restore on close

**Release v0.7.0**
- Merged dev → main (no-ff), tagged v0.7.0

### Key concepts learned

**Server-side payment verification** — never trust the client. When Paystack calls back, the client sends a `reference` string. Always verify with Paystack's server directly before fulfilling an order. Amount check too — prevents paying ₦1 for a ₦50,000 order.

**`DEFAULT NOW()` in SQL migrations** — when adding a `NOT NULL` column to a table that already has rows, Postgres needs a default value for existing rows. `DEFAULT NOW()` fills them with the current timestamp. Prisma's `--create-only` flag lets you edit the raw SQL before it runs.

**iOS Safari scroll lock** — iOS Safari ignores `overflow: hidden` on `<body>`. Workaround: save `scrollY`, set `position: fixed; top: -${scrollY}px; width: 100%` to freeze the viewport, restore on close.

---

## Session 9 — Locale/Currency Switcher & UX Polish

### What we built

**Locale/currency switcher (NGN / USD / GBP)**
- Country detected via Vercel's `x-vercel-ip-country` header — no third-party service or API key needed
- Exchange rates fetched from `open.er-api.com` (free, no auth) and cached 1 hour via Next.js `revalidate: 3600`
- `CurrencyProvider` client component wraps the app — holds `currency` state and live rates
- `CurrencyContext` + `useCurrency()` hook: any component can call `formatPrice(amountNgn)` to get the converted value
- `PriceDisplay` client component bridges the gap: server components can't use hooks, so they render `<PriceDisplay priceNgn={n} />` which reads the context client-side
- User's choice persisted in `localStorage` key `tomanni-currency`

**FlagCircle SVG component (`src/components/FlagCircle.tsx`)**
- Inline SVG flags for Nigeria, UK, USA — no emoji (emoji render as waving rectangles, not clean circles)
- Parent `span` with `border-radius: 50%; overflow: hidden` clips to circle (no SVG clipPath — avoids duplicate ID bugs when multiple flags render simultaneously)
- UK flag uses `viewBox="0 0 120 60"` (correct 2:1 ratio) + `preserveAspectRatio="xMidYMid slice"` — like `object-fit: cover` for SVG

**CurrencySwitcher redesign (Noble Panacea style)**
- Left side of navbar: circular flag + `NG | NGN` label + chevron
- Dropdown uses `position: fixed` with `getBoundingClientRect()` coordinates — escapes `overflow: hidden` on StickyHeader without needing a React portal
- Outside-click handler checks both the button ref AND the dropdown ref — prevents `mousedown` from closing the dropdown before the button's `onClick` fires (classic timing bug)

**Announcement bar flash fix**
- `announcement-slide` keyframe starts at `opacity: 0` — caused black bar flash on every page load
- Fix: `hasRotated` state starts `false`; animation class only applied after first rotation fires

**Coming Soon empty PLP state**
- Category pages with no products show: category name eyebrow → "Coming Soon" heading → message → "Shop All" CTA
- Header (title, sort dropdown, count) hidden when the coming-soon state is active
- Search with no results still shows "No products found" (different user intent)

**Pants rename**
- "Trousers" → "Pants" in nav links, PLP labels, and Sanity Studio
- URL slug `type=trousers` unchanged — no broken links

### Key concepts learned

**Vercel geo headers** — Vercel automatically injects `x-vercel-ip-country` on every server-side request (e.g. "NG", "GB", "US"). Read it in a Server Component via `headers()` from `next/headers`. Free, zero config, no third-party service.

**`position: fixed` vs React portal** — `position: fixed` elements are NOT clipped by `overflow: hidden` ancestors (unless the ancestor uses `transform`/`filter`/`will-change`). This makes it a cleaner alternative to `createPortal` for dropdowns trapped inside overflow-hidden containers — no context boundary issues, stays in the React tree.

**`mousedown` vs `click` timing** — `mousedown` fires before `click`. If you close a dropdown on `mousedown`, the button unmounts before `click` fires and the `onClick` never runs. Fix: in your outside-click handler, check if the click target is inside the dropdown itself, and skip closing if it is.

**React Context for global UI state** — `CurrencyContext` shares currency + formatPrice across the whole app. Like Express middleware that stamps `req.currency` on every request — any route handler (component) can read it without the caller passing it in.

**SVG `preserveAspectRatio="xMidYMid slice"`** — scales an SVG to fill its container, cropping the excess. Identical to `object-fit: cover`. Essential when your SVG's natural ratio (e.g. 2:1 flag) doesn't match the container (1:1 circle).

---

## Session 10 — Ambient Audio, Sanity Custom Components & Accessibility

### What we built

**Ambient audio player on hero sections**
- Each home section in Sanity can now have an optional audio file, with controls for: start time, snippet length (30s / 60s / 120s / full), and repeat behaviour (loop / once)
- `AudioPlayer.tsx` — a `'use client'` component with a mute/unmute toggle button in the bottom-right corner of the hero
- Browser autoplay policy means audio always starts muted (browsers block autoplay with sound). The user taps the 🔇 icon to unmute — that tap counts as a user gesture so the browser allows it
- `timeupdate` event (fires ~4×/sec) detects when the snippet should end; `ended` event fires when the full track finishes naturally
- `IntersectionObserver` on the button: if the hero scrolls off screen, the 30-second replay timer does NOT fire — saves the user from hearing audio unexpectedly
- **Mobile z-index bug fix**: the button (`z-10`) and the text overlay (`z-10`) shared the same stacking order. The text overlay was later in the DOM, so even though it didn't visually cover the button, it captured all touch events. Fix: bumped button to `z-20`

**Sanity custom component lesson — `AnnouncementBannersInput`**
- The announcement bar had a custom React component (`AnnouncementBannersInput.tsx`) that completely replaced Sanity's default field renderer
- Adding a new field (`href`) to the schema did nothing — because the custom component hardcoded which fields it showed. Sanity's schema is just a type definition; the custom component decides what actually appears in Studio
- Fix: add the `href` input row directly inside `AnnouncementBannersInput.tsx`, alongside message and theme

**Clickable announcement banners**
- Added `href?: string` to the Banner type in both schema and custom component
- `RotatingAnnouncementBar.tsx`: when `href` is set, the entire bar renders as a `<Link>` instead of a `<div>`
- GROQ query updated to fetch `href` alongside message and theme

**WCAG 2.1 AA accessibility audit + automated test suite**
- Added `@axe-core/playwright` — runs axe accessibility checks in Playwright tests
- `accessibility.page.ts` PO: `navigate()` + `assertNoA11yViolations()` — scans with tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`
- `accessibility.spec.ts` — tests 6 pages × 2 viewports (desktop + mobile) = 12 tests; plus 1 smoke test
- Reporter section added: `{ key: 'a11y', label: 'Accessibility', matchers: ['@a11y'] }`
- Contrast fixes across 39 files: `text-gray-400` → `text-gray-500` (contrast ratio goes from 2.6:1 to 5.7:1 — WCAG AA requires 4.5:1); nav background `bg-gray-100` → `bg-white`

### Key concepts learned

**Browser autoplay policy** — browsers block audio that starts without a user gesture (tap or click). The workaround: start audio muted (`<audio muted autoPlay />`), then unmute on the first tap. The mute toggle itself is the user gesture, which satisfies the browser's requirement.

**DOM order in z-index ties** — when two sibling elements have the same `z-index`, the one that appears **later in the HTML** sits on top. This is rarely visible on desktop (pointer events follow the cursor accurately) but on mobile all touch events go to the topmost element at that coordinate. Fix: give the element that needs to receive touches a higher z-index.

**Sanity custom components bypass the schema renderer** — Sanity's Studio reads your schema to know what fields exist, but if you register a custom `components.input`, that component takes full control of rendering. No amount of schema changes will make new fields appear until you update the component too.

**WCAG contrast ratios** — WCAG 2.1 AA requires:
- Normal text: 4.5:1 minimum ratio against background
- Large text (18px+ or 14px+ bold): 3:1 minimum
- `text-gray-400` (#9ca3af on white) = 2.56:1 → **fail**
- `text-gray-500` (#6b7280 on white) = 4.6:1 → **pass**
Tool: WebAIM Contrast Checker. Check every muted/placeholder text colour before shipping.

**axe-core vs manual audit** — axe catches structural issues (contrast, missing alt text, missing labels, ARIA errors) automatically. It does NOT catch UX issues (confusing navigation, poor copy, bad tab order that's technically valid). Use both: axe for compliance, human review for usability.

---

## Session 11 — Checkout Polish, Guest Delivery Fee & Cart Image Fix

### What we built

**Guest delivery fee — conversion incentive**
- Guests pay ₦7,500 flat delivery fee; registered users get free delivery on every order
- Simple `getDeliveryFee(isLoggedIn: boolean)` function replaces the old zone-based system
- Order Summary shows a nudge for guests: "Sign in or create an account for free delivery"
- The nudge links to `/sign-in?callbackUrl=/checkout` — after signing in, user is automatically redirected back to checkout. The sign-in page already supported `callbackUrl` query param; no extra code needed there

**Why this works as a conversion tool** — the guest sees the ₦7,500 fee at the exact moment of highest purchase intent (checkout). The "Sign in for free delivery" nudge removes a real cost with zero friction. This is the same mechanic used by ASOS, Zara, and other large retailers.

**Product images in checkout order summary**
- Root cause: `CartItem` database table had no `imageUrl` column. When a logged-in user's cart loaded from the database, every item came back with `image: undefined` → checkout showed grey placeholders
- Fix: added `imageUrl String?` to the Prisma `CartItem` model, ran migration, updated `/api/cart/merge` to save and return the image field
- Items added to cart while logged in were already in localStorage with images (fine); items loaded from DB after login had no image (broken). The migration fixes it going forward — existing DB rows need to be re-added to get images

**Mobile scroll-to-first-error on checkout**
- When the user taps Pay with empty fields, the page now scrolls smoothly to the first invalid field
- Implementation: refactored `validate()` to return the errors map (instead of just `true/false`), so `handleSubmit` can read which fields failed without waiting for React state to update
- Field priority order: `fullName → email → phone → address → city → state → country`
- `document.getElementById(firstError)?.scrollIntoView({ behavior: 'smooth', block: 'center' })` brings the field to the centre of the screen

**Test discount code `TEST10`**
- Created via a Prisma seed script (`scripts/seed-test-discount.ts`)
- 10% off, 9,999 uses, no expiry — effectively unlimited for testing
- Lives in the shared Supabase DB so it works in both local dev and production (but only you know the code)

### Key concepts learned

**`callbackUrl` query param in NextAuth** — the sign-in page reads `?callbackUrl=/checkout` from the URL and redirects there after a successful login. This is built into NextAuth — you just need to pass the right URL. Pattern: any link that sends a user to sign in should include `?callbackUrl=<where they were>` so they land back where they started.

**Prisma schema migration flow** — when you add a column to a model:
1. Edit `prisma/schema.prisma` (add the field)
2. `npx prisma migrate dev --name description` — creates and applies the SQL migration, updates the DB
3. `npx prisma generate` — regenerates the TypeScript client so your code knows about the new column
4. Update any API routes that read/write that model

**Why `validate()` should return the errors map** — if `validate()` only returns `boolean`, the caller can't know *which* fields failed without re-checking. Returning the errors object means one source of truth: the caller gets the errors, sets them in state, AND uses them for scroll targeting — all from one function call.

**Database columns vs localStorage** — localStorage is per-browser. The database is per-user. When you're logged in, your cart comes from the DB. If the DB doesn't store a field (like `imageUrl`), it's gone the moment the cart is loaded from the server — even if it was in localStorage before. Always check: "if this data comes from the DB, does the DB schema have a column for it?"
