import type { AQIInfo } from "../types";

export function getAQIInfo(aqi: number): AQIInfo {
  if (aqi <= 50)
    return {
      label: "Yaxshi",
      color: "#E8F5E9",
      textColor: "#3B6D11",
      advice: "Tashqarida bo'lish mumkin",
    };
  if (aqi <= 100)
    return {
      label: "O'rtacha",
      color: "#FFFDE7",
      textColor: "#854F0B",
      advice: "Sezgir guruhlar ehtiyot bo'lsin",
    };
  if (aqi <= 150)
    return {
      label: "Sezgir",
      color: "#FFF3E0",
      textColor: "#854F0B",
      advice: "Astmatiklar cheklash kerak",
    };
  if (aqi <= 200)
    return {
      label: "Zararli",
      color: "#FFEBEE",
      textColor: "#A32D2D",
      advice: "Hamma cheklash kerak",
    };
  if (aqi <= 300)
    return {
      label: "Juda zararli",
      color: "#F3E5F5",
      textColor: "#6A1B9A",
      advice: "Tashqariga chiqmang",
    };
  return {
    label: "Xavfli",
    color: "#FCE4EC",
    textColor: "#791F1F",
    advice: "Favqulodda holat!",
  };
}
