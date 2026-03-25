// src/pages/Stats.tsx
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
import { Bar, Line } from "react-chartjs-2";

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

const days = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];
const aqiData = [78, 95, 142, 88, 65, 167, 110];

const districtData = {
  labels: [
    "Sergeli",
    "Bektemir",
    "Mirzo U.",
    "Chilonzor",
    "Shayxontohur",
    "Yunusobod",
  ],
  values: [167, 152, 105, 88, 55, 42],
  colors: ["#E24B4A", "#E24B4A", "#EF9F27", "#EF9F27", "#639922", "#639922"],
};

export default function Stats() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-xl font-medium text-gray-800 mb-6">Statistika</h1>

      {/* Metrik kartochkalar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">O'rtacha AQI</p>
          <p className="text-2xl font-medium text-yellow-700">94</p>
          <p className="text-xs text-green-600 mt-1">
            ▼ 8 o'tgan haftaga nisbatan
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">Eng yuqori AQI</p>
          <p className="text-2xl font-medium text-red-700">187</p>
          <p className="text-xs text-gray-400 mt-1">Shanba — Sergeli</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">Yaxshi kunlar</p>
          <p className="text-2xl font-medium text-green-700">3 / 7</p>
          <p className="text-xs text-gray-400 mt-1">AQI &lt; 50</p>
        </div>
      </div>

      {/* Chiziqli grafik */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 mb-4">
        <p className="text-sm font-medium text-gray-700 mb-4">
          Haftalik AQI trendi
        </p>
        <Line
          data={{
            labels: days,
            datasets: [
              {
                label: "AQI",
                data: aqiData,
                borderColor: "#2E74B5",
                backgroundColor: "rgba(46,116,181,0.1)",
                fill: true,
                tension: 0.4,
                pointBackgroundColor: aqiData.map((v) =>
                  v > 150 ? "#E24B4A" : v > 100 ? "#EF9F27" : "#2E74B5",
                ),
                pointRadius: 5,
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

      {/* Ustunli grafik */}
      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <p className="text-sm font-medium text-gray-700 mb-4">
          Tumanlar bo'yicha o'rtacha AQI
        </p>
        <Bar
          data={{
            labels: districtData.labels,
            datasets: [
              {
                label: "AQI",
                data: districtData.values,
                backgroundColor: districtData.colors,
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
