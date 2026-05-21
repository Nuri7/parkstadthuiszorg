import { SignIn } from "@clerk/nextjs";
import { DevQuickLogin } from "@/components/auth/DevQuickLogin";

export const metadata = {
  title: "Login | Parkstad Thuiszorg",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fefdfc] dark:bg-[#02191c] py-20 px-4">
      <div className="mb-8 text-center mt-10">
        <h1 className="text-3xl font-heading text-[var(--color-sage-800)] dark:text-white mb-2">
          Welkom terug
        </h1>
        <p className="text-[var(--color-sage-600)] dark:text-[var(--color-sage-300)]">
          Log in om toegang te krijgen tot het dashboard.
        </p>
      </div>

      {/* Developer Magic Buttons */}
      <DevQuickLogin />

      {/* Clerk's highly secure drop-in component */}
      <SignIn routing="hash" forceRedirectUrl="/admin" />

      <div className="mt-12 p-6 w-full max-w-md bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-2xl text-sm text-blue-800 dark:text-blue-300">
        <p className="font-bold mb-4 text-center text-base">Test Credentials</p>
        
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#02191c] p-4 rounded-xl shadow-sm border border-blue-100 dark:border-blue-800">
            <p className="font-semibold text-[var(--color-sage-800)] dark:text-white mb-2">Admin Account</p>
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-500 dark:text-gray-400">Email:</span>
              <code className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-[var(--color-sage-800)] dark:text-gray-200 select-all">admin+clerk_test@parkstad.nl</code>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 dark:text-gray-400">Wachtwoord:</span>
              <code className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-[var(--color-sage-800)] dark:text-gray-200 select-all">ParkstadThuiszorg-Admin-2026!</code>
            </div>
          </div>

          <div className="bg-white dark:bg-[#02191c] p-4 rounded-xl shadow-sm border border-blue-100 dark:border-blue-800">
            <p className="font-semibold text-[var(--color-sage-800)] dark:text-white mb-2">Customer Account</p>
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-500 dark:text-gray-400">Email:</span>
              <code className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-[var(--color-sage-800)] dark:text-gray-200 select-all">klant+clerk_test@test.nl</code>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 dark:text-gray-400">Wachtwoord:</span>
              <code className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-[var(--color-sage-800)] dark:text-gray-200 select-all">ParkstadThuiszorg-Klant-2026!</code>
            </div>
          </div>
        </div>
        
        <p className="mt-4 text-xs opacity-80 text-center">
          * Let op: Bij de allereerste keer moet je deze gegevens registreren (Sign up). Daarna kun je ze gebruiken om in te loggen. In development mode kun je altijd inloggen met de code <strong>424242</strong> als er om verificatie wordt gevraagd.
        </p>
      </div>
    </div>
  );
}
