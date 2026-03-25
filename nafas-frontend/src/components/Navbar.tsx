// src/components/Navbar.tsx
import { Link, useLocation } from "react-router-dom";

const links = [
  { path: "/", label: "Bosh sahifa" },
  { path: "/stats", label: "Statistika" },
  { path: "/districts", label: "Tumanlar" },
  { path: "/tips", label: "Tavsiyalar" },
  { path: "/profile", label: "Kabinet" },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
        <span className="font-medium text-gray-900 text-base">HavoNazor</span>
      </Link>

      {/* Links */}
      <div className="flex items-center gap-1">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              pathname === link.path
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* User avatar */}
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-sm font-medium cursor-pointer">
        AK
      </div>
    </nav>
  );
}
