import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationsRead,
} from "../services/airQuality";
import { getProfile, updateProfile } from "../services/auth";
import { useAuthStore } from "../store/authStore";

interface Notification {
  _id: string;
  message: string;
  district: string;
  aqi: number;
  isRead: boolean;
  sentAt: string;
}

interface Profile {
  name: string;
  email: string;
  district: string;
  alertThreshold: number;
  emailNotification: boolean;
  dailyReport: boolean;
}

export default function Profile() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    Promise.all([getProfile(), getNotifications()])
      .then(([profileRes, notifRes]) => {
        setProfile(profileRes.data);
        setNotifications(notifRes.data);
        markNotificationsRead();
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    await updateProfile({
      name: profile.name,
      district: profile.district,
      alertThreshold: profile.alertThreshold,
      emailNotification: profile.emailNotification,
      dailyReport: profile.dailyReport,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AK";

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-xl font-medium text-gray-800 mb-6">Kabinet</h1>

      {/* Ikki kartochka */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Profil */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm font-medium text-gray-700 mb-4">Profil</p>
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium mb-4">
            {initials}
          </div>
          {[
            { label: "Ism familiya", key: "name" },
            { label: "Tuman", key: "district" },
          ].map((f) => (
            <div key={f.key} className="mb-3">
              <label className="text-xs text-gray-400 block mb-1">
                {f.label}
              </label>
              <input
                value={(profile as any)[f.key]}
                onChange={(e) =>
                  setProfile({ ...profile, [f.key]: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-blue-400"
              />
            </div>
          ))}
          <div className="mb-3">
            <label className="text-xs text-gray-400 block mb-1">Email</label>
            <input
              value={profile.email}
              disabled
              className="w-full border border-gray-100 rounded-xl px-3 py-2 text-sm text-gray-400 bg-gray-50"
            />
          </div>
        </div>

        {/* Sozlamalar */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm font-medium text-gray-700 mb-4">
            Ogohlantirish sozlamalari
          </p>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">AQI chegarasi</span>
              <span className="font-medium text-blue-600">
                {profile.alertThreshold}
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={200}
              value={profile.alertThreshold}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  alertThreshold: Number(e.target.value),
                })
              }
              className="w-full accent-blue-600"
            />
          </div>

          {[
            {
              label: "Email xabar",
              sub: "Chegara oshganda",
              key: "emailNotification",
            },
            {
              label: "Kunlik hisobot",
              sub: "Har kuni soat 08:00",
              key: "dailyReport",
            },
          ].map((t) => (
            <div
              key={t.key}
              className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
            >
              <div>
                <p className="text-sm text-gray-800">{t.label}</p>
                <p className="text-xs text-gray-400">{t.sub}</p>
              </div>
              <button
                onClick={() =>
                  setProfile({ ...profile, [t.key]: !(profile as any)[t.key] })
                }
                className={`w-10 h-6 rounded-full transition-colors relative ${
                  (profile as any)[t.key] ? "bg-blue-500" : "bg-gray-200"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    (profile as any)[t.key] ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Saqlash tugmasi — ikki kartochka ostida */}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full py-3 rounded-xl text-sm font-medium transition-colors mb-4 ${
          saved
            ? "bg-green-500 text-white"
            : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        }`}
      >
        {saving ? "Saqlanmoqda..." : saved ? "✓ Saqlandi!" : "Saqlash"}
      </button>

      {/* Bildirishnomalar */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <p className="text-sm font-medium text-gray-700 mb-4">
          So'nggi bildirishnomalar
          {notifications.filter((n) => !n.isRead).length > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {notifications.filter((n) => !n.isRead).length}
            </span>
          )}
        </p>

        {notifications.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            Hozircha bildirishnoma yo'q
          </p>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`flex items-start gap-3 py-2 border-b border-gray-50 last:border-0 ${
                  !n.isRead ? "opacity-100" : "opacity-60"
                }`}
              >
                <div
                  className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                  style={{
                    background:
                      n.aqi > 150
                        ? "#E24B4A"
                        : n.aqi > 100
                          ? "#EF9F27"
                          : "#639922",
                  }}
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(n.sentAt).toLocaleString("uz-UZ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
