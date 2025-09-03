import './admin.css';
import AdminShell from '@/components/admin/AdminShell';

export const metadata = { title: "Admin · Ko Lake Villa" };

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
