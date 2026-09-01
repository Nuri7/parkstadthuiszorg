import { AdminNav } from "@/components/admin/AdminNav";
import { WaStoringBanner } from "@/components/admin/WaStoringBanner";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-[#fefdfc] dark:bg-[#02191c]">
      <AdminNav />
      <main className="flex-1 min-w-0">
        <WaStoringBanner />
        {children}
      </main>
    </div>
  );
}
