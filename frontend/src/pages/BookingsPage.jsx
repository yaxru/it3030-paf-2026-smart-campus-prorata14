// Member 02 - Booking Engine & Logic: Bookings page
import { useEffect, useState } from "react";
import axios from "axios";
import BookingForm from "../components/BookingForm";
import { useUser } from "../context/UserContext";

const API_BASE = "http://localhost:8080";

export default function BookingsPage() {
  const user = useUser();
  const isAdmin = user?.role === "ADMIN";

  const [bookings, setBookings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reasonInputs, setReasonInputs] = useState({});

  const fetchBookings = () => {
    setLoading(true);
    const url = isAdmin
      ? `${API_BASE}/api/bookings/all`
      : `${API_BASE}/api/bookings/my`;
    axios
      .get(url, { withCredentials: true })
      .then((res) => setBookings(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, [isAdmin]);

  const updateStatus = (id, status) => {
    axios
      .put(
        `${API_BASE}/api/bookings/${id}/status`,
        { status, reason: reasonInputs[id] || "" },
        { withCredentials: true },
      )
      .then(fetchBookings);
  };

  const statusColors = {
    PENDING: "border-yellow-500 text-yellow-700 bg-yellow-50",
    APPROVED: "border-green-600 text-green-700 bg-green-50",
    REJECTED: "border-red-500 text-red-600 bg-red-50",
    CANCELLED: "border-gray-400 text-gray-600 bg-gray-50",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 border-b-2 border-zinc-900 pb-2">
        <h2 className="font-mono text-lg uppercase tracking-widest text-zinc-900">
          {isAdmin ? "All Bookings" : "My Bookings"}
        </h2>
        {!isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="font-mono text-xs uppercase tracking-widest border-2 border-zinc-900 px-4 py-2 hover:bg-zinc-900 hover:text-white transition-colors"
          >
            {showForm ? "Close" : "+ New Booking"}
          </button>
        )}
      </div>

      {showForm && !isAdmin && (
        <div className="mb-8">
          <BookingForm
            onSuccess={() => {
              setShowForm(false);
              fetchBookings();
            }}
          />
        </div>
      )}

      {loading ? (
        <p className="font-mono text-xs text-zinc-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map((b) => (
            <div key={b.id} className="border-2 border-zinc-900 p-4 bg-white flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  #{b.id} · Res {b.resourceId}
                </span>
                <span
                  className={`font-mono text-[10px] uppercase tracking-widest border px-2 py-0.5 ${statusColors[b.status]}`}
                >
                  {b.status}
                </span>
              </div>

              <div className="flex-1">
                <p className="font-mono text-sm text-zinc-800 font-bold uppercase tracking-tight line-clamp-2 mb-2">
                  {b.purpose}
                </p>
                <div className="space-y-1">
                  <p className="font-mono text-[10px] text-zinc-500 flex items-center gap-1">
                    <span className="font-bold">START:</span> {new Date(b.startTime).toLocaleString()}
                  </p>
                  <p className="font-mono text-[10px] text-zinc-500 flex items-center gap-1">
                    <span className="font-bold">END:</span> {new Date(b.endTime).toLocaleString()}
                  </p>
                  {isAdmin && b.userId && (
                    <p className="font-mono text-[10px] text-zinc-400 italic truncate">
                      User: {b.userId}
                    </p>
                  )}
                </div>

                {b.adminReason && (
                  <p className="font-mono text-[10px] text-zinc-600 mt-3 border-l-2 border-zinc-900 pl-2 italic bg-zinc-50 py-1">
                    REASON: {b.adminReason}
                  </p>
                )}
              </div>

              {/* Admin approve / reject controls */}
              {isAdmin && b.status === "PENDING" && (
                <div className="mt-4 pt-4 border-t border-zinc-100 flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Optional reason..."
                    className="border-2 border-zinc-900 font-mono text-[10px] px-2 py-1.5 w-full focus:outline-none focus:bg-zinc-50"
                    value={reasonInputs[b.id] || ""}
                    onChange={(e) =>
                      setReasonInputs((r) => ({ ...r, [b.id]: e.target.value }))
                    }
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(b.id, "APPROVED")}
                      className="flex-1 font-mono text-[10px] uppercase tracking-widest border-2 border-green-600 text-green-700 py-1.5 hover:bg-green-600 hover:text-white transition-all"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(b.id, "REJECTED")}
                      className="flex-1 font-mono text-[10px] uppercase tracking-widest border-2 border-red-500 text-red-600 py-1.5 hover:bg-red-500 hover:text-white transition-all"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {!loading && bookings.length === 0 && (
        <p className="font-mono text-xs text-zinc-500">No bookings yet.</p>
      )}
    </div>
  );
}
