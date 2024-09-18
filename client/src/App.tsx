import { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import { auth } from "./config/firebase";
import { useAppStore } from "./context";
import Loader from "./components/loader/PageLoader";
import ProtectedRoute from "./components/ProtectedRoute";
import Chats from "./components/sidepanes/Chats";
import Search from "./components/sidepanes/Search";
import NewChats from "./components/sidepanes/NewChat";


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
          <Route path="/chats/:id?" element={<Chats />} />
          <Route path="/groups/:id?" element={<>Groups page</>} />
          <Route path="/search/:id?" element={<Search />} />
          <Route path="/profile/:id?" element={<>Profile page</>} />
          <Route path="/new-chat/:id?" element={<NewChats />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
