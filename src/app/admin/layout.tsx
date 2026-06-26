import AdminLayout from '@/components/admin/AdminLayout'

export const metadata = { title: 'Admin — StreetByte' }

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>
}
