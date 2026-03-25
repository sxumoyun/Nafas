import { lazy, Suspense, useEffect, useState } from "react";
import AQICard from "../components/AQICard";
import AlertBanner from "../components/AlertBanner";
import { getLiveData } from "../services/airQuality";

const Map = lazy(() => import("../components/Map"));

interface LiveData {
  station: {
    id: string;
    name: string;
    district: string;
    coordinates: [number, number];
  };
  aqi: number | null;
  category: string | null;
  recordedAt: string | null;
}

export default function Home() {
  const [liveData, setLiveData] = useState<LiveData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLiveData()
      .then((res) => setLiveData(res.data))
      .catch(() => console.error("Ma'lumot olishda xato"))
      .finally(() => setLoading(false));
  }, []);

  const dangerousDistricts = liveData
    .filter((d) => d.aqi && d.aqi > 150)
    .map((d) => d.station.district);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <AlertBanner
        districts={dangerousDistricts}
        message="havo sifati xavfli darajada. Tashqariga chiqmaslikni tavsiya etamiz."
      />

      {/* Xarita */}
      <div className="px-4 mt-6">
        <Suspense
          fallback={
            <div className="h-80 bg-gray-100 rounded-xl animate-pulse" />
          }
        >
          <Map stations={liveData} />
        </Suspense>
      </div>

      {/* Sarlavha */}
      <div className="px-4 mt-6 mb-4">
        <h1 className="text-xl font-medium text-gray-800">
          Toshkent havo holati
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Real vaqt • Oxirgi yangilanish:{" "}
          {new Date().toLocaleTimeString("uz-UZ", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {/* Kartochkalar */}
      <div className="px-4 grid grid-cols-2 md:grid-cols-3 gap-3">
        {liveData.map((item) => (
          <AQICard
            key={item.station.id}
            district={item.station.district}
            aqi={item.aqi ?? 0}
            updatedAt={
              item.recordedAt
                ? new Date(item.recordedAt).toLocaleTimeString("uz-UZ", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"
            }
          />
        ))}
      </div>
    </div>
  );
}
