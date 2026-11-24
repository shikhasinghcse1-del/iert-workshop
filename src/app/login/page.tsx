"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (loginEmail?: string, loginPassword?: string) => {
    setError("");
    setLoading(true);

    const submitEmail = loginEmail || email;
    const submitPassword = loginPassword || password;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: submitEmail, password: submitPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("flowvault_user", JSON.stringify(data.user));
      localStorage.setItem("flowvault_token", data.token);

      if (data.user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[85vh]">
      <div className="w-full max-w-md p-8 rounded-2xl earth-card shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 mx-auto rounded-lg bg-stone-900 border border-stone-700 flex items-center justify-center text-xs font-mono font-bold text-stone-100 shadow-sm">
            <span>SS</span>
            <span className="w-1.5 h-1.5 rounded-full bg-clay-500 ml-0.5"></span>
          </div>
          <h1 className="text-2xl font-bold text-stone-100">
            Sign In to Security Lab
          </h1>
          <p className="text-xs text-stone-400 font-mono">
            Access your orders, audit tools, and interactive testing bench.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-stone-900 border border-red-900/60 text-red-300 text-xs font-mono rounded-lg">
            {error}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-mono font-medium text-stone-400 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-4 py-2.5 rounded-lg bg-stone-950 border border-stone-800 text-sm text-stone-100 placeholder-stone-600 focus:border-clay-500 font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-stone-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 rounded-lg bg-stone-950 border border-stone-800 text-sm text-stone-100 placeholder-stone-600 focus:border-clay-500 font-mono"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg btn-clay text-sm font-semibold flex items-center justify-center space-x-2"
          >
            <span>{loading ? "Authenticating..." : "Sign In to Workbench"}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Select Personas */}
        <div className="pt-4 border-t border-stone-800 space-y-2">
          <p className="text-[11px] font-mono font-semibold text-stone-500 uppercase tracking-wider text-center">
            Quick-Select Workshop Persona
          </p>
          <div className="grid grid-cols-3 gap-2 font-mono">
            <button
              type="button"
              onClick={() => handleLogin("usera@example.com", "Password123!")}
              className="px-2 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 hover:border-stone-600 border border-stone-800 text-xs font-medium text-stone-200 transition-colors"
            >
              User A
            </button>
            <button
              type="button"
              onClick={() => handleLogin("userb@example.com", "Password123!")}
              className="px-2 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 hover:border-stone-600 border border-stone-800 text-xs font-medium text-amber-sand transition-colors"
            >
              User B
            </button>
            <button
              type="button"
              onClick={() => handleLogin("admin@example.com", "Admin123!")}
              className="px-2 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 hover:border-stone-600 border border-stone-800 text-xs font-medium text-clay-400 transition-colors"
            >
              Admin
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-stone-500 font-mono">
          Need an account?{" "}
          <Link href="/signup" className="text-clay-400 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
