import { haversineDistanceKm } from "./geo";

export function getDaysUntilDeparture(departureDateValue) {
  const departureDate = new Date(departureDateValue);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffMs = departureDate.getTime() - today.getTime();

  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function optimizeDestinationOrder(destinations) {
  if (destinations.length <= 2) return destinations;

  const remaining = destinations.slice(1);
  const optimized = [destinations[0]];

  while (remaining.length > 0) {
    const current = optimized[optimized.length - 1];
    let nearestIndex = 0;
    let nearestDistance = haversineDistanceKm(current, remaining[0]);

    remaining.forEach((candidate, index) => {
      const distance = haversineDistanceKm(current, candidate);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    optimized.push(remaining.splice(nearestIndex, 1)[0]);
  }

  return optimized;
}

export function transportIcon(mode) {
  return mode === "voiture" ? "🚗" : "🚆";
}

export function validateTripData(data) {
  const ids = data.destinations.map((destination) => destination.id);
  const uniqueIds = new Set(ids);

  console.assert(
    data.destinations.length > 0,
    "Test failed: the trip should contain at least one destination."
  );
  console.assert(
    uniqueIds.size === ids.length,
    "Test failed: destination ids should be unique."
  );
  console.assert(
    data.destinations.every(
      (destination) =>
        typeof destination.lat === "number" && typeof destination.lng === "number"
    ),
    "Test failed: every destination should have numeric coordinates."
  );
  console.assert(
    data.destinations.every(
      (destination) =>
        Array.isArray(destination.categories) && destination.categories.length === 4
    ),
    "Test failed: every destination should have four category cards."
  );
}
