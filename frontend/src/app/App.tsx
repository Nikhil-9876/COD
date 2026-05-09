import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Screen1Login } from "./components/screens/Screen1Login";
import { Screen3AgencyDashboard } from "./components/screens/Screen3AgencyDashboard";
import { Screen4AddClient } from "./components/screens/Screen4AddClient";
import { Screen5ClientDashboard } from "./components/screens/Screen5ClientDashboard";
import { Screen6EmployeeDashboard } from "./components/screens/Screen6EmployeeDashboard";
import { ReactNode } from "react";

/**
 * Route guard — checks authentication and role access.
 * Accepts one or more allowed roles.
 */
function AuthGuard({
    children,
    allowedRoles,
}: {
    children: ReactNode;
    allowedRoles?: ("admin" | "manager" | "employee" | "client")[];
}) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F1F5F9" }}>
                <div style={{ color: "#64748B", fontSize: 16 }}>Loading…</div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Wrong role — redirect to their dashboard
        return <Navigate to={getDashboardPath(user.role)} replace />;
    }

    return <>{children}</>;
}

/**
 * Returns the dashboard path for a given role.
 */
function getDashboardPath(role: string): string {
    switch (role) {
        case "admin":
        case "manager":
            return "/agency/dashboard";
        case "employee":
            return "/employee/dashboard";
        case "client":
            return "/client/dashboard";
        default:
            return "/login";
    }
}

function SmartRedirect() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F1F5F9" }}>
                <div style={{ color: "#64748B", fontSize: 16 }}>Loading…</div>
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;
    return <Navigate to={getDashboardPath(user.role)} replace />;
}



function AppRoutes() {
    return (
        <div className="min-h-screen flex" style={{ backgroundColor: "#F1F5F9" }}>
            <main className="flex-1 overflow-auto">
                <Routes>
                    <Route path="/" element={<SmartRedirect />} />
                    <Route path="/login" element={<Screen1Login />} />

                    {/* Admin routes */}
                    <Route
                        path="/agency/dashboard"
                        element={
                            <AuthGuard allowedRoles={["admin", "manager"]}>
                                <Screen3AgencyDashboard />
                            </AuthGuard>
                        }
                    />
                    <Route
                        path="/agency/add-client"
                        element={
                            <AuthGuard allowedRoles={["admin"]}>
                                <Screen4AddClient />
                            </AuthGuard>
                        }
                    />

                    <Route
                        path="/employee/dashboard"
                        element={
                            <AuthGuard allowedRoles={["employee"]}>
                                <Screen6EmployeeDashboard />
                            </AuthGuard>
                        }
                    />

                    {/* Client routes */}
                    <Route
                        path="/client/dashboard"
                        element={
                            <AuthGuard allowedRoles={["client"]}>
                                <Screen5ClientDashboard />
                            </AuthGuard>
                        }
                    />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
}
