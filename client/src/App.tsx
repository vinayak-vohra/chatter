import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import { auth } from "./config/firebase";
import { useAppStore } from "./context";
import Loader from "./components/loader";

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
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
