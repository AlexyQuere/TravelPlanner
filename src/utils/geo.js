import { TILE_SIZE } from "../constants/map";

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function routeKey(firstId, secondId) {
  return [firstId, secondId].sort((a, b) => a - b).join("-");
}

export function haversineDistanceKm(first, second) {
  const earthRadiusKm = 6371;
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const deltaLat = toRadians(second.lat - first.lat);
  const deltaLng = toRadians(second.lng - first.lng);
  const lat1 = toRadians(first.lat);
  const lat2 = toRadians(second.lat);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;

  return Math.round(
    earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  );
}

export function lngLatToWorld(lng, lat, zoom) {
  const scale = TILE_SIZE * 2 ** zoom;
  const sinLat = Math.sin((lat * Math.PI) / 180);
  const x = ((lng + 180) / 360) * scale;
  const y =
    (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale;

  return { x, y };
}

export function worldToLngLat(x, y, zoom) {
  const scale = TILE_SIZE * 2 ** zoom;
  const lng = (x / scale) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / scale;
  const lat =
    (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));

  return { lat, lng };
}
