import { getAQIInfo } from "../utils/aqi";
import AQIBadge from "./AQIBadge";

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
      className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5"
    >
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        {district}
      </p>

      <div className="flex items-end gap-2 mb-3">
        <span
          className="text-4xl font-semibold"
          style={{ color: info.textColor }}
        >
          {aqi}
        </span>
        <span className="text-sm text-gray-400 mb-1">AQI</span>
      </div>

      <AQIBadge aqi={aqi} size="sm" />
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
        {info.advice}
      </p>

      {updatedAt && (
        <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">
          {updatedAt}
        </p>
      )}
    </div>
  );
}
