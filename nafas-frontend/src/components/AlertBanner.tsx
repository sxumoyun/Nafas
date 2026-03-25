interface Props {
  districts: string[];
  message: string;
}

export default function AlertBanner({ districts, message }: Props) {
  if (districts.length === 0) return null;

  return (
    <div className="mx-4 mt-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-3">
      {/* Dot */}
      <div className="w-2 h-2 rounded-full bg-red-500 mt-1 flex-shrink-0 animate-pulse" />

      {/* Matn */}
      <div className="flex-1">
        <span className="text-sm text-red-800">
          <strong>{districts.join(", ")}</strong> — {message}
        </span>
      </div>

      {/* Batafsil tugma */}
      <button className="text-xs text-red-700 border border-red-300 rounded-lg px-2 py-1 hover:bg-red-100 transition-colors flex-shrink-0">
        Batafsil
      </button>
    </div>
  );
}
