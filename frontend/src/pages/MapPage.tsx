import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { useTranslation } from "react-i18next";
import { api } from "../services/api";

type Place = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  type: string;
};

const categories = [
  { key: "hospital", label: "Hospital" },
  { key: "police", label: "Police" },
  { key: "fire", label: "Fire" },
];

export const MapPage: React.FC = () => {
  const { t } = useTranslation();
  const [position, setPosition] = useState<LatLngExpression | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [category, setCategory] = useState("hospital");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
      () => setPosition([21.1466, 79.0889]),
      { enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    const fetchNearby = async () => {
      if (!position) return;
      setLoading(true);
      try {
        const [lat, lng] = position as [number, number];
        const response = await api.get<Place[]>(`/nearby/${category}`, {
          params: { lat, lng, radius: 5000 },
        });
        setPlaces(response.data);
      } finally {
        setLoading(false);
      }
    };
    fetchNearby();
  }, [category, position]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold">{t("pages.map")}</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Filter:</span>
          <select
            className="border rounded px-3 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-lg bg-white p-4 shadow-sm">
        {position ? (
          <MapContainer
            center={position}
            zoom={13}
            style={{ height: "60vh", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={position}>
              <Popup>Your location</Popup>
            </Marker>
            <Circle center={position} radius={5000} pathOptions={{ fillOpacity: 0.1 }} />
            {places.map((place) => (
              <Marker key={place.id} position={[place.lat, place.lng]}>
                <Popup>
                  <div className="space-y-1">
                    <p className="font-semibold">{place.name}</p>
                    <p className="text-sm text-slate-600">{place.address}</p>
                    {place.phone && (
                      <p className="text-sm">Phone: {place.phone}</p>
                    )}
                    <a
                      className="text-sm text-accent hover:underline"
                      href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Get directions
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <p>Loading location...</p>
        )}
        {loading && <p className="mt-2 text-sm text-slate-500">Loading nearby places...</p>}
      </div>
    </div>
  );
};
