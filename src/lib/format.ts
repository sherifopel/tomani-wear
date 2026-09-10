// Words that should stay lowercase in title case (unless they open the string)
const MINOR_WORDS = new Set(['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'by', 'in', 'of', 'up', 'as', 'x'])

export function toTitleCase(str: string): string {
  const words = str.toLowerCase().trim().split(/\s+/)
  return words
    .map((word, i) => {
      if (!word) return word
      if (i !== 0 && MINOR_WORDS.has(word)) return word
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}
