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
