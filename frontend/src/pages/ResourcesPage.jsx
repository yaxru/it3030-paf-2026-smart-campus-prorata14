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
      <div className="flex items-center justify-between mb-6 border-b-2 border-black pb-2">
        <h2 className="font-mono text-lg uppercase tracking-widest">
          Resources
        </h2>
        {isAdmin && (
          <button
            onClick={openAdd}
            className="font-mono text-xs uppercase tracking-widest border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
          >
            + Add Resource
          </button>
        )}
      </div>

      {/* Add / Edit form — admin only */}
      {isAdmin && showForm && (
        <form
          onSubmit={handleSubmit}
          className="border-2 border-black p-6 mb-8 bg-white space-y-4 max-w-lg"
        >
          <h3 className="font-mono text-sm uppercase tracking-widest border-b border-black pb-2">
            {editTarget ? `Edit Resource #${editTarget.id}` : "New Resource"}
          </h3>

          <input
            type="text"
            placeholder="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border-2 border-black px-3 py-2 font-mono text-sm focus:outline-none"
          />

          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full border-2 border-black px-3 py-2 font-mono text-sm focus:outline-none"
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
            className="w-full border-2 border-black px-3 py-2 font-mono text-sm focus:outline-none"
          />

          <input
            type="text"
            placeholder="Location"
            required
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full border-2 border-black px-3 py-2 font-mono text-sm focus:outline-none"
          />

          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full border-2 border-black px-3 py-2 font-mono text-sm focus:outline-none"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
          </select>

          {error && <p className="font-mono text-xs text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-black text-white font-mono text-xs uppercase tracking-widest py-3 hover:bg-gray-800 transition-colors"
            >
              {editTarget ? "Save Changes" : "Create Resource"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 border-2 border-black font-mono text-xs uppercase tracking-widest py-3 hover:bg-black hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="font-mono text-xs text-black/40">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-2 border-black text-sm font-mono">
            <thead className="bg-black text-white">
              <tr>
                {["ID", "Name", "Type", "Capacity", "Location", "Status", ...(isAdmin ? ["Actions"] : [])].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-2 uppercase tracking-widest text-xs"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {resources.map((r, i) => (
                <tr key={r.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-2 border-b border-black/10">{r.id}</td>
                  <td className="px-4 py-2 border-b border-black/10">{r.name}</td>
                  <td className="px-4 py-2 border-b border-black/10">{r.type}</td>
                  <td className="px-4 py-2 border-b border-black/10">{r.capacity}</td>
                  <td className="px-4 py-2 border-b border-black/10">{r.location}</td>
                  <td className="px-4 py-2 border-b border-black/10">{statusTag(r.status)}</td>
                  {isAdmin && (
                    <td className="px-4 py-2 border-b border-black/10">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(r)}
                          className="font-mono text-[10px] uppercase tracking-widest border border-black px-2 py-0.5 hover:bg-black hover:text-white transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="font-mono text-[10px] uppercase tracking-widest border border-red-500 text-red-600 px-2 py-0.5 hover:bg-red-500 hover:text-white transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {resources.length === 0 && (
            <p className="font-mono text-xs text-black/40 mt-4">
              No resources found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

