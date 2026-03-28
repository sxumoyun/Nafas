import { useEffect, useState } from "react";
import AQICard from "../components/AQICard";
import { getLiveData } from "../services/airQuality";
import { getAQIInfo } from "../utils/aqi";

interface LiveItem {
  station: { id: string; district: string; coordinates: [number, number] };
  aqi: number | null;
  pollutants: {
    pm25: number;
    pm10: number;
    co: number;
    no2: number;
    o3: number;
  } | null;
}

export default function Districts() {
  const [liveData, setLiveData] = useState<LiveItem[]>([]);
  const [selected, setSelected] = useState<LiveItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLiveData()
      .then((res) => {
        setLiveData(res.data);
        setSelected(res.data[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const info = selected ? getAQIInfo(selected.aqi ?? 0) : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-xl font-medium text-gray-800 mb-6">Tumanlar</h1>

      {/* Tuman kartochkalari */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {liveData.map((d) => (
          <div
            key={d.station.id}
            onClick={() => setSelected(d)}
            className={`cursor-pointer rounded-xl border-2 transition-all ${
              selected?.station.id === d.station.id
                ? "border-blue-500 shadow-md"
                : "border-transparent"
            }`}
          >
            <AQICard district={d.station.district} aqi={d.aqi ?? 0} />
          </div>
        ))}
      </div>

      {/* Tanlangan tuman detali */}
      {selected && info && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-800">
              {selected.station.district}
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
              {
                label: "PM2.5",
                value: selected.pollutants?.pm25 ?? 0,
                unit: "μg/m³",
                max: 75,
              },
              {
                label: "PM10",
                value: selected.pollutants?.pm10 ?? 0,
                unit: "μg/m³",
                max: 150,
              },
              {
                label: "CO",
                value: selected.pollutants?.co ?? 0,
                unit: "mg/m³",
                max: 3,
              },
              {
                label: "NO₂",
                value: selected.pollutants?.no2 ?? 0,
                unit: "μg/m³",
                max: 100,
              },
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
      )}
    </div>
  );
}
