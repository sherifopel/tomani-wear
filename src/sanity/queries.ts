import { groq } from 'next-sanity'

// Sanity image transformation params appended to every asset->url so Sanity's
// CDN serves a pre-resized WebP instead of the full-size original.
// Next.js <Image> then further optimises from this smaller source — not from a
// raw 8 MB phone photo — which is what was burning through the 100 GB quota.
// GROQ string literals — the outer JS quotes wrap inner GROQ double-quotes so that
// ${IMG_CARD} interpolates as a valid quoted GROQ string, not a bare token.
const IMG_CARD = '"?w=800&auto=format&fit=max&q=80"'   // product cards / carousels
const IMG_PDP  = '"?w=1200&auto=format&fit=max&q=85"'  // PDP main image + gallery

export const NEW_IN_PRODUCTS_QUERY = groq`*[_type == "product" && ("new-in" in coalesce(categories, []) || newIn == true)] | order(orderRank asc) {
  _id,
  name,
  "slug": slug.current,
  price,
  compareAtPrice,
  inStock,
  "image": coalesce(
    productImages[isMain == true][0].cloudinaryUrl,
    productImages[0].cloudinaryUrl,
    productImages[isMain == true][0].image.asset->url + ${IMG_CARD},
    productImages[0].image.asset->url + ${IMG_CARD},
    image.asset->url + ${IMG_CARD},
    gallery[0].asset->url + ${IMG_CARD}
  ),
  description,
  category,
  _createdAt,
  "productType": coalesce(menType, womenType, accessoriesType)
}`

export const PRODUCTS_QUERY = groq`*[_type == "product"] | order(orderRank asc) {
  _id,
  name,
  "slug": slug.current,
  price,
  compareAtPrice,
  inStock,
  "image": coalesce(
    productImages[isMain == true][0].cloudinaryUrl,
    productImages[0].cloudinaryUrl,
    productImages[isMain == true][0].image.asset->url + ${IMG_CARD},
    productImages[0].image.asset->url + ${IMG_CARD},
    image.asset->url + ${IMG_CARD},
    gallery[0].asset->url + ${IMG_CARD}
  ),
  description,
  category,
  _createdAt,
  "productType": coalesce(menType, womenType, accessoriesType)
}`

export const PRODUCTS_BY_CATEGORY_QUERY = groq`*[_type == "product"
  && ($category == "" || $category in coalesce(categories, []) || category == $category || ($category == "new" && ("new-in" in coalesce(categories, []) || newIn == true)) || ($category == "sale" && compareAtPrice > price))
  && ($type == "" || menType == $type || womenType == $type || accessoriesType == $type || categoryTypes[category == $category][0].type == $type)
  && ($q == "" || name match $q || description match $q || menType match $q || womenType match $q || accessoriesType match $q)
] | order(orderRank asc) {
  _id,
  name,
  "slug": slug.current,
  price,
  compareAtPrice,
  inStock,
  "image": coalesce(
    productImages[isMain == true][0].cloudinaryUrl,
    productImages[0].cloudinaryUrl,
    productImages[isMain == true][0].image.asset->url + ${IMG_CARD},
    productImages[0].image.asset->url + ${IMG_CARD},
    image.asset->url + ${IMG_CARD},
    gallery[0].asset->url + ${IMG_CARD}
  ),
  description,
  category,
  _createdAt,
  "productType": coalesce(menType, womenType, accessoriesType)
}`


