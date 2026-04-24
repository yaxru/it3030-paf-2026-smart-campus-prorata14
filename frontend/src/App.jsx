// Member 01 - UI/UX Layout: App router configuration
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import LoginPage from "./pages/LoginPage";
import ResourcesPage from "./pages/ResourcesPage";
import BookingsPage from "./pages/BookingsPage";
import TicketsPage from "./pages/TicketsPage";
import NotificationsPage from "./pages/NotificationsPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="resources" replace />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
