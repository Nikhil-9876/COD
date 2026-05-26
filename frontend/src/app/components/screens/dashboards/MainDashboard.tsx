import { useState, useEffect } from "react";
import { PageTransition } from "../../ui/LoadingSkeletons";
import { useNavigate, useParams } from "react-router";
import {
  LayoutDashboard, Users, Megaphone, FileBarChart,
  RefreshCw, Settings, Bell, Search, ChevronDown,
  Plus, Cloud, LogOut, ShieldCheck, Menu
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

// Import Shared Tabs
import { DashboardOverviewD, DashboardOverviewM } from "../overview/Overview";
import { ClientsD, ClientsM } from "../clients/ClientsList";
import { AddClient } from "../clients/AddClient";
import { CampaignsD, CampaignsM } from "../campaigns/Campaigns";
import { SyncStatusD, SyncStatusM } from "../integrations/SyncStatus";
import { SettingsD, SettingsM } from "../settings/Settings";
import { TeamAccess } from "../team/TeamAccess";
import { Reports } from "../reports/Reports";

export type Section = "Dashboard" | "Clients" | "Campaigns" | "Reports" | "Sync Status" | "Team & Access" | "Settings";

const ALL_NAV: { key: Section; icon: React.FC<{ size?: number; className?: string }> }[] = [
  { key: "Dashboard", icon: LayoutDashboard },
  { key: "Clients", icon: Users },
  { key: "Campaigns", icon: Megaphone },
  { key: "Reports", icon: FileBarChart },
  { key: "Sync Status", icon: RefreshCw },
  { key: "Team & Access", icon: ShieldCheck },
  { key: "Settings", icon: Settings },
];

/* ══════════════════════════════════════════════════════════════
   DESKTOP SHELL
══════════════════════════════════════════════════════════════ */
function Desktop({ section, onSection, search, onSearch }: { section: Section; onSection: (s: Section) => void; search: string; onSearch: (s: string) => void }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  
  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";
  const isEmployee = user?.role === "employee";
  
  // Visibility rules based on usertype
  let visibleNav = ALL_NAV;
  if (isManager) {
    visibleNav = ALL_NAV.filter(n => n.key !== "Team & Access");
  } else if (isEmployee) {
    visibleNav = ALL_NAV.filter(n => n.key === "Dashboard" || n.key === "Campaigns" || n.key === "Reports" || n.key === "Sync Status" || n.key === "Settings");
  } else if (!isAdmin) {
    visibleNav = ALL_NAV.filter(n => n.key === "Dashboard" || n.key === "Settings");
  }

  const roleLabel = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Unknown";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function content() {
    switch (section) {
      case "Dashboard": return <DashboardOverviewD onSection={onSection} onAddClient={() => setIsAddClientOpen(true)} />;
      case "Clients": return <ClientsD search={search} onAddClient={() => setIsAddClientOpen(true)} />;
      case "Campaigns": return <CampaignsD search={search} />;
      case "Reports": return <div className="p-6 max-w-[1200px] mx-auto"><Reports /></div>;
      case "Sync Status": return <SyncStatusD />;
      case "Team & Access": return isAdmin ? <div className="p-6"><TeamAccess /></div> : <DashboardOverviewD onSection={onSection} />;
      case "Settings": return <SettingsD />;
      default: return <DashboardOverviewD onSection={onSection} />;
    }
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#F8FAFC" }}>
      {/* Inner CRM Sidebar */}
      <div 
        className="flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out" 
        style={{ width: isCollapsed ? 64 : 200, background: "#1E293B" }}
      >
        {/* Sidebar Header with Hamburger */}
        <div className="flex items-center justify-start px-[17px] gap-3 h-[52px] border-b overflow-hidden" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0"
          >
            <Menu size={18} />
          </button>
          <span className={`text-white font-bold whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`} style={{ fontSize: 14 }}>
            CloudCRM
          </span>
        </div>
        
        {/* Nav */}
        <nav className="flex-1 py-3 flex flex-col gap-1.5 px-3 overflow-hidden">
          {visibleNav.map(({ key, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onSection(key)}
              title={isCollapsed ? key : undefined}
              className="flex items-center justify-start h-10 w-full pl-[11px] gap-3 rounded-xl transition-colors cursor-pointer overflow-hidden"
              style={{
                background: section === key ? "rgba(99,102,241,0.25)" : "transparent",
                color: section === key ? "#A5B4FC" : "#94A3B8",
              }}
            >
              <Icon size={18} className="flex-shrink-0" />
              <span className={`font-medium whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`} style={{ fontSize: 13 }}>
                {key}
              </span>
            </button>
          ))}
        </nav>
        
        {/* User + Sign Out */}
        <div className="py-3 border-t flex flex-col gap-3 px-3 overflow-hidden" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-start pl-[4px] gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: "#6366F1", fontSize: 11 }}>
              {user?.name ? user.name.substring(0, 2).toUpperCase() : "U"}
            </div>
            <div className={`flex flex-col min-w-0 transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
              <p className="text-white font-medium truncate" style={{ fontSize: 11 }}>{user?.name ?? "User"}</p>
              <p style={{ fontSize: 9, color: "#64748B" }}>{roleLabel}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title={isCollapsed ? "Sign Out" : undefined}
            className="flex items-center justify-start h-10 w-full pl-[11px] gap-3 rounded-xl transition-colors cursor-pointer text-slate-400 hover:text-white hover:bg-white/10 overflow-hidden"
            style={{ fontSize: 12 }}
          >
            <LogOut size={18} className="flex-shrink-0" /> 
            <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
              Sign Out
            </span>
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 bg-white border-b border-slate-100 flex-shrink-0">
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => onSearch(e.target.value)}
              placeholder="Search..."
              className="w-full border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-slate-600 bg-white outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
              style={{ fontSize: 12 }}
            />
          </div>
          <div className="flex-1" />
          <button className="relative text-slate-500 cursor-pointer hover:text-slate-800 transition-colors">
            <Bell size={16} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full" style={{ background: "#F43F5E" }} />
          </button>
          {isAdmin && (
            <button
              onClick={() => setIsAddClientOpen(true)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-white font-semibold cursor-pointer hover:bg-indigo-600 transition-colors"
              style={{ background: "#6366F1", fontSize: 12 }}
            >
              <Plus size={13} /> Add Client
            </button>
          )}
          <div className="flex items-center gap-2 border-l border-slate-200 pl-4 ml-1">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold" style={{ background: "#6366F1", fontSize: 10 }}>
              {user?.name ? user.name.substring(0, 2).toUpperCase() : "U"}
            </div>
            <span className="text-slate-700 font-medium" style={{ fontSize: 12 }}>{user?.name || "User"}</span>
            <ChevronDown size={13} className="text-slate-400" />
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 p-5 overflow-y-auto relative">
          <PageTransition sectionKey={section}>{content()}</PageTransition>
        </div>
      </div>

      <AddClient isOpen={isAddClientOpen} onClose={() => setIsAddClientOpen(false)} />
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
  const isManager = user?.role === "manager";
  const isEmployee = user?.role === "employee";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function content() {
    switch (section) {
      case "Dashboard": return <DashboardOverviewM />;
      case "Clients": return <ClientsM search={search} />;
      case "Campaigns": return <CampaignsM search={search} />;
      case "Reports": return <div className="p-3"><Reports /></div>;
      case "Sync Status": return <SyncStatusM />;
      case "Team & Access": return isAdmin ? <div className="p-3"><TeamAccess /></div> : <DashboardOverviewM />;
      case "Settings": return <SettingsM onLogout={handleLogout} />;
      default: return <DashboardOverviewM />;
    }
  }

  let bottomNav = [
    { key: "Dashboard" as Section, icon: LayoutDashboard, label: "Home" },
    { key: "Clients" as Section, icon: Users, label: "Clients" },
    { key: "Campaigns" as Section, icon: Megaphone, label: "Campaigns" },
    { key: "Reports" as Section, icon: FileBarChart, label: "Reports" },
    { key: "Settings" as Section, icon: Settings, label: "Settings" },
  ];

  if (isManager) {
    bottomNav = [
      { key: "Dashboard" as Section, icon: LayoutDashboard, label: "Home" },
      { key: "Clients" as Section, icon: Users, label: "Clients" },
      { key: "Campaigns" as Section, icon: Megaphone, label: "Campaigns" },
      { key: "Reports" as Section, icon: FileBarChart, label: "Reports" },
      { key: "Sync Status" as Section, icon: RefreshCw, label: "Sync" },
    ];
  } else if (isEmployee) {
    bottomNav = [
      { key: "Dashboard" as Section, icon: LayoutDashboard, label: "Home" },
      { key: "Campaigns" as Section, icon: Megaphone, label: "Campaigns" },
      { key: "Reports" as Section, icon: FileBarChart, label: "Reports" },
      { key: "Sync Status" as Section, icon: RefreshCw, label: "Sync" },
      { key: "Settings" as Section, icon: Settings, label: "Settings" },
    ];
  } else if (!isAdmin) {
    bottomNav = [
      { key: "Dashboard" as Section, icon: LayoutDashboard, label: "Home" },
      { key: "Settings" as Section, icon: Settings, label: "Settings" },
    ];
  }

  return (
    <div className="flex flex-col bg-white h-[100dvh] overflow-hidden">
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
      <div className="flex-1 overflow-y-auto relative" style={{ background: "#F8FAFC" }}>
        <PageTransition sectionKey={section}>{content()}</PageTransition>
      </div>

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
const urlToSection = (tab?: string): Section => {
  switch (tab) {
    case "clients": return "Clients";
    case "campaigns": return "Campaigns";
    case "reports": return "Reports";
    case "sync-status": return "Sync Status";
    case "team-access": return "Team & Access";
    case "settings": return "Settings";
    default: return "Dashboard";
  }
};

const sectionToUrl = (section: Section): string => {
  switch (section) {
    case "Clients": return "clients";
    case "Campaigns": return "campaigns";
    case "Reports": return "reports";
    case "Sync Status": return "sync-status";
    case "Team & Access": return "team-access";
    case "Settings": return "settings";
    default: return "dashboard";
  }
};

export function MainDashboard() {
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const section = urlToSection(tab);
  const [search, setSearch] = useState("");

  const handleSectionChange = (s: Section) => {
    const slug = sectionToUrl(s);
    let basePath = "/login";
    if (user?.role === "admin") basePath = "/agency";
    else if (user?.role === "manager") basePath = "/manager";
    else if (user?.role === "employee") basePath = "/employee";
    
    navigate(`${basePath}/${slug}`);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 relative">
      <div className="hidden md:block w-full">
        <Desktop section={section} onSection={handleSectionChange} search={search} onSearch={setSearch} />
      </div>
      <div className="block md:hidden w-full">
        <Mobile section={section} onSection={handleSectionChange} search={search} onSearch={setSearch} />
      </div>
    </div>
  );
}
