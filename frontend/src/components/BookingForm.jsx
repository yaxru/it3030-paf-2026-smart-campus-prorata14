// Member 02 - Booking Engine & Logic: BookingForm React component
import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8080";

export default function BookingForm({ resourceId, onSuccess }) {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({
    resourceId: resourceId || "",
    purpose: "",
    startTime: "",
    endTime: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/resources`, { withCredentials: true })
      .then((res) => {
        // Only show ACTIVE resources
        setResources(res.data.filter((r) => r.status === "ACTIVE"));
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validate = () => {
    if (!form.startTime || !form.endTime) {
      return "Start and end times are required.";
    }
    if (new Date(form.endTime) <= new Date(form.startTime)) {
      return "End time must be after start time.";
    }
    if (!form.purpose.trim()) {
      return "Purpose is required.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${API_BASE}/api/bookings`,
        {
          resourceId: Number(form.resourceId),
          purpose: form.purpose,
          startTime: form.startTime,
          endTime: form.endTime,
        },
        { withCredentials: true },
      );
      setForm({
        resourceId: resourceId || "",
        purpose: "",
        startTime: "",
        endTime: "",
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(
        err.response?.data?.message || "Booking failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border-2 border-zinc-900 p-6 max-w-lg">
      <h2 className="font-mono text-xl font-bold uppercase tracking-widest mb-6 border-b-2 border-zinc-900 pb-2 text-zinc-900">
        Request Booking
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Resource */}
        <div>
          <label className="block font-mono text-xs uppercase tracking-widest mb-1 text-zinc-600">
            Resource
          </label>
          <select
            name="resourceId"
            value={form.resourceId}
            onChange={handleChange}
            required
            className="w-full border-2 border-zinc-900 px-3 py-2 font-mono text-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-zinc-800"
          >
            <option value="">— select a resource —</option>
            {resources.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.type}
                {r.capacity ? `, cap: ${r.capacity}` : ""}) — {r.location}
              </option>
            ))}
          </select>
        </div>

        {/* Purpose */}
        <div>
          <label className="block font-mono text-xs uppercase tracking-widest mb-1 text-zinc-600">
            Purpose
          </label>
          <input
            type="text"
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            required
            className="w-full border-2 border-zinc-900 px-3 py-2 font-mono text-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-zinc-800"
            placeholder="e.g. Group study session"
          />
        </div>

        {/* Start Time */}
        <div>
          <label className="block font-mono text-xs uppercase tracking-widest mb-1 text-zinc-600">
            Start Time
          </label>
          <input
            type="datetime-local"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            required
            className="w-full border-2 border-zinc-900 px-3 py-2 font-mono text-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-zinc-800"
          />
        </div>

        {/* End Time */}
        <div>
          <label className="block font-mono text-xs uppercase tracking-widest mb-1 text-zinc-600">
            End Time
          </label>
          <input
            type="datetime-local"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            required
            min={form.startTime}
            className="w-full border-2 border-zinc-900 px-3 py-2 font-mono text-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-zinc-800"
          />
        </div>

        {/* Error message */}
        {error && (
          <p className="font-mono text-xs text-red-600 border border-red-200 px-3 py-2 bg-red-50">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-zinc-900 text-white font-mono text-sm uppercase tracking-widest py-3 hover:bg-zinc-800 transition-colors disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}
