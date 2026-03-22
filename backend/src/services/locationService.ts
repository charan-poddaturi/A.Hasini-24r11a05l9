import axios from "axios";

export type PlaceType = "hospital" | "police" | "fire_station";

export interface NearbyPlace {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distanceMeters?: number;
  phone?: string;
  type: PlaceType;
}

export const fetchNearbyPlaces = async (
  lat: number,
  lng: number,
  type: PlaceType,
  _radius = 5000
): Promise<NearbyPlace[]> => {
  // Use OpenStreetMap Nominatim search for amenities.
  const query = `${type}`;
  const url = `https://nominatim.openstreetmap.org/search`;
  const params = {
    q: query,
    format: "jsonv2",
    addressdetails: 1,
    limit: 20,
    extratags: 1,
    viewbox: `${lng - 0.1},${lat - 0.1},${lng + 0.1},${lat + 0.1}`,
  };
  const { data } = await axios.get<unknown[]>(url, { params, headers: { "User-Agent": "safehub/1.0" } });
  return (Array.isArray(data) ? data : []).map((item) => {
    const i = item as Record<string, unknown>;
    const extratags = (i.extratags as Record<string, unknown> | undefined) ?? undefined;
    const phone = extratags?.phone ?? extratags?.contact_phone;
    return {
      id: String(i.place_id ?? ""),
      name: String(i.display_name ?? i.name ?? type),
      address: String(i.display_name ?? ""),
      lat: Number(i.lat),
      lng: Number(i.lon),
    type,
      phone: phone ? String(phone) : undefined,
    };
  });
};
