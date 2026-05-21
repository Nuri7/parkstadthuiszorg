import { db } from "@/lib/db";
import { RequestTable } from "./RequestTable";

export const metadata = {
  title: "Admin Dashboard | Parkstad Thuiszorg",
  description: "Beheer intake aanvragen",
};

export default async function AdminDashboard() {
  // Fetch all requests, newest first
  const requests = await db.contactRequest.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="bg-[#fefdfc] dark:bg-[#02191c] min-h-screen py-16 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading text-[var(--color-sage-800)] dark:text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-[var(--color-sage-600)] dark:text-[var(--color-sage-200)]">
              Beheer alle inkomende zorg aanvragen
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white dark:bg-[#243029] p-4 rounded-xl shadow-sm border border-[#ede7db] dark:border-[#086370]">
              <div className="text-sm text-[#8a9a8a] font-medium mb-1">Nieuwe Aanvragen</div>
              <div className="text-2xl font-bold text-[var(--color-sage-800)] dark:text-white">
                {requests.filter(r => r.status === 'new').length}
              </div>
            </div>
            <div className="bg-white dark:bg-[#243029] p-4 rounded-xl shadow-sm border border-[#ede7db] dark:border-[#086370]">
              <div className="text-sm text-[#8a9a8a] font-medium mb-1">Totaal</div>
              <div className="text-2xl font-bold text-[var(--color-sage-800)] dark:text-white">
                {requests.length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#243029] rounded-3xl p-6 md:p-8 shadow-xl border border-[#ede7db] dark:border-[#086370]">
          <RequestTable requests={requests} />
        </div>
      </div>
    </div>
  );
}
