import "leaflet/dist/leaflet.css";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import { getAQIInfo } from "../utils/aqi";

interface Station {
  station: { id: string; district: string; coordinates: [number, number] };
  aqi: number | null;
}

interface Props {
  stations: Station[];
}

export default function Map({ stations }: Props) {
  return (
    <MapContainer
      center={[41.2995, 69.2401]}
      zoom={11}
      style={{ height: "320px", width: "100%", borderRadius: "12px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap"
      />
      {stations.map((s) => {
        if (!s.aqi) return null;
        const info = getAQIInfo(s.aqi);
        return (
          <CircleMarker
            key={s.station.id}
            center={s.station.coordinates}
            radius={20}
            pathOptions={{
              fillColor: info.textColor,
              color: info.textColor,
              fillOpacity: 0.7,
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-medium">{s.station.district}</p>
                <p style={{ color: info.textColor }}>AQI: {s.aqi}</p>
                <p className="text-gray-500">{info.label}</p>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
