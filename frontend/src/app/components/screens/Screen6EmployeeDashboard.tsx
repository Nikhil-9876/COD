import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Cloud, Bell, LogOut, RefreshCw, LayoutDashboard, Database,
  ArrowUpRight, Users, CheckCircle2, AlertTriangle, XCircle
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

type SyncStatus = "Synced" | "Syncing" | "Error";

interface Client {
  id: string;
  name: string;
  industry: string;
  monthly_budget: string;
  onboarding_status: string;
  total_spend: string;
  total_leads: string;
  campaign_count: string;
}

interface DashboardMetrics {
  total_spend: number;
  assigned_clients: number;
  total_campaigns: number;
  last_synced: string | null;
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="bg-white rounded-xl p-5 flex flex-col gap-3 flex-1" style={{ border: "1px solid #E2E8F0" }}>
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg" style={{ background: "#EEF2FF", color: "#6366F1" }}>
          <Icon size={16} />
        </div>
        <span className="text-slate-500 font-medium" style={{ fontSize: 13 }}>{label}</span>
      </div>
      <span className="text-slate-900 font-bold" style={{ fontSize: 24 }}>{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; dot: string }> = {
    pending: { bg: "#FFFBEB", text: "#92400E", dot: "#F59E0B" },
    active: { bg: "#ECFDF5", text: "#065F46", dot: "#10B981" },
  };
  const s = map[status] || { bg: "#F1F5F9", text: "#475569", dot: "#94A3B8" };
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-medium" style={{ background: s.bg, color: s.text, fontSize: 11 }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
      {status}
    </span>
  );
}

