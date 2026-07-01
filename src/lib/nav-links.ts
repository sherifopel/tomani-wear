export type NavChild = {
  label: string
  href: string
}

export type NavLink = {
  label: string
  href: string
  underlineColor?: string
  accent?: boolean
  children?: NavChild[]
}

export const NAV_LINKS: NavLink[] = [
  {
    label: 'New In',
    href: '/products?category=new',
    underlineColor: 'var(--brand-black)',
  },
  {
    label: 'Men',
    href: '/products?category=men',
    underlineColor: 'var(--brand-yellow)',
    children: [
      { label: 'Shirts',              href: '/products?category=men&type=shirts' },
      { label: 'Hoodies',             href: '/products?category=men&type=hoodies' },
      { label: 'Shorts',              href: '/products?category=men&type=shorts' },
      { label: 'Trousers & Joggers',  href: '/products?category=men&type=trousers' },
    ],
  },
  {
    label: 'Women',
    href: '/products?category=women',
    underlineColor: 'var(--brand-red)',
    children: [
      { label: 'Tops',               href: '/products?category=women&type=tops' },
      { label: 'Dresses',            href: '/products?category=women&type=dresses' },
      { label: 'Shorts',             href: '/products?category=women&type=shorts' },
      { label: 'Trousers & Joggers', href: '/products?category=women&type=trousers' },
    ],
  },
  {
    label: 'Accessories',
    href: '/products?category=accessories',
    underlineColor: 'var(--brand-black)',
    children: [
      { label: 'Bags',  href: '/products?category=accessories&type=bags' },
      { label: 'Hats',  href: '/products?category=accessories&type=hats' },
      { label: 'Belts', href: '/products?category=accessories&type=belts' },
    ],
  },
  {
    label: 'Collections',
    href: '/products?category=collections',
    underlineColor: 'var(--brand-yellow)',
    children: [
      { label: 'Summer Collection 2025', href: '/products?collection=summer-2025' },
      { label: 'Summer Collection 2024', href: '/products?collection=summer-2024' },
    ],
  },
  {
    label: 'Sale',
    href: '/products?category=sale',
    underlineColor: 'var(--brand-red)',
    accent: true,
  },
]
