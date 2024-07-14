import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import { auth } from "./config/firebase";

export default function App() {
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(console.log);

    return unsub;
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
