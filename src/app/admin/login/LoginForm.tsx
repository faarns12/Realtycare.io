"use client";

import { useActionState } from "react";
import { login } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, { error: "" });
  return (
    <form action={action} className="mt-6 grid gap-4">
      <label className="grid gap-1.5 text-[14px] font-medium">
        Email
        <input name="email" type="email" required autoFocus autoComplete="username" className="rounded-xl border border-line bg-mist px-4 py-3 text-[15px] font-normal outline-none focus:border-sky-600" />
      </label>
      <label className="grid gap-1.5 text-[14px] font-medium">
        Password
        <input name="password" type="password" required autoComplete="current-password" className="rounded-xl border border-line bg-mist px-4 py-3 text-[15px] font-normal outline-none focus:border-sky-600" />
      </label>
      {state.error && <p className="text-[14px] text-red-600" role="alert">{state.error}</p>}
      <button disabled={pending} className="rounded-full bg-sky-600 px-5 py-3 text-[15px] font-semibold text-white hover:bg-sky-700 disabled:opacity-60">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
