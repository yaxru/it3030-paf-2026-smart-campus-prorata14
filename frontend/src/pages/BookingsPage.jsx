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
        { withCredentials: true }
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
      <div className="flex items-center justify-between mb-6 border-b-2 border-black pb-2">
        <h2 className="font-mono text-lg uppercase tracking-widest">
          {isAdmin ? "All Bookings" : "My Bookings"}
        </h2>
        {!isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="font-mono text-xs uppercase tracking-widest border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
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
        <p className="font-mono text-xs text-black/40">Loading...</p>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="border-2 border-black p-4 bg-white">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs uppercase tracking-widest text-black/50">
                  Booking #{b.id} · Resource {b.resourceId}
                  {isAdmin && b.userId && (
                    <span className="ml-2 text-black/40">· {b.userId}</span>
                  )}
                </span>
                <span
                  className={`font-mono text-[10px] uppercase tracking-widest border px-2 py-0.5 ${statusColors[b.status]}`}
                >
                  {b.status}
                </span>
              </div>
              <p className="font-mono text-sm">{b.purpose}</p>
              <p className="font-mono text-xs text-black/50 mt-1">
                {new Date(b.startTime).toLocaleString()} →{" "}
                {new Date(b.endTime).toLocaleString()}
              </p>
              {b.adminReason && (
                <p className="font-mono text-xs text-black/60 mt-1 border-l-2 border-black pl-2">
                  Reason: {b.adminReason}
                </p>
              )}

              {/* Admin approve / reject controls */}
              {isAdmin && b.status === "PENDING" && (
                <div className="mt-3 flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Optional reason..."
                    className="border border-black font-mono text-xs px-2 py-1 w-full"
                    value={reasonInputs[b.id] || ""}
                    onChange={(e) =>
                      setReasonInputs((r) => ({ ...r, [b.id]: e.target.value }))
                    }
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(b.id, "APPROVED")}
                      className="font-mono text-xs uppercase tracking-widest border-2 border-green-600 text-green-700 px-3 py-1 hover:bg-green-600 hover:text-white transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(b.id, "REJECTED")}
                      className="font-mono text-xs uppercase tracking-widest border-2 border-red-500 text-red-600 px-3 py-1 hover:bg-red-500 hover:text-white transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {bookings.length === 0 && (
            <p className="font-mono text-xs text-black/40">No bookings yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
