"use client";

import { useState } from "react";
import { Session } from "@supabase/supabase-js";

type AuthPanelProps = {
  session: Session | null;
  isConfigured: boolean;
  isBusy: boolean;
  errorMessage: string | null;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
  onSignOut: () => Promise<void>;
};

export default function AuthPanel({
  session,
  isConfigured,
  isBusy,
  errorMessage,
  onSignIn,
  onSignUp,
  onSignOut,
}: AuthPanelProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isDisabled = isBusy || !isConfigured;

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col gap-6 px-6 py-14">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Account</p>
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">
          Sign in to sync your tasks
        </h2>
        <p className="text-sm text-slate-200/80">
          When you log in, local tasks are pushed to Supabase and then stored there.
        </p>
      </header>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30 backdrop-blur-md">
        {!isConfigured ? (
          <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-sm text-slate-200/80">
            Supabase is not configured. Add `NEXT_PUBLIC_SUPABASE_URL` and
            `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` to enable login and sync.
          </div>
        ) : session ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300">Signed in</p>
              <p className="mt-2 text-lg font-semibold text-white">{session.user.email}</p>
            </div>
            <button
              type="button"
              onClick={onSignOut}
              disabled={isDisabled}
              className="rounded-full border border-red-200/40 bg-red-500/10 px-5 py-2 text-sm font-semibold text-red-100 transition hover:border-red-200/70 hover:bg-red-500/20 disabled:opacity-60"
            >
              Sign out
            </button>
          </div>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onSignIn(email, password);
            }}
            className="space-y-4"
          >
            <label className="block space-y-2">
              <span className="text-xs uppercase tracking-wide text-slate-300">Email</span>
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                disabled={isDisabled}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/60 focus:bg-white/10 focus:ring-2 focus:ring-cyan-400/50"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-xs uppercase tracking-wide text-slate-300">Password</span>
              <input
                required
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Your password"
                disabled={isDisabled}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/60 focus:bg-white/10 focus:ring-2 focus:ring-cyan-400/50"
              />
            </label>
            {errorMessage ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {errorMessage}
              </div>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isDisabled}
                className="rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-500 px-5 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 disabled:opacity-60"
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => onSignUp(email, password)}
                disabled={isDisabled}
                className="rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/20 disabled:opacity-60"
              >
                Sign up
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
