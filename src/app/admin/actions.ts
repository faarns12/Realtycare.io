"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { clearSession, getAccessToken, isAdminToken, saveSession, signInWithPassword } from "@/lib/adminAuth";
import { deleteLead, isLeadStatus, updateLead } from "@/lib/supabase";

export async function login(_prev: { error: string }, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const session = await signInWithPassword(email, password).catch(() => null);
  if (!session) return { error: "Wrong email or password." };
  if (!(await isAdminToken(session.access_token))) return { error: "This account isn’t an admin." };
  await saveSession(session);
  redirect("/admin");
}

export async function logout() {
  await clearSession();
  redirect("/admin/login");
}

async function token() {
  const t = await getAccessToken();
  if (!t) throw new Error("Not signed in.");
  return t; // the database checks admin rights on every query (RLS)
}

export async function setStatus(id: string, status: string) {
  if (!isLeadStatus(status)) throw new Error("Unknown status.");
  await updateLead(await token(), id, { status });
  revalidatePath("/admin");
}

export async function saveNotes(id: string, notes: string) {
  await updateLead(await token(), id, { notes: notes.slice(0, 5000) });
  revalidatePath("/admin");
}

export async function removeLead(id: string) {
  await deleteLead(await token(), id);
  revalidatePath("/admin");
}
