/* ── Clients ─────────────────────────────────────────────── */
export const clients = [
  { id: 1, name: "Apex Media", industry: "E-commerce", spend: 12400, roas: 4.2, leads: 284, campaigns: 8, status: "Active", budget: 15000, email: "hello@apexmedia.com", initials: "AM" },
  { id: 2, name: "Blue Horizon", industry: "Finance", spend: 8700, roas: 3.1, leads: 156, campaigns: 5, status: "Active", budget: 10000, email: "team@bluehorizon.co", initials: "BH" },
  { id: 3, name: "Crest Studios", industry: "SaaS", spend: 5200, roas: 2.8, leads: 98, campaigns: 3, status: "Paused", budget: 6000, email: "ads@creststudios.io", initials: "CS" },
  { id: 4, name: "Dune & Co", industry: "Retail", spend: 9800, roas: 5.3, leads: 312, campaigns: 6, status: "Active", budget: 12000, email: "marketing@duneandco.com", initials: "DC" },
  { id: 5, name: "Echo Digital", industry: "Healthcare", spend: 3100, roas: 1.9, leads: 47, campaigns: 2, status: "Setup", budget: 5000, email: "info@echodigital.health", initials: "ED" },
];

/* ── Monthly platform spend (6 months) ───────────────────── */
export const monthlySpend = [
  { month: "Oct", google: 14200, meta: 9800, mailchimp: 3200 },
  { month: "Nov", google: 16500, meta: 11200, mailchimp: 3800 },
  { month: "Dec", google: 18900, meta: 13500, mailchimp: 4100 },
  { month: "Jan", google: 15200, meta: 10800, mailchimp: 3500 },
  { month: "Feb", google: 19400, meta: 14200, mailchimp: 4600 },
  { month: "Mar", google: 22100, meta: 16800, mailchimp: 5200 },
];

/* ── Campaigns ───────────────────────────────────────────── */
export const campaigns = [
  { id: 1, name: "Spring Sale 2025",    client: "Apex Media",   platform: "Google Ads", spend: 3200, roas: 4.8, leads: 95,  status: "Active" },
  { id: 2, name: "Brand Awareness Q2",  client: "Blue Horizon", platform: "Meta Ads",   spend: 2100, roas: 2.4, leads: 43,  status: "Active" },
  { id: 3, name: "Retargeting June",    client: "Dune & Co",    platform: "Google Ads", spend: 1800, roas: 6.1, leads: 78,  status: "Active" },
  { id: 4, name: "Email Nurture",       client: "Apex Media",   platform: "Mailchimp",  spend: 890,  roas: 3.2, leads: 112, status: "Active" },
  { id: 5, name: "Product Launch",      client: "Crest Studios",platform: "Meta Ads",   spend: 1500, roas: 2.1, leads: 34,  status: "Paused" },
  { id: 6, name: "Lead Gen March",      client: "Dune & Co",    platform: "Meta Ads",   spend: 2400, roas: 5.7, leads: 134, status: "Active" },
];

/* ── Client weekly performance (for client dashboard) ────── */
export const clientPerformance = [
  { week: "Wk 1", spend: 4200, leads: 38, reach: 24500 },
  { week: "Wk 2", spend: 5100, leads: 52, reach: 31200 },
  { week: "Wk 3", spend: 4800, leads: 45, reach: 28900 },
  { week: "Wk 4", spend: 6200, leads: 71, reach: 38400 },
  { week: "Wk 5", spend: 5800, leads: 64, reach: 35100 },
  { week: "Wk 6", spend: 7100, leads: 84, reach: 44200 },
];

/* ── Platform spend pie (client dashboard) ───────────────── */
export const platformPie = [
  { name: "Google Ads", value: 22100, color: "#6366F1" },
  { name: "Meta Ads",   value: 16800, color: "#EC4899" },
  { name: "Mailchimp",  value: 5200,  color: "#F59E0B" },
];

/* ── Sync status ─────────────────────────────────────────── */
export const syncRows = [
  { platform: "Google Ads", client: "Apex Media",    lastSynced: "2 mins ago",   status: "Synced"  },
  { platform: "Meta Ads",   client: "Blue Horizon",  lastSynced: "15 mins ago",  status: "Synced"  },
  { platform: "Google Ads", client: "Dune & Co",     lastSynced: "1 hour ago",   status: "Synced"  },
  { platform: "Mailchimp",  client: "Apex Media",    lastSynced: "3 hours ago",  status: "Warning" },
  { platform: "Meta Ads",   client: "Crest Studios", lastSynced: "2 days ago",   status: "Error"   },
];

/* ── Formatting helpers ──────────────────────────────────── */
export const fmtK = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n}`;

export const fmtFull = (n: number) => `$${n.toLocaleString()}`;
