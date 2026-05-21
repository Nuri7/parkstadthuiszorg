"use client";

import { useState } from "react";
import { updateRequestStatus } from "@/app/actions/admin";

type RequestType = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  zipCode: string | null;
  careType: string | null;
  status: string;
  createdAt: Date;
};

export function RequestTable({ requests }: { requests: RequestType[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLoadingId(id);
    await updateRequestStatus(id, newStatus);
    setLoadingId(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "contacted":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#ede7db] dark:border-[#086370] text-[#8a9a8a] text-sm">
            <th className="py-4 px-4 font-semibold">Naam</th>
            <th className="py-4 px-4 font-semibold">Contact</th>
            <th className="py-4 px-4 font-semibold">Zorg Type</th>
            <th className="py-4 px-4 font-semibold">Datum</th>
            <th className="py-4 px-4 font-semibold">Status</th>
            <th className="py-4 px-4 font-semibold text-right">Actie</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#ede7db] dark:divide-[#086370]">
          {requests.map((req) => (
            <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-[#02191c]/50 transition-colors">
              <td className="py-4 px-4 font-medium text-[var(--color-sage-800)] dark:text-white">
                {req.name}
              </td>
              <td className="py-4 px-4 text-sm text-[#4f6b6f] dark:text-[#5cb0bd]">
                <div>{req.phone}</div>
                {req.email && <div className="text-xs opacity-75">{req.email}</div>}
              </td>
              <td className="py-4 px-4 text-sm text-[var(--color-sage-800)] dark:text-gray-200">
                {req.careType || "Onbekend"}
              </td>
              <td className="py-4 px-4 text-sm text-[var(--color-sage-800)] dark:text-gray-200">
                {new Date(req.createdAt).toLocaleDateString("nl-NL")}
              </td>
              <td className="py-4 px-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${getStatusColor(req.status)}`}>
                  {req.status}
                </span>
              </td>
              <td className="py-4 px-4 text-right">
                <select
                  disabled={loadingId === req.id}
                  value={req.status}
                  onChange={(e) => handleStatusChange(req.id, e.target.value)}
                  className="bg-white dark:bg-[#02191c] border border-[var(--color-beige-300)] dark:border-[#086370] text-[var(--color-sage-800)] dark:text-white text-sm rounded-lg focus:ring-[var(--color-sage-500)] focus:border-[var(--color-sage-500)] block w-full p-2"
                >
                  <option value="new">Nieuw</option>
                  <option value="contacted">Gecontacteerd</option>
                  <option value="resolved">Afgerond</option>
                </select>
              </td>
            </tr>
          ))}
          {requests.length === 0 && (
            <tr>
              <td colSpan={6} className="py-8 text-center text-[#8a9a8a]">
                Geen aanvragen gevonden.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
