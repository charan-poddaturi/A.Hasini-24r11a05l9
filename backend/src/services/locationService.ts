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
  radius = 5000
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
  const { data } = await axios.get(url, { params, headers: { "User-Agent": "safehub/1.0" } });
  return data.map((item: any) => ({
    id: item.place_id,
    name: item.display_name || item.name || type,
    address: item.display_name,
    lat: Number(item.lat),
    lng: Number(item.lon),
    type,
    phone: item.extratags?.phone || item.extratags?.contact_phone,
  }));
};
