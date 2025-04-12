import { Outlet } from "react-router";
import { usePocket } from "@/hooks";
import Button from "@components/Button";
import { Link } from "react-router";

export default function UserLayout() {
  const { user, logout } = usePocket();

  return (
    <>
      <div className="min-h-screen mx-auto">
        <Outlet />
      </div>
    </>
  );
}
