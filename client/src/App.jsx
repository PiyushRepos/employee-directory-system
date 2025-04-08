import React from "react";
import LoginPage from "./pages/Login/Login.jsx";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register/Register.jsx";
import DashboardPage from "./pages/Dashboard/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import RegisterPage from "./pages/Register/Register.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
