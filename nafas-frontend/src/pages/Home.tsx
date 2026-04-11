import { lazy, Suspense, useEffect, useState } from "react";
import AQICard from "../components/AQICard";
import AlertBanner from "../components/AlertBanner";
import { useLocation } from "../hooks/useLocation";
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
  useLocation();

  useEffect(() => {
    getLiveData()
      .then((res) => setLiveData(res.data))
      .finally(() => setLoading(false));
  }, []);

  const dangerousDistricts = liveData
    .filter((d) => d.aqi && d.aqi > 150)
    .map((d) => d.station.district);

  const avgAqi = liveData.length
    ? Math.round(
        liveData.reduce((s, d) => s + (d.aqi ?? 0), 0) / liveData.length,
      )
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-10">
      {/* Hero section */}
      <div className="px-4 pt-8 pb-6">
        <div className="bg-blue-600 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-blue-100 text-sm mb-1">Toshkent shahri</p>
            <h1 className="text-3xl font-bold mb-1">Havo holati</h1>
            <p className="text-blue-100 text-sm">
              Real vaqt • Oxirgi yangilanish:{" "}
              {new Date().toLocaleTimeString("uz-UZ", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <div className="mt-4 flex items-center gap-4">
              <div>
                <p className="text-4xl font-bold">{avgAqi}</p>
                <p className="text-blue-100 text-sm">O'rtacha AQI</p>
              </div>
              <div className="w-px h-12 bg-blue-400" />
              <div>
                <p className="text-lg font-semibold">
                  {liveData.length} ta tuman
                </p>
                <p className="text-blue-100 text-sm">monitoring qilinmoqda</p>
              </div>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-blue-500 rounded-full opacity-30" />
          <div className="absolute -right-4 -bottom-10 w-32 h-32 bg-blue-400 rounded-full opacity-20" />
        </div>
      </div>

      {/* Alert */}
      {dangerousDistricts.length > 0 && (
        <div className="px-4 mb-4">
          <AlertBanner
            districts={dangerousDistricts}
            message="havo sifati xavfli darajada. Tashqariga chiqmaslikni tavsiya etamiz."
          />
        </div>
      )}

      {/* Xarita */}
      <div className="px-4 mb-6">
        <Suspense
          fallback={
            <div className="h-80 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
          }
        >
          <Map stations={liveData} />
        </Suspense>
      </div>

      {/* Sarlavha */}
      <div className="px-4 mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Tumanlar bo'yicha AQI
        </h2>
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
