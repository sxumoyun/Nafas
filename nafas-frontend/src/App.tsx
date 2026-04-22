import { HashRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Districts from "./pages/Districts";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Stats from "./pages/Stats";
import Tips from "./pages/Tips";
import Admin from "./pages/admin";
import Login from "./pages/login";
import Register from "./pages/registr";

export default function App() {
  return (
    <HashRouter>
      <div className="relative min-h-screen">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/*"
            element={
              <div className="min-h-screen">
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/stats" element={<Stats />} />
                  <Route path="/districts" element={<Districts />} />
                  <Route path="/tips" element={<Tips />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/admin" element={<Admin />} />
                </Routes>
              </div>
            }
          />
        </Routes>
      </div>
    </HashRouter>
  );
}
