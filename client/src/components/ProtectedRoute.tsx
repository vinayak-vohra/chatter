import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useAppStore } from "../context";
import SideNav from "./chatnav/SideNav";

export default function ProtectedRoute() {
  const user = useAppStore((state) => state.user);
  const nav = useNavigate();

  useEffect(() => {
    if (!user) nav("/login", { replace: true });
  }, [user]);

  return (
    <div className="h-dvh w-dvw flex overflow-hidden">
      <SideNav />
      <Outlet />
    </div>
  );
}
