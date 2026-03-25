// src/pages/Tips.tsx
import { useState } from "react";
import { getAQIInfo } from "../utils/aqi";

const levels = [
  {
    range: "0 - 50",
    aqi: 25,
    tips: [
      "Ertalab yugurish mumkin",
      "Derazani ochiq qoldiring",
      "Bolalar tashqarida o'ynashi mumkin",
    ],
  },
  {
    range: "51 - 100",
    aqi: 75,
    tips: [
      "Uzoq vaqt tashqarida qolmang",
      "Sezgir odamlar niqob taqsin",
      "Sport mashg'ulotlarini kamaytiring",
    ],
  },
  {
    range: "101 - 150",
    aqi: 125,
    tips: [
      "Astmatiklar uyda qolsin",
      "Niqob taqib chiqing",
      "Derazalarni yoping",
    ],
  },
  {
    range: "151 - 200",
    aqi: 175,
    tips: [
      "Hamma uyda qolsin",
      "N95 niqob tavsiya etiladi",
      "Havo tozalagich ishlating",
    ],
  },
  {
    range: "200+",
    aqi: 250,
    tips: [
      "Tashqariga chiqmang",
      "Tibbiy yordam tayyor bo'lsin",
      "Favqulodda xizmatlarni kuzating",
    ],
  },
];

export default function Tips() {
  const [selected, setSelected] = useState(levels[0]);
  const info = getAQIInfo(selected.aqi);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-xl font-medium text-gray-800 mb-2">
        Sog'liq tavsiyalari
      </h1>
      <p className="text-sm text-gray-400 mb-6">
        AQI darajasiga qarab nima qilish kerakligini bilib oling
      </p>

      {/* Daraja tanlash */}
      <div className="flex flex-wrap gap-2 mb-8">
        {levels.map((l) => {
          const i = getAQIInfo(l.aqi);
          return (
            <button
              key={l.range}
              onClick={() => setSelected(l)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                selected.range === l.range
                  ? "shadow-md scale-105"
                  : "opacity-70"
              }`}
              style={{
                background: i.color,
                color: i.textColor,
                borderColor: i.textColor + "40",
              }}
            >
              {l.range}
            </button>
          );
        })}
      </div>

      {/* Tavsiyalar */}
      <div
        className="rounded-2xl p-6 border"
        style={{ background: info.color, borderColor: info.textColor + "30" }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
            style={{ background: info.textColor, color: "#fff" }}
          >
            {selected.aqi}
          </div>
          <div>
            <p
              className="font-medium text-lg"
              style={{ color: info.textColor }}
            >
              {info.label}
            </p>
            <p className="text-sm" style={{ color: info.textColor + "99" }}>
              AQI {selected.range}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {selected.tips.map((tip, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-white bg-opacity-60 rounded-xl p-3"
            >
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                style={{ background: info.textColor, color: "#fff" }}
              >
                {i + 1}
              </span>
              <p className="text-sm" style={{ color: info.textColor }}>
                {tip}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
