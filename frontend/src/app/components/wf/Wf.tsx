import React from "react";

/* ─── Gray text block (inline placeholder) ───────────────────── */
export const WfTextBlock = ({
  width = 80,
  height = 8,
  shade = "medium",
}: {
  width?: number | string;
  height?: number;
  shade?: "light" | "medium" | "dark";
}) => (
  <div
    className={`rounded-sm flex-shrink-0 ${
      shade === "light"
        ? "bg-gray-100"
        : shade === "dark"
        ? "bg-gray-400"
        : "bg-gray-200"
    }`}
    style={{ width, height }}
  />
);

/* ─── Logo ───────────────────────────────────────────────────── */
export const WfLogo = ({ size = "sm" }: { size?: "sm" | "md" | "lg" }) => {
  const cls =
    size === "lg"
      ? "h-10 w-32"
      : size === "md"
      ? "h-7 w-24"
      : "h-5 w-16";
  return (
    <div
      className={`border border-black bg-gray-300 flex items-center justify-center flex-shrink-0 ${cls}`}
    >
      <span className="text-black" style={{ fontSize: 10 }}>
        Logo
      </span>
    </div>
  );
};

/* ─── Avatar ──────────────────────────────────────────────────── */
export const WfAvatar = ({ size = "sm" }: { size?: "sm" | "md" }) => {
  const cls = size === "md" ? "w-7 h-7" : "w-5 h-5";
  return (
    <div
      className={`border border-black bg-gray-300 rounded-full flex-shrink-0 ${cls}`}
    />
  );
};

/* ─── Image placeholder (gray box with X) ────────────────────── */
export const WfImage = ({
  width,
  height,
  className = "",
}: {
  width?: number | string;
  height?: number | string;
  className?: string;
}) => (
  <div
    className={`relative border border-black bg-gray-200 flex-shrink-0 overflow-hidden ${className}`}
    style={{ width, height }}
  >
    {/* diagonal cross */}
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <line x1="0" y1="0" x2="100" y2="100" stroke="#9CA3AF" strokeWidth="1.5" />
      <line x1="100" y1="0" x2="0" y2="100" stroke="#9CA3AF" strokeWidth="1.5" />
    </svg>
  </div>
);

/* ─── Box placeholder ─────────────────────────────────────────── */
export const WfBox = ({
  label,
  height,
  shade = "medium",
  className = "",
}: {
  label?: string;
  height?: number | string;
  shade?: "light" | "medium" | "dark";
  className?: string;
}) => {
  const bg =
    shade === "light"
      ? "bg-gray-100"
      : shade === "dark"
      ? "bg-gray-400"
      : "bg-gray-200";
  return (
    <div
      className={`border border-black ${bg} flex items-center justify-center ${className}`}
      style={{ minHeight: height }}
    >
      {label && (
        <span className="text-xs text-gray-500 italic">{label}</span>
      )}
    </div>
  );
};

/* ─── Input ───────────────────────────────────────────────────── */
export const WfInput = ({
  label,
}: {
  label?: string;
}) => (
  <div className="w-full flex flex-col gap-0.5">
    {label && (
      <span className="text-xs text-black">{label}</span>
    )}
    <div className="w-full border border-black bg-white h-6 px-1.5 flex items-center">
      <WfTextBlock width={90} height={6} shade="light" />
    </div>
  </div>
);

/* ─── Textarea ────────────────────────────────────────────────── */
export const WfTextarea = ({ label }: { label: string }) => (
  <div className="w-full flex flex-col gap-0.5">
    <span className="text-xs text-black">{label}</span>
    <div className="w-full border border-black bg-white h-14 px-1.5 pt-2">
      <WfTextBlock width="80%" height={6} shade="light" />
    </div>
  </div>
);

/* ─── Button ──────────────────────────────────────────────────── */
export const WfButton = ({
  label,
  variant = "primary",
  size = "md",
  inline = false,
}: {
  label: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md";
  inline?: boolean;
}) => {
  const bg =
    variant === "primary"
      ? "bg-gray-800 text-white"
      : variant === "secondary"
      ? "bg-gray-300 text-black"
      : "bg-white text-black";
  const h = size === "sm" ? "h-5" : "h-7";
  const w = inline ? "px-3" : "w-full";
  return (
    <div
      className={`border border-black flex items-center justify-center flex-shrink-0 ${bg} ${h} ${w}`}
    >
      <span className="text-xs">{label}</span>
    </div>
  );
};