function Desktop() {
  const { user, logout, apiFetch } = useAuth();
  const navigate = useNavigate();
  
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingIds, setSyncingIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [dashRes, clientsRes] = await Promise.all([
          apiFetch("/api/dashboard/employee"),
          apiFetch("/api/clients")
        ]);
        if (!dashRes.ok || !clientsRes.ok) throw new Error("Failed to load data");
        const dashData = await dashRes.json();
        const clientsData = await clientsRes.json();
        
        setMetrics(dashData);
        setClients(clientsData.clients || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [apiFetch]);

  async function handleSync(clientId: string) {
    if (syncingIds.has(clientId)) return;
    
    // Optimistic UI updates
    setSyncingIds(prev => new Set(prev).add(clientId));
    setError("");
    
    try {
      const res = await apiFetch(`/api/sync/${clientId}/all`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Sync failed");
      }
      
      // Reload dashboard data
      const [dashRes, clientsRes] = await Promise.all([
        apiFetch("/api/dashboard/employee"),
        apiFetch("/api/clients")
      ]);
      if (dashRes.ok && clientsRes.ok) {
        setMetrics(await dashRes.json());
        setClients((await clientsRes.json()).clients || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSyncingIds(prev => {
        const next = new Set(prev);
        next.delete(clientId);
        return next;
      });
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex flex-col bg-white" style={{ minHeight: "100vh" }}>
      {/* Top nav */}
      <div
        className="flex items-center gap-4 px-6 py-3 flex-shrink-0"
        style={{ background: "#1E293B", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="rounded-lg p-1.5" style={{ background: "#6366F1" }}>
            <Cloud size={13} className="text-white" />
          </div>
          <span className="text-white font-bold" style={{ fontSize: 13 }}>CloudCRM DataOps</span>
        </div>

        <div className="h-4 w-px bg-white/20 mx-1" />
        
        <div className="flex items-center gap-1 ml-4">
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
            style={{ fontSize: 12, background: "rgba(99,102,241,0.25)", color: "#A5B4FC" }}
          >
            <LayoutDashboard size={13} />
            Data Pipeline
          </button>
        </div>

        <div className="flex-1" />
        <div className="flex items-center gap-2 mr-3">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold" style={{ background: "#6366F1", fontSize: 9 }}>
            {user?.name?.[0] || "E"}
          </div>
          <span className="text-white font-medium" style={{ fontSize: 13 }}>{user?.name}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 border border-white/20 rounded-lg px-2.5 py-1.5 text-slate-400 cursor-pointer hover:text-white hover:border-white/40 transition-colors"
          style={{ fontSize: 11 }}
        >
          <LogOut size={12} /> Sign Out
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col gap-6" style={{ background: "#F8FAFC" }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-slate-900 font-bold" style={{ fontSize: 20 }}>Employee Dashboard</h1>
            <p className="text-slate-500" style={{ fontSize: 13 }}>Manage data synchronization for your assigned clients.</p>
          </div>
          <button 
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-white font-semibold cursor-pointer shadow-sm hover:opacity-90 transition-opacity"
            style={{ background: "#6366F1", fontSize: 13 }}
            onClick={() => clients.forEach(c => handleSync(c.id))}
          >
            <RefreshCw size={14} /> Sync All Data
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg" style={{ fontSize: 13 }}>{error}</div>
        )}

        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading dashboard data...</div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="flex gap-4">
              <StatCard label="Assigned Clients" value={String(metrics?.assigned_clients || 0)} icon={Users} />
              <StatCard label="Managed Campaigns" value={String(metrics?.total_campaigns || 0)} icon={Database} />
              <StatCard 
                label="Total Tracked Spend" 
                value={`$${((metrics?.total_spend || 0) / 1000).toFixed(1)}k`} 
                icon={ArrowUpRight} 
              />
            </div>

            {/* Clients Table */}
            <div className="bg-white rounded-xl shadow-sm" style={{ border: "1px solid #E2E8F0" }}>
              <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
                <span className="text-slate-800 font-bold" style={{ fontSize: 14 }}>Assigned Clients Pipeline</span>
                <span className="text-slate-500" style={{ fontSize: 12 }}>Last full sync: {metrics?.last_synced ? new Date(metrics.last_synced).toLocaleString() : 'Never'}</span>
              </div>
              <table className="w-full">
                <thead>
                  <tr style={{ background: "#F8FAFC" }}>
                    {["Client Name", "Industry", "Monthly Budget", "Campaigns", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-slate-500 font-semibold" style={{ fontSize: 12 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {clients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-slate-500" style={{ fontSize: 13 }}>
                        No clients assigned yet. Contact your administrator.
                      </td>
                    </tr>
                  ) : (
                    clients.map((c) => {
                      const isSyncing = syncingIds.has(c.id);
                      return (
                        <tr key={c.id} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold" style={{ background: "#6366F1", fontSize: 11 }}>
                                {c.name.substring(0,2).toUpperCase()}
                              </div>
                              <span className="text-slate-800 font-semibold" style={{ fontSize: 13 }}>{c.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-slate-500" style={{ fontSize: 13 }}>{c.industry}</td>
                          <td className="px-5 py-3.5 text-slate-800 font-medium" style={{ fontSize: 13 }}>${Number(c.monthly_budget).toLocaleString()}</td>
                          <td className="px-5 py-3.5 text-slate-800" style={{ fontSize: 13 }}>{c.campaign_count}</td>
                          <td className="px-5 py-3.5"><StatusBadge status={c.onboarding_status} /></td>
                          <td className="px-5 py-3.5">
                            <button
                              onClick={() => handleSync(c.id)}
                              disabled={isSyncing}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer disabled:cursor-not-allowed"
                              style={{ 
                                fontSize: 12,
                                background: isSyncing ? "#F1F5F9" : "#EEF2FF",
                                color: isSyncing ? "#94A3B8" : "#6366F1",
                                border: `1px solid ${isSyncing ? "#E2E8F0" : "#C7D2FE"}`
                              }}
                            >
                              <RefreshCw size={13} className={isSyncing ? "animate-spin" : ""} />
                              {isSyncing ? "Syncing..." : "Sync Now"}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Mobile view (Simplified version of Desktop)
function Mobile() {
  const { user, logout, apiFetch } = useAuth();
  const navigate = useNavigate();
  
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingIds, setSyncingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [dashRes, clientsRes] = await Promise.all([
          apiFetch("/api/dashboard/employee"),
          apiFetch("/api/clients")
        ]);
        if (dashRes.ok && clientsRes.ok) {
          setMetrics(await dashRes.json());
          setClients((await clientsRes.json()).clients || []);
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [apiFetch]);

  async function handleSync(clientId: string) {
    if (syncingIds.has(clientId)) return;
    setSyncingIds(prev => new Set(prev).add(clientId));
    
    try {
      await apiFetch(`/api/sync/${clientId}/all`, { method: "POST" });
      const [dashRes, clientsRes] = await Promise.all([
        apiFetch("/api/dashboard/employee"),
        apiFetch("/api/clients")
      ]);
      if (dashRes.ok && clientsRes.ok) {
        setMetrics(await dashRes.json());
        setClients((await clientsRes.json()).clients || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSyncingIds(prev => {
        const next = new Set(prev);
        next.delete(clientId);
        return next;
      });
    }
  }

  return (
    <div className="flex flex-col bg-slate-50 min-h-screen">
       <div className="flex items-center justify-between px-4 py-3 bg-slate-900 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="rounded-md p-1" style={{ background: "#6366F1" }}>
            <Cloud size={12} className="text-white" />
          </div>
          <span className="text-white font-bold" style={{ fontSize: 13 }}>DataOps</span>
        </div>
        <button onClick={() => { logout(); navigate("/login"); }} className="text-slate-400 cursor-pointer">
          <LogOut size={16} />
        </button>
      </div>
      
      <div className="flex-1 p-4 flex flex-col gap-4">
        <h1 className="text-slate-900 font-bold" style={{ fontSize: 18 }}>Dashboard</h1>
        
        {loading ? (
          <div className="text-center p-4 text-slate-500">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Clients" value={String(metrics?.assigned_clients || 0)} icon={Users} />
              <StatCard label="Campaigns" value={String(metrics?.total_campaigns || 0)} icon={Database} />
            </div>
            
            <h2 className="text-slate-800 font-bold mt-2" style={{ fontSize: 15 }}>Assigned Clients</h2>
            {clients.length === 0 ? (
              <p className="text-slate-500 text-sm">No clients assigned.</p>
            ) : (
              clients.map(c => {
                const isSyncing = syncingIds.has(c.id);
                return (
                  <div key={c.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-slate-800 font-bold text-sm">{c.name}</div>
                        <div className="text-slate-500 text-xs">{c.industry}</div>
                      </div>
                      <StatusBadge status={c.onboarding_status} />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-slate-800 font-medium text-sm">${Number(c.monthly_budget).toLocaleString()}/mo</div>
                      <button
                        onClick={() => handleSync(c.id)}
                        disabled={isSyncing}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold cursor-pointer disabled:cursor-not-allowed"
                        style={{ 
                          fontSize: 12,
                          background: isSyncing ? "#F1F5F9" : "#EEF2FF",
                          color: isSyncing ? "#94A3B8" : "#6366F1",
                        }}
                      >
                        <RefreshCw size={12} className={isSyncing ? "animate-spin" : ""} />
                        {isSyncing ? "Syncing..." : "Sync"}
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function Screen6EmployeeDashboard() {
  return (
    <div className="w-full relative">
      <div className="hidden md:block w-full">
        <Desktop />
      </div>
      <div className="block md:hidden w-full">
        <Mobile />
      </div>
    </div>
  );
}
