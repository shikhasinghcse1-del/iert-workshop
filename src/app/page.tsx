"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  ShieldCheck,
  Terminal,
  Cpu,
  Layers,
  Activity,
  Database,
  Lock,
  Code2,
  Server,
  CheckCircle2,
  ArrowUpRight,
  ChevronRight,
  GitBranch,
  Mail,
  MapPin,
  Briefcase,
  Compass,
  BookOpen,
  SlidersHorizontal,
  PenTool,
} from "lucide-react";

interface Project {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  category: "all" | "security" | "systems" | "craft";
  categoryLabel: string;
  badge: string;
  problem: string;
  solution: string;
  craftNote: string;
  metrics: { label: string; value: string }[];
  techStack: string[];
  primaryLink: { label: string; href: string };
  secondaryLink?: { label: string; href: string };
}

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [hudTab, setHudTab] = useState<"diagnostics" | "security" | "tradeoffs" | "specs">("diagnostics");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const projects: Project[] = [
    {
      id: "flowvault-security-lab",
      index: "01",
      title: "FlowVault: Application Security Testing & Auditing Workbench",
      subtitle: "Hands-on vulnerability remediation and multi-tenant isolation platform",
      category: "security",
      categoryLabel: "Security & Full-Stack",
      badge: "LIVE LAB SYSTEM",
      problem:
        "Modern cloud apps often rely exclusively on edge middleware for authorization, leaving route handlers vulnerable to internal header spoofing (CVE-2025-29927) and IDOR data leaks.",
      solution:
        "Engineered a zero-network offline architecture with defense-in-depth route checks (`requireAdmin`), row-level authorization, and automated AST static scanning with Semgrep.",
      craftNote:
        "Designed to run 100% offline without live database credentials, ensuring reproducible testing for 13 distinct OWASP vulnerability tracks.",
      metrics: [
        { label: "Vulnerability Tracks", value: "13 Exploits Audited" },
        { label: "Defense Depth", value: "Edge + Route + DB" },
        { label: "Offline Mode", value: "Zero-Network Fallback" },
      ],
      techStack: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Supabase RLS", "Semgrep"],
      primaryLink: { label: "Test Live Security Lab", href: "/dashboard" },
      secondaryLink: { label: "Admin Console", href: "/admin" },
    },
    {
      id: "aquastream-pipeline",
      index: "02",
      title: "TerraStream: High-Throughput Environmental Telemetry",
      subtitle: "Low-latency distributed sensor ingestion and event aggregation",
      category: "systems",
      categoryLabel: "Distributed Systems",
      badge: "PRODUCTION ARCHITECTURE",
      problem:
        "Ingesting thousands of erratic sensor events caused thread pool starvation and unbuffered database lock contention during environmental peak surges.",
      solution:
        "Built a decoupled WebSocket ingestion gateway backed by Redis ring buffers, streaming metrics into TimescaleDB with p99 response times below 35 milliseconds.",
      craftNote:
        "Implemented backpressure shedding and atomic rolling aggregates to guarantee 99.98% pipeline uptime even during sustained network jitter.",
      metrics: [
        { label: "Ingestion Peak", value: "50,000+ evt/s" },
        { label: "p99 Ingest Latency", value: "< 34ms" },
        { label: "Uptime SLA", value: "99.98% Verified" },
      ],
      techStack: ["Node.js", "WebSockets", "Redis", "TimescaleDB", "Docker", "TypeScript"],
      primaryLink: { label: "Inspect Architecture", href: "#architecture" },
      secondaryLink: { label: "Tech Specs", href: "#skills" },
    },
    {
      id: "sentinelgate-auth",
      index: "03",
      title: "SentinelGate: Stateless Cryptographic Access Proxy",
      subtitle: "Token revocation and strict role-based access control gateway",
      category: "security",
      categoryLabel: "Cybersecurity & Backend",
      badge: "ZERO-TRUST STANDARD",
      problem:
        "Microservices frequently suffer from TOCTOU race conditions during coupon redemption and mass-assignment flaws when accepting raw unchecked JSON payloads.",
      solution:
        "Architected an edge reverse proxy verifying stateless cryptographic signatures, distributed token revocation lists, and strict Zod runtime request schemas.",
      craftNote:
        "Enforced atomic database transactions and idempotent mutations to eliminate duplicate coupon redemption exploits entirely.",
      metrics: [
        { label: "Standard", value: "OWASP ASVS v4" },
        { label: "Overhead", value: "< 1.5ms" },
        { label: "TOCTOU Immunity", value: "100% Guaranteed" },
      ],
      techStack: ["Node.js", "TypeScript", "PostgreSQL", "Zod", "Docker", "Jest"],
      primaryLink: { label: "View Threat Model", href: "#architecture" },
      secondaryLink: { label: "Audit Rules", href: "#skills" },
    },
    {
      id: "atelier-design-system",
      index: "04",
      title: "Atelier: Tactile & Accessible Human Design System",
      subtitle: "Earth-toned component library adhering to strict accessibility standards",
      category: "craft",
      categoryLabel: "Design Engineering",
      badge: "WCAG 2.1 AA CERTIFIED",
      problem:
        "Generic UI kits rely on low-contrast gray text and synthetic neon gradients that violate accessibility criteria and lack distinct human identity.",
      solution:
        "Handcrafted an editorial design system utilizing crisp neutrals, terracotta warmth, visible keyboard focus rings, and zero cumulative layout shift (CLS).",
      craftNote:
        "Every interactive element meets the 44x44px minimum target size and achieves a minimum 7:1 contrast ratio for all essential typography.",
      metrics: [
        { label: "Lighthouse Score", value: "100 / 100" },
        { label: "Contrast Ratio", value: "> 7.5:1 AA" },
        { label: "CLS Measure", value: "0.000" },
      ],
      techStack: ["React 19", "Tailwind CSS", "Radix Primitives", "TypeScript", "Storybook"],
      primaryLink: { label: "View Craft Principles", href: "#notes" },
    },
  ];

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactName("");
      setContactEmail("");
      setContactMessage("");
    }, 2500);
  };

  return (
    <div className="flex flex-col w-full text-stone-300">
      {/* 
        ========================================================================
        HERO SECTION: Editorial & Architectural Framing
        ========================================================================
      */}
      <section className="relative w-full min-h-[92vh] flex flex-col justify-center items-center px-6 pt-16 pb-24 border-b border-stone-800/80">
        <div className="max-w-5xl mx-auto flex flex-col items-start text-left space-y-8 w-full">
          {/* Eyebrow & Stamp */}
          <div className="flex items-center space-x-3 text-xs font-mono text-stone-400">
            <span className="px-2.5 py-1 rounded bg-stone-900 border border-stone-800 text-clay-400 font-semibold tracking-wider uppercase">
              STUDIO &amp; WORKBENCH
            </span>
            <span className="text-stone-600">/</span>
            <span className="flex items-center space-x-1.5 text-stone-400">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
              <span>Available for engineering collaborations</span>
            </span>
          </div>

          {/* Main Headline */}
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-stone-100 leading-[1.08]">
              Building software with care, restraint, and architectural rigor.
            </h1>

            <p className="text-lg sm:text-xl text-stone-400 max-w-2xl font-normal leading-relaxed pt-2">
              I’m Shikha Singh — a software engineer and security researcher. I build resilient distributed systems, audit application boundaries, and create software that feels solid, calm, and unmistakably human.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#work"
              className="px-6 py-3.5 rounded-lg btn-clay text-sm font-semibold flex items-center space-x-2 shadow-sm focus-visible:outline-none"
            >
              <span>Explore Selected Work</span>
              <ChevronRight className="w-4 h-4" />
            </a>

            <Link
              href="/dashboard"
              className="px-6 py-3.5 rounded-lg btn-stone text-sm font-medium flex items-center space-x-2 shadow-sm focus-visible:outline-none"
            >
              <Terminal className="w-4 h-4 text-clay-400" />
              <span>Launch Live Security Lab</span>
            </Link>

            <a
              href="#contact"
              className="px-5 py-3.5 rounded-lg text-stone-400 hover:text-stone-200 text-sm font-mono transition-colors"
            >
              Contact Direct →
            </a>
          </div>

          {/* 
            ====================================================================
            WORKBENCH HUD: Tactile Diagnostic Board (Human-Made)
            ====================================================================
          */}
          <div className="w-full mt-6 earth-card rounded-2xl border-stone-800 shadow-xl overflow-hidden">
            {/* Header bar */}
            <div className="bg-stone-900 border-b border-stone-800 px-5 py-3 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-2 h-2 rounded-full bg-clay-500"></div>
                <span className="text-xs font-mono font-bold tracking-wider text-stone-300 uppercase">
                  Workbench Diagnostics &amp; Telemetry
                </span>
              </div>

              {/* Tabs */}
              <div className="flex items-center space-x-1">
                {(
                  [
                    { id: "diagnostics", label: "Runtime Telemetry", icon: Activity },
                    { id: "security", label: "AST Security Gate", icon: ShieldCheck },
                    { id: "tradeoffs", label: "Tradeoffs & Design", icon: Layers },
                    { id: "specs", label: "Node Specs", icon: Cpu },
                  ] as const
                ).map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setHudTab(tab.id)}
                      className={`px-3 py-1 rounded text-xs font-mono flex items-center space-x-1.5 transition-all ${
                        hudTab === tab.id
                          ? "bg-stone-800 text-stone-100 border border-stone-700 font-semibold"
                          : "text-stone-400 hover:text-stone-200"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-clay-400" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Body */}
            <div className="p-6 font-mono text-xs bg-stone-950/90 leading-relaxed text-stone-300">
              {hudTab === "diagnostics" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-800/80">
                    <span className="text-stone-200 font-bold flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>LOCAL RUNTIME STATUS: STABLE &amp; VERIFIED</span>
                    </span>
                    <span className="text-stone-500">HOST: LOCALHOST:3000</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-lg bg-stone-900 border border-stone-800">
                      <div className="text-[10px] text-stone-500 uppercase tracking-wider">Database Architecture</div>
                      <div className="text-sm font-bold text-amber-sand mt-0.5">USE_LOCAL_DB=true</div>
                      <div className="text-[10px] text-stone-400 mt-1">Zero external network requirement</div>
                    </div>
                    <div className="p-3.5 rounded-lg bg-stone-900 border border-stone-800">
                      <div className="text-[10px] text-stone-500 uppercase tracking-wider">Authorization Layer</div>
                      <div className="text-sm font-bold text-clay-400 mt-0.5">Dual-Tier In-Handler</div>
                      <div className="text-[10px] text-stone-400 mt-1">CVE-2025-29927 spoof proof</div>
                    </div>
                    <div className="p-3.5 rounded-lg bg-stone-900 border border-stone-800">
                      <div className="text-[10px] text-stone-500 uppercase tracking-wider">Median Query Speed</div>
                      <div className="text-sm font-bold text-stone-100 mt-0.5">14.2 ms (p95: 28 ms)</div>
                      <div className="text-[10px] text-stone-400 mt-1">Indexed SQLite memory tables</div>
                    </div>
                  </div>
                </div>
              )}

              {hudTab === "security" && (
                <div className="space-y-3">
                  <div className="text-stone-200 font-bold flex items-center space-x-2 pb-2 border-b border-stone-800/80">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>AUTOMATED AST STATIC ANALYSIS &amp; AUDIT RESULTS</span>
                  </div>
                  <div className="space-y-1.5 pt-1 text-stone-300">
                    <div className="flex items-center justify-between">
                      <span>• Rule `semgrep/no-unauth-db.yaml`:</span>
                      <span className="text-emerald-400 font-semibold">PASS (0 unauthenticated calls)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>• Gitleaks Secret Detector:</span>
                      <span className="text-emerald-400 font-semibold">PASS (Historic commit scrubbed)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>• Edge Auth Guard (`requireAdmin`):</span>
                      <span className="text-emerald-400 font-semibold">ACTIVE (Direct handler boundary)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>• Playwright + Axe-Core A11y Suite:</span>
                      <span className="text-emerald-400 font-semibold">100% (Zero WCAG 2.1 AA violations)</span>
                    </div>
                  </div>
                </div>
              )}

              {hudTab === "tradeoffs" && (
                <div className="space-y-3">
                  <div className="text-stone-200 font-bold flex items-center space-x-2 pb-2 border-b border-stone-800/80">
                    <Layers className="w-4 h-4 text-amber-sand" />
                    <span>ENGINEERING TRADEOFFS &amp; DESIGN DECISIONS</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                    <div className="p-3 rounded-lg bg-stone-900 border border-stone-800">
                      <div className="text-clay-400 font-bold">Why Offline Fallback First?</div>
                      <div className="text-stone-400 mt-1 leading-relaxed">
                        Eliminates flaky external network dependencies during development, enabling deterministic testing of all security gates.
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-stone-900 border border-stone-800">
                      <div className="text-clay-400 font-bold">In-Handler Guards vs Middleware?</div>
                      <div className="text-stone-400 mt-1 leading-relaxed">
                        Never trust perimeter edge headers exclusively. Validating sessions inside each route handler prevents CVE-2025-29927 bypasses.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {hudTab === "specs" && (
                <div className="space-y-3">
                  <div className="text-stone-200 font-bold flex items-center space-x-2 pb-2 border-b border-stone-800/80">
                    <Cpu className="w-4 h-4 text-stone-400" />
                    <span>LOCAL WORKSPACE RUNTIME ENVIRONMENT</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <div className="p-2.5 rounded bg-stone-900 border border-stone-800">
                      <div className="text-stone-500 text-[10px]">Runtime</div>
                      <div className="font-bold text-stone-100">Node.js 26 LTS</div>
                    </div>
                    <div className="p-2.5 rounded bg-stone-900 border border-stone-800">
                      <div className="text-stone-500 text-[10px]">Framework</div>
                      <div className="font-bold text-stone-100">Next.js 15.2</div>
                    </div>
                    <div className="p-2.5 rounded bg-stone-900 border border-stone-800">
                      <div className="text-stone-500 text-[10px]">Reactivity</div>
                      <div className="font-bold text-stone-100">React 19 Hooks</div>
                    </div>
                    <div className="p-2.5 rounded bg-stone-900 border border-stone-800">
                      <div className="text-stone-500 text-[10px]">Styling</div>
                      <div className="font-bold text-stone-100">Tailwind CSS 3.4</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        SECTION 01: SELECTED WORKS (Editorial Case Studies)
        ========================================================================
      */}
      <section id="work" className="max-w-6xl mx-auto py-24 px-6 w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 pb-6 border-b border-stone-800">
          <div>
            <div className="flex items-center space-x-2 text-clay-400 text-xs font-mono font-semibold uppercase tracking-widest mb-2">
              <span>01 / SELECTED WORK</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-stone-100">
              Architectural Case Studies
            </h2>
            <p className="text-stone-400 text-sm sm:text-base max-w-2xl mt-2 font-normal leading-relaxed">
              Detailed technical walk-throughs of production-grade systems, security audit benchmarks, and resilient architectures.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-lg bg-stone-900 border border-stone-800 self-start md:self-auto font-mono text-xs">
            {[
              { id: "all", label: "All Projects" },
              { id: "security", label: "Security & Audits" },
              { id: "systems", label: "Distributed Systems" },
              { id: "craft", label: "Design Engineering" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded transition-all ${
                  activeFilter === tab.id
                    ? "bg-stone-800 text-stone-100 font-semibold"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Project List */}
        <div className="space-y-12">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="earth-card earth-card-hover rounded-2xl p-8 sm:p-10 flex flex-col justify-between relative"
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2 pb-4 border-b border-stone-800/80">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-mono font-bold text-clay-400">
                      CASE {project.index}
                    </span>
                    <span className="text-stone-700 font-mono">/</span>
                    <span className="text-xs font-mono text-stone-400">
                      {project.categoryLabel}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded bg-stone-900 text-stone-300 border border-stone-700/80">
                    {project.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-100 mb-2">
                  {project.title}
                </h3>
                <div className="text-sm text-stone-400 mb-6 font-normal">
                  {project.subtitle}
                </div>

                {/* Problem vs Solution Split */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800/90">
                    <div className="text-xs font-mono font-bold text-stone-400 uppercase tracking-wider mb-1.5">
                      The Challenge
                    </div>
                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                      {project.problem}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800/90">
                    <div className="text-xs font-mono font-bold text-clay-400 uppercase tracking-wider mb-1.5">
                      The Architecture
                    </div>
                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                      {project.solution}
                    </p>
                  </div>
                </div>

                {/* Handcrafted Note */}
                <div className="p-3.5 rounded-lg bg-stone-950/60 border border-stone-800 text-xs font-mono text-stone-400 flex items-start space-x-2.5 mb-6">
                  <span className="text-amber-sand font-bold">✎</span>
                  <span><strong>Craftsman Note:</strong> {project.craftNote}</span>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {project.metrics.map((m) => (
                    <div key={m.label} className="p-3 rounded-lg bg-stone-900/60 border border-stone-800/80 text-center">
                      <div className="text-[10px] font-mono text-stone-500 uppercase">{m.label}</div>
                      <div className="text-xs sm:text-sm font-mono font-bold text-stone-200 mt-0.5">{m.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 mb-6 pt-4 border-t border-stone-800/80">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] font-mono px-2.5 py-1 rounded bg-stone-900 text-stone-400 border border-stone-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-4">
                  <Link
                    href={project.primaryLink.href}
                    className="py-2.5 px-5 rounded-lg btn-clay text-xs font-semibold flex items-center space-x-2"
                  >
                    <span>{project.primaryLink.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                  {project.secondaryLink && (
                    <Link
                      href={project.secondaryLink.href}
                      className="py-2.5 px-5 rounded-lg btn-stone text-xs font-medium"
                    >
                      {project.secondaryLink.label}
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 
        ========================================================================
        SECTION 02: ARCHITECTURE BLUEPRINT
        ========================================================================
      */}
      <section id="architecture" className="max-w-6xl mx-auto py-20 px-6 w-full border-t border-stone-800">
        <div className="mb-14">
          <div className="text-clay-400 text-xs font-mono font-semibold uppercase tracking-widest mb-2">
            02 / SYSTEM ARCHITECTURE
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-100">
            Defense in Depth: The Four Architectural Tiers
          </h2>
          <p className="text-stone-400 text-sm sm:text-base max-w-2xl mt-2 font-normal leading-relaxed">
            How requests traverse security boundaries, preventing unauthorized data exfiltration, race conditions, and privilege escalation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="earth-card rounded-xl p-6">
            <div className="text-xs font-mono font-bold text-clay-400 mb-2">TIER 01</div>
            <h3 className="text-base font-bold text-stone-100 mb-2">Edge &amp; Gateway</h3>
            <p className="text-xs text-stone-400 leading-relaxed mb-4">
              Sanitizes incoming headers, strips forged `x-middleware-*` subrequest indicators, and applies rate-limiting buckets.
            </p>
            <div className="text-[11px] font-mono text-stone-500 border-t border-stone-800 pt-3 space-y-1">
              <div>• Header Sanitation</div>
              <div>• Strict CORS Whitelist</div>
              <div>• TLS 1.3 Termination</div>
            </div>
          </div>

          <div className="earth-card rounded-xl p-6">
            <div className="text-xs font-mono font-bold text-amber-sand mb-2">TIER 02</div>
            <h3 className="text-base font-bold text-stone-100 mb-2">Route Handlers</h3>
            <p className="text-xs text-stone-400 leading-relaxed mb-4">
              Direct verification of session identity, strict runtime Zod schemas, and independent in-handler `requireAdmin` assertions.
            </p>
            <div className="text-[11px] font-mono text-stone-500 border-t border-stone-800 pt-3 space-y-1">
              <div>• In-Handler Auth Check</div>
              <div>• IDOR Ownership Guard</div>
              <div>• Schema Validation</div>
            </div>
          </div>

          <div className="earth-card rounded-xl p-6">
            <div className="text-xs font-mono font-bold text-stone-400 mb-2">TIER 03</div>
            <h3 className="text-base font-bold text-stone-100 mb-2">Data Isolation</h3>
            <p className="text-xs text-stone-400 leading-relaxed mb-4">
              Row-level security enforcement at database query level (`auth.uid() = user_id`) and atomic coupon redemption transactions.
            </p>
            <div className="text-[11px] font-mono text-stone-500 border-t border-stone-800 pt-3 space-y-1">
              <div>• PostgreSQL RLS Policies</div>
              <div>• TOCTOU Atomic Locks</div>
              <div>• Zero-Network SQLite</div>
            </div>
          </div>

          <div className="earth-card rounded-xl p-6">
            <div className="text-xs font-mono font-bold text-emerald-500 mb-2">TIER 04</div>
            <h3 className="text-base font-bold text-stone-100 mb-2">CI/CD &amp; AST Audit</h3>
            <p className="text-xs text-stone-400 leading-relaxed mb-4">
              Automated Semgrep rules prevent unauthenticated database calls from merging into production. Playwright ensures WCAG AA.
            </p>
            <div className="text-[11px] font-mono text-stone-500 border-t border-stone-800 pt-3 space-y-1">
              <div>• Semgrep AST Rules</div>
              <div>• Axe-Core A11y Suite</div>
              <div>• CycloneDX SBOM</div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        SECTION 03: LIVE SECURITY BENCH
        ========================================================================
      */}
      <section className="max-w-6xl mx-auto py-20 px-6 w-full border-t border-stone-800">
        <div className="earth-card rounded-2xl p-8 sm:p-12 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-10">
            <div className="flex-1 space-y-4">
              <div className="text-xs font-mono font-semibold text-clay-400 uppercase tracking-widest">
                03 / INTERACTIVE AUDIT WORKBENCH
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold text-stone-100">
                Experience the Live Lab Application
              </h2>
              <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
                FlowVault is running live in the background. You can sign in using pre-configured test personas to evaluate authorization boundaries, multi-tenant order segregation, and coupon race conditions directly in your browser.
              </p>

              <div className="space-y-2 pt-2 text-xs sm:text-sm text-stone-300 font-mono">
                <div>✓ Multi-Tenant Isolation: Test User A vs User B order data.</div>
                <div>✓ Prompt Injection Defense: Verify AI assistant scope restrictions.</div>
                <div>✓ Offline Fallback: Zero dependency on external network services.</div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="/dashboard"
                  className="px-6 py-3 rounded-lg btn-clay text-xs sm:text-sm font-semibold"
                >
                  Open Live Dashboard ⚡
                </Link>
                <Link
                  href="/login"
                  className="px-5 py-3 rounded-lg btn-stone text-xs sm:text-sm font-medium"
                >
                  Quick Sign-In Credentials
                </Link>
              </div>
            </div>

            {/* Test Credentials Box */}
            <div className="w-full lg:w-5/12 p-6 rounded-xl bg-stone-900 border border-stone-800 font-mono text-xs space-y-3.5">
              <div className="text-stone-400 font-bold uppercase tracking-wider text-[11px] pb-2 border-b border-stone-800 flex items-center justify-between">
                <span>PRE-SEEDED ACCOUNTS</span>
                <span className="text-emerald-500 font-normal">Active &amp; Ready</span>
              </div>

              <div className="p-3 rounded bg-stone-950 border border-stone-800/80">
                <div className="font-bold text-stone-200">User A (Standard Tenant)</div>
                <div className="text-stone-400 text-[11px] mt-1">usera@example.com / Password123!</div>
              </div>

              <div className="p-3 rounded bg-stone-950 border border-stone-800/80">
                <div className="font-bold text-amber-sand">User B (Confidential Data)</div>
                <div className="text-stone-400 text-[11px] mt-1">userb@example.com / Password123!</div>
              </div>

              <div className="p-3 rounded bg-stone-950 border border-stone-800/80">
                <div className="font-bold text-clay-400">Administrator Role</div>
                <div className="text-stone-400 text-[11px] mt-1">admin@example.com / Admin123!</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        SECTION 04: CRAFT & STACK
        ========================================================================
      */}
      <section id="skills" className="max-w-6xl mx-auto py-24 px-6 w-full border-t border-stone-800">
        <div className="mb-14">
          <div className="text-clay-400 text-xs font-mono font-semibold uppercase tracking-widest mb-2">
            04 / TOOLKIT &amp; CRAFT
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-100">
            Languages, Systems, and Practices
          </h2>
          <p className="text-stone-400 text-sm sm:text-base max-w-2xl mt-2 font-normal leading-relaxed">
            A deliberate stack chosen for reliability, developer ergonomics, and rock-solid production performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono text-xs">
          <div className="earth-card rounded-xl p-6">
            <div className="text-clay-400 font-bold mb-3 flex items-center space-x-2">
              <Code2 className="w-4 h-4" />
              <span>FRONTEND</span>
            </div>
            <div className="space-y-2 text-stone-300">
              <div>• Next.js 15 (App Router)</div>
              <div>• React 19 &amp; Server Actions</div>
              <div>• TypeScript (Strict Mode)</div>
              <div>• Tailwind CSS &amp; Radix UI</div>
              <div>• WCAG 2.1 AA Standards</div>
            </div>
          </div>

          <div className="earth-card rounded-xl p-6">
            <div className="text-amber-sand font-bold mb-3 flex items-center space-x-2">
              <Server className="w-4 h-4" />
              <span>BACKEND &amp; DATA</span>
            </div>
            <div className="space-y-2 text-stone-300">
              <div>• Node.js &amp; Express</div>
              <div>• PostgreSQL &amp; Supabase RLS</div>
              <div>• RESTful &amp; RPC APIs</div>
              <div>• Redis Caching &amp; Queues</div>
              <div>• Database Migrations</div>
            </div>
          </div>

          <div className="earth-card rounded-xl p-6">
            <div className="text-stone-300 font-bold mb-3 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>SECURITY &amp; AUDITS</span>
            </div>
            <div className="space-y-2 text-stone-300">
              <div>• OWASP Top 10 Auditing</div>
              <div>• Semgrep AST Analysis</div>
              <div>• IDOR / BOLA Prevention</div>
              <div>• SSRF &amp; Injection Defense</div>
              <div>• Cryptographic JWT RBAC</div>
            </div>
          </div>

          <div className="earth-card rounded-xl p-6">
            <div className="text-stone-300 font-bold mb-3 flex items-center space-x-2">
              <GitBranch className="w-4 h-4 text-clay-400" />
              <span>DEVOPS &amp; TOOLING</span>
            </div>
            <div className="space-y-2 text-stone-300">
              <div>• GitHub Actions CI/CD</div>
              <div>• Docker Containerization</div>
              <div>• CycloneDX SBOM Generation</div>
              <div>• Playwright Test Suites</div>
              <div>• Linux &amp; PowerShell</div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        SECTION 05: NOTES ON CRAFTSMANSHIP
        ========================================================================
      */}
      <section id="notes" className="max-w-4xl mx-auto py-20 px-6 w-full border-t border-stone-800">
        <div className="space-y-6">
          <div className="text-clay-400 text-xs font-mono font-semibold uppercase tracking-widest">
            05 / NOTES ON SOFTWARE CRAFT
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-stone-100">
            Principles for Software That Lasts
          </h2>

          <div className="space-y-6 text-stone-300 text-sm sm:text-base leading-relaxed pt-2">
            <p>
              I believe software is most valuable when it is calm, deliberate, and built with craftsmanship. Too much of the modern web is generated in haste—cluttered with loud gradients, placeholder buzzwords, and paper-thin security that buckles under scrutiny.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 font-mono text-xs">
              <div className="p-5 rounded-xl bg-stone-900 border border-stone-800">
                <div className="text-clay-400 font-bold mb-1.5">01. Restraint &amp; Clarity</div>
                <p className="text-stone-400 leading-relaxed font-sans text-xs">
                  Say more with less. Clean architecture and thoughtful typography outlast transient design trends.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-stone-900 border border-stone-800">
                <div className="text-amber-sand font-bold mb-1.5">02. Security as Respect</div>
                <p className="text-stone-400 leading-relaxed font-sans text-xs">
                  Protecting tenant data isn’t an afterthought. It is a fundamental commitment of respect to the people using your tools.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-stone-900 border border-stone-800">
                <div className="text-stone-200 font-bold mb-1.5">03. Tactile Feedback</div>
                <p className="text-stone-400 leading-relaxed font-sans text-xs">
                  Every click, error state, and loading indicator should feel grounded, responsive, and trustworthy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        SECTION 06: CORRESPONDENCE
        ========================================================================
      */}
      <section id="contact" className="max-w-4xl mx-auto py-24 px-6 w-full border-t border-stone-800">
        <div className="earth-card rounded-2xl p-8 sm:p-12 relative">
          <div className="text-clay-400 text-xs font-mono font-semibold uppercase tracking-widest mb-2">
            06 / CORRESPONDENCE
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-stone-100 mb-3">
            Start a Conversation
          </h2>

          <p className="text-stone-400 text-sm sm:text-base mb-8 max-w-xl leading-relaxed">
            Whether you’re exploring a systems architecture collaboration, reviewing application security findings, or discussing full-stack engineering roles, I’d be glad to connect.
          </p>

          {contactSubmitted ? (
            <div className="p-6 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 text-sm max-w-md">
              <CheckCircle2 className="w-8 h-8 text-clay-400 mb-2" />
              <strong>Message Received.</strong> Thank you for your note. I will reply to your email promptly.
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="max-w-lg space-y-4">
              <div>
                <label htmlFor="name-input" className="block text-xs font-mono font-medium text-stone-400 mb-1.5">
                  Your Name
                </label>
                <input
                  id="name-input"
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-stone-950 border border-stone-800 focus:border-clay-500 text-sm text-stone-100 placeholder-stone-600 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="email-input" className="block text-xs font-mono font-medium text-stone-400 mb-1.5">
                  Email Address
                </label>
                <input
                  id="email-input"
                  type="email"
                  required
                  placeholder="alex@company.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-stone-950 border border-stone-800 focus:border-clay-500 text-sm text-stone-100 placeholder-stone-600 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="message-input" className="block text-xs font-mono font-medium text-stone-400 mb-1.5">
                  Message / Inquiries
                </label>
                <textarea
                  id="message-input"
                  rows={4}
                  required
                  placeholder="Describe your engineering requirements, project scope, or questions..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-stone-950 border border-stone-800 focus:border-clay-500 text-sm text-stone-100 placeholder-stone-600 transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-lg btn-clay text-sm font-semibold flex items-center justify-center space-x-2"
              >
                <span>Send Correspondence</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="mt-12 pt-6 border-t border-stone-800 flex flex-wrap items-center justify-between text-xs text-stone-500 font-mono gap-4">
            <span className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-clay-400" />
              <span>India • Global Remote</span>
            </span>
            <span className="flex items-center space-x-2">
              <Briefcase className="w-3.5 h-3.5 text-amber-sand" />
              <span>Full-Stack &amp; Application Security</span>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
