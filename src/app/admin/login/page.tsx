import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { adminConfigured, getAccessToken, isAdminToken } from "@/lib/adminAuth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  const token = adminConfigured() ? await getAccessToken() : null;
  if (token && (await isAdminToken(token).catch(() => false))) redirect("/admin");
  return (
    <div className="grid min-h-[70vh] place-items-center px-4 py-16">
      <div className="w-full max-w-[400px] rounded-[var(--radius-card)] border border-line bg-paper p-7 shadow-[var(--shadow-pop)]">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-sky-700">RealtyCare admin</p>
        <h1 className="mt-2 text-[28px] font-bold">Sign in</h1>
        {adminConfigured() ? (
          <LoginForm />
        ) : (
          <p className="mt-4 rounded-xl bg-gold-50 p-4 text-[14px] text-gold-800">
            Admin isn’t set up yet. Add <code>SUPABASE_URL</code> and <code>SUPABASE_PUBLISHABLE_KEY</code> to your environment variables.
          </p>
        )}
      </div>
    </div>
  );
}
