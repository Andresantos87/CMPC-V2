import { AdminSidebarNav } from './_components/admin-sidebar-nav';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full">
      <AdminSidebarNav />
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  );
}
