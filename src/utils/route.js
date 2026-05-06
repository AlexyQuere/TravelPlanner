export async function getRouteData(origin, destination, mode = "driving-car") {
  const apiKey = import.meta.env.VITE_ORS_API_KEY;

  if (!apiKey) {
    throw new Error("Missing VITE_ORS_API_KEY");
  }

  if (
    !Number.isFinite(origin?.lat) ||
    !Number.isFinite(origin?.lng) ||
    !Number.isFinite(destination?.lat) ||
    !Number.isFinite(destination?.lng)
  ) {
    throw new Error("Invalid coordinates");
  }

  const response = await fetch(
    `https://api.openrouteservice.org/v2/directions/${mode}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify({
        coordinates: [
          [origin.lng, origin.lat],
          [destination.lng, destination.lat],
        ],
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("ORS error:", data);
    throw new Error(data?.error?.message || "ORS API error");
  }

  const summary =
    data.routes?.[0]?.summary ||
    data.features?.[0]?.properties?.summary;

  if (!summary) {
    console.error("Unexpected ORS response:", data);
    throw new Error("No route summary found");
  }

  return {
    distance: summary.distance,
    duration: summary.duration,
  };
}