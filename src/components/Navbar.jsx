import Button from "@components/Button";
import { Link } from "react-router";
import { usePocket, usePace } from "@/hooks";
import { CircleUserRound } from "lucide-react";

export default function Navbar() {
  const { user, logout } = usePocket();
  const { data } = usePace();

  return (
    <nav className="flex flex-row justify-between items-center">
      <div className="flex flex-row gap-4 items-center">
        <p className="text-xl font-bold">Solves Pacer</p>
        {user ? (
          <>
            <div className="flex flex-row gap-2 items-center text-gray-400">
              <CircleUserRound />
              <span className="">{user.name}</span>
            </div>
            <Link
              className="hover:bg-gray-600 px-3 py-2 rounded transition-colors"
              to="/user"
            >
              Home
            </Link>
            <Link
              className="hover:bg-gray-600 px-3 py-2 rounded transition-colors"
              to="/user/settings"
            >
              Settings
            </Link>
          </>
        ) : (
          <>
            <Link
              className="hover:bg-gray-600 px-3 py-2 rounded transition-colors"
              to="/login"
            >
              Login
            </Link>
            <Link
              className="hover:bg-gray-600 px-3 py-2 rounded transition-colors"
              to="/signup"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
