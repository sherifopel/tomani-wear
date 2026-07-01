import { groq } from 'next-sanity'

export const PRODUCTS_QUERY = groq`*[_type == "product"] | order(_createdAt asc) {
  _id,
  name,
  "slug": slug.current,
  price,
  compareAtPrice,
  inStock,
  "image": coalesce(
    productImages[isMain == true][0].image.asset->url,
    productImages[0].image.asset->url,
    image.asset->url,
    gallery[0].asset->url
  ),
  description,
  category
}`

export const PRODUCTS_BY_CATEGORY_QUERY = groq`*[_type == "product" && category == $category] | order(_createdAt asc) {
  _id,
  name,
  "slug": slug.current,
  price,
  compareAtPrice,
  inStock,
  "image": coalesce(
    productImages[isMain == true][0].image.asset->url,
    productImages[0].image.asset->url,
    image.asset->url,
    gallery[0].asset->url
  ),
  description,
  category
}`

export const HERO_SLIDES_QUERY = groq`*[_type == "heroSlide" && enabled != false] | order(order asc, _createdAt asc) {
  _id,
  "label":    coalesce(content.label,    label),
  "heading":  coalesce(content.heading,  heading),
  "sub":      coalesce(content.sub,      sub),
  "href":     coalesce(content.href,     href),
  "videoUrl":     focalPoints.video.asset->url,
  "imageMobile":  focalPoints.imageMobile,
  "imageTablet":  coalesce(focalPoints.imageTablet,  focalPoints.imageMobile),
  "imageDesktop": coalesce(focalPoints.imageDesktop, focalPoints.imageTablet,  focalPoints.imageMobile),
  "imageXl":      coalesce(focalPoints.imageXl,      focalPoints.imageDesktop, focalPoints.imageTablet,  focalPoints.imageMobile),
  "mobileFocalY":  coalesce(focalPoints.mobile,   50),
  "tabletFocalY":  coalesce(focalPoints.tablet,   50),
  "desktopFocalY": coalesce(focalPoints.desktop,  30),
  "xlFocalY":      coalesce(focalPoints.xlarge,   30),
  "mobileFocalX":  coalesce(focalPoints.mobileX,  50),
  "tabletFocalX":  coalesce(focalPoints.tabletX,  50),
  "desktopFocalX": coalesce(focalPoints.desktopX, 50),
  "xlFocalX":      coalesce(focalPoints.xlargeX,  50),
  "textPosition":         coalesce(content.textPosition,         textPosition,  85),
  "textPositionX":        coalesce(content.textPositionX,        textPositionX, 0),
  "mobileTextPosition":   coalesce(content.mobileTextPosition,   content.textPosition,  textPosition,  85),
  "mobileTextPositionX":  coalesce(content.mobileTextPositionX,  content.textPositionX, textPositionX, 0),
  "tabletTextPosition":   coalesce(content.tabletTextPosition,   content.textPosition,  textPosition,  85),
  "tabletTextPositionX":  coalesce(content.tabletTextPositionX,  content.textPositionX, textPositionX, 0),
  "desktopTextPosition":  coalesce(content.desktopTextPosition,  content.textPosition,  textPosition,  85),
  "desktopTextPositionX": coalesce(content.desktopTextPositionX, content.textPositionX, textPositionX, 0),
  "xlTextPosition":       coalesce(content.xlTextPosition,       content.textPosition,  textPosition,  85),
  "xlTextPositionX":      coalesce(content.xlTextPositionX,      content.textPositionX, textPositionX, 0),
  "textColor":            coalesce(content.textColor,            textColor,     "white"),
  "buttonColor":          coalesce(content.buttonColor,          buttonColor,   "white"),
  "buttonCustomColor":    content.buttonCustomColor,
  "buttonBackgroundColor": content.buttonBackgroundColor
}`

export const PRODUCT_BY_SLUG_QUERY = groq`*[_type == "product" && slug.current == $slug][0] {
  _id,
  name,
  "slug": slug.current,
  price,
  compareAtPrice,
  "image": coalesce(
    productImages[isMain == true][0].image.asset->url,
    productImages[0].image.asset->url,
    image.asset->url,
    gallery[0].asset->url
  ),
  "hotspot": coalesce(
    productImages[isMain == true][0].image.hotspot,
    productImages[0].image.hotspot,
    image.hotspot,
    gallery[0].hotspot
  ),
  "gallery": select(
    defined(productImages[0]) => productImages[isMain != true][]{
      "url": image.asset->url,
      "hotspot": image.hotspot
    },
    defined(gallery[0]) => gallery[]{
      "url": asset->url,
      "hotspot": hotspot
    },
    []
  ),
  "colors": colors[]{ colorName, colorHex },
  description,
  category,
  sizes,
  shoeSizes,
  inStock,
  featured
}`

export const SETTINGS_QUERY = groq`*[_id == "global-settings"][0] {
  announcementBar,
  announcementBars,
  announcementBarEnabled,
  heroAutoplay,
  heroShowArrows,
  heroSlideInterval,
  footerLinks[]{
    label,
    href
  },
  socialLinks[]{
    platform,
    url
  },
  membersCarouselEnabled,
  membersCarouselTitle,
  "membersCarouselProducts": membersCarouselProducts[]->{
    _id,
    name,
    "slug": slug.current,
    price,
    compareAtPrice,
    inStock,
    "image": coalesce(
      productImages[isMain == true][0].image.asset->url,
      productImages[0].image.asset->url,
      image.asset->url,
      gallery[0].asset->url
    )
  }
}`
