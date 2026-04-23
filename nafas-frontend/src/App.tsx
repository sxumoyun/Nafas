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
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />
        <Route
          path="/stats"
          element={
            <>
              <Navbar />
              <Stats />
            </>
          }
        />
        <Route
          path="/districts"
          element={
            <>
              <Navbar />
              <Districts />
            </>
          }
        />
        <Route
          path="/tips"
          element={
            <>
              <Navbar />
              <Tips />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <Navbar />
              <Profile />
            </>
          }
        />
        <Route
          path="/admin"
          element={
            <>
              <Navbar />
              <Admin />
            </>
          }
        />
      </Routes>
    </HashRouter>
  );
}
