import { adminLogin } from "@/app/actions/adminLogin";

export const metadata = {
  title: "Inloggen | Parkstad Thuiszorg",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fefdfc] dark:bg-[#02191c] py-20 px-4">
      <div className="mb-8 text-center mt-10">
        <h1 className="text-3xl font-heading text-[var(--color-sage-800)] dark:text-white mb-2">
          Inloggen
        </h1>
        <p className="text-[var(--color-sage-600)] dark:text-[var(--color-sage-300)]">
          Log in om toegang te krijgen tot het dashboard.
        </p>
      </div>

      <form
        action={adminLogin}
        className="w-full max-w-sm bg-white dark:bg-[#243029] p-6 rounded-2xl shadow-xl border border-[#ede7db] dark:border-[#086370] space-y-4"
      >
        <label className="block">
          <span className="text-sm text-[var(--color-sage-700)] dark:text-[var(--color-sage-200)]">
            Wachtwoord
          </span>
          <input
            type="password"
            name="password"
            required
            autoFocus
            autoComplete="current-password"
            className="mt-1 w-full rounded-xl border border-[#dce8de] dark:border-[#086370] bg-white dark:bg-[#02191c] px-4 py-3 text-[#064a54] dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]"
          />
        </label>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">
            Onjuist wachtwoord. Probeer het opnieuw.
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-xl bg-[#064a54] hover:bg-[#053a42] text-white font-medium py-3 transition-colors"
        >
          Inloggen
        </button>
      </form>
    </div>
  );
}
