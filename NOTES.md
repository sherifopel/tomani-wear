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

*More notes will be added here as we build...*
