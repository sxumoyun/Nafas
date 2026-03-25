// src/App.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Districts from "./pages/Districts";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Stats from "./pages/Stats";
import Tips from "./pages/Tips";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/districts" element={<Districts />} />
          <Route path="/tips" element={<Tips />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
