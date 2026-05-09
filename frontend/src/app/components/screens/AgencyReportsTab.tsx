import React, { useState, useEffect } from "react";
import { Download, FileBarChart, Filter, RefreshCw, BarChart2, TrendingUp, DollarSign, Target } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, LineChart, Line
} from "recharts";
import { useAuth } from "../../context/AuthContext";

interface AnalyticsRow {
  platform: string;
  campaign_name: string;
  status: string;
  total_spend: string | number;
  total_impressions: string | number;
  total_clicks: string | number;
  total_leads: string | number;
  ctr: string;
  cpl: string;
  cpc: string;
}

export function AgencyReportsTab() {
  const { apiFetch } = useAuth();
  const [data, setData] = useState<AnalyticsRow[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [dateRange, setDateRange] = useState("30"); // days
  const [clientId, setClientId] = useState("");
  const [clients, setClients] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    async function init() {
      try {
        const res = await apiFetch("/api/clients");
        if (res.ok) {
          const cData = await res.json();
          setClients(cData.clients || []);
        }
      } catch (err) {
        console.error("Failed to load clients for filter");
      }
    }
    init();
  }, [apiFetch]);

  useEffect(() => {
    async function loadReport() {
      setLoading(true);
      try {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - parseInt(dateRange));
        
        const from = start.toISOString().split('T')[0];
        const to = end.toISOString().split('T')[0];
        
        let url = `/api/reports/analytics?from=${from}&to=${to}`;
        if (clientId) url += `&client_id=${clientId}`;
        
        const res = await apiFetch(url);
        if (res.ok) {
          const json = await res.json();
          setData(json.data || []);
        }
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [apiFetch, dateRange, clientId]);

  // Aggregate by platform for charts
  const platformAgg = data.reduce((acc, row) => {
    if (!acc[row.platform]) {
      acc[row.platform] = { name: row.platform, spend: 0, leads: 0, clicks: 0, impressions: 0 };
    }
    acc[row.platform].spend += Number(row.total_spend) || 0;
    acc[row.platform].leads += Number(row.total_leads) || 0;
    acc[row.platform].clicks += Number(row.total_clicks) || 0;
    acc[row.platform].impressions += Number(row.total_impressions) || 0;
    return acc;
  }, {} as Record<string, any>);
  
  const chartData = Object.values(platformAgg);

  const totalSpend = chartData.reduce((sum, p) => sum + p.spend, 0);
  const totalLeads = chartData.reduce((sum, p) => sum + p.leads, 0);
  const avgCPL = totalLeads > 0 ? totalSpend / totalLeads : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900 font-bold flex items-center gap-2" style={{ fontSize: 20 }}>
            <BarChart2 size={20} className="text-indigo-600" /> Advanced Analytics
          </h1>
          <p className="text-slate-500" style={{ fontSize: 13 }}>Cross-platform performance & ROAS insights.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-3 py-2 bg-slate-50 border-r border-slate-200">
              <Filter size={14} className="text-slate-500" />
            </div>
            <select 
              value={clientId} 
              onChange={e => setClientId(e.target.value)}
              className="px-3 py-2 text-slate-700 bg-white outline-none cursor-pointer" 
              style={{ fontSize: 12, minWidth: 140 }}
            >
              <option value="">All Clients</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <div className="w-px h-full bg-slate-200"></div>
            <select 
              value={dateRange} 
              onChange={e => setDateRange(e.target.value)}
              className="px-3 py-2 text-slate-700 bg-white outline-none cursor-pointer" 
              style={{ fontSize: 12 }}
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="365">Year to Date</option>
            </select>
          </div>
          
          <button className="flex items-center gap-1.5 rounded-lg px-3 py-2 font-semibold text-white cursor-pointer hover:opacity-90 transition-opacity shadow-sm" style={{ background: "#6366F1", fontSize: 12 }}>
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 text-slate-400">
          <RefreshCw size={24} className="animate-spin" />
        </div>
      ) : (
        <>
          {/* Top Line Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md"><DollarSign size={16} /></div>
                <span className="text-slate-500 font-semibold text-xs uppercase tracking-wider">Total Ad Spend</span>
              </div>
              <span className="text-slate-900 font-bold text-2xl">${totalSpend.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md"><Target size={16} /></div>
                <span className="text-slate-500 font-semibold text-xs uppercase tracking-wider">Total Leads Generated</span>
              </div>
              <span className="text-slate-900 font-bold text-2xl">{totalLeads.toLocaleString()}</span>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-purple-50 text-purple-600 rounded-md"><TrendingUp size={16} /></div>
                <span className="text-slate-500 font-semibold text-xs uppercase tracking-wider">Blended Cost per Lead</span>
              </div>
              <span className="text-slate-900 font-bold text-2xl">${avgCPL.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Chart: Spend vs Leads by Platform */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col h-80">
              <h2 className="text-slate-800 font-semibold text-sm mb-4">Spend vs Leads by Platform</h2>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{fill: '#F8FAFC'}} 
                      contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(val: number, name: string) => name === 'Spend' ? [`$${val.toFixed(2)}`, name] : [val, name]}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: "#64748B" }} />
                    <Bar yAxisId="left" dataKey="spend" name="Spend" fill="#6366F1" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar yAxisId="right" dataKey="leads" name="Leads" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart: Efficiency (CPL) */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col h-80">
              <h2 className="text-slate-800 font-semibold text-sm mb-4">Cost Per Lead (CPL) Efficiency</h2>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748B", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{fill: '#F8FAFC'}} 
                      contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }}
                      formatter={(val: number) => [`$${val.toFixed(2)}`, 'CPL']}
                    />
                    <Bar dataKey={(d) => d.leads > 0 ? (d.spend / d.leads) : 0} name="CPL" fill="#8B5CF6" radius={[0, 4, 4, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Detailed Data Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-slate-800 font-semibold text-sm">Campaign Performance Detail</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {["Platform", "Campaign Name", "Status", "Spend", "Impressions", "Clicks", "CTR", "Leads", "CPL"].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-5 py-8 text-center text-slate-500 text-sm">No campaign data available for this period.</td>
                    </tr>
                  ) : (
                    data.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3">
                          <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                            {row.platform.replace('_ads', '')}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-sm font-medium text-slate-900 truncate max-w-[200px]" title={row.campaign_name}>{row.campaign_name}</td>
                        <td className="px-5 py-3">
                          <span className="inline-flex items-center gap-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${row.status === 'active' ? 'bg-emerald-500' : row.status === 'paused' ? 'bg-amber-500' : 'bg-slate-400'}`}></div>
                            <span className="text-xs font-medium text-slate-600 capitalize">{row.status}</span>
                          </span>
                        </td>
                        <td className="px-5 py-3 text-sm font-semibold text-slate-900">${Number(row.total_spend).toFixed(2)}</td>
                        <td className="px-5 py-3 text-sm text-slate-600">{Number(row.total_impressions).toLocaleString()}</td>
                        <td className="px-5 py-3 text-sm text-slate-600">{Number(row.total_clicks).toLocaleString()}</td>
                        <td className="px-5 py-3 text-sm text-slate-600">{row.ctr}</td>
                        <td className="px-5 py-3 text-sm font-medium text-indigo-600">{Number(row.total_leads).toLocaleString()}</td>
                        <td className="px-5 py-3 text-sm font-semibold text-emerald-600">${row.cpl}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
