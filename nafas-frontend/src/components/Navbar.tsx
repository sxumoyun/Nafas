import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";

const links = [
  { path: "/", label: "Bosh sahifa" },
  { path: "/stats", label: "Statistika" },
  { path: "/districts", label: "Tumanlar" },
  { path: "/tips", label: "Tavsiyalar" },
  { path: "/profile", label: "Kabinet" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { isDark, toggle } = useThemeStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-3 flex items-center justify-between sticky top-0 z-50 backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
          <span className="text-white text-xs font-bold">N</span>
        </div>
        <span className="font-semibold text-gray-900 dark:text-white text-base">
          Nafas
        </span>
      </Link>

      {/* Links */}
      <div className="flex items-center gap-1">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              pathname === link.path
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            {link.label}
          </Link>
        ))}

        {(user?.role === "admin" || user?.role === "superadmin") && (
          <Link
            to="/admin"
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              pathname === "/admin"
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            Admin
          </Link>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Dark mode toggle */}
        <button
          onClick={toggle}
          className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {isDark ? "☀️" : "🌙"}
        </button>

        {user ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
              {initials}
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors"
            >
              Chiqish
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="text-sm text-white bg-blue-600 px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Kirish
          </Link>
        )}
      </div>
    </nav>
  );
}
