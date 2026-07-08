import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProfileForm from './ProfileForm'

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/sign-in?callbackUrl=/account/profile')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, phone: true },
  })

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight mb-8 text-center">My Profile</h1>
      <ProfileForm user={{ name: user?.name ?? '', email: user?.email ?? '', phone: user?.phone ?? '' }} />
    </div>
  )
}