export const HOME_SECTIONS_QUERY = groq`*[_type == "homePage"][0] {
  sections[enabled != false] {
    _key,
    title,
    "imageMobile":  coalesce(focalPoints.imageMobileCloudinaryUrl,  focalPoints.imageMobile.asset->url  + "?w=800&auto=format&fit=max&q=85"),
    "imageTablet":  coalesce(focalPoints.imageTabletCloudinaryUrl,  coalesce(focalPoints.imageTablet.asset->url,  focalPoints.imageMobile.asset->url) + "?w=1200&auto=format&fit=max&q=85"),
    "imageDesktop": coalesce(focalPoints.imageDesktopCloudinaryUrl, coalesce(focalPoints.imageDesktop.asset->url, focalPoints.imageTablet.asset->url,  focalPoints.imageMobile.asset->url) + "?w=1600&auto=format&fit=max&q=85"),
    "imageXl":      coalesce(focalPoints.imageXlCloudinaryUrl,      coalesce(focalPoints.imageXl.asset->url,      focalPoints.imageDesktop.asset->url, focalPoints.imageTablet.asset->url, focalPoints.imageMobile.asset->url) + "?w=1920&auto=format&fit=max&q=85"),
    "videoUrl":        focalPoints.video.asset->url,
    "videoDesktopUrl": focalPoints.videoDesktop.asset->url,
    "audioUrl":        audio.asset->url,
    audioStart,
    audioSnippetLength,
    audioRepeat,
    "mobileFocalY":  coalesce(focalPoints.mobile,   50),
    "tabletFocalY":  coalesce(focalPoints.tablet,   50),
    "desktopFocalY": coalesce(focalPoints.desktop,  30),
    "xlFocalY":      coalesce(focalPoints.xlarge,   30),
    "mobileFocalX":  coalesce(focalPoints.mobileX,  50),
    "tabletFocalX":  coalesce(focalPoints.tabletX,  50),
    "desktopFocalX": coalesce(focalPoints.desktopX, 50),
    "xlFocalX":      coalesce(focalPoints.xlargeX,  50),
    heights,
    content,
    "carousel": carousel {
      title,
      viewAllLink,
      style,
      filter,
      filterMenType,
      filterWomenType,
      filterAccessoriesType,
      filterTag,
      limit,
      "products": *[_type == "product" && (
        // Tag mode — overrides category + type
        (defined(^.filterTag) && ^.filterTag in coalesce(tags, [])) ||
        // Category mode — only runs when no tag filter is set
        (!defined(^.filterTag) && (
          ^.filter == "all" ||
          (^.filter == "new"         && ("new-in" in coalesce(categories, []) || newIn == true)) ||
          (^.filter == "sale"        && defined(compareAtPrice) && compareAtPrice > price) ||
          (^.filter == "men"         && ("men"         in coalesce(categories, []) || category == "men")         && (!defined(^.filterMenType)         || ^.filterMenType         == "" || menType         == ^.filterMenType)) ||
          (^.filter == "women"       && ("women"       in coalesce(categories, []) || category == "women")       && (!defined(^.filterWomenType)       || ^.filterWomenType       == "" || womenType       == ^.filterWomenType)) ||
          (^.filter == "accessories" && ("accessories" in coalesce(categories, []) || category == "accessories") && (!defined(^.filterAccessoriesType) || ^.filterAccessoriesType == "" || accessoriesType == ^.filterAccessoriesType))
        ))
      )] | order(orderRank asc) [0...20] {
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
        ) + ${IMG_CARD}
      }
    }
  }
}`

export const PRODUCT_BY_SLUG_QUERY = groq`*[_type == "product" && slug.current == $slug][0] {
  _id,
  name,
  "slug": slug.current,
  price,
  compareAtPrice,
  "image": coalesce(
    productImages[isMain == true][0].cloudinaryUrl,
    productImages[0].cloudinaryUrl,
    productImages[isMain == true][0].image.asset->url + ${IMG_PDP},
    productImages[0].image.asset->url + ${IMG_PDP},
    image.asset->url + ${IMG_PDP},
    gallery[0].asset->url + ${IMG_PDP}
  ),
  "hotspot": coalesce(
    productImages[isMain == true][0].image.hotspot,
    productImages[0].image.hotspot,
    image.hotspot,
    gallery[0].hotspot
  ),
  "gallery": select(
    defined(productImages[0]) => productImages[isMain != true][]{
      "url": coalesce(cloudinaryUrl, image.asset->url + ${IMG_PDP}),
      "hotspot": image.hotspot
    },
    defined(gallery[0]) => gallery[]{
      "url": asset->url + ${IMG_PDP},
      "hotspot": hotspot
    },
    []
  ),
  "colors": colors[]{ colorName, colorHex },
  description,
  category,
  sizes,
  shoeSizes,
  inStock
}`

export const NAV_QUERY = groq`*[_id == "navigation-singleton"][0] {
  links[enabled != false] {
    label,
    href,
    accent,
    underlineColor,
    "children": children[enabled != false]{ label, href }
  }
}`

export const SETTINGS_QUERY = groq`*[_id == "global-settings"][0] {
  announcementBars[]{ message, theme, href },
  announcementBarEnabled,
  footerLinks[]{
    label,
    href
  },
  socialLinks[]{
    platform,
    url
  },
}`
