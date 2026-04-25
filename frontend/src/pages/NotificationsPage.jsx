// Member 03 - Incident Ticketing & Notifications: Notifications page
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8080";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = () => {
    setLoading(true);
    axios
      .get(`${API_BASE}/api/notifications`, { withCredentials: true })
      .then((res) => setNotifications(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markRead = async (id) => {
    await axios.put(
      `${API_BASE}/api/notifications/${id}/read`,
      {},
      { withCredentials: true },
    );
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  return (
    <div>
      <h2 className="font-mono text-lg uppercase tracking-widest mb-6 border-b-2 border-black pb-2">
        Notifications
      </h2>

      {loading ? (
        <p className="font-mono text-xs text-black/40">Loading...</p>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`border-2 p-4 flex items-start justify-between
                ${n.isRead ? "border-black/20 bg-gray-50" : "border-black bg-white"}`}
            >
              <div>
                <p
                  className={`font-mono text-sm ${n.isRead ? "text-black/40" : "text-black"}`}
                >
                  {n.message}
                </p>
                <p className="font-mono text-[10px] text-black/30 mt-1 uppercase tracking-widest">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
              {!n.isRead && (
                <button
                  onClick={() => markRead(n.id)}
                  className="font-mono text-[10px] uppercase tracking-widest border border-black px-2 py-1 ml-4 shrink-0 hover:bg-black hover:text-white transition-colors"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))}
          {notifications.length === 0 && (
            <p className="font-mono text-xs text-black/40">No notifications.</p>
          )}
        </div>
      )}
    </div>
  );
}
