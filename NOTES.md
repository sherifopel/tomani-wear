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

*More notes will be added here as we build...*
