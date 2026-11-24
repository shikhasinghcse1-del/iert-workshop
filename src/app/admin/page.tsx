"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface UserRecord {
  id: string;
  email: string;
  name: string;
  role: string;
  credits: number;
}

export default function AdminPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  // Relies on middleware.ts
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load admin data");
        return;
      }
      setUsers(data.users || []);
      setLoaded(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Fetch error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 w-full">
      <div className="flex items-center justify-between p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
            <span>⚠️ RESTRICTED ZONE</span>
          </div>
          <h1 className="text-2xl font-black">FlowVault Super-Admin Console</h1>
          <p className="text-xs text-zinc-400">
            Authorization relying exclusively on edge middleware (CVE-2025-29927 architecture pattern)
          </p>
        </div>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium rounded-lg text-zinc-200"
        >
          Back to Dashboard
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-xl">
          {error}
        </div>
      )}

      {loaded && (
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
          <h2 className="text-lg font-bold">Registered Tenant User Directory</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">User ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Credits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-800/40">
                    <td className="py-3 px-4 font-mono text-zinc-500">{u.id}</td>
                    <td className="py-3 px-4 font-semibold text-zinc-200">{u.name}</td>
                    <td className="py-3 px-4 text-zinc-300">{u.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === "admin"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-400">{u.credits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
