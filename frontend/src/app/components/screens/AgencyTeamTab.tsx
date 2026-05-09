import React, { useState, useEffect } from "react";
import { Plus, ShieldCheck, Trash2, Link as LinkIcon, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// Interface definitions
interface TeamUser {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
}

interface Client {
  id: string;
  name: string;
  industry: string;
}

interface Assignment {
  id: string;
  employee_id: string;
  client_id: string;
  client_name: string;
}

export function AgencyTeamTab() {
  const { apiFetch } = useAuth();
  const [teamMembers, setTeamMembers] = useState<TeamUser[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [assignments, setAssignments] = useState<Record<string, Assignment[]>>({});
  
  const [loading, setLoading] = useState(true);
  const [expandedEmpId, setExpandedEmpId] = useState<string | null>(null);
  
  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmpName, setNewEmpName] = useState("");
  const [newEmpEmail, setNewEmpEmail] = useState("");
  const [newEmpRole, setNewEmpRole] = useState<"manager" | "employee">("employee");
  const [addingEmp, setAddingEmp] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [createdRole, setCreatedRole] = useState<"manager" | "employee">("employee");
  
  // Assign state
  const [assigningTo, setAssigningTo] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string>("");

  async function loadData() {
    setLoading(true);
    try {
      const [usersRes, clientsRes, assignRes] = await Promise.all([
        apiFetch("/api/users"),
        apiFetch("/api/clients"),
        apiFetch("/api/assignments")
      ]);
      if (usersRes.ok && clientsRes.ok && assignRes.ok) {
        const usersData = await usersRes.json();
        const clientsData = await clientsRes.json();
        const assignData = await assignRes.json();
        
        setTeamMembers(
          usersData.users?.filter((u: any) => u.display_role === "employee" || u.display_role === "manager") || []
        );
        setClients(clientsData.clients || []);
        
        // Group assignments by employee
        const grouped: Record<string, Assignment[]> = {};
        for (const a of (assignData.assignments || [])) {
          if (!grouped[a.employee_id]) grouped[a.employee_id] = [];
          grouped[a.employee_id].push(a);
        }
        setAssignments(grouped);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [apiFetch]);

  async function handleAddEmployee(e: React.FormEvent) {
    e.preventDefault();
    setAddingEmp(true);
    try {
      const res = await apiFetch("/api/users", {
        method: "POST",
        body: JSON.stringify({ name: newEmpName, email: newEmpEmail, role: newEmpRole })
      });
      const data = await res.json();
      if (res.ok) {
        setTempPassword(data.temp_password);
        setCreatedRole(newEmpRole);
        loadData();
        setNewEmpName("");
        setNewEmpEmail("");
        setNewEmpRole("employee");
        // Keep modal open to show temp password
      } else {
        alert(data.error || "Failed to create team member");
      }
    } finally {
      setAddingEmp(false);
    }
  }

  async function handleAssignClient(empId: string) {
    if (!selectedClientId) return;
    try {
      const res = await apiFetch("/api/assignments", {
        method: "POST",
        body: JSON.stringify({ employee_id: empId, client_id: selectedClientId })
      });
      if (res.ok) {
        setAssigningTo(null);
        setSelectedClientId("");
        loadData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to assign client");
      }
    } catch (e) {
      alert("Error assigning client");
    }
  }

  async function handleUnassign(assignmentId: string) {
    try {
      const res = await apiFetch(`/api/assignments/${assignmentId}`, { method: "DELETE" });
      if (res.ok) {
        loadData();
      } else {
        alert("Failed to unassign client");
      }
    } catch (e) {
      alert("Error unassigning client");
    }
  }

  if (loading) return <div className="p-8 text-center text-slate-500">Loading team data...</div>;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900 font-bold" style={{ fontSize: 18 }}>Team & Access</h1>
          <p className="text-slate-500" style={{ fontSize: 12 }}>Manage your managers, employees, and employee client assignments.</p>
        </div>
        <button
          onClick={() => { setIsAddModalOpen(true); setTempPassword(null); setCreatedRole("employee"); }}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-white font-semibold cursor-pointer shadow-sm hover:opacity-90 transition-opacity"
          style={{ background: "#6366F1", fontSize: 12 }}
        >
          <Plus size={13} /> Add Team Member
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm" style={{ border: "1px solid #E2E8F0" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "#F8FAFC" }}>
              {["Team Member", "Role", "Email", "Status", "Assigned Clients", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-slate-500 font-semibold border-b border-slate-100" style={{ fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teamMembers.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500" style={{ fontSize: 13 }}>No team members found.</td></tr>
            ) : (
              teamMembers.map(emp => {
                const isExpanded = expandedEmpId === emp.id;
                const empAssignments = assignments[emp.id] || [];
                const isEmployee = emp.role === "employee";
                return (
                  <React.Fragment key={emp.id}>
                    <tr className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: "#6366F1", fontSize: 10 }}>
                            {emp.name.substring(0,2).toUpperCase()}
                          </div>
                          <span className="text-slate-800 font-semibold" style={{ fontSize: 12 }}>{emp.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-medium"
                          style={{
                            background: emp.role === "manager" ? "#EEF2FF" : "#ECFEFF",
                            color: emp.role === "manager" ? "#4338CA" : "#155E75",
                            fontSize: 11
                          }}
                        >
                          {emp.role === "manager" ? "Manager" : "Employee"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500" style={{ fontSize: 12 }}>{emp.email}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-medium" style={{ background: emp.is_active ? "#ECFDF5" : "#F1F5F9", color: emp.is_active ? "#065F46" : "#475569", fontSize: 11 }}>
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: emp.is_active ? "#10B981" : "#94A3B8" }} />
                          {emp.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-slate-800 font-medium" style={{ fontSize: 12 }}>
                          {isEmployee ? `${empAssignments.length} clients` : "Agency-wide access"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {isEmployee ? (
                          <button
                            onClick={() => setExpandedEmpId(isExpanded ? null : emp.id)}
                            className="border border-slate-200 rounded-md px-2.5 py-1 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer"
                            style={{ fontSize: 11 }}
                          >
                            {isExpanded ? "Close Access" : "Manage Access"}
                          </button>
                        ) : (
                          <span className="text-slate-400" style={{ fontSize: 11 }}>No client assignment needed</span>
                        )}
                      </td>
                    </tr>
                    {isExpanded && isEmployee && (
                      <tr style={{ background: "#F8FAFC" }}>
                        <td colSpan={6} className="px-4 py-4 border-t border-slate-100">
                          <div className="ml-9 p-4 bg-white rounded-lg border border-slate-200">
                            <h4 className="text-slate-800 font-semibold mb-3 flex items-center gap-1.5" style={{ fontSize: 12 }}>
                              <ShieldCheck size={14} className="text-indigo-500" />
                              Assigned Clients for {emp.name}
                            </h4>
                            
                            <div className="flex flex-col gap-2 mb-4">
                              {empAssignments.length === 0 ? (
                                <p className="text-slate-500" style={{ fontSize: 12 }}>No clients assigned yet.</p>
                              ) : (
                                empAssignments.map(a => (
                                  <div key={a.id} className="flex items-center justify-between p-2.5 border border-slate-100 rounded-lg bg-slate-50">
                                    <span className="text-slate-700 font-medium" style={{ fontSize: 12 }}>{a.client_name}</span>
                                    <button 
                                      onClick={() => handleUnassign(a.id)}
                                      className="text-slate-400 hover:text-red-500 cursor-pointer"
                                      title="Remove assignment"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                ))
                              )}
                            </div>

                            {assigningTo === emp.id ? (
                              <div className="flex items-center gap-2 mt-3 p-3 bg-indigo-50/50 rounded-lg border border-indigo-100">
                                <select 
                                  className="flex-1 border border-slate-200 rounded-md px-2 py-1.5 text-slate-700 bg-white" 
                                  style={{ fontSize: 12 }}
                                  value={selectedClientId}
                                  onChange={e => setSelectedClientId(e.target.value)}
                                >
                                  <option value="">Select a client...</option>
                                  {clients.filter(c => !empAssignments.find(a => a.client_id === c.id)).map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => handleAssignClient(emp.id)}
                                  disabled={!selectedClientId}
                                  className="rounded-md px-3 py-1.5 text-white font-semibold cursor-pointer disabled:opacity-50"
                                  style={{ background: "#6366F1", fontSize: 12 }}
                                >
                                  Assign
                                </button>
                                <button
                                  onClick={() => setAssigningTo(null)}
                                  className="rounded-md px-3 py-1.5 text-slate-600 font-semibold border border-slate-200 cursor-pointer bg-white"
                                  style={{ fontSize: 12 }}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => { setAssigningTo(emp.id); setSelectedClientId(""); }}
                                className="flex items-center gap-1.5 text-indigo-600 font-medium cursor-pointer hover:underline mt-2"
                                style={{ fontSize: 12 }}
                              >
                                <LinkIcon size={12} /> Assign new client
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            {!tempPassword ? (
              <>
                <h3 className="text-slate-900 font-bold mb-1" style={{ fontSize: 18 }}>Add Team Member</h3>
                <p className="text-slate-500 mb-5" style={{ fontSize: 13 }}>They will receive an email with their Keycloak temporary credentials.</p>
                
                <form onSubmit={handleAddEmployee} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-700 font-semibold" style={{ fontSize: 12 }}>Role</label>
                    <select
                      value={newEmpRole}
                      onChange={e => setNewEmpRole(e.target.value as "manager" | "employee")}
                      className="border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:border-indigo-500 outline-none bg-white"
                      style={{ fontSize: 13 }}
                    >
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-700 font-semibold" style={{ fontSize: 12 }}>Full Name</label>
                    <input 
                      required value={newEmpName} onChange={e => setNewEmpName(e.target.value)}
                      className="border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:border-indigo-500 outline-none" style={{ fontSize: 13 }}
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-700 font-semibold" style={{ fontSize: 12 }}>Email Address</label>
                    <input 
                      required type="email" value={newEmpEmail} onChange={e => setNewEmpEmail(e.target.value)}
                      className="border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:border-indigo-500 outline-none" style={{ fontSize: 13 }}
                      placeholder="jane@agency.com"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3 mt-4">
                    <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 rounded-lg py-2 text-slate-700 font-semibold border border-slate-200 hover:bg-slate-50 cursor-pointer" style={{ fontSize: 13 }}>Cancel</button>
                    <button type="submit" disabled={addingEmp} className="flex-1 rounded-lg py-2 text-white font-semibold cursor-pointer disabled:opacity-50" style={{ background: "#6366F1", fontSize: 13 }}>
                      {addingEmp ? "Creating..." : `Create ${newEmpRole === "manager" ? "Manager" : "Employee"}`}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-3">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-slate-900 font-bold mb-1" style={{ fontSize: 18 }}>
                  {createdRole === "manager" ? "Manager Created!" : "Employee Created!"}
                </h3>
                <p className="text-slate-500 mb-5" style={{ fontSize: 13 }}>An email has been sent to them. Alternatively, you can securely copy their temporary password below.</p>
                
                <div className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 mb-5 flex flex-col items-center gap-2">
                  <span className="text-slate-500 font-medium" style={{ fontSize: 11 }}>TEMPORARY PASSWORD</span>
                  <span className="text-slate-900 font-mono font-bold text-lg">{tempPassword}</span>
                </div>
                
                <button onClick={() => setIsAddModalOpen(false)} className="w-full rounded-lg py-2 text-white font-semibold cursor-pointer" style={{ background: "#6366F1", fontSize: 13 }}>
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
