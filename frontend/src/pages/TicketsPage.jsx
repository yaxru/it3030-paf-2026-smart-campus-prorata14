// Member 03 - Incident Ticketing & Notifications: Tickets page
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";

const API_BASE = "http://localhost:8080";

export default function TicketsPage() {
  const user = useUser();
  const isAdmin = user?.role === "ADMIN";
  const isTechnician = user?.role === "TECHNICIAN";

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [technicians, setTechnicians] = useState([]);
  const [resources, setResources] = useState([]);
  const [assignInputs, setAssignInputs] = useState({});
  const [form, setForm] = useState({
    resourceId: "",
    description: "",
    priority: "LOW",
    imageUrls: "",
  });
  const [error, setError] = useState("");

  const fetchIncidents = () => {
    setLoading(true);
    axios
      .get(`${API_BASE}/api/incidents`, { withCredentials: true })
      .then((res) => setIncidents(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchIncidents();
    // Load resources for the report form
    axios
      .get(`${API_BASE}/api/resources`, { withCredentials: true })
      .then((res) =>
        setResources(res.data.filter((r) => r.status === "ACTIVE")),
      )
      .catch(() => {});
    if (isAdmin) {
      axios
        .get(`${API_BASE}/api/admin/users/technicians`, {
          withCredentials: true,
        })
        .then((res) => setTechnicians(res.data))
        .catch(() => {});
    }
  }, [isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const urls = form.imageUrls
        .split(",")
        .map((u) => u.trim())
        .filter(Boolean)
        .slice(0, 3);
      await axios.post(
        `${API_BASE}/api/incidents`,
        { ...form, resourceId: Number(form.resourceId), imageUrls: urls },
        { withCredentials: true },
      );
      setShowForm(false);
      fetchIncidents();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create incident.");
    }
  };

  const assignTechnician = (id) => {
    const techEmail = assignInputs[id];
    if (!techEmail) return;
    axios
      .put(
        `${API_BASE}/api/incidents/${id}/assign`,
        { technicianEmail: techEmail },
        { withCredentials: true },
      )
      .then(fetchIncidents);
  };

  const priorityColors = {
    LOW: "border-blue-400 text-blue-600 bg-blue-50",
    HIGH: "border-red-500 text-red-600 bg-red-50",
  };
  const statusColors = {
    OPEN: "border-yellow-500 text-yellow-700",
    IN_PROGRESS: "border-blue-500 text-blue-700",
    RESOLVED: "border-green-600 text-green-700",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 border-b-2 border-zinc-900 pb-2 text-zinc-900">
        <h2 className="font-mono text-lg uppercase tracking-widest">
          {isTechnician ? "My Assigned Tickets" : "Incident Tickets"}
        </h2>
        {/* Only non-admin, non-technician users can open new tickets */}
        {!isAdmin && !isTechnician && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="font-mono text-xs uppercase tracking-widest border-2 border-zinc-900 px-4 py-2 hover:bg-zinc-900 hover:text-white transition-colors"
          >
            {showForm ? "Close" : "+ New Ticket"}
          </button>
        )}
      </div>

      {showForm && !isAdmin && !isTechnician && (
        <form
          onSubmit={handleSubmit}
          className="border-2 border-zinc-900 p-6 mb-8 bg-white space-y-4 max-w-lg"
        >
          <h3 className="font-mono text-sm uppercase tracking-widest border-b border-zinc-900 pb-2 text-zinc-900">
            Report Incident
          </h3>
          <select
            required
            value={form.resourceId}
            onChange={(e) => setForm({ ...form, resourceId: e.target.value })}
            className="w-full border-2 border-zinc-900 px-3 py-2 font-mono text-sm focus:outline-none focus:border-zinc-500"
          >
            <option value="">— select a resource —</option>
            {resources.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.type}
                {r.capacity ? `, cap: ${r.capacity}` : ""}) — {r.location}
              </option>
            ))}
          </select>
          <textarea
            placeholder="Description"
            required
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border-2 border-zinc-900 px-3 py-2 font-mono text-sm focus:outline-none focus:border-zinc-500 resize-none"
          />
          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            className="w-full border-2 border-zinc-900 px-3 py-2 font-mono text-sm focus:outline-none focus:border-zinc-500"
          >
            <option value="LOW">LOW</option>
            <option value="HIGH">HIGH</option>
          </select>
          <input
            type="text"
            placeholder="Image URLs (comma-separated, max 3)"
            value={form.imageUrls}
            onChange={(e) => setForm({ ...form, imageUrls: e.target.value })}
            className="w-full border-2 border-zinc-900 px-3 py-2 font-mono text-sm focus:outline-none focus:border-zinc-500"
          />
          {error && <p className="font-mono text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full bg-zinc-900 text-white font-mono text-xs uppercase tracking-widest py-3 hover:bg-zinc-800 transition-colors"
          >
            Submit Ticket
          </button>
        </form>
      )}

      {loading ? (
        <p className="font-mono text-xs text-zinc-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {incidents.map((inc) => (
            <div
              key={inc.id}
              className="border-2 border-zinc-900 p-4 bg-white flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
                  #{inc.id}
                </span>
                <div className="flex gap-1">
                  <span
                    className={`font-mono text-[10px] uppercase tracking-widest border px-2 py-0.5 ${priorityColors[inc.priority]}`}
                  >
                    {inc.priority}
                  </span>
                  <span
                    className={`font-mono text-[10px] uppercase tracking-widest border px-2 py-0.5 ${statusColors[inc.status]}`}
                  >
                    {inc.status}
                  </span>
                </div>
              </div>

              <p className="font-mono text-sm text-zinc-800 flex-1 font-bold uppercase tracking-tight mb-4">
                {inc.description}
              </p>

              <div className="space-y-1 mb-4">
                {inc.assignedTo ? (
                  <p className="font-mono text-[10px] text-zinc-600 flex items-center gap-1">
                    <span className="font-bold">TECH:</span> {inc.assignedTo}
                  </p>
                ) : (
                  isAdmin && (
                    <p className="font-mono text-[10px] text-zinc-400 italic">
                      Pending Assignment
                    </p>
                  )
                )}
              </div>

              {/* Admin: assign-technician control */}
              {isAdmin && inc.status !== "RESOLVED" && (
                <div className="mt-auto pt-4 border-t border-zinc-100 space-y-2">
                  <select
                    className="w-full border-2 border-zinc-900 font-mono text-[10px] px-2 py-1.5 focus:outline-none focus:bg-zinc-50"
                    value={assignInputs[inc.id] || ""}
                    onChange={(e) =>
                      setAssignInputs((a) => ({
                        ...a,
                        [inc.id]: e.target.value,
                      }))
                    }
                  >
                    <option value="">— select tech —</option>
                    {technicians.map((t) => (
                      <option key={t.email} value={t.email}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => assignTechnician(inc.id)}
                    className="w-full font-mono text-[10px] uppercase tracking-widest border-2 border-zinc-900 py-1.5 hover:bg-zinc-900 hover:text-white transition-all text-zinc-900"
                  >
                    Assign Tech
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {!loading && incidents.length === 0 && (
        <p className="font-mono text-xs text-zinc-500">No tickets found.</p>
      )}
    </div>
  );
}
