# Tomani Wear — Design Standards

Always enforce these on every component — new or touched.

## Page Layout
Every page wraps content in the standard body container:
```tsx
<div className="max-w-7xl mx-auto px-6">
  {/* content */}
</div>
```
`<Breadcrumbs>` must always sit **inside** this container, never outside it.

## Breadcrumbs
- Use the shared `<Breadcrumbs crumbs={[...]} />` component — never write inline breadcrumb nav elements
- Desktop-only: the `hidden md:flex` rule is baked into the component, never override it

## Typography / Fonts
- Site font controlled by a single token: `--font-sans` in `globals.css`
- `--font-sans` maps to `--font-montserrat` (set in `layout.tsx` via Next.js font loader)
- **To change the font**: update the import in `src/app/layout.tsx` only
- Never hardcode `font-family` anywhere — always use Tailwind's `font-sans` class or the CSS variable

## CTA Button Animations
Two classes in `globals.css` — always use one, never write custom hover styles:

| Class | Use case | Effect |
|---|---|---|
| `btn-wipe` | Dark button (black bg) | White fills in from both edges on hover, text turns black |
| `btn-wipe-white` | Light/outlined button | Black fills in from both edges on hover, text turns white |

Example: `className="bg-black text-white border border-black btn-wipe"`

## Border Radius
**No perfect square corners anywhere.** Every button, input, card, badge, dropdown, and panel must have rounded corners.

| Element | Class |
|---|---|
| Buttons, inputs, filter pills, dropdowns | `rounded` (4px) |
| Cards / image wrappers | `rounded-md` (6px) |
| Badges / tags | `rounded` (4px) |

Never use zero border-radius on any visible UI element.

## Data Test IDs
**Every meaningful element must have a `data-testid`** — no exceptions.

- Format: `kebab-case`, scoped to component — e.g. `cart-checkout-button`, `pdp-size-selector`
- Pattern: `[page/component]-[element]`
- Cover: headings, images, buttons, links, form inputs, error messages, empty states, loading states

Examples:
- `pdp-add-to-cart`, `pdp-size-S`, `pdp-breadcrumb`
- `cart-item`, `cart-subtotal`, `cart-checkout-button`
- `nav-logo-link`, `nav-cart-button`, `nav-search-button`
- `plp-product-card`, `plp-product-name`, `plp-product-price`

Never use generic ids like `button-1` or `item`.

Add `data-testid` to every element when writing new components, and add missing ones when touching existing components.

## Carousel
- All carousels use **Embla Carousel** (`embla-carousel-react`)
- Use the shared `<CardCarousel>` component (once built) — never write one-off carousel logic
- `Hero.tsx` is the only exception — stays standalone due to full-bleed image complexity
