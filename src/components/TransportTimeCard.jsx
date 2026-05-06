import React, { useEffect, useMemo, useState } from "react";
import { haversineDistanceKm } from "../utils/geo";
import { getRouteData } from "../utils/route";

const transportModes = [
  { key: "driving-car", label: "Voiture", icon: "🚗" },
  { key: "cycling-regular", label: "Vélo", icon: "🚲" },
  { key: "foot-walking", label: "Marche", icon: "🚶" },
];

function formatDuration(seconds) {
  if (!Number.isFinite(seconds)) return "À renseigner";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);

  if (hours <= 0) return `${minutes} min`;
  if (minutes <= 0) return `${hours}h`;

  return `${hours}h ${minutes}min`;
}

function formatDistance(meters) {
  if (!Number.isFinite(meters)) return "À renseigner";
  return `${(meters / 1000).toFixed(1)} km`;
}

export default function TransportTimeCard({
  selectedCities,
  destinations,
  transportMode,
  onTransportModeChange,
  onClear,
}) {
  const [routeData, setRouteData] = useState(null);
  const [routeStatus, setRouteStatus] = useState("idle");
  const [routeError, setRouteError] = useState("");

  const firstCity = destinations.find(
    (destination) => destination.id === selectedCities[0]
  );

  const secondCity = destinations.find(
    (destination) => destination.id === selectedCities[1]
  );

  const activeMode = transportModes.some((mode) => mode.key === transportMode)
    ? transportMode
    : "driving-car";

  const selectedMode =
    transportModes.find((mode) => mode.key === activeMode) || transportModes[0];

  const directDistanceKm = useMemo(() => {
    if (!firstCity || !secondCity) return null;
    return haversineDistanceKm(firstCity, secondCity);
  }, [firstCity, secondCity]);

  useEffect(() => {
    if (!firstCity || !secondCity) {
      setRouteData(null);
      return;
    }

    let cancelled = false;

    async function fetchRoute() {
      try {
        setRouteStatus("loading");
        setRouteError("");

        const data = await getRouteData(firstCity, secondCity, activeMode);

        if (cancelled) return;

        setRouteData(data);
        setRouteStatus("success");
      } catch (error) {
        if (cancelled) return;

        console.error(error);
        setRouteData(null);
        setRouteStatus("error");
        setRouteError("Impossible de récupérer le trajet réel.");
      }
    }

    fetchRoute();

    return () => {
      cancelled = true;
    };
  }, [firstCity, secondCity, activeMode]);

  if (!firstCity && !secondCity) return null;

  if (!firstCity || !secondCity) {
    const selected = firstCity || secondCity;

    return (
      <div className="absolute bottom-24 left-5 z-40 rounded-3xl bg-white/95 p-4 text-sm text-slate-700 shadow-2xl backdrop-blur">
        <p className="font-semibold text-slate-950">
          1ère ville : {selected.city}
        </p>
        <p>Maj + clic sur une deuxième ville.</p>
      </div>
    );
  }

  return (
    <div className="absolute bottom-24 left-5 z-40 w-[360px] max-w-[calc(100%-2.5rem)] rounded-3xl bg-white/95 p-4 text-slate-800 shadow-2xl backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Temps de transport
          </p>
          <h3 className="mt-1 text-xl font-bold text-slate-950">
            {firstCity.city} → {secondCity.city}
          </h3>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold hover:bg-slate-200"
        >
          Effacer
        </button>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {transportModes.map((mode) => (
          <button
            key={mode.key}
            type="button"
            onClick={() => onTransportModeChange(mode.key)}
            className={`rounded-2xl border px-3 py-2 text-left text-sm font-semibold transition ${
              activeMode === mode.key
                ? "border-slate-950 bg-slate-950 text-white"
                : "border-slate-200 bg-slate-50 hover:bg-slate-100"
            }`}
          >
            {mode.icon} {mode.label}
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-2xl bg-slate-100 p-4">
        <p className="text-sm text-slate-500">Trajet réel estimé</p>

        {routeStatus === "loading" && (
          <p className="mt-2 text-sm font-semibold text-slate-600">
            Calcul du trajet...
          </p>
        )}

        {routeStatus === "success" && routeData && (
          <>
            <p className="text-3xl font-bold text-slate-950">
              {selectedMode.icon} {formatDuration(routeData.duration)}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Distance route : {formatDistance(routeData.distance)}
            </p>
          </>
        )}

        {routeStatus === "error" && (
          <>
            <p className="text-sm font-semibold text-red-600">{routeError}</p>
            <p className="mt-1 text-sm text-slate-600">
              Distance directe : {directDistanceKm} km
            </p>
          </>
        )}

        <p className="mt-2 text-xs text-slate-500">
          Distance directe : {directDistanceKm} km
        </p>
      </div>
    </div>
  );
}