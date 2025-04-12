import "./index.css";
// TanStack Query and PocketBase Providers
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PocketProvider } from "@contexts/PocketContext";
import { queryClient } from "@lib/queryClient";

// Route components
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@components/ProtectedRoute";
import PublicOnlyRoute from "@components/PublicOnlyRoute";
import MainLayout from "@routes/MainLayout";
import LandingPage from "@routes/LandingPage";
import AuthLayout from "@routes/auth/AuthLayout";
import Login from "@routes/auth/Login";
import SignUp from "@routes/auth/SignUp";
import UserLayout from "@routes/user/UserLayout";
import Dashboard from "@routes/user/Dashboard";
import Settings from "@routes/user/Settings";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PocketProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              {/* Public routes */}
              <Route element={<PublicOnlyRoute />}>
                <Route index element={<LandingPage />} />
                {/* Auth routes */}
                <Route element={<AuthLayout />}>
                  <Route path="login" element={<Login />} />
                  <Route path="signup" element={<SignUp />} />
                </Route>
              </Route>
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="user" element={<UserLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </PocketProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
