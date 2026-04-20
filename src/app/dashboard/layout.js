import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/dashboard/Sidebar'
import s from './dashboard.module.css'

export const metadata = {
  title: 'Dashboard — The Maker',
}

export default async function DashboardLayout({ children }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <>{children}</>
  }

  const { count: newInquiries } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new')

  return (
    <div className={s.layout}>
      <Sidebar newInquiries={newInquiries || 0} />
      <main className={s.main}>
        {children}
      </main>
    </div>
  )
}