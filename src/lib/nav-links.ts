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
      { label: 'Hoodies',  href: '/products?category=men&type=hoodies' },
      { label: 'Jackets',  href: '/products?category=men&type=jackets' },
      { label: 'Joggers',  href: '/products?category=men&type=joggers' },
      { label: 'Shirts',   href: '/products?category=men&type=shirts' },
      { label: 'Shorts',   href: '/products?category=men&type=shorts' },
      { label: 'Trousers', href: '/products?category=men&type=trousers' },
    ],
  },
  {
    label: 'Women',
    href: '/products?category=women',
    underlineColor: 'var(--brand-red)',
    children: [
      { label: 'Dresses',  href: '/products?category=women&type=dresses' },
      { label: 'Jackets',  href: '/products?category=women&type=jackets' },
      { label: 'Joggers',  href: '/products?category=women&type=joggers' },
      { label: 'Shorts',   href: '/products?category=women&type=shorts' },
      { label: 'Tops',     href: '/products?category=women&type=tops' },
      { label: 'Trousers', href: '/products?category=women&type=trousers' },
    ],
  },
  {
    label: 'Accessories',
    href: '/products?category=accessories',
    underlineColor: 'var(--brand-black)',
    children: [
      { label: 'Bags',  href: '/products?category=accessories&type=bags' },
      { label: 'Belts', href: '/products?category=accessories&type=belts' },
      { label: 'Boots', href: '/products?category=accessories&type=boots' },
      { label: 'Hats',  href: '/products?category=accessories&type=hats' },
      { label: 'Shoes', href: '/products?category=accessories&type=shoes' },
    ],
  },
  {
    label: 'Collections',
    href: '/products?category=collections',
    underlineColor: 'var(--brand-yellow)',
    children: [
      { label: 'Archives', href: '/products?category=archives' },
    ],
  },
  {
    label: 'Sale',
    href: '/products?category=sale',
    underlineColor: 'var(--brand-red)',
    accent: true,
  },
]
