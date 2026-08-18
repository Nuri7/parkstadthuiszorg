import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-[#fefdfc] dark:bg-[#02191c]">
      <AdminNav />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
