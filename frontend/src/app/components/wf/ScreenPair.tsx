import React from "react";

/* ─── Browser Chrome ──────────────────────────────────────── */
function BrowserChrome({ url }: { url?: string }) {
  const domain = url ? url.split("/")[0] : "cloudcrm.app";
  return (
    <div
      className="flex-shrink-0 select-none"
      style={{ background: "#E8E8EA", borderBottom: "1px solid #D1D1D6" }}
    >
      {/* Tab row */}
      <div className="flex items-end px-3 pt-2 gap-1">
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-t-md border-l border-t border-r border-gray-200 bg-white"
          style={{ minWidth: 140, fontSize: 10 }}
        >
          {/* Favicon — indigo dot for brand feel */}
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 flex-shrink-0" />
          <span className="text-gray-600 truncate flex-1">{domain}</span>
          <span className="text-gray-400 flex-shrink-0">×</span>
        </div>
        <span className="text-gray-500 pb-1 px-1" style={{ fontSize: 13 }}>+</span>
      </div>

      {/* Controls + URL bar */}
      <div className="flex items-center gap-2 px-3 py-2">
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="w-3 h-3 rounded-full bg-red-400 opacity-80" />
          <div className="w-3 h-3 rounded-full bg-yellow-400 opacity-80" />
          <div className="w-3 h-3 rounded-full bg-green-400 opacity-80" />
        </div>
        {/* Back / forward */}
        <div className="flex items-center gap-0.5 text-gray-400 flex-shrink-0" style={{ fontSize: 17 }}>
          <span>‹</span>
          <span>›</span>
        </div>
        {/* URL bar */}
        <div className="flex-1 bg-white border border-gray-200 rounded-md px-2.5 py-1 flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full border border-gray-300 flex items-center justify-center flex-shrink-0">
            <div className="w-1 h-1 rounded-full bg-gray-400" />
          </div>
          <span className="text-gray-500 truncate" style={{ fontSize: 10 }}>
            {url || "cloudcrm.app"}
          </span>
        </div>
        <span className="text-gray-400 flex-shrink-0" style={{ fontSize: 13 }}>↻</span>
      </div>
    </div>
  );
}

/* ─── Phone Status Bar ────────────────────────────────────── */
function PhoneStatusBar() {
  return (
    <div
      className="flex items-center justify-between px-4 flex-shrink-0 bg-white"
      style={{ height: 22, borderBottom: "1px solid #EBEBEB" }}
    >
      <span className="text-gray-700" style={{ fontSize: 10 }}>9:41</span>
      <div className="flex items-center gap-1.5">
        <div className="flex items-end gap-px">
          <div className="w-1 bg-gray-600 rounded-sm" style={{ height: 4 }} />
          <div className="w-1 bg-gray-600 rounded-sm" style={{ height: 6 }} />
          <div className="w-1 bg-gray-600 rounded-sm" style={{ height: 8 }} />
          <div className="w-1 bg-gray-300 rounded-sm" style={{ height: 8 }} />
        </div>
        <span className="text-gray-600" style={{ fontSize: 9 }}>WiFi</span>
        <div className="flex items-center gap-px">
          <div
            className="border border-gray-500 rounded-sm flex items-center justify-start p-px"
            style={{ width: 18, height: 9 }}
          >
            <div className="bg-gray-500 rounded-sm" style={{ width: "70%", height: "100%" }} />
          </div>
          <div className="bg-gray-500 rounded-sm" style={{ width: 2, height: 5 }} />
        </div>
      </div>
    </div>
  );
}

/* ─── ScreenPair ──────────────────────────────────────────── */
interface Props {
  title: string;
  desktop: React.ReactNode;
  mobile: React.ReactNode;
  desktopUrl?: string;
}

const DESKTOP_VIEWPORT_H = 560;
const PHONE_CONTENT_H    = 600;
const PHONE_OUTER_W      = 256;

export function ScreenPair({ title, desktop, mobile, desktopUrl }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {/* Heading */}
      <div className="flex items-center gap-3">
        <span className="font-semibold text-slate-800" style={{ fontSize: 14 }}>{title}</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* Frames row */}
      <div className="flex gap-6 items-start">

        {/* ── Desktop ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <span className="text-slate-400 uppercase tracking-widest" style={{ fontSize: 10 }}>
            Desktop
          </span>
          <div
            className="overflow-hidden w-full"
            style={{
              borderRadius: 10,
              border: "1px solid #D1D1D6",
              boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
            }}
          >
            <BrowserChrome url={desktopUrl} />
            <div
              className="overflow-y-auto overflow-x-hidden bg-white"
              style={{ height: DESKTOP_VIEWPORT_H }}
            >
              {desktop}
            </div>
          </div>
        </div>

        {/* ── Mobile ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-1.5 flex-shrink-0" style={{ width: PHONE_OUTER_W }}>
          <span className="text-slate-400 uppercase tracking-widest" style={{ fontSize: 10 }}>
            Mobile
          </span>
          {/* Phone outer shell — dark bezel */}
          <div
            style={{
              borderRadius: 38,
              border: "7px solid #1C1C1E",
              background: "#1C1C1E",
              boxShadow: "0 8px 40px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.06)",
              overflow: "hidden",
            }}
          >
            {/* Notch — white bar with dark pill */}
            <div
              style={{ height: 22, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <div
                style={{ width: 68, height: 14, background: "#1C1C1E", borderRadius: 9999 }}
              />
            </div>

            <PhoneStatusBar />

            {/* Scrollable content */}
            <div
              className="overflow-y-auto overflow-x-hidden bg-white"
              style={{ height: PHONE_CONTENT_H }}
            >
              {mobile}
            </div>

            {/* Home indicator */}
            <div
              style={{ height: 22, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <div
                style={{ width: 68, height: 5, background: "#E2E8F0", borderRadius: 9999 }}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}