// Member 01 - UI/UX Layout: Resources page with admin CRUD controls
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";

const API_BASE = "http://localhost:8080";

const EMPTY_FORM = {
  name: "",
  type: "LAB",
  capacity: "",
  location: "",
  status: "ACTIVE",
};

export default function ResourcesPage() {
  const user = useUser();
  const isAdmin = user?.role === "ADMIN";

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // resource being edited
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  const fetchResources = () => {
    setLoading(true);
    axios
      .get(`${API_BASE}/api/resources`, { withCredentials: true })
      .then((res) => setResources(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const openAdd = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowForm(true);
  };

  const openEdit = (r) => {
    setEditTarget(r);
    setForm({
      name: r.name,
      type: r.type,
      capacity: r.capacity,
      location: r.location,
      status: r.status,
    });
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...form, capacity: Number(form.capacity) };
      if (editTarget) {
        await axios.put(`${API_BASE}/api/resources/${editTarget.id}`, payload, {
          withCredentials: true,
        });
      } else {
        await axios.post(`${API_BASE}/api/resources`, payload, {
          withCredentials: true,
        });
      }
      setShowForm(false);
      fetchResources();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save resource.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resource?")) return;
    try {
      await axios.delete(`${API_BASE}/api/resources/${id}`, {
        withCredentials: true,
      });
      fetchResources();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete resource.");
    }
  };

  const statusTag = (status) => (
    <span
      className={`font-mono text-[10px] uppercase tracking-widest border px-2 py-0.5
      ${status === "ACTIVE" ? "border-green-600 text-green-700 bg-green-50" : "border-red-500 text-red-600 bg-red-50"}`}
    >
      {status}
    </span>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6 border-b-2 border-zinc-900 pb-2">
        <h2 className="font-mono text-lg uppercase tracking-widest text-zinc-900">
          Resources
        </h2>
        {isAdmin && (
          <button
            onClick={openAdd}
            className="font-mono text-xs uppercase tracking-widest border-2 border-zinc-900 px-4 py-2 hover:bg-zinc-900 hover:text-white transition-colors text-zinc-900"
          >
            + Add Resource
          </button>
        )}
      </div>

      {/* Add / Edit form — admin only */}
      {isAdmin && showForm && (
        <form
          onSubmit={handleSubmit}
          className="border-2 border-zinc-900 p-6 mb-8 bg-white space-y-4 max-w-lg"
        >
          <h3 className="font-mono text-sm uppercase tracking-widest border-b border-zinc-900 pb-2 text-zinc-900">
            {editTarget ? `Edit Resource #${editTarget.id}` : "New Resource"}
          </h3>

          <input
            type="text"
            placeholder="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border-2 border-zinc-900 px-3 py-2 font-mono text-sm focus:outline-none focus:border-zinc-500"
          />

          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full border-2 border-zinc-900 px-3 py-2 font-mono text-sm focus:outline-none focus:border-zinc-500"
          >
            <option value="LAB">LAB</option>
            <option value="HALL">HALL</option>
            <option value="EQUIP">EQUIP</option>
          </select>

          <input
            type="number"
            placeholder="Capacity"
            required
            min={1}
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            className="w-full border-2 border-zinc-900 px-3 py-2 font-mono text-sm focus:outline-none focus:border-zinc-500"
          />

          <input
            type="text"
            placeholder="Location"
            required
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full border-2 border-zinc-900 px-3 py-2 font-mono text-sm focus:outline-none focus:border-zinc-500"
          />

          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full border-2 border-zinc-900 px-3 py-2 font-mono text-sm focus:outline-none focus:border-zinc-500"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
          </select>

          {error && <p className="font-mono text-xs text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-zinc-900 text-white font-mono text-xs uppercase tracking-widest py-3 hover:bg-zinc-800 transition-colors"
            >
              {editTarget ? "Save Changes" : "Create Resource"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 border-2 border-zinc-900 font-mono text-xs uppercase tracking-widest py-3 hover:bg-zinc-900 hover:text-white transition-colors text-zinc-900"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="font-mono text-xs text-zinc-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((r) => (
            <div
              key={r.id}
              className="border-2 border-zinc-900 p-4 bg-white flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
                  #{r.id} · {r.type}
                </span>
                {statusTag(r.status)}
              </div>

              <h3 className="font-mono text-sm font-bold uppercase tracking-tight text-zinc-900 mb-2">
                {r.name}
              </h3>

              <div className="flex-1 space-y-1 mb-4">
                <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                  <span className="font-bold">LOC:</span> {r.location}
                </p>
                <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                  <span className="font-bold">CAP:</span> {r.capacity} PEOPLE
                </p>
              </div>

              {isAdmin && (
                <div className="mt-auto pt-4 border-t border-zinc-100 flex gap-2">
                  <button
                    onClick={() => openEdit(r)}
                    className="flex-1 font-mono text-[10px] uppercase tracking-widest border-2 border-zinc-900 py-1.5 hover:bg-zinc-900 hover:text-white transition-all text-zinc-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="flex-1 font-mono text-[10px] uppercase tracking-widest border-2 border-red-500 text-red-600 py-1.5 hover:bg-red-500 hover:text-white transition-all"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {!loading && resources.length === 0 && (
        <p className="font-mono text-xs text-zinc-500 mt-4">
          No resources found.
        </p>
      )}
    </div>
  );
}