/* ─── Toggle / Segmented control ─────────────────────────────── */
export const WfToggle = ({
  options,
  active = 0,
}: {
  options: string[];
  active?: number;
}) => (
  <div className="flex border border-black w-full">
    {options.map((opt, i) => (
      <div
        key={i}
        className={`flex-1 flex items-center justify-center py-1.5 border-r last:border-r-0 border-black ${
          i === active ? "bg-gray-400" : "bg-gray-100"
        }`}
      >
        <span className="text-xs text-black text-center px-0.5 leading-tight">
          {opt}
        </span>
      </div>
    ))}
  </div>
);

/* ─── Dropdown ────────────────────────────────────────────────── */
export const WfDropdown = ({
  label,
  width,
}: {
  label: string;
  width?: number | string;
}) => (
  <div
    className="border border-black bg-white h-5 flex items-center justify-between px-1 gap-1 flex-shrink-0"
    style={{ width: width || "auto", minWidth: 80 }}
  >
    <span className="text-xs text-black truncate">{label}</span>
    <span className="text-xs text-black flex-shrink-0">▾</span>
  </div>
);

/* ─── Navbar ──────────────────────────────────────────────────── */
export const WfNav = ({
  left,
  center,
  right,
  height = 30,
}: {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  height?: number;
}) => (
  <div
    className="w-full border-b border-black bg-gray-100 flex items-center px-2 gap-1 flex-shrink-0"
    style={{ height }}
  >
    <div className="flex items-center gap-1 flex-1 min-w-0">{left}</div>
    {center && (
      <div className="flex items-center justify-center flex-1 min-w-0">
        {center}
      </div>
    )}
    <div className="flex items-center gap-1 justify-end flex-1 min-w-0">
      {right}
    </div>
  </div>
);

/* ─── Sidebar item ────────────────────────────────────────────── */
export const WfSidebarItem = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) => (
  <div
    className={`px-2 py-1.5 border-b border-gray-200 ${
      active ? "bg-gray-300" : "bg-white"
    } ${onClick ? "cursor-pointer hover:bg-gray-100" : ""}`}
    onClick={onClick}
  >
    <span className="text-xs text-black">{label}</span>
  </div>
);

/* ─── Summary card ───────────────────���────────────────────────── */
export const WfSummaryCard = ({
  label,
  fullWidth = false,
}: {
  label: string;
  value?: string;
  sub?: string;
  fullWidth?: boolean;
}) => (
  <div
    className={`border border-black bg-white p-2 flex flex-col gap-1.5 ${
      fullWidth ? "w-full" : "flex-1 min-w-0"
    }`}
  >
    <span className="text-xs text-gray-500 leading-tight">{label}</span>
    <WfTextBlock width="60%" height={14} shade="medium" />
    <WfTextBlock width="40%" height={6} shade="light" />
  </div>
);

