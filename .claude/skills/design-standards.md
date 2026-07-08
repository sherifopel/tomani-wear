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
- **Sentence case, no uppercase, no tracking-widest** — breadcrumb labels display as written, not transformed

## Case — the one rule

**`uppercase` is banned everywhere except the logo.**

| Element | Rule |
|---|---|
| Logo (`Navbar.tsx`, `Footer.tsx`) | `uppercase` — only place it's allowed |
| Nav links, headings, buttons, labels, body text, badges, breadcrumbs | Sentence case — never `uppercase` |
| `tracking-widest` | Only on the logo — remove it everywhere else |

When writing or touching any component, never add `uppercase` or `tracking-widest` to non-logo elements.

---

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

## Forms

These rules apply to every form in the project — checkout, profile, sign-in, address, returns, or any future form.

### Labels
- **Sentence case only** — never all-caps. Write `Full name`, not `FULL NAME`
- **12px, gray-500** — use exactly `text-[12px] text-gray-500`
- **No `uppercase` or `tracking-widest`** on labels — those are for headings and nav only

### Required indicator
Every required field must show a `Required` label on the same row as the field label, right-aligned, at 12px gray:

```tsx
function RequiredLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-1.5">
      <label htmlFor={htmlFor} className="text-[12px] text-gray-500">{children}</label>
      <span className="text-[12px] text-gray-400">Required</span>
    </div>
  )
}
```

Use `<RequiredLabel>` for every required field. Only use a plain `<label>` for optional fields (and note it as "Optional" in the same right-aligned pattern if context needs it).

### Placeholders
**No placeholder text on any input.** The label is enough. Placeholders create false impressions of pre-filled data and disappear the moment the user starts typing.

### Input style
All inputs share one base class — define it as a constant, never repeat it inline:

```tsx
const inputClass = `
  w-full px-4 py-3 border border-gray-300 rounded text-sm
  focus:outline-none focus:border-black transition-colors duration-200
`
```

### Validation errors
- Show errors **below** the input they belong to
- 12px, red-500, `mt-1`
- Write full sentences, not terse codes: `"Please enter a valid email address"` not `"Invalid email"`
- Clear the error for a field as soon as the user starts typing in it (`handleChange` pattern)
- Use `data-testid="[form]-error-[fieldName]"` on every error element

```tsx
{errors.email && (
  <p className="text-xs text-red-500 mt-1" data-testid="checkout-error-email">
    {errors.email}
  </p>
)}
```

### Field validation rules

| Field | Rule |
|---|---|
| Email | `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` — separate "empty" and "invalid" messages |
| Phone (Nigerian) | `/^(\+?234\|0)[789]\d{9}$/` after stripping spaces — accepts `08012345678`, `+2348012345678`, `2348012345678` |
| All required text fields | Non-empty after `.trim()` |

### noValidate
Always add `noValidate` to the `<form>` tag so browser native validation doesn't clash with our custom errors:
```tsx
<form onSubmit={handleSubmit} noValidate>
```

---

## Carousel
- All carousels use **Embla Carousel** (`embla-carousel-react`)
- Use the shared `<CardCarousel>` component (once built) — never write one-off carousel logic
- `Hero.tsx` is the only exception — stays standalone due to full-bleed image complexity
