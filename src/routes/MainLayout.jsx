import { Outlet } from "react-router";
import Navbar from "@/components/Navbar";

export default function MainLayout() {
  return (
    <div className="h-screen bg-gray-800 text-gray-100 px-9 py-6 font-sans antialiased">
      <Navbar />
      <div className="text-gray-100 selection:bg-green-600 selection:text-white accent-green-500">
        <Outlet />
      </div>
    </div>
  );
}
