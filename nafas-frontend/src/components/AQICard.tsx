// src/components/AQICard.tsx
import { getAQIInfo } from "../utils/aqi";
import AQIBadge from "./AqiBadge";

interface Props {
  district: string;
  aqi: number;
  updatedAt?: string;
  onClick?: () => void;
}

export default function AQICard({ district, aqi, updatedAt, onClick }: Props) {
  const info = getAQIInfo(aqi);

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Tuman nomi */}
      <p className="text-sm text-gray-500 mb-2">{district}</p>

      {/* AQI qiymati */}
      <div className="flex items-end gap-2 mb-3">
        <span
          className="text-4xl font-semibold"
          style={{ color: info.textColor }}
        >
          {aqi}
        </span>
        <span className="text-sm text-gray-400 mb-1">AQI</span>
      </div>

      {/* Badge */}
      <AQIBadge aqi={aqi} size="sm" />

      {/* Maslahat */}
      <p className="text-xs text-gray-400 mt-2">{info.advice}</p>

      {/* Vaqt */}
      {updatedAt && <p className="text-xs text-gray-300 mt-1">{updatedAt}</p>}
    </div>
  );
}
