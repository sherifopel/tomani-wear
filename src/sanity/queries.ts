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
  "image": image.asset->url,
  label,
  heading,
  sub,
  "href": coalesce(href, "/products"),
  "position": coalesce(imagePosition, "center center")
}`

export const SETTINGS_QUERY = groq`*[_type == "settings"][0] {
  announcementBar,
  announcementBars,
  announcementBarEnabled
}`
