import { useEffect, useState } from "react";
import {
  clearAirQuality,
  deleteStation,
  deleteUser,
  getAdminAirQuality,
  getAdminStations,
  getAdminStats,
  getAdminUsers,
  toggleStation,
  updateUserRole,
} from "../services/admin";
import { useAuthStore } from "../store/authStore";

type Tab = "stats" | "users" | "stations" | "airquality";

interface Stats {
  users: number;
  stations: number;
  airQualityCount: number;
  latestAqi: { aqi: number; recordedAt: string } | null;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  district: string;
  createdAt: string;
}

interface Station {
  _id: string;
  name: string;
  district: string;
  isActive: boolean;
  coordinates: [number, number];
}

interface AirQualityItem {
  _id: string;
  aqi: number;
  category: string;
  recordedAt: string;
  stationId: { district: string; name: string } | null;
}

export default function Admin() {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === "superadmin";

  const [tab, setTab] = useState<Tab>("stats");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [airQuality, setAirQuality] = useState<AirQualityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, stationsRes, aqRes] = await Promise.all([
        getAdminStats(),
        getAdminUsers(),
        getAdminStations(),
        getAdminAirQuality(),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setStations(stationsRes.data);
      setAirQuality(aqRes.data);
    } catch {
      alert("Admin huquqi kerak!");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id: string, role: string) => {
    await updateUserRole(id, role);
    setUsers(users.map((u) => (u._id === id ? { ...u, role } : u)));
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Foydalanuvchini o'chirasizmi?")) return;
    await deleteUser(id);
    setUsers(users.filter((u) => u._id !== id));
  };

  const handleToggleStation = async (id: string) => {
    const res = await toggleStation(id);
    setStations(
      stations.map((s) =>
        s._id === id ? { ...s, isActive: res.data.isActive } : s,
      ),
    );
  };

  const handleDeleteStation = async (id: string) => {
    if (!confirm("Stansiyani o'chirasizmi?")) return;
    await deleteStation(id);
    setStations(stations.filter((s) => s._id !== id));
  };

  const handleClearData = async () => {
    if (!confirm("7 kundan eski ma'lumotlarni o'chirasizmi?")) return;
    setClearing(true);
    const res = await clearAirQuality();
    alert(`${res.data.deleted} ta ma'lumot o'chirildi!`);
    setClearing(false);
    const aqRes = await getAdminAirQuality();
    setAirQuality(aqRes.data);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "stats", label: "Dashboard" },
    { key: "users", label: "Foydalanuvchilar" },
    { key: "stations", label: "Stansiyalar" },
    { key: "airquality", label: "AQI Ma'lumotlar" },
  ];

  const roleColor = (role: string) => {
    if (role === "superadmin") return "bg-purple-100 text-purple-700";
    if (role === "admin") return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-500";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium text-gray-800 dark:text-white">
            Admin Panel
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {isSuperAdmin ? "👑 Super Admin" : "🔧 Admin"} — Tizim boshqaruvi
          </p>
        </div>
        <button
          onClick={loadData}
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Yangilash
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
              tab === t.key
                ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 font-medium shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {tab === "stats" && stats && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Foydalanuvchilar",
                value: stats.users,
                color: "text-blue-600",
              },
              {
                label: "Faol stansiyalar",
                value: stats.stations,
                color: "text-green-600",
              },
              {
                label: "AQI yozuvlar",
                value: stats.airQualityCount,
                color: "text-purple-600",
              },
              {
                label: "So'nggi AQI",
                value: stats.latestAqi?.aqi ?? "—",
                color: "text-orange-600",
              },
            ].map((s) => (
              <div key={s.label} className="glass rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                <p className={`text-3xl font-semibold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="glass rounded-xl p-5">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Tizim holati
            </p>
            {[
              { label: "Backend", status: "Ishlayapti", color: "bg-green-500" },
              { label: "MongoDB", status: "Ulangan", color: "bg-green-500" },
              { label: "IQAir API", status: "Faol", color: "bg-green-500" },
              {
                label: "Scheduler",
                status: "Har 30 daqiqada",
                color: "bg-blue-500",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {s.label}
                </span>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${s.color} animate-pulse`}
                  />
                  <span className="text-xs text-gray-500">{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Foydalanuvchilar */}
      {tab === "users" && (
        <div className="glass rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                {["Ism", "Email", "Tuman", "Role", "Amal"].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs text-gray-500 px-4 py-3 font-medium"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                          u.role === "superadmin"
                            ? "bg-purple-100 text-purple-700"
                            : u.role === "admin"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {u.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <span className="text-sm text-gray-800 dark:text-gray-200">
                        {u.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{u.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {u.district}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${roleColor(u.role)}`}
                    >
                      {u.role === "superadmin"
                        ? "👑 Super Admin"
                        : u.role === "admin"
                          ? "🔧 Admin"
                          : "👤 User"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {isSuperAdmin ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={u.role}
                          onChange={(e) =>
                            handleRoleChange(u._id, e.target.value)
                          }
                          className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="superadmin">Super Admin</option>
                        </select>
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="text-xs text-red-500 border border-red-200 rounded-lg px-2 py-1 hover:bg-red-50 transition-colors"
                        >
                          O'chirish
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">
                        Ko'rish huquqi
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Stansiyalar */}
      {tab === "stations" && (
        <div className="glass rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                {["Stansiya", "Tuman", "Koordinatlar", "Holat", "Amal"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left text-xs text-gray-500 px-4 py-3 font-medium"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {stations.map((s) => (
                <tr
                  key={s._id}
                  className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                    {s.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {s.district}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {s.coordinates[0].toFixed(4)}, {s.coordinates[1].toFixed(4)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        s.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {s.isActive ? "Faol" : "Nofaol"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleStation(s._id)}
                        className={`text-xs border rounded-lg px-2 py-1 transition-colors ${
                          s.isActive
                            ? "text-orange-500 border-orange-200 hover:bg-orange-50"
                            : "text-green-500 border-green-200 hover:bg-green-50"
                        }`}
                      >
                        {s.isActive ? "O'chirish" : "Yoqish"}
                      </button>
                      {isSuperAdmin && (
                        <button
                          onClick={() => handleDeleteStation(s._id)}
                          className="text-xs text-red-500 border border-red-200 rounded-lg px-2 py-1 hover:bg-red-50 transition-colors"
                        >
                          O'chirish
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* AQI Ma'lumotlar */}
      {tab === "airquality" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              So'nggi {airQuality.length} ta yozuv
            </p>
            {isSuperAdmin && (
              <button
                onClick={handleClearData}
                disabled={clearing}
                className="text-sm text-red-500 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                {clearing ? "O'chirilmoqda..." : "7 kundan eskini o'chirish"}
              </button>
            )}
          </div>

          <div className="glass rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  {["Tuman", "AQI", "Kategoriya", "Vaqt"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs text-gray-500 px-4 py-3 font-medium"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {airQuality.map((a) => (
                  <tr
                    key={a._id}
                    className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                      {a.stationId?.district ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-sm font-medium ${
                          a.aqi <= 50
                            ? "text-green-600"
                            : a.aqi <= 100
                              ? "text-yellow-600"
                              : a.aqi <= 150
                                ? "text-orange-600"
                                : "text-red-600"
                        }`}
                      >
                        {a.aqi}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                        {a.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(a.recordedAt).toLocaleString("uz-UZ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
