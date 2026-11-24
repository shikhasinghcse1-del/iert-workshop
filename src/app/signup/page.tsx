"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("Registration simulated. Please use pre-seeded accounts (User A, User B, Admin) for the workshop lab.");
    setTimeout(() => {
      router.push("/login");
    }, 1500);
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
            Create Workbench Account
          </h1>
          <p className="text-xs text-stone-400 font-mono">
            Register your test persona or use pre-configured workshop accounts.
          </p>
        </div>

        {msg && (
          <div className="p-3 bg-stone-900 border border-clay-500/50 text-clay-300 text-xs font-mono rounded-lg">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-medium text-stone-400 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Full Name"
              className="w-full px-4 py-2.5 rounded-lg bg-stone-950 border border-stone-800 text-sm text-stone-100 placeholder-stone-600 focus:border-clay-500 font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-stone-400 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@company.com"
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

          <div className="flex items-center space-x-2 text-xs font-mono text-stone-400">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="h-4 w-4 accent-clay-500 rounded"
              required
            />
            <span>I accept workshop lab guidelines</span>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg btn-clay text-sm font-semibold flex items-center justify-center space-x-2"
          >
            <span>Create Test Account</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-stone-500 font-mono pt-2 border-t border-stone-800">
          Already registered?{" "}
          <Link href="/login" className="text-clay-400 hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
