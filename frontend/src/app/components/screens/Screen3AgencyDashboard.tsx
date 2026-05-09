import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
  LayoutDashboard, Users, Megaphone, FileBarChart,
  RefreshCw, Settings, Bell, Search, ChevronDown,
  Plus, Cloud, ArrowUpRight, ArrowDownRight, MoreHorizontal,
  Filter, Download, AlertTriangle, CheckCircle2, XCircle, LogOut, ShieldCheck
} from "lucide-react";
export const fmtK = (num: number) => `$${(num / 1000).toFixed(1)}k`;
export const fmtFull = (num: number) => `$${num.toLocaleString()}`;
import { useAuth } from "../../context/AuthContext";
import { AgencyTeamTab } from "./AgencyTeamTab";
import { AgencyReportsTab } from "./AgencyReportsTab";

type Section = "Dashboard" | "Clients" | "Campaigns" | "Reports" | "Sync Status" | "Team & Access" | "Settings";

const NAV: { key: Section; icon: React.FC<{ size?: number; className?: string }> }[] = [
  { key: "Dashboard", icon: LayoutDashboard },
  { key: "Clients", icon: Users },
  { key: "Campaigns", icon: Megaphone },
  { key: "Reports", icon: FileBarChart },
  { key: "Sync Status", icon: RefreshCw },
  { key: "Team & Access", icon: ShieldCheck },
  { key: "Settings", icon: Settings },
];

/* ── Shared atoms ──────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; dot: string }> = {
    Active: { bg: "#ECFDF5", text: "#065F46", dot: "#10B981" },
    Paused: { bg: "#FFFBEB", text: "#92400E", dot: "#F59E0B" },
    Setup: { bg: "#F1F5F9", text: "#475569", dot: "#94A3B8" },
    Synced: { bg: "#ECFDF5", text: "#065F46", dot: "#10B981" },
    Warning: { bg: "#FFFBEB", text: "#92400E", dot: "#F59E0B" },
    Error: { bg: "#FFF1F2", text: "#9F1239", dot: "#F43F5E" },
  };
  const s = map[status] || map.Setup;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-medium" style={{ background: s.bg, color: s.text, fontSize: 11 }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
      {status}
    </span>
  );
}

function PlatformBadge({ platform }: { platform: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    "Google Ads": { bg: "#EEF2FF", color: "#4338CA" },
    "Meta Ads": { bg: "#FDF2F8", color: "#9D174D" },
    "Mailchimp": { bg: "#FFFBEB", color: "#92400E" },
  };
  const s = map[platform] || { bg: "#F1F5F9", color: "#475569" };
  return (
    <span className="inline-flex items-center rounded px-2 py-0.5 font-medium" style={{ background: s.bg, color: s.color, fontSize: 11 }}>
      {platform}
    </span>
  );
}

function StatCard({ label, value, sub, up }: { label: string; value: string; sub: string; up: boolean }) {
  return (
    <div className="bg-white rounded-xl p-4 flex flex-col gap-2 flex-1" style={{ border: "1px solid #E2E8F0" }}>
      <span className="text-slate-500 font-medium" style={{ fontSize: 12 }}>{label}</span>
      <span className="text-slate-900 font-bold" style={{ fontSize: 22 }}>{value}</span>
      <div className="flex items-center gap-1">
        {up ? (
          <ArrowUpRight size={12} style={{ color: "#10B981" }} />
        ) : (
          <ArrowDownRight size={12} style={{ color: "#F43F5E" }} />
        )}
        <span className="font-medium" style={{ fontSize: 11, color: up ? "#10B981" : "#F43F5E" }}>
          {sub}
        </span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DESKTOP SECTIONS
══════════════════════════════════════════════════════════════ */

