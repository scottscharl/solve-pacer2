import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="min-h-screen mx-auto">
      <Outlet />
    </div>
  );
}
