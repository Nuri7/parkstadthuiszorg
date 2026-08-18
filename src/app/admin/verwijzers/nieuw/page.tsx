import Link from "next/link";
import { requireAdmin } from "@/lib/adminGuard";
import { createVerwijzer } from "@/app/actions/verwijzers";
import { VerwijzerVelden } from "@/components/admin/VerwijzerVelden";

export const metadata = { title: "Nieuwe verwijzer | Parkstad Thuiszorg" };

export default async function NieuweVerwijzerPage() {
  await requireAdmin();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <Link href="/admin/verwijzers" className="text-sm text-[#5b7f63] dark:text-[#5cb0bd] hover:underline">
          ← Terug naar verwijzers
        </Link>
        <h1 className="text-2xl font-heading text-[#064a54] dark:text-white mt-2">Nieuwe verwijzer</h1>
      </div>

      <form
        action={createVerwijzer}
        className="space-y-5 bg-white dark:bg-[#243029] p-6 rounded-2xl border border-[#ede7db] dark:border-[#086370]"
      >
        <VerwijzerVelden />
        <div className="flex gap-3">
          <button type="submit" className="rounded-lg bg-[#064a54] text-white px-5 py-2.5 text-sm font-medium hover:bg-[#053a42]">
            Verwijzer opslaan
          </button>
          <Link
            href="/admin/verwijzers"
            className="rounded-lg border border-[#dce8de] dark:border-[#086370] px-5 py-2.5 text-sm text-[#4f6b6f] dark:text-[#9fc7b5]"
          >
            Annuleren
          </Link>
        </div>
      </form>
    </div>
  );
}
