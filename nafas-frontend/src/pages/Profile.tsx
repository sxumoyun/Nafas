// src/pages/Profile.tsx
import { useState } from "react";

const notifications = [
  {
    id: 1,
    color: "#E24B4A",
    text: "Sergeli: AQI 167 ga yetdi — xavfli daraja.",
    time: "Bugun 14:30",
  },
  {
    id: 2,
    color: "#EF9F27",
    text: "Bektemir: AQI 120 — sezgir guruhlar ehtiyot bo'lsin.",
    time: "Bugun 09:15",
  },
  {
    id: 3,
    color: "#639922",
    text: "Yunusobod: Havo holati yaxshilandi. AQI 42.",
    time: "Kecha 18:00",
  },
];

export default function Profile() {
  const [threshold, setThreshold] = useState(100);
  const [emailOn, setEmailOn] = useState(true);
  const [pushOn, setPushOn] = useState(true);
  const [dailyOn, setDailyOn] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-xl font-medium text-gray-800 mb-6">Kabinet</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Profil */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm font-medium text-gray-700 mb-4">Profil</p>
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium mb-4">
            AK
          </div>
          {[
            { label: "Ism familiya", value: "Alisher Karimov" },
            { label: "Email", value: "alisher@email.com" },
            { label: "Tuman", value: "Yunusobod" },
          ].map((f) => (
            <div key={f.label} className="mb-3">
              <label className="text-xs text-gray-400 block mb-1">
                {f.label}
              </label>
              <input
                defaultValue={f.value}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-blue-400"
              />
            </div>
          ))}
        </div>

        {/* Sozlamalar */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm font-medium text-gray-700 mb-4">
            Ogohlantirish sozlamalari
          </p>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">AQI chegarasi</span>
              <span className="font-medium text-blue-600">{threshold}</span>
            </div>
            <input
              type="range"
              min={50}
              max={200}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          {[
            {
              label: "Email xabar",
              sub: "Chegara oshganda",
              val: emailOn,
              set: setEmailOn,
            },
            {
              label: "Push bildirishnoma",
              sub: "Brauzer orqali",
              val: pushOn,
              set: setPushOn,
            },
            {
              label: "Kunlik hisobot",
              sub: "Har kuni soat 08:00",
              val: dailyOn,
              set: setDailyOn,
            },
          ].map((t) => (
            <div
              key={t.label}
              className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
            >
              <div>
                <p className="text-sm text-gray-800">{t.label}</p>
                <p className="text-xs text-gray-400">{t.sub}</p>
              </div>
              <button
                onClick={() => t.set(!t.val)}
                className={`w-10 h-6 rounded-full transition-colors relative ${t.val ? "bg-blue-500" : "bg-gray-200"}`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${t.val ? "translate-x-5" : "translate-x-1"}`}
                />
              </button>
            </div>
          ))}

          <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
            Saqlash
          </button>
        </div>
      </div>

      {/* Bildirishnomalar */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <p className="text-sm font-medium text-gray-700 mb-4">
          So'nggi bildirishnomalar
        </p>
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0"
            >
              <div
                className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                style={{ background: n.color }}
              />
              <div>
                <p className="text-sm text-gray-800">{n.text}</p>
                <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
