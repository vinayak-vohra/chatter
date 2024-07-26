import { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import { auth } from "./config/firebase";
import { useAppStore } from "./context";
import Loader from "./components/loader/PageLoader";
import ProtectedRoute from "./components/ProtectedRoute";
import Chats from "./components/chatnav/Chat";
import Search from "./components/chatnav/Search";

export default function App() {
  const setUser = useAppStore((state) => state.setUser);
  const hasUserMounted = useAppStore((state) => state.hasUserMounted);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(setUser);

    return unsub;
  }, []);

  if (!hasUserMounted) return <Loader />;
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute />}>
          <Route index element={<Navigate to="/chats" replace />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/groups" element={<>Groups page</>} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<>Profile page</>} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
