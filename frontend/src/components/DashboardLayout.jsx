// Member 01 - UI/UX Layout: Main DashboardLayout with sidebar and top navbar
import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import {
  LayoutDashboard,
  CalendarCheck,
  AlertTriangle,
  Bell,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const API_BASE = "http://localhost:8080";

const navItems = [
  { to: "/dashboard/resources", label: "Resources", icon: LayoutDashboard },
  { to: "/dashboard/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/dashboard/tickets", label: "Tickets", icon: AlertTriangle },
  { to: "/dashboard/notifications", label: "Notifications", icon: Bell },
];

export default function DashboardLayout() {
  const [user, setUser] = useState(null);
  const [unread, setUnread] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/auth/me`, { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => navigate("/login"));

    axios
      .get(`${API_BASE}/api/notifications/unread-count`, {
        withCredentials: true,
      })
      .then((res) => setUnread(res.data.count))
      .catch(() => {});
  }, [navigate]);

  const handleLogout = () => {
    window.location.href = `${API_BASE}/api/auth/logout`;
  };

  return (
    <div className="flex h-screen bg-gray-50 font-['Inter',sans-serif]">
      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside
        className={`flex flex-col bg-black text-white transition-all duration-200
          ${sidebarOpen ? "w-56" : "w-16"} shrink-0`}
      >
        {/* Logo / Toggle */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          {sidebarOpen && (
            <span className="font-mono text-xs uppercase tracking-widest text-white/70">
              SmartCampus
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white/60 hover:text-white"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-none border transition-colors
                 font-mono text-xs uppercase tracking-widest
                 ${
                   isActive
                     ? "bg-white text-black border-white"
                     : "border-transparent text-white/60 hover:text-white hover:border-white/30"
                 }`
              }
            >
              <Icon size={16} className="shrink-0" />
              {sidebarOpen && <span>{label}</span>}
              {/* Unread badge on Notifications */}
              {label === "Notifications" && unread > 0 && sidebarOpen && (
                <span className="ml-auto bg-white text-black font-mono text-[10px] px-1.5 py-0.5 rounded-full">
                  {unread}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full text-white/60 hover:text-white
                       font-mono text-xs uppercase tracking-widest"
          >
            <LogOut size={16} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main area ────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navbar */}
        <header className="flex items-center justify-between bg-white border-b-2 border-black px-6 py-3 shrink-0">
          <h1 className="font-mono text-sm uppercase tracking-widest text-black/70">
            Smart Campus Portal
          </h1>

          {/* User profile */}
          {user ? (
            <div className="flex items-center gap-3">
              {/* Role tag */}
              <span className="font-mono text-[10px] uppercase tracking-widest border border-black px-2 py-0.5 bg-black text-white">
                {user.role}
              </span>
              <span className="font-mono text-xs text-black/60 hidden sm:block">
                {user.email}
              </span>
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border-2 border-black object-cover"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full border-2 border-black bg-black text-white
                                flex items-center justify-center font-mono text-xs"
                >
                  {user.name?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}
              <button
                onClick={handleLogout}
                className="font-mono text-xs uppercase tracking-widest border-2 border-black
                           px-3 py-1 hover:bg-black hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          )}
        </header>

        {/* Page content — provide user (incl. role) via context */}
        <main className="flex-1 overflow-auto p-6">
          <UserContext.Provider value={user}>
            <Outlet />
          </UserContext.Provider>
        </main>
      </div>
    </div>
  );
}
