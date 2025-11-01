import { Routes, Route } from "react-router-dom";
import { Login, MainLayout, Register } from "../pages";
import PrivateRoute from "../features/auth/components/PrivateRoute";
import Subscription from "@pages/subscription/Subscription";

export default function AuthRoute() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      />
      <Route
        path="/membership"
        element={
          <PrivateRoute>
            <Subscription />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