/* ─── Table ───────────────────────────────────────────────────── */
export const WfTable = ({
  columns,
  rowCount = 4,
}: {
  columns: string[];
  rows?: React.ReactNode[][];
  rowCount?: number;
}) => {
  const widths = [80, 52, 44, 44, 56, 52, 48];
  return (
    <div className="w-full border border-black overflow-x-auto">
      <table className="w-full border-collapse" style={{ minWidth: "max-content" }}>
        <thead>
          <tr className="bg-gray-200">
            {columns.map((col, i) => (
              <th
                key={i}
                className="border border-black px-2 py-1 text-left whitespace-nowrap"
              >
                <span className="text-xs font-bold text-black">{col}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rowCount }).map((_, ri) => (
            <tr key={ri} className="bg-white border-b border-gray-200">
              {columns.map((_, ci) => (
                <td
                  key={ci}
                  className="border-r border-gray-200 px-2 py-2"
                >
                  <WfTextBlock
                    width={widths[ci % widths.length]}
                    height={7}
                    shade={ri % 2 === 0 ? "medium" : "light"}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ─── Chart placeholder ───────────────────────────────────────── */
export const WfChart = ({
  title,
  type,
  height = 90,
  className = "",
}: {
  title: string;
  type: string;
  height?: number;
  className?: string;
}) => (
  <div
    className={`border border-black flex flex-col flex-shrink-0 ${className}`}
    style={{ height }}
  >
    <div className="px-1.5 py-1 border-b border-black bg-gray-100 flex-shrink-0">
      <span className="text-xs text-black">{title}</span>
    </div>
    <div className="flex-1 bg-gray-200 relative overflow-hidden flex items-center justify-center">
      <span className="text-xs text-gray-400 italic">[ {type} ]</span>
    </div>
  </div>
);

/* ─── Banner / alert ──────────────────────────────────────────── */
export const WfBanner = ({
  text,
  button,
}: {
  text: string;
  button: string;
}) => (
  <div className="border border-black bg-gray-200 flex items-center justify-between px-2 py-1 gap-2 w-full">
    <span className="text-xs text-black leading-tight">{text}</span>
    <div className="border border-black bg-white px-1.5 py-0.5 flex-shrink-0">
      <span className="text-xs text-black">{button}</span>
    </div>
  </div>
);

/* ─── Step indicator ──────────────────────────────────────────── */
export const WfSteps = ({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) => (
  <div className="flex items-center w-full gap-1">
    {steps.map((step, i) => (
      <React.Fragment key={i}>
        <div className="flex items-center gap-1 flex-shrink-0">
          <div
            className={`w-4 h-4 border border-black flex items-center justify-center flex-shrink-0 ${
              i < current
                ? "bg-gray-400"
                : i === current
                ? "bg-gray-800"
                : "bg-white"
            }`}
          >
            <span
              className={`leading-none ${
                i === current ? "text-white" : "text-black"
              }`}
              style={{ fontSize: 9 }}
            >
              {i + 1}
            </span>
          </div>
          <span
            className={`text-xs whitespace-nowrap ${
              i === current ? "text-black" : "text-gray-400"
            }`}
          >
            {step}
          </span>
        </div>
        {i < steps.length - 1 && (
          <div className="flex-1 h-px bg-gray-300 min-w-2" />
        )}
      </React.Fragment>
    ))}
  </div>
);

/* ─── Divider ─────────────────────────────────────────────────── */
export const WfDivider = () => <div className="w-full h-px bg-gray-300" />;

/* ─── Password copy box ───────────────────────────────────────── */
export const WfCopyBox = () => (
  <div className="w-full border border-black bg-gray-100 h-7 px-2 flex items-center justify-between">
    <WfTextBlock width={100} height={7} shade="medium" />
    <div className="border border-black bg-gray-300 px-1.5 py-0.5 flex-shrink-0">
      <span className="text-xs text-black">Copy</span>
    </div>
  </div>
);

/* ─── Platform row (for Add Client step 2) ───────────────────── */
export const WfPlatformRow = ({ name }: { name: string }) => (
  <div className="flex items-center gap-1.5 w-full border-b border-gray-200 pb-1.5">
    <div
      className="border border-black bg-gray-200 px-1.5 h-5 flex items-center justify-center flex-shrink-0"
      style={{ width: 72 }}
    >
      <span className="text-xs text-black">{name}</span>
    </div>
    <div className="flex-1 border border-black bg-white h-5 px-1 flex items-center">
      <WfTextBlock width={50} height={6} shade="light" />
    </div>
    <div className="flex-1 border border-black bg-white h-5 px-1 flex items-center">
      <WfTextBlock width={50} height={6} shade="light" />
    </div>
    <div className="border border-black bg-gray-200 px-1.5 h-5 flex items-center justify-center flex-shrink-0">
      <span className="text-xs text-black">Test</span>
    </div>
  </div>
);

/* ─── Note text ───────────────────────────────────────────────── */
export const WfNote = ({ text }: { text: string }) => (
  <div className="border border-gray-300 bg-gray-100 px-2 py-1">
    <span className="text-xs text-gray-500 italic">{text}</span>
  </div>
);

/* ─── Hamburger placeholder ───────────────────────────────────── */
export const WfHamburger = () => (
  <div className="border border-black bg-gray-200 w-6 h-5 flex flex-col items-center justify-center gap-0.5 flex-shrink-0 px-1">
    <div className="w-full h-px bg-black" />
    <div className="w-full h-px bg-black" />
    <div className="w-full h-px bg-black" />
  </div>
);

/* ─── Bell placeholder ────────────────────────────────────────── */
export const WfBell = () => (
  <div className="border border-black bg-gray-200 w-5 h-5 flex items-center justify-center flex-shrink-0">
    <div className="w-2.5 h-2.5 bg-gray-400 rounded-sm" />
  </div>
);

/* ─── Card placeholder ──────────���─────────────────────────────── */
export const WfCard = ({
  height = 80,
  lines = 3,
  className = "",
}: {
  height?: number;
  lines?: number;
  className?: string;
}) => (
  <div
    className={`border border-black bg-white p-2 flex flex-col gap-1.5 ${className}`}
    style={{ minHeight: height }}
  >
    <WfTextBlock width="70%" height={8} shade="medium" />
    {lines > 1 &&
      Array.from({ length: lines - 1 }).map((_, i) => (
        <WfTextBlock
          key={i}
          width={`${55 - i * 10}%`}
          height={6}
          shade="light"
        />
      ))}
  </div>
);