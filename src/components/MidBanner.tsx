import Image from 'next/image'
import Link from 'next/link'

type Props = {
  imageUrl: string
  href?: string
}

export default function MidBanner({ imageUrl, href }: Props) {
  const inner = (
    <div className="relative w-full aspect-[16/7] md:aspect-[21/9] overflow-hidden" data-testid="mid-banner">
      <Image
        src={imageUrl}
        alt="Tomanni editorial"
        fill
        className="object-cover"
        sizes="100vw"
        priority={false}
      />
    </div>
  )

  if (href) {
    return (
      <Link href={href} data-testid="mid-banner-link">
        {inner}
      </Link>
    )
  }

  return inner
}
