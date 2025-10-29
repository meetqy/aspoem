'use client'

import { redirect } from 'next/navigation'

import { authClient } from '@/server/auth/client'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data, isPending } = authClient.useSession()

  if (!data && !isPending)
    return redirect('/login')
  if (data?.user.role !== 'admin' && !isPending)
    return redirect('/')

  if (isPending)
    return null

  return (
    children
  )
}
