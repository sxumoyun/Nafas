// src/pages/Districts.tsx
import { useState } from "react";
import AQICard from "../components/AQICard";
import { getAQIInfo } from "../utils/aqi";

const districts = [
  { district: "Yunusobod", aqi: 42, pm25: 12, pm10: 18, co: 0.3, no2: 15 },
  { district: "Chilonzor", aqi: 88, pm25: 28, pm10: 45, co: 0.8, no2: 32 },
  { district: "Sergeli", aqi: 167, pm25: 58, pm10: 92, co: 1.8, no2: 68 },
  { district: "Bektemir", aqi: 152, pm25: 52, pm10: 84, co: 1.6, no2: 61 },
  {
    district: "Mirzo Ulug'bek",
    aqi: 105,
    pm25: 35,
    pm10: 56,
    co: 1.1,
    no2: 42,
  },
  { district: "Shayxontohur", aqi: 55, pm25: 16, pm10: 26, co: 0.5, no2: 19 },
];

export default function Districts() {
  const [selected, setSelected] = useState(districts[0]);
  const info = getAQIInfo(selected.aqi);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-xl font-medium text-gray-800 mb-6">Tumanlar</h1>

      {/* Tuman kartochkalari */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {districts.map((d) => (
          <div
            key={d.district}
            onClick={() => setSelected(d)}
            className={`cursor-pointer rounded-xl border-2 transition-all ${
              selected.district === d.district
                ? "border-blue-500 shadow-md"
                : "border-transparent"
            }`}
          >
            <AQICard district={d.district} aqi={d.aqi} />
          </div>
        ))}
      </div>

      {/* Tanlangan tuman detali */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-800">
            {selected.district}
          </h2>
          <span
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{ background: info.color, color: info.textColor }}
          >
            {info.label}
          </span>
        </div>

        {/* Ifloslantiruvchilar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "PM2.5", value: selected.pm25, unit: "μg/m³", max: 75 },
            { label: "PM10", value: selected.pm10, unit: "μg/m³", max: 150 },
            { label: "CO", value: selected.co, unit: "mg/m³", max: 3 },
            { label: "NO₂", value: selected.no2, unit: "μg/m³", max: 100 },
          ].map((p) => (
            <div key={p.label} className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">{p.label}</p>
              <p className="text-xl font-medium text-gray-800">
                {p.value}
                <span className="text-xs text-gray-400 ml-1">{p.unit}</span>
              </p>
              <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min((p.value / p.max) * 100, 100)}%`,
                    background: info.textColor,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Maslahat */}
        <div
          className="mt-4 p-3 rounded-xl text-sm"
          style={{ background: info.color, color: info.textColor }}
        >
          💡 {info.advice}
        </div>
      </div>
    </div>
  );
}
