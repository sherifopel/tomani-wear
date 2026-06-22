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
  // New per-device images from focalPoints, falling back to legacy top-level fields
  "image":         coalesce(focalPoints.desktopImage, image),
  "mobileImage":   coalesce(focalPoints.mobileImage,  mobileImage),
  "mediumImage":   coalesce(focalPoints.tabletImage,   mediumImage),
  "extraLargeImage": coalesce(focalPoints.xlImage,    extraLargeImage),
  label,
  heading,
  sub,
  "href": coalesce(href, "/products"),
  "focalPoints": coalesce(focalPoints, {"mobile": 50, "tablet": 50, "desktop": 30}),
  "desktopFocalY": coalesce(focalPoints.desktop, desktopFocalY, 30),
  "tabletFocalY":  coalesce(focalPoints.tablet, 50),
  "mobileFocalY":  coalesce(focalPoints.mobile, 50)
}`

export const PRODUCT_BY_SLUG_QUERY = groq`*[_type == "product" && slug.current == $slug][0] {
  _id,
  name,
  "slug": slug.current,
  price,
  compareAtPrice,
  "image": image.asset->url,
  "hotspot": image.hotspot,
  description,
  category,
  sizes,
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
