/* ══════════════════════════════════════════════════════════════
   LoadingSkeletons.tsx — Shimmer skeleton components
   Used as in-place placeholders while API data is loading.
══════════════════════════════════════════════════════════════ */

import { ReactNode, useState, useEffect } from "react";
import { Cloud } from "lucide-react";

/**
 * Hook to delay showing a loading state (e.g. skeletons).
 * Prevents flashing when requests resolve extremely fast (like from a cache).
 */
export function useDelayedLoading(isLoading: boolean, delayMs: number = 100) {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isLoading) {
      timeout = setTimeout(() => setShowLoading(true), delayMs);
    } else {
      setShowLoading(false);
    }
    return () => clearTimeout(timeout);
  }, [isLoading, delayMs]);

  return showLoading;
}

// ─── Base shimmer block ─────────────────────────────────────
function Shimmer({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`rounded-lg ${className}`}
      style={{
        background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
        ...style,
      }}
    />
  );
}

// ─── Inject keyframes once ──────────────────────────────────
if (typeof document !== "undefined" && !document.getElementById("shimmer-keyframes")) {
  const style = document.createElement("style");
  style.id = "shimmer-keyframes";
  style.textContent = `
    @keyframes shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    @keyframes fadeSlideIn {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    .page-enter {
      animation: fadeSlideIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .data-enter {
      animation: fadeIn 0.2s ease forwards;
    }
  `;
  document.head.appendChild(style);
}

// ─── Stat Card Skeleton ─────────────────────────────────────
export function StatCardSkeleton() {
  return (
    <div
      className="bg-white rounded-xl p-4 flex flex-col gap-2 flex-1"
      style={{ border: "1px solid #E2E8F0" }}
    >
      <Shimmer style={{ height: 12, width: "60%" }} />
      <Shimmer style={{ height: 28, width: "80%", marginTop: 4 }} />
      <Shimmer style={{ height: 10, width: "40%", marginTop: 2 }} />
    </div>
  );
}

// ─── Stat Card Skeleton (Mobile 2-col grid) ─────────────────
export function StatCardSkeletonM() {
  return (
    <div className="bg-white rounded-xl p-3" style={{ border: "1px solid #E2E8F0" }}>
      <Shimmer style={{ height: 10, width: "55%" }} />
      <Shimmer style={{ height: 24, width: "75%", marginTop: 6 }} />
      <Shimmer style={{ height: 9, width: "40%", marginTop: 4 }} />
    </div>
  );
}

