import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { getLiveData } from "../services/airQuality";
import api from "../services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface DailyStat {
  _id: string;
  avgAqi: number;
  maxAqi: number;
  minAqi: number;
}

interface LiveItem {
  station: { district: string };
  aqi: number | null;
}

const FILTERS = [
  { label: "Bugun", days: 1 },
  { label: "7 kun", days: 7 },
  { label: "30 kun", days: 30 },
  { label: "3 oy", days: 90 },
];

export default function Stats() {
  const [activeFilter, setActiveFilter] = useState(7);
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [liveData, setLiveData] = useState<LiveItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/air-quality/stats/daily?days=${activeFilter}`),
      getLiveData(),
    ])
      .then(([statsRes, liveRes]) => {
        setDailyStats(statsRes.data);
        setLiveData(liveRes.data);
      })
      .finally(() => setLoading(false));
  }, [activeFilter]);

  const avgAqi = liveData.length
    ? Math.round(
        liveData.reduce((s, d) => s + (d.aqi ?? 0), 0) / liveData.length,
      )
    : 0;

  const maxAqi = liveData.reduce((max, d) => Math.max(max, d.aqi ?? 0), 0);
  const goodDays = dailyStats.filter((d) => d.avgAqi < 50).length;

  const barColors = liveData.map((d) => {
    if (!d.aqi) return "#888";
    if (d.aqi <= 50) return "#639922";
    if (d.aqi <= 100) return "#EF9F27";
    return "#E24B4A";
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-xl font-medium text-gray-800 mb-6">Statistika</h1>

      {/* Metrik kartochkalar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">O'rtacha AQI</p>
          <p className="text-2xl font-medium text-yellow-700">{avgAqi}</p>
          <p className="text-xs text-gray-400 mt-1">Barcha tumanlar</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">Eng yuqori AQI</p>
          <p className="text-2xl font-medium text-red-700">{maxAqi}</p>
          <p className="text-xs text-gray-400 mt-1">Bugungi maksimum</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">Yaxshi kunlar</p>
          <p className="text-2xl font-medium text-green-700">
            {goodDays} / {dailyStats.length}
          </p>
          <p className="text-xs text-gray-400 mt-1">AQI &lt; 50</p>
        </div>
      </div>

      {/* Chiziqli grafik */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 mb-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-gray-700">AQI trendi</p>
          {/* Filter tugmalar */}
          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.days}
                onClick={() => setActiveFilter(f.days)}
                className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                  activeFilter === f.days
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : dailyStats.length > 0 ? (
          <Line
            data={{
              labels: dailyStats.map((d) =>
                new Date(d._id).toLocaleDateString("uz-UZ", {
                  month: "short",
                  day: "numeric",
                }),
              ),
              datasets: [
                {
                  label: "O'rtacha AQI",
                  data: dailyStats.map((d) => Math.round(d.avgAqi)),
                  borderColor: "#2E74B5",
                  backgroundColor: "rgba(46,116,181,0.1)",
                  fill: true,
                  tension: 0.4,
                  pointBackgroundColor: dailyStats.map((d) =>
                    d.avgAqi > 150
                      ? "#E24B4A"
                      : d.avgAqi > 100
                        ? "#EF9F27"
                        : "#2E74B5",
                  ),
                  pointRadius: 4,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                y: { beginAtZero: true, grid: { color: "#f0f0f0" } },
                x: { grid: { display: false } },
              },
            }}
          />
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">
            Bu davr uchun ma'lumot yetarli emas
          </p>
        )}
      </div>

      {/* Ustunli grafik */}
      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <p className="text-sm font-medium text-gray-700 mb-4">
          Tumanlar bo'yicha AQI
        </p>
        <Bar
          data={{
            labels: liveData.map((d) => d.station.district),
            datasets: [
              {
                label: "AQI",
                data: liveData.map((d) => d.aqi ?? 0),
                backgroundColor: barColors,
                borderRadius: 6,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, grid: { color: "#f0f0f0" } },
              x: { grid: { display: false } },
            },
          }}
        />
      </div>
    </div>
  );
}
