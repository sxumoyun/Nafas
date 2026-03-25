// src/components/AQIBadge.tsx
import { getAQIInfo } from "../utils/aqi";

interface Props {
  aqi: number;
  size?: "sm" | "md" | "lg";
}

export default function AQIBadge({ aqi, size = "md" }: Props) {
  const info = getAQIInfo(aqi);

  const sizeClass = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  }[size];

  return (
    <span
      className={`rounded-full font-medium ${sizeClass}`}
      style={{ background: info.color, color: info.textColor }}
    >
      {info.label}
    </span>
  );
}
