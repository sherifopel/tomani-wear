import { groq } from 'next-sanity'

export const PRODUCTS_QUERY = groq`*[_type == "product"] | order(_createdAt asc) {
  _id,
  name,
  "slug": slug.current,
  price,
  "image": image.asset->url,
  description,
  category
}`

export const HERO_SLIDES_QUERY = groq`*[_type == "heroSlide" && enabled != false] | order(order asc, _createdAt asc) {
  _id,
  image,
  label,
  heading,
  sub,
  "href": coalesce(href, "/products"),
  "mobileFocalY":  coalesce(focalPoints.mobile,  50),
  "tabletFocalY":  coalesce(focalPoints.tablet,  50),
  "desktopFocalY": coalesce(focalPoints.desktop, 30)
}`

export const PRODUCT_BY_SLUG_QUERY = groq`*[_type == "product" && slug.current == $slug][0] {
  _id,
  name,
  "slug": slug.current,
  price,
  compareAtPrice,
  "image": image.asset->url,
  "hotspot": image.hotspot,
  "gallery": gallery[]{ "url": asset->url, hotspot },
  "variants": variants[]{ colorName, colorHex, "images": images[]{ "url": asset->url, hotspot }, sizes },
  description,
  category,
  sizes,
  shoeSizes,
  inStock,
  featured
}`

export const SETTINGS_QUERY = groq`*[_type == "settings"][0] {
  announcementBar,
  announcementBars,
  announcementBarEnabled,
  heroAutoplay,
  heroShowArrows
}`
