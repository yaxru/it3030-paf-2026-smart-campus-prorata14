// Member 01 - Facilities & Security: Admin page to manage user roles
import { useState, useEffect } from "react";
import axios from "axios";
import { Users, ShieldCheck, Mail, RefreshCw } from "lucide-react";

const API_BASE = "http://localhost:8080";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/admin/users`, {
        withCredentials: true,
      });
      setUsers(res.data);
    } catch (err) {
      setError("Failed to load users. Are you an admin?");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (email, newRole) => {
    try {
      await axios.put(
        `${API_BASE}/api/admin/users/${email}/role`,
        { role: newRole },
        { withCredentials: true },
      );
      // Update local state
      setUsers((prev) =>
        prev.map((u) => (u.email === email ? { ...u, role: newRole } : u)),
      );
    } catch (err) {
      alert("Failed to update role. Please try again.");
    }
  };

  if (loading)
    return <div className="p-6 font-mono text-zinc-500">Loading users...</div>;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-mono uppercase tracking-tighter text-zinc-900 flex items-center gap-2">
            <Users size={24} /> User Management
          </h2>
          <p className="text-zinc-500 font-mono text-xs mt-1 uppercase tracking-widest">
            Manage campus roles and access
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="p-2 border-2 border-zinc-900 hover:bg-zinc-900 hover:text-white transition-colors"
        >
          <RefreshCw size={16} />
        </button>
      </header>

      {error && (
        <div className="border-2 border-red-200 bg-red-50 p-4 font-mono text-xs text-red-600">
          {error}
        </div>
      )}

      <div className="border-2 border-zinc-900 bg-white overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-100 border-b-2 border-zinc-900">
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500 font-semibold italic">
                User Details
              </th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500 font-semibold italic">
                Current Role
              </th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500 font-semibold italic">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-zinc-900">
            {users.map((user) => (
              <tr
                key={user.email}
                className="hover:bg-zinc-50 transition-colors"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    {user.picture ? (
                      <img
                        src={user.picture}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full border-2 border-zinc-900 object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full border-2 border-zinc-900 bg-zinc-900 text-white flex items-center justify-center font-mono text-sm uppercase">
                        {user.name?.[0] || "?"}
                      </div>
                    )}
                    <div>
                      <div className="font-mono text-sm font-bold text-zinc-900 uppercase tracking-tight">
                        {user.name}
                      </div>
                      <div className="flex items-center gap-1 text-zinc-500 font-mono text-[10px]">
                        <Mail size={10} /> {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-block font-mono text-[10px] px-2 py-0.5 border uppercase tracking-widest
                    ${
                      user.role === "ADMIN"
                        ? "bg-zinc-900 text-white border-zinc-900"
                        : user.role === "TECHNICIAN"
                          ? "bg-zinc-100 text-zinc-900 border-zinc-900 font-bold"
                          : "bg-white text-zinc-500 border-zinc-200"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(user.email, e.target.value)
                    }
                    className="font-mono text-[10px] uppercase tracking-widest border-2 border-zinc-900 px-2 py-1 bg-white focus:outline-none focus:bg-zinc-900 focus:text-white transition-colors cursor-pointer"
                  >
                    <option value="USER">Make User</option>
                    <option value="TECHNICIAN">Make Tech</option>
                    <option value="ADMIN">Make Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && !loading && (
          <div className="p-12 text-center font-mono text-zinc-400 italic">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
}