function DashboardD({ onSection }: { onSection: (s: Section) => void }) {
  const navigate = useNavigate();
  const { apiFetch, user } = useAuth();
  const canAddClient = user?.role === "admin";
  
  const [metrics, setMetrics] = useState<any>({ total_spend: 0, avg_roas: 0, active_clients: 0, total_campaigns: 0 });
  const [clients, setClients] = useState<any[]>([]);
  const [monthlySpend, setMonthlySpend] = useState<any[]>([]);
  const [platformPie, setPlatformPie] = useState<any[]>([]);

  useEffect(() => {
    apiFetch("/api/dashboard/agency").then(res => res.json()).then(setMetrics);
    apiFetch("/api/clients").then(res => res.json()).then(data => setClients((data.clients || []).slice(0, 5)));
    apiFetch("/api/charts/agency-spend").then(res => res.json()).then(data => {
      if (data.data) {
         setPlatformPie(data.data.map((d: any) => ({
           name: d.platform,
           value: Number(d.spend),
           color: d.platform === 'google_ads' ? '#6366F1' : d.platform === 'meta_ads' ? '#EC4899' : '#F59E0B'
         })));
      }
    });
    // For now we'll just show empty for monthlySpend since there isn't a month-grouped backend endpoint yet
  }, [apiFetch]);
  return (
    <div className="flex flex-col gap-4">
      {/* Page heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900 font-bold" style={{ fontSize: 18 }}>Good morning, Sarah 👋</h1>
          <p className="text-slate-500" style={{ fontSize: 12 }}>Monday, 16 March 2026 · Bright Agency</p>
        </div>
        {canAddClient && (
          <button
            onClick={() => navigate("/agency/add-client")}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-white font-semibold cursor-pointer"
            style={{ background: "#6366F1", fontSize: 12 }}
          >
            <Plus size={13} /> Add Client
          </button>
        )}
      </div>

      {/* 4 stat cards */}
      <div className="flex gap-3">
        <StatCard label="Total Spend (Mar)" value={fmtK(metrics.total_spend)} sub="" up={true} />
        <StatCard label="Avg ROAS" value={`${metrics.avg_roas}×`} sub="" up={true} />
        <StatCard label="Active Clients" value={String(metrics.active_clients)} sub="" up={true} />
        <StatCard label="Total Campaigns" value={String(metrics.total_campaigns)} sub="" up={true} />
      </div>

      {/* Charts row */}
      <div className="flex gap-3">
        {/* Bar chart */}
        <div className="bg-white rounded-xl p-4 flex-1" style={{ border: "1px solid #E2E8F0" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-800 font-semibold" style={{ fontSize: 13 }}>Monthly Spend by Platform</span>
            <span className="text-slate-400" style={{ fontSize: 11 }}>Oct – Mar</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={monthlySpend} barSize={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip formatter={(v: number) => fmtFull(v)} contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E2E8F0" }} />
              <Bar dataKey="google" name="Google Ads" fill="#6366F1" radius={[3, 3, 0, 0]} />
              <Bar dataKey="meta" name="Meta Ads" fill="#EC4899" radius={[3, 3, 0, 0]} />
              <Bar dataKey="mailchimp" name="Mailchimp" fill="#F59E0B" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2">
            {[["Google Ads", "#6366F1"], ["Meta Ads", "#EC4899"], ["Mailchimp", "#F59E0B"]].map(([n, c]) => (
              <div key={n} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />
                <span className="text-slate-500" style={{ fontSize: 10 }}>{n}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-xl p-4 flex flex-col" style={{ width: 200, border: "1px solid #E2E8F0" }}>
          <span className="text-slate-800 font-semibold mb-3" style={{ fontSize: 13 }}>Mar Breakdown</span>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie data={platformPie} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={3}>
                {platformPie.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => fmtK(v)} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1.5 mt-auto">
            {platformPie.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-slate-500" style={{ fontSize: 10 }}>{d.name}</span>
                </div>
                <span className="text-slate-700 font-semibold" style={{ fontSize: 10 }}>{fmtK(d.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Client table */}
      <div className="bg-white rounded-xl" style={{ border: "1px solid #E2E8F0" }}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <span className="text-slate-800 font-semibold" style={{ fontSize: 13 }}>Clients Overview</span>
          <button onClick={() => onSection("Clients")} className="text-slate-500 hover:text-indigo-600 cursor-pointer" style={{ fontSize: 12 }}>View all →</button>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ background: "#F8FAFC" }}>
              {["Client", "Industry", "Spend", "ROAS", "Leads", "Campaigns", "Status"].map((h) => (
                <th key={h} className="px-4 py-2 text-left text-slate-500 font-semibold" style={{ fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clients.map((c, i) => (
              <tr key={c.id} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: "#6366F1", fontSize: 9 }}>{c.name.substring(0, 2).toUpperCase()}</div>
                    <span className="text-slate-800 font-medium" style={{ fontSize: 12 }}>{c.name}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-slate-500" style={{ fontSize: 12 }}>{c.industry || 'N/A'}</td>
                <td className="px-4 py-2.5 text-slate-800 font-semibold" style={{ fontSize: 12 }}>{fmtK(c.total_spend || 0)}</td>
                <td className="px-4 py-2.5 text-slate-800" style={{ fontSize: 12 }}>-</td>
                <td className="px-4 py-2.5 text-slate-800" style={{ fontSize: 12 }}>{c.total_leads || 0}</td>
                <td className="px-4 py-2.5 text-slate-800" style={{ fontSize: 12 }}>{c.campaign_count || 0}</td>
                <td className="px-4 py-2.5"><StatusBadge status={c.onboarding_status === 'active' ? 'Active' : 'Setup'} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ClientsD({ search }: { search: string }) {
  const navigate = useNavigate();
  const { apiFetch, user } = useAuth();
  const canAddClient = user?.role === "admin";
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    apiFetch("/api/clients").then(res => res.json()).then(data => setClients(data.clients || []));
  }, [apiFetch]);

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.industry || '').toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-slate-900 font-bold" style={{ fontSize: 18 }}>Clients</h1>
        {canAddClient && (
          <button
            onClick={() => navigate("/agency/add-client")}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-white font-semibold cursor-pointer"
            style={{ background: "#6366F1", fontSize: 12 }}
          >
            <Plus size={13} /> Add Client
          </button>
        )}
      </div>
      <div className="bg-white rounded-xl" style={{ border: "1px solid #E2E8F0" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "#F8FAFC" }}>
              {["Client", "Industry", "Monthly Budget", "Email", "Campaigns", "ROAS", "Status", ""].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-slate-500 font-semibold border-b border-slate-100" style={{ fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-t border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: "#6366F1", fontSize: 10 }}>{c.name.substring(0, 2).toUpperCase()}</div>
                    <div>
                      <div className="text-slate-800 font-semibold" style={{ fontSize: 12 }}>{c.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500" style={{ fontSize: 12 }}>{c.industry || 'N/A'}</td>
                <td className="px-4 py-3 text-slate-800 font-semibold" style={{ fontSize: 12 }}>{fmtK(c.monthly_budget || 0)}/mo</td>
                <td className="px-4 py-3 text-slate-500" style={{ fontSize: 12 }}>-</td>
                <td className="px-4 py-3 text-slate-800" style={{ fontSize: 12 }}>{c.campaign_count || 0}</td>
                <td className="px-4 py-3 text-slate-800" style={{ fontSize: 12 }}>-</td>
                <td className="px-4 py-3"><StatusBadge status={c.onboarding_status === 'active' ? 'Active' : 'Setup'} /></td>
                <td className="px-4 py-3 text-right text-slate-400 hover:text-indigo-600">
                  <MoreHorizontal size={14} className="ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-400" style={{ fontSize: 13 }}>No clients match your search.</div>
        )}
      </div>
    </div>
  );
}

function CampaignsD({ search }: { search: string }) {
  const navigate = useNavigate();
  const { apiFetch } = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    apiFetch("/api/campaigns").then(res => res.json()).then(data => setCampaigns(data.campaigns || []));
  }, [apiFetch]);

  const filtered = campaigns.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.client_name || '').toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-slate-900 font-bold" style={{ fontSize: 18 }}>Campaigns</h1>
        <button className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-white font-semibold cursor-pointer" style={{ background: "#6366F1", fontSize: 12 }}>
          <Plus size={13} /> New Campaign
        </button>
      </div>
      <div className="flex items-center gap-2">
        {["All Clients ▾", "Platform ▾", "Status ▾", "Date ▾"].map((f) => (
          <button key={f} className="border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 bg-white hover:border-indigo-400 transition-colors" style={{ fontSize: 11 }}>{f}</button>
        ))}
        <div className="flex-1" />
        <button className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 bg-white" style={{ fontSize: 11 }}>
          <Download size={11} /> Export
        </button>
      </div>
      <div className="bg-white rounded-xl" style={{ border: "1px solid #E2E8F0" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "#F8FAFC" }}>
              {["Campaign", "Client", "Platform", "Spend", "ROAS", "Leads", "Status", ""].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-slate-500 font-semibold border-b border-slate-100" style={{ fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-slate-800 font-medium" style={{ fontSize: 12 }}>{c.name}</td>
                <td className="px-4 py-3 text-slate-500" style={{ fontSize: 12 }}>{c.client_name}</td>
                <td className="px-4 py-3">
                  <PlatformBadge platform={
                    c.platform === 'google_ads' ? 'Google Ads' :
                    c.platform === 'meta_ads' ? 'Meta Ads' :
                    c.platform === 'linkedin_ads' ? 'LinkedIn Ads' :
                    c.platform === 'twitter_ads' ? 'Twitter Ads' :
                    'Mailchimp'
                  } />
                </td>
                <td className="px-4 py-3 text-slate-800 font-semibold" style={{ fontSize: 12 }}>{fmtK(c.budget || 0)}</td>
                <td className="px-4 py-3 text-slate-800" style={{ fontSize: 12 }}>-</td>
                <td className="px-4 py-3 text-slate-800" style={{ fontSize: 12 }}>-</td>
                <td className="px-4 py-3"><StatusBadge status={c.status === 'active' ? 'Active' : c.status === 'paused' ? 'Paused' : 'Completed'} /></td>
                <td className="px-4 py-3"><button className="text-slate-400 hover:text-slate-600 cursor-pointer"><MoreHorizontal size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-400" style={{ fontSize: 13 }}>No campaigns match your search.</div>
        )}
      </div>
    </div>
  );
}

function ReportsD() {
  const { apiFetch } = useAuth();
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    apiFetch("/api/clients").then(res => res.json()).then(data => setClients(data.clients || []));
  }, [apiFetch]);
  const types = [
    { title: "Performance Report", desc: "Spend, ROAS, CTR per client" },
    { title: "Lead Gen Summary", desc: "Leads, CPL, conversion rate" },
    { title: "Platform Breakdown", desc: "Google vs Meta vs Mailchimp" },
    { title: "Monthly Overview", desc: "Full agency rollup report" },
  ];
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-slate-900 font-bold" style={{ fontSize: 18 }}>Reports</h1>
      <div className="grid grid-cols-2 gap-3">
        {types.map((r) => (
          <div key={r.title} className="bg-white rounded-xl p-4 flex flex-col gap-2 cursor-pointer hover:border-indigo-300 transition-colors" style={{ border: "1px solid #E2E8F0" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#EEF2FF" }}>
              <FileBarChart size={16} style={{ color: "#6366F1" }} />
            </div>
            <div className="text-slate-800 font-semibold" style={{ fontSize: 13 }}>{r.title}</div>
            <div className="text-slate-500" style={{ fontSize: 12 }}>{r.desc}</div>
            <button className="text-xs font-semibold mt-1 text-left" style={{ color: "#6366F1" }}>Generate →</button>
          </div>
        ))}
      </div>
      {/* Generate form */}
      <div className="bg-white rounded-xl p-5" style={{ border: "1px solid #E2E8F0" }}>
        <h2 className="text-slate-800 font-semibold mb-4" style={{ fontSize: 13 }}>Custom Report Builder</h2>
        <div className="flex gap-3 items-end">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs font-semibold text-slate-500">Client</label>
            <select className="border border-slate-200 rounded-lg px-3 py-2 text-slate-700 bg-white outline-none" style={{ fontSize: 12 }}>
              <option>All Clients</option>
              {clients.map((c: any) => <option key={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs font-semibold text-slate-500">Date Range</label>
            <select className="border border-slate-200 rounded-lg px-3 py-2 text-slate-700 bg-white outline-none" style={{ fontSize: 12 }}>
              <option>This month</option>
              <option>Last 3 months</option>
              <option>Last 6 months</option>
            </select>
          </div>
          <div className="flex flex-col gap-1" style={{ width: 120 }}>
            <label className="text-xs font-semibold text-slate-500">Format</label>
            <select className="border border-slate-200 rounded-lg px-3 py-2 text-slate-700 bg-white outline-none" style={{ fontSize: 12 }}>
              <option>PDF</option>
              <option>CSV</option>
            </select>
          </div>
          <button className="rounded-lg px-4 py-2 text-white font-semibold flex items-center gap-1.5" style={{ background: "#6366F1", fontSize: 12 }}>
            <Download size={13} /> Generate
          </button>
        </div>
      </div>
    </div>
  );
}

function SyncStatusD() {
  const { apiFetch } = useAuth();
  const [syncRows, setSyncRows] = useState<any[]>([]);
  const [syncingIds, setSyncingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    apiFetch("/api/sync/all-logs", { cache: "no-store" }).then(res => res.json()).then(data => setSyncRows(data.logs || []));
  }, [apiFetch]);

  async function handleSync(clientId: string, platform?: string) {
    const key = platform ? `${clientId}-${platform}` : clientId;
    if (!clientId || syncingIds.has(key)) return;
    setSyncingIds(prev => new Set(prev).add(key));
    try {
      const routePlat = platform ? platform.replace('_ads', '').replace('linkedin', 'linkedin').replace('twitter', 'twitter') : 'all';
      await apiFetch(`/api/sync/${clientId}/${routePlat}`, { method: "POST" });
      const res = await apiFetch("/api/sync/all-logs", { cache: "no-store" });
      const data = await res.json();
      setSyncRows(data.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setSyncingIds(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  }

  async function handleSyncAll() {
    try {
      const res = await apiFetch("/api/clients");
      const data = await res.json();
      (data.clients || []).forEach((c: any) => handleSync(c.id));
    } catch (err) {
      console.error(err);
    }
  }
  const icons: Record<string, React.ReactNode> = {
    Synced: <CheckCircle2 size={14} style={{ color: "#10B981" }} />,
    Warning: <AlertTriangle size={14} style={{ color: "#F59E0B" }} />,
    Error: <XCircle size={14} style={{ color: "#F43F5E" }} />,
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-slate-900 font-bold" style={{ fontSize: 18 }}>Sync Status</h1>
        <button 
          onClick={handleSyncAll}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 font-semibold border border-slate-200 bg-white text-slate-700 hover:border-indigo-400 transition-colors cursor-pointer" 
          style={{ fontSize: 12 }}
        >
          <RefreshCw size={12} /> Sync All
        </button>
      </div>
      <div className="bg-white rounded-xl" style={{ border: "1px solid #E2E8F0" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "#F8FAFC" }}>
              {["Platform", "Client", "Last Synced", "Status", "Action"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-slate-500 font-semibold border-b border-slate-100" style={{ fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {syncRows.map((r, i) => (
              <tr key={i} className="border-t border-slate-50 hover:bg-slate-50">
                <td className="px-4 py-3"><PlatformBadge platform={
                    r.platform === 'google_ads' ? 'Google Ads' :
                    r.platform === 'meta_ads' ? 'Meta Ads' :
                    r.platform === 'linkedin_ads' ? 'LinkedIn Ads' :
                    r.platform === 'twitter_ads' ? 'Twitter Ads' :
                    'Mailchimp'
                  } /></td>
                <td className="px-4 py-3 text-slate-700 font-medium" style={{ fontSize: 12 }}>{r.client_name}</td>
                <td className="px-4 py-3 text-slate-500" style={{ fontSize: 12 }}>{new Date(r.synced_at).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {r.status === 'success' ? icons.Synced : r.status === 'failed' ? icons.Error : icons.Warning}
                    <StatusBadge status={r.status === 'success' ? 'Synced' : r.status === 'failed' ? 'Error' : 'Warning'} />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button 
                    onClick={() => handleSync(r.client_id, r.platform)}
                    disabled={syncingIds.has(`${r.client_id}-${r.platform}`) || syncingIds.has(r.client_id)}
                    className="border border-slate-200 rounded-md px-2.5 py-1 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1" 
                    style={{ fontSize: 11 }}
                  >
                    <RefreshCw size={10} className={(syncingIds.has(`${r.client_id}-${r.platform}`) || syncingIds.has(r.client_id)) ? "animate-spin" : ""} />
                    {(syncingIds.has(`${r.client_id}-${r.platform}`) || syncingIds.has(r.client_id)) ? "Syncing..." : "Sync now"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-slate-400" style={{ fontSize: 11 }}>Data syncs automatically every 15 minutes. Last full sync: 2 mins ago.</p>
    </div>
  );
}

function SettingsD() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-slate-900 font-bold" style={{ fontSize: 18 }}>Settings</h1>
      <div className="flex gap-4">
        {/* Agency info */}
        <div className="bg-white rounded-xl p-5 flex flex-col gap-4 flex-1" style={{ border: "1px solid #E2E8F0" }}>
          <h2 className="text-slate-800 font-semibold" style={{ fontSize: 13 }}>Agency Profile</h2>
          {[
            { label: "Agency Name", value: "Bright Agency" },
            { label: "Contact Email", value: "hello@brightagency.com" },
            { label: "Website", value: "brightagency.com" },
          ].map((f) => (
            <div key={f.label} className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">{f.label}</label>
              <input readOnly defaultValue={f.value} className="border border-slate-200 rounded-lg px-3 py-2 text-slate-700 bg-white" style={{ fontSize: 12 }} />
            </div>
          ))}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-500">Timezone</label>
            <select className="border border-slate-200 rounded-lg px-3 py-2 text-slate-700 bg-white" style={{ fontSize: 12 }}>
              <option>UTC+10 — Sydney, Australia</option>
            </select>
          </div>
          <button className="rounded-lg px-4 py-2 text-white font-semibold w-full" style={{ background: "#6366F1", fontSize: 12 }}>
            Save Changes
          </button>
        </div>

        {/* Team + notifications */}
        <div className="bg-white rounded-xl p-5 flex flex-col gap-4 flex-1" style={{ border: "1px solid #E2E8F0" }}>
          <h2 className="text-slate-800 font-semibold" style={{ fontSize: 13 }}>Team Members</h2>
          {[
            { name: "Sarah Chen", role: "Admin", initials: "SC" },
            { name: "Marcus Lee", role: "Manager", initials: "ML" },
          ].map((m) => (
            <div key={m.name} className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold" style={{ background: "#6366F1", fontSize: 10 }}>{m.initials}</div>
                <div>
                  <div className="text-slate-800 font-medium" style={{ fontSize: 12 }}>{m.name}</div>
                  <div className="text-slate-400" style={{ fontSize: 11 }}>{m.role}</div>
                </div>
              </div>
              <button className="border border-slate-200 rounded-md px-2 py-0.5 text-slate-500" style={{ fontSize: 11 }}>Edit</button>
            </div>
          ))}
          <button className="flex items-center gap-1.5 border border-dashed border-slate-300 rounded-lg px-3 py-2 text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors" style={{ fontSize: 12 }}>
            <Plus size={13} /> Invite Member
          </button>
          <div className="border-t border-slate-100 pt-4">
            <h2 className="text-slate-800 font-semibold mb-3" style={{ fontSize: 13 }}>Notifications</h2>
            {["Email alerts for sync errors", "Weekly performance digest", "Client report reminders", "Budget threshold alerts"].map((n, i) => (
              <label key={i} className="flex items-center justify-between py-2 border-b border-slate-50 cursor-pointer">
                <span className="text-slate-600" style={{ fontSize: 12 }}>{n}</span>
                <input type="checkbox" defaultChecked={i < 3} className="rounded" />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MOBILE SECTIONS
═════════════════════════════════════════════════════════════ */

function DashboardM() {
  const { apiFetch } = useAuth();
  const [metrics, setMetrics] = useState<any>({ total_spend: 0, avg_roas: 0, active_clients: 0, total_campaigns: 0 });
  const [clients, setClients] = useState<any[]>([]);
  const [monthlySpend, setMonthlySpend] = useState<any[]>([]);

  useEffect(() => {
    apiFetch("/api/dashboard/agency").then(res => res.json()).then(setMetrics);
    apiFetch("/api/clients").then(res => res.json()).then(data => setClients((data.clients || []).slice(0, 4)));
  }, [apiFetch]);

  return (
    <div className="flex flex-col gap-3 p-3">
      <div>
        <p className="text-slate-800 font-bold" style={{ fontSize: 15 }}>Good morning, Sarah 👋</p>
        <p className="text-slate-400" style={{ fontSize: 11 }}>March 2026 · Bright Agency</p>
      </div>
      {/* 2×2 stats */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Total Spend", value: fmtK(metrics.total_spend), up: true },
          { label: "Avg ROAS", value: `${metrics.avg_roas}×`, up: false },
          { label: "Active Clients", value: String(metrics.active_clients), up: true },
          { label: "Campaigns", value: String(metrics.total_campaigns), up: true },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-3" style={{ border: "1px solid #E2E8F0" }}>
            <p className="text-slate-400" style={{ fontSize: 10 }}>{s.label}</p>
            <p className="text-slate-900 font-bold mt-0.5" style={{ fontSize: 17 }}>{s.value}</p>
            <p style={{ fontSize: 10, color: s.up ? "#10B981" : "#F43F5E" }}>{s.up ? "↑" : "↓"} vs last month</p>
          </div>
        ))}
      </div>
      {/* Chart */}
      <div className="bg-white rounded-xl p-3" style={{ border: "1px solid #E2E8F0" }}>
        <p className="text-slate-700 font-semibold mb-2" style={{ fontSize: 12 }}>Monthly Spend</p>
        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={monthlySpend} barSize={6}>
            <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v: number) => fmtK(v)} contentStyle={{ fontSize: 10, borderRadius: 8 }} />
            <Bar dataKey="google" fill="#6366F1" radius={[2, 2, 0, 0]} />
            <Bar dataKey="meta" fill="#EC4899" radius={[2, 2, 0, 0]} />
            <Bar dataKey="mailchimp" fill="#F59E0B" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Client list */}
      <div className="bg-white rounded-xl" style={{ border: "1px solid #E2E8F0" }}>
        <div className="px-3 py-2.5 border-b border-slate-100">
          <span className="text-slate-700 font-semibold" style={{ fontSize: 12 }}>Clients</span>
        </div>
        {clients.slice(0, 4).map((c) => (
          <div key={c.id} className="flex items-center justify-between px-3 py-2.5 border-b border-slate-50">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: "#6366F1", fontSize: 9 }}>{c.name.substring(0, 2).toUpperCase()}</div>
              <div>
                <p className="text-slate-800 font-medium" style={{ fontSize: 11 }}>{c.name}</p>
                <p className="text-slate-400" style={{ fontSize: 10 }}>{fmtK(c.total_spend || 0)} · {c.campaign_count || 0} cmpgs</p>
              </div>
            </div>
            <StatusBadge status={c.onboarding_status === 'active' ? 'Active' : 'Setup'} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientsM({ search }: { search: string }) {
  const navigate = useNavigate();
  const { apiFetch, user } = useAuth();
  const canAddClient = user?.role === "admin";
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    apiFetch("/api/clients").then(res => res.json()).then(data => setClients(data.clients || []));
  }, [apiFetch]);

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.industry || '').toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex items-center justify-between">
        <p className="text-slate-800 font-bold" style={{ fontSize: 15 }}>Clients</p>
        {canAddClient && (
          <button
            onClick={() => navigate("/agency/add-client")}
            className="rounded-lg px-2.5 py-1.5 text-white font-semibold flex items-center gap-1 cursor-pointer"
            style={{ background: "#6366F1", fontSize: 11 }}
          >
            <Plus size={11} /> Add
          </button>
        )}
      </div>
      {filtered.map((c) => (
        <div key={c.id} className="bg-white rounded-xl p-3" style={{ border: "1px solid #E2E8F0" }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold" style={{ background: "#6366F1", fontSize: 10 }}>{c.name.substring(0, 2).toUpperCase()}</div>
              <p className="text-slate-800 font-semibold" style={{ fontSize: 12 }}>{c.name}</p>
            </div>
            <StatusBadge status={c.onboarding_status === 'active' ? 'Active' : 'Setup'} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {([["Spend", fmtK(c.total_spend || 0)], ["ROAS", `-`], ["Leads", c.total_leads || 0]] as [string, string | number][]).map(([l, v]) => (
              <div key={l}>
                <p className="text-slate-400" style={{ fontSize: 9 }}>{l}</p>
                <p className="text-slate-800 font-semibold" style={{ fontSize: 12 }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
      {filtered.length === 0 && (
        <p className="text-center text-slate-400 py-8" style={{ fontSize: 13 }}>No clients found.</p>
      )}
    </div>
  );
}

function CampaignsM({ search }: { search: string }) {
  const { apiFetch } = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    apiFetch("/api/campaigns").then(res => res.json()).then(data => setCampaigns(data.campaigns || []));
  }, [apiFetch]);

  const filtered = campaigns.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.client_name || '').toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="flex flex-col gap-3 p-3">
      <p className="text-slate-800 font-bold" style={{ fontSize: 15 }}>Campaigns</p>
      {filtered.map((c) => (
        <div key={c.id} className="bg-white rounded-xl p-3" style={{ border: "1px solid #E2E8F0" }}>
          <div className="flex items-start justify-between mb-1.5">
            <p className="text-slate-800 font-semibold" style={{ fontSize: 12 }}>{c.name}</p>
            <StatusBadge status={c.status === 'active' ? 'Active' : c.status === 'paused' ? 'Paused' : 'Completed'} />
          </div>
          <div className="flex items-center gap-1.5 mb-2">
            <PlatformBadge platform={
              c.platform === 'google_ads' ? 'Google Ads' :
              c.platform === 'meta_ads' ? 'Meta Ads' :
              c.platform === 'linkedin_ads' ? 'LinkedIn Ads' :
              c.platform === 'twitter_ads' ? 'Twitter Ads' :
              'Mailchimp'
            } />
            <span className="text-slate-400" style={{ fontSize: 11 }}>· {c.client_name}</span>
          </div>
          <div className="flex gap-4">
            {([["Spend", fmtK(c.budget || 0)], ["ROAS", `-`], ["Leads", `-`]] as [string, string | number][]).map(([l, v]) => (
              <div key={l}>
                <p className="text-slate-400" style={{ fontSize: 9 }}>{l}</p>
                <p className="text-slate-800 font-semibold" style={{ fontSize: 12 }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
      {filtered.length === 0 && (
        <p className="text-center text-slate-400 py-8" style={{ fontSize: 13 }}>No campaigns found.</p>
      )}
    </div>
  );
}

function ReportsM() {
  return (
    <div className="flex flex-col gap-3 p-3">
      <p className="text-slate-800 font-bold" style={{ fontSize: 15 }}>Reports</p>
      {["Performance Report", "Lead Gen Summary", "Platform Breakdown", "Monthly Overview"].map((r) => (
        <div key={r} className="bg-white rounded-xl p-3 flex items-center gap-3" style={{ border: "1px solid #E2E8F0" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#EEF2FF" }}>
            <FileBarChart size={14} style={{ color: "#6366F1" }} />
          </div>
          <div className="flex-1">
            <p className="text-slate-800 font-medium" style={{ fontSize: 12 }}>{r}</p>
          </div>
          <button className="font-semibold" style={{ color: "#6366F1", fontSize: 11 }}>→</button>
        </div>
      ))}
      <div className="bg-white rounded-xl p-3" style={{ border: "1px solid #E2E8F0" }}>
        <p className="text-slate-800 font-semibold mb-3" style={{ fontSize: 12 }}>Custom Report</p>
        {["Client", "Date Range", "Format"].map((f) => (
          <div key={f} className="flex flex-col gap-1 mb-2">
            <label className="text-slate-400" style={{ fontSize: 10 }}>{f}</label>
            <select className="border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 bg-white" style={{ fontSize: 11 }}>
              <option>Select…</option>
            </select>
          </div>
        ))}
        <button className="w-full rounded-lg py-2 text-white font-semibold mt-1" style={{ background: "#6366F1", fontSize: 12 }}>Generate Report</button>
      </div>
    </div>
  );
}

function SyncStatusM() {
  const { apiFetch } = useAuth();
  const [syncRows, setSyncRows] = useState<any[]>([]);
  const [syncingIds, setSyncingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    apiFetch("/api/sync/all-logs", { cache: "no-store" }).then(res => res.json()).then(data => setSyncRows(data.logs || []));
  }, [apiFetch]);

  async function handleSync(clientId: string, platform?: string) {
    const key = platform ? `${clientId}-${platform}` : clientId;
    if (!clientId || syncingIds.has(key)) return;
    setSyncingIds(prev => new Set(prev).add(key));
    try {
      const routePlat = platform ? platform.replace('_ads', '').replace('linkedin', 'linkedin').replace('twitter', 'twitter') : 'all';
      await apiFetch(`/api/sync/${clientId}/${routePlat}`, { method: "POST" });
      const res = await apiFetch("/api/sync/all-logs", { cache: "no-store" });
      const data = await res.json();
      setSyncRows(data.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setSyncingIds(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  }

  async function handleSyncAll() {
    try {
      const res = await apiFetch("/api/clients");
      const data = await res.json();
      (data.clients || []).forEach((c: any) => handleSync(c.id));
    } catch (err) {
      console.error(err);
    }
  }

  const icons: Record<string, React.ReactNode> = {
    Synced: <CheckCircle2 size={12} style={{ color: "#10B981" }} />,
    Warning: <AlertTriangle size={12} style={{ color: "#F59E0B" }} />,
    Error: <XCircle size={12} style={{ color: "#F43F5E" }} />,
  };
  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex items-center justify-between">
        <p className="text-slate-800 font-bold" style={{ fontSize: 15 }}>Sync Status</p>
        <button 
          onClick={handleSyncAll}
          className="flex items-center gap-1 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-600 cursor-pointer" 
          style={{ fontSize: 11 }}
        >
          <RefreshCw size={11} /> Sync All
        </button>
      </div>
      {syncRows.map((r, i) => (
        <div key={i} className="bg-white rounded-xl p-3" style={{ border: "1px solid #E2E8F0" }}>
          <div className="flex items-center justify-between mb-1">
            <PlatformBadge platform={
              r.platform === 'google_ads' ? 'Google Ads' :
              r.platform === 'meta_ads' ? 'Meta Ads' :
              r.platform === 'linkedin_ads' ? 'LinkedIn Ads' :
              r.platform === 'twitter_ads' ? 'Twitter Ads' :
              'Mailchimp'
            } />
            <div className="flex items-center gap-1">
              {r.status === 'success' ? icons.Synced : r.status === 'failed' ? icons.Error : icons.Warning}
              <StatusBadge status={r.status === 'success' ? 'Synced' : r.status === 'failed' ? 'Error' : 'Warning'} />
            </div>
          </div>
          <p className="text-slate-500" style={{ fontSize: 11 }}>{r.client_name}</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-slate-400" style={{ fontSize: 10 }}>Last synced {new Date(r.synced_at).toLocaleTimeString()}</p>
            <button 
              onClick={() => handleSync(r.client_id, r.platform)}
              disabled={syncingIds.has(`${r.client_id}-${r.platform}`) || syncingIds.has(r.client_id)}
              className="border border-slate-200 rounded px-2 py-0.5 text-slate-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1" 
              style={{ fontSize: 10 }}
            >
              <RefreshCw size={10} className={(syncingIds.has(`${r.client_id}-${r.platform}`) || syncingIds.has(r.client_id)) ? "animate-spin" : ""} />
              {(syncingIds.has(`${r.client_id}-${r.platform}`) || syncingIds.has(r.client_id)) ? "Syncing..." : "Sync"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function SettingsM({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="flex flex-col gap-3 p-3">
      <p className="text-slate-800 font-bold" style={{ fontSize: 15 }}>Settings</p>
      <div className="bg-white rounded-xl p-3" style={{ border: "1px solid #E2E8F0" }}>
        <p className="text-slate-700 font-semibold mb-3" style={{ fontSize: 12 }}>Agency Profile</p>
        {([["Agency Name", "Bright Agency"], ["Email", "hello@brightagency.com"]] as [string, string][]).map(([l, v]) => (
          <div key={l} className="flex flex-col gap-1 mb-2">
            <label className="text-slate-400" style={{ fontSize: 10 }}>{l}</label>
            <input defaultValue={v} className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 bg-white" style={{ fontSize: 11 }} />
          </div>
        ))}
        <button className="w-full rounded-lg py-2 text-white font-semibold mt-1" style={{ background: "#6366F1", fontSize: 12 }}>Save</button>
      </div>
      <div className="bg-white rounded-xl p-3" style={{ border: "1px solid #E2E8F0" }}>
        <p className="text-slate-700 font-semibold mb-3" style={{ fontSize: 12 }}>Team</p>
        {[{ n: "Sarah Chen", r: "Admin", i: "SC" }, { n: "Marcus Lee", r: "Manager", i: "ML" }].map((m) => (
          <div key={m.n} className="flex items-center gap-2 py-2 border-b border-slate-50">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold" style={{ background: "#6366F1", fontSize: 9 }}>{m.i}</div>
            <div className="flex-1">
              <p className="text-slate-800 font-medium" style={{ fontSize: 11 }}>{m.n}</p>
              <p className="text-slate-400" style={{ fontSize: 10 }}>{m.r}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onLogout}
        className="w-full rounded-xl py-3 border border-slate-200 text-slate-600 font-semibold flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors"
        style={{ fontSize: 13 }}
      >
        <LogOut size={15} /> Sign Out
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DESKTOP SHELL
══════════════════════════════════════════════════════════════ */
function Desktop({ section, onSection, search, onSearch }: { section: Section; onSection: (s: Section) => void; search: string; onSearch: (s: string) => void }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";
  const visibleNav = isAdmin ? NAV : NAV.filter(({ key }) => key !== "Team & Access");
  const roleLabel = user?.role === "manager" ? "Manager" : "Admin";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function content() {
    switch (section) {
      case "Dashboard": return <DashboardD onSection={onSection} />;
      case "Clients": return <ClientsD search={search} />;
      case "Campaigns": return <CampaignsD search={search} />;
      case "Reports": return <div className="p-6 max-w-[1200px] mx-auto"><AgencyReportsTab /></div>;
      case "Sync Status": return <SyncStatusD />;
      case "Team & Access": return isAdmin ? <div className="p-6"><AgencyTeamTab /></div> : <DashboardD onSection={onSection} />;
      case "Settings": return <SettingsD />;
    }
  }

  return (
    <div className="flex" style={{ minHeight: "100vh", background: "#F8FAFC" }}>
      {/* Inner CRM Sidebar */}
      <div className="flex flex-col flex-shrink-0" style={{ width: 200, background: "#1E293B" }}>
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="rounded-lg p-1.5" style={{ background: "#6366F1" }}>
            <Cloud size={13} className="text-white" />
          </div>
          <span className="text-white font-bold" style={{ fontSize: 13 }}>CloudCRM</span>
        </div>
        {/* Agency */}
        <div className="px-4 py-2.5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <p className="text-white font-medium" style={{ fontSize: 11 }}>Bright Agency</p>
          <p style={{ fontSize: 10, color: "#64748B" }}>5 clients · Pro plan</p>
        </div>
        {/* Nav */}
        <nav className="flex-1 py-3 flex flex-col gap-0.5 px-2">
          {visibleNav.map(({ key, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onSection(key)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors cursor-pointer text-left"
              style={{
                background: section === key ? "rgba(99,102,241,0.25)" : "transparent",
                color: section === key ? "#A5B4FC" : "#94A3B8",
              }}
            >
              <Icon size={14} />
              <span className="font-medium" style={{ fontSize: 12 }}>{key}</span>
            </button>
          ))}
        </nav>
        {/* User + Sign Out */}
        <div className="px-3 py-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: "#6366F1", fontSize: 9 }}>SC</div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate" style={{ fontSize: 10 }}>{user?.name ?? "Sarah Chen"}</p>
              <p style={{ fontSize: 9, color: "#64748B" }}>{roleLabel}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            style={{ fontSize: 11 }}
          >
            <LogOut size={12} /> Sign Out
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-5 py-3 bg-white border-b border-slate-100 flex-shrink-0">
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => onSearch(e.target.value)}
              placeholder="Search clients, campaigns…"
              className="w-full border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-slate-600 bg-white outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
              style={{ fontSize: 12 }}
            />
          </div>
          <div className="flex-1" />
          <button className="relative text-slate-500">
            <Bell size={16} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full" style={{ background: "#F43F5E" }} />
          </button>
          {isAdmin && (
            <button
              onClick={() => navigate("/agency/add-client")}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-white font-semibold cursor-pointer"
              style={{ background: "#6366F1", fontSize: 12 }}
            >
              <Plus size={13} /> Add Client
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold" style={{ background: "#6366F1", fontSize: 10 }}>SC</div>
            <span className="text-slate-700 font-medium" style={{ fontSize: 12 }}>Sarah Chen</span>
            <ChevronDown size={13} className="text-slate-400" />
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 p-5 overflow-auto">{content()}</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MOBILE SHELL
══════════════════════════════════════════════════════════════ */
function Mobile({ section, onSection, search, onSearch }: { section: Section; onSection: (s: Section) => void; search: string; onSearch: (s: string) => void }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function content() {
    switch (section) {
      case "Dashboard": return <DashboardM />;
      case "Clients": return <ClientsM search={search} />;
      case "Campaigns": return <CampaignsM search={search} />;
      case "Reports": return <div className="p-3"><AgencyReportsTab /></div>;
      case "Sync Status": return <SyncStatusM />;
      case "Team & Access": return isAdmin ? <div className="p-3"><AgencyTeamTab /></div> : <DashboardM />;
      case "Settings": return <SettingsM onLogout={handleLogout} />;
    }
  }

  const bottomNav = [
    { key: "Dashboard" as Section, icon: LayoutDashboard, label: "Home" },
    { key: "Clients" as Section, icon: Users, label: "Clients" },
    { key: "Campaigns" as Section, icon: Megaphone, label: "Campaigns" },
    { key: "Reports" as Section, icon: FileBarChart, label: "Reports" },
    { key: "Settings" as Section, icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex flex-col bg-white" style={{ minHeight: "100vh" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-white border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="rounded-md p-1" style={{ background: "#6366F1" }}>
            <Cloud size={12} className="text-white" />
          </div>
          <span className="font-bold text-slate-800" style={{ fontSize: 12 }}>CloudCRM</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Bell size={15} className="text-slate-500" />
          <button onClick={handleLogout} className="flex items-center gap-1 text-slate-500">
            <LogOut size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto" style={{ background: "#F8FAFC" }}>{content()}</div>

      {/* Bottom tab bar */}
      <div className="flex border-t border-slate-100 bg-white flex-shrink-0">
        {bottomNav.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => onSection(key)}
            className="flex-1 flex flex-col items-center py-2 gap-0.5 cursor-pointer transition-colors"
            style={{ color: section === key ? "#6366F1" : "#94A3B8" }}
          >
            <Icon size={16} />
            <span style={{ fontSize: 9 }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   EXPORT
══════════════════════════════════════════════════════════════ */
export function Screen3AgencyDashboard() {
  const [section, setSection] = useState<Section>("Dashboard");
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen w-full bg-slate-50 relative">
      <div className="hidden md:block w-full">
        <Desktop section={section} onSection={setSection} search={search} onSearch={setSearch} />
      </div>
      <div className="block md:hidden w-full">
        <Mobile section={section} onSection={setSection} search={search} onSearch={setSearch} />
      </div>
    </div>
  );
}
