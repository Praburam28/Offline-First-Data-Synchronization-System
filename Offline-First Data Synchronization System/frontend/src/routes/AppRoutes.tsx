import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Records from "../pages/Records";
import Profile from "../pages/Profile";
import Conflicts from "../pages/Conflicts";
import SyncHistory from "../pages/SyncHistory";
import MainLayout from "../layouts/MainLayout";

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected application routes */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/records" element={<Records />} />
        <Route path="/sync-history" element={<SyncHistory />} />
        <Route path="/conflicts" element={<Conflicts />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Unknown route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;