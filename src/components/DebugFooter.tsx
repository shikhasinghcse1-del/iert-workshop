"use client";

import React, { useState } from "react";
import { Terminal, Shield, CheckCircle2 } from "lucide-react";

export function DebugFooter() {
  const [showConfig, setShowConfig] = useState(false);

  const serviceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || "NOT_CONFIGURED";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "NOT_CONFIGURED";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";

  return (
    <footer className="mt-auto border-t border-stone-800 bg-stone-950 px-6 py-5 text-xs text-stone-500 font-mono">
      <div className="mx-auto flex max-w-7xl items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-3">
          <span className="text-stone-300 font-semibold flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-clay-500"></span>
            <span>Shikha Singh • Handcrafted Portfolio &amp; FlowVault Lab</span>
          </span>
          <span className="text-stone-700">/</span>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="text-stone-400 hover:text-clay-400 underline transition-colors"
          >
            {showConfig ? "Hide Diagnostics" : "System Diagnostics"}
          </button>
        </div>
        <div className="text-stone-400 flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500/80"></span>
          <span>Offline Fallback Active • Port 3000</span>
        </div>
      </div>

      {showConfig && (
        <div className="mx-auto mt-4 max-w-7xl rounded-xl bg-stone-900 border border-stone-800 p-4 font-mono text-[11px] text-stone-300">
          <div className="font-bold text-clay-400 mb-2 flex items-center space-x-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>Developer Diagnostic Overlay</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div>Endpoint: <span className="text-stone-100">{supabaseUrl}</span></div>
            <div>Database Mode: <span className="text-amber-sand font-semibold">Local Fallback (Zero-Network)</span></div>
            <div className="truncate">Anon Public Token: <span className="text-stone-400">{anonKey}</span></div>
            <div className="truncate text-red-400">
              Internal Token: {serviceRoleKey}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
