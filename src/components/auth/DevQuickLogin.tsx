"use client";

import { useClerk } from "@clerk/nextjs";
import { useState } from "react";
import { ShieldAlert, User, ShieldCheck, Loader2 } from "lucide-react";

export function DevQuickLogin() {
  const { client, setActive, loaded } = useClerk();
  const [loading, setLoading] = useState<'admin' | 'customer' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleQuickLogin = async (role: 'admin' | 'customer') => {
    if (!loaded) return;
    
    setLoading(role);
    setError(null);
    
    // Test mode emails that Clerk recognizes
    const email = role === 'admin' ? 'admin+clerk_test@parkstad.nl' : 'klant+clerk_test@test.nl';
    const password = role === 'admin' ? 'ParkstadThuiszorg-Admin-2026!' : 'ParkstadThuiszorg-Klant-2026!';

    try {
      // 1. Attempt to sign in
      const result = await client.signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        window.location.href = role === 'admin' ? '/admin' : '/mijn-zorg';
        return;
      }
    } catch (err: any) {
      // 2. If the user does not exist, we will create it programmatically
      if (err.errors?.[0]?.code === 'form_identifier_not_found') {
        try {
          // Create the user
          const signUpResult = await client.signUp.create({
            emailAddress: email,
            password,
          });

          // Prepare email verification
          await client.signUp.prepareEmailAddressVerification({ strategy: "email_code" });

          // In Clerk Development mode, "424242" is the universal OTP code
          const attempt = await client.signUp.attemptEmailAddressVerification({
            code: "424242",
          });

          if (attempt.status === "complete") {
            await setActive({ session: attempt.createdSessionId });
            window.location.href = role === 'admin' ? '/admin' : '/mijn-zorg';
            return;
          }
        } catch (signupErr: any) {
          console.error("Auto-signup failed:", signupErr);
          setError("Kon testgebruiker niet automatisch aanmaken.");
        }
      } else {
        console.error("Auto-login failed:", err);
        setError("Er ging iets mis bij het inloggen.");
      }
    } finally {
      setLoading(null);
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null; // Ensure this NEVER shows in production
  }

  return (
    <div className="w-full max-w-md bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 border-dashed rounded-2xl p-6 mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">
        Dev Mode
      </div>
      
      <div className="flex items-center gap-3 mb-4">
        <ShieldAlert className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
        <h3 className="font-bold text-yellow-800 dark:text-yellow-500 text-lg">1-Click Test Login</h3>
      </div>
      
      <p className="text-sm text-yellow-700 dark:text-yellow-600 mb-6">
        Deze knoppen werken alleen lokaal. Ze loggen je direct in (of maken het account automatisch aan op de achtergrond met de testcode 424242).
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleQuickLogin('admin')}
          disabled={loading !== null}
          className="flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-[#02191c] border-2 border-yellow-300 dark:border-yellow-700 rounded-xl hover:bg-yellow-100 dark:hover:bg-yellow-800/30 transition-colors disabled:opacity-50 text-[var(--color-sage-800)] dark:text-white font-medium"
        >
          {loading === 'admin' ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShieldCheck className="w-6 h-6 text-blue-500" />}
          <span>Admin</span>
        </button>

        <button
          onClick={() => handleQuickLogin('customer')}
          disabled={loading !== null}
          className="flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-[#02191c] border-2 border-yellow-300 dark:border-yellow-700 rounded-xl hover:bg-yellow-100 dark:hover:bg-yellow-800/30 transition-colors disabled:opacity-50 text-[var(--color-sage-800)] dark:text-white font-medium"
        >
          {loading === 'customer' ? <Loader2 className="w-6 h-6 animate-spin" /> : <User className="w-6 h-6 text-green-500" />}
          <span>Customer</span>
        </button>
      </div>
    </div>
  );
}
