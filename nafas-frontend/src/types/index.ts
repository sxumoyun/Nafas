export interface Station {
  _id: string;
  name: string;
  district: string;
  coordinates: [number, number];
  isActive: boolean;
}

export interface AirQuality {
  _id: string;
  stationId: string;
  aqi: number;
  pollutants: {
    pm25: number;
    pm10: number;
    co: number;
    no2: number;
    o3: number;
  };
  category:
    | "good"
    | "moderate"
    | "sensitive"
    | "bad"
    | "very-bad"
    | "dangerous";
  recordedAt: string;
}

export interface AQIInfo {
  label: string;
  color: string;
  textColor: string;
  advice: string;
}