// ─── Chart Skeleton ─────────────────────────────────────────
export function ChartSkeleton({ height = 160 }: { height?: number }) {
  return (
    <div className="bg-white rounded-xl p-4 flex-1" style={{ border: "1px solid #E2E8F0" }}>
      <div className="flex items-center justify-between mb-3">
        <Shimmer style={{ height: 13, width: "45%" }} />
        <Shimmer style={{ height: 11, width: "20%" }} />
      </div>
      {/* Fake bar chart */}
      <div className="flex items-end gap-2" style={{ height }}>
        {[55, 80, 40, 95, 60, 75].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end gap-1">
            <Shimmer style={{ height: `${h}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Pie / Donut Skeleton ───────────────────────────────────
export function PieSkeleton() {
  return (
    <div
      className="bg-white rounded-xl p-4 flex flex-col"
      style={{ width: 200, border: "1px solid #E2E8F0" }}
    >
      <Shimmer style={{ height: 13, width: "70%", marginBottom: 12 }} />
      <div className="flex justify-center items-center" style={{ height: 120 }}>
        <div
          className="rounded-full"
          style={{
            width: 100,
            height: 100,
            background:
              "conic-gradient(#e2e8f0 0%, #f1f5f9 30%, #e2e8f0 60%, #f1f5f9 100%)",
            animation: "shimmer 1.5s infinite",
            backgroundSize: "200% 100%",
          }}
        />
      </div>
    </div>
  );
}

// ─── Table Row Skeleton ─────────────────────────────────────
function TableRowSkeleton({ cols }: { cols: number }) {
  return (
    <tr className="border-t border-slate-50">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          {i === 0 ? (
            <div className="flex items-center gap-2">
              <Shimmer style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0 }} />
              <Shimmer style={{ height: 12, width: "70%" }} />
            </div>
          ) : (
            <Shimmer style={{ height: 12, width: i % 2 === 0 ? "60%" : "80%" }} />
          )}
        </td>
      ))}
    </tr>
  );
}

// ─── Table Skeleton ─────────────────────────────────────────
export function TableSkeleton({
  cols = 7,
  rows = 5,
  headers,
}: {
  cols?: number;
  rows?: number;
  headers?: string[];
}) {
  return (
    <div className="bg-white rounded-xl" style={{ border: "1px solid #E2E8F0" }}>
      <table className="w-full">
        <thead>
          <tr style={{ background: "#F8FAFC" }}>
            {(headers || Array.from({ length: cols })).map((h, i) => (
              <th key={i} className="px-4 py-2.5 border-b border-slate-100">
                <Shimmer style={{ height: 11, width: typeof h === "string" && h ? "80%" : "60%" }} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} cols={cols} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Card List Skeleton (mobile) ────────────────────────────
export function CardListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl p-3"
          style={{ border: "1px solid #E2E8F0" }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Shimmer style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0 }} />
              <Shimmer style={{ height: 12, width: 100 }} />
            </div>
            <Shimmer style={{ height: 18, width: 52, borderRadius: 999 }} />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {[0, 1, 2].map((j) => (
              <div key={j}>
                <Shimmer style={{ height: 9, width: "50%", marginBottom: 4 }} />
                <Shimmer style={{ height: 12, width: "80%" }} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Overview Dashboard Skeleton (Desktop) ──────────────────
export function OverviewSkeletonD() {
  return (
    <div className="flex flex-col gap-4 data-enter">
      {/* Heading */}
      <div className="flex items-center justify-between">
        <div>
          <Shimmer style={{ height: 18, width: 220, marginBottom: 6 }} />
          <Shimmer style={{ height: 12, width: 300 }} />
        </div>
        <Shimmer style={{ height: 34, width: 100, borderRadius: 8 }} />
      </div>
      {/* 4 stat cards */}
      <div className="flex gap-3">
        {[0, 1, 2, 3].map((i) => <StatCardSkeleton key={i} />)}
      </div>
      {/* Charts */}
      <div className="flex gap-3">
        <ChartSkeleton height={160} />
        <PieSkeleton />
      </div>
      {/* Table */}
      <TableSkeleton cols={7} rows={4} />
    </div>
  );
}

// ─── Overview Dashboard Skeleton (Mobile) ───────────────────
export function OverviewSkeletonM() {
  return (
    <div className="flex flex-col gap-3 p-3 data-enter">
      <Shimmer style={{ height: 15, width: 180, marginBottom: 2 }} />
      <div className="grid grid-cols-2 gap-2">
        {[0, 1, 2, 3].map((i) => <StatCardSkeletonM key={i} />)}
      </div>
      <ChartSkeleton height={100} />
      <CardListSkeleton count={3} />
    </div>
  );
}

// ─── Campaigns Skeleton (Desktop) ───────────────────────────
export function CampaignsSkeletonD() {
  return (
    <div className="flex flex-col gap-4 data-enter">
      <div className="flex items-center justify-between">
        <Shimmer style={{ height: 18, width: 130 }} />
        <Shimmer style={{ height: 34, width: 120, borderRadius: 8 }} />
      </div>
      <div className="flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <Shimmer key={i} style={{ height: 30, width: 90, borderRadius: 8 }} />
        ))}
      </div>
      <TableSkeleton cols={7} rows={6} />
    </div>
  );
}

// ─── Clients Skeleton (Desktop) ─────────────────────────────
export function ClientsSkeletonD() {
  return (
    <div className="flex flex-col gap-4 data-enter">
      <div className="flex items-center justify-between">
        <Shimmer style={{ height: 18, width: 100 }} />
        <Shimmer style={{ height: 34, width: 110, borderRadius: 8 }} />
      </div>
      <TableSkeleton cols={8} rows={6} />
    </div>
  );
}

// ─── Sync Status Skeleton (Desktop) ─────────────────────────
export function SyncSkeletonD() {
  return (
    <div className="flex flex-col gap-4 data-enter">
      <div className="flex items-center justify-between">
        <Shimmer style={{ height: 18, width: 130 }} />
        <div className="flex gap-2">
          <Shimmer style={{ height: 34, width: 110, borderRadius: 8 }} />
          <Shimmer style={{ height: 34, width: 90, borderRadius: 8 }} />
        </div>
      </div>
      <TableSkeleton cols={5} rows={5} />
    </div>
  );
}

// ─── Reports Skeleton ────────────────────────────────────────
export function ReportsSkeletonD() {
  return (
    <div className="flex flex-col gap-4 data-enter">
      <div className="flex items-center justify-between">
        <Shimmer style={{ height: 18, width: 100 }} />
        <div className="flex gap-2">
          <Shimmer style={{ height: 34, width: 130, borderRadius: 8 }} />
          <Shimmer style={{ height: 34, width: 100, borderRadius: 8 }} />
        </div>
      </div>
      {/* Stat row */}
      <div className="flex gap-3">
        {[0, 1, 2, 3].map((i) => <StatCardSkeleton key={i} />)}
      </div>
      <TableSkeleton cols={7} rows={5} />
    </div>
  );
}

// ─── Generic full-page spinner (for initial auth / route load) ─
export function PageSpinner({ message = "Authenticating" }: { message?: string }) {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-5 z-50"
      style={{ background: "#F8FAFC" }}
    >
      {/* Logo container with pulse animation */}
      <div className="relative flex items-center justify-center">
        {/* Outer glowing rings */}
        <div className="absolute inset-0 rounded-2xl bg-indigo-500 opacity-20 animate-ping" style={{ animationDuration: '2s' }} />
        <div className="absolute inset-[-12px] rounded-2xl border border-indigo-200 opacity-50 animate-pulse" style={{ animationDuration: '2s' }} />
        
        {/* Core logo box */}
        <div
          className="relative z-10 rounded-2xl p-4 shadow-xl flex items-center justify-center"
          style={{ 
            background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
          }}
        >
          <Cloud size={28} className="text-white opacity-90" />
        </div>
      </div>

      {/* Brand text */}
      <div className="flex flex-col items-center gap-1.5 animate-pulse" style={{ animationDuration: '2s' }}>
        <h2 className="text-slate-800 font-bold tracking-tight" style={{ fontSize: 22 }}>
          Cloud<span className="text-indigo-600">CRM</span>
        </h2>
        <div className="flex items-center gap-2">
          <div className="w-4 h-[2px] bg-indigo-200 rounded-full" />
          <p className="text-slate-400 font-medium tracking-widest uppercase" style={{ fontSize: 10 }}>{message}</p>
          <div className="w-4 h-[2px] bg-indigo-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ─── Team & Access Skeleton ──────────────────────────────────
export function TeamAccessSkeleton() {
  return (
    <div className="flex flex-col gap-5 data-enter">
      {/* Heading row */}
      <div className="flex items-center justify-between">
        <div>
          <Shimmer style={{ height: 18, width: 160, marginBottom: 6 }} />
          <Shimmer style={{ height: 12, width: 280 }} />
        </div>
        <Shimmer style={{ height: 34, width: 140, borderRadius: 8 }} />
      </div>

      {/* Managers section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Shimmer style={{ width: 16, height: 16, borderRadius: 4 }} />
          <Shimmer style={{ height: 14, width: 90 }} />
        </div>
        <div className="bg-white rounded-xl" style={{ border: "1px solid #E2E8F0" }}>
          <table className="w-full">
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                {["Manager", "Email", "Status", "Assigned Clients", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 border-b border-slate-100">
                    <Shimmer style={{ height: 11, width: "70%" }} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2].map((i) => (
                <tr key={i} className="border-t border-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Shimmer style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0 }} />
                      <Shimmer style={{ height: 12, width: 110 }} />
                    </div>
                  </td>
                  <td className="px-4 py-3"><Shimmer style={{ height: 12, width: 160 }} /></td>
                  <td className="px-4 py-3"><Shimmer style={{ height: 20, width: 60, borderRadius: 999 }} /></td>
                  <td className="px-4 py-3"><Shimmer style={{ height: 12, width: 70 }} /></td>
                  <td className="px-4 py-3"><Shimmer style={{ height: 28, width: 100, borderRadius: 6 }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employees section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Shimmer style={{ width: 16, height: 16, borderRadius: 4 }} />
          <Shimmer style={{ height: 14, width: 100 }} />
        </div>
        <div className="bg-white rounded-xl" style={{ border: "1px solid #E2E8F0" }}>
          <table className="w-full">
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                {["Employee", "Email", "Status", "Assigned Manager", "Campaigns", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 border-b border-slate-100">
                    <Shimmer style={{ height: 11, width: "70%" }} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2, 3].map((i) => (
                <tr key={i} className="border-t border-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Shimmer style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0 }} />
                      <Shimmer style={{ height: 12, width: 100 }} />
                    </div>
                  </td>
                  <td className="px-4 py-3"><Shimmer style={{ height: 12, width: 150 }} /></td>
                  <td className="px-4 py-3"><Shimmer style={{ height: 20, width: 60, borderRadius: 999 }} /></td>
                  <td className="px-4 py-3"><Shimmer style={{ height: 12, width: 90 }} /></td>
                  <td className="px-4 py-3"><Shimmer style={{ height: 12, width: 80 }} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Shimmer style={{ height: 28, width: 110, borderRadius: 6 }} />
                      <Shimmer style={{ height: 28, width: 120, borderRadius: 6 }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Section Transition Wrapper ─────────────────────────────
// Wrap any section content — every time `sectionKey` changes,
// it remounts and triggers the fade+slide-in animation.
export function PageTransition({ sectionKey, children }: { sectionKey: string; children: ReactNode }) {
  return (
    <div key={sectionKey} className="page-enter w-full h-full">
      {children}
    </div>
  );
}
