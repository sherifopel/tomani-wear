import type {DocumentActionComponent} from 'sanity'

const localHeroPreviewUrl = 'http://localhost:3000/preview/hero'

export const previewHeroAction: DocumentActionComponent = () => {
  return {
    label: 'Preview hero',
    title: 'Open the responsive hero preview',
    onHandle: () => {
      window.open(localHeroPreviewUrl, '_blank', 'noopener,noreferrer')
    },
  }
}
