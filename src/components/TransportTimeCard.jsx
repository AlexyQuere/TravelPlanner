import { trip } from "../data/trip";
import { haversineDistanceKm, routeKey } from "../utils/geo";
import { transportIcon } from "../utils/trip";
import React from "react";

export default function TransportTimeCard({
  selectedCities,
  destinations,
  transportMode,
  onTransportModeChange,
  onClear,
}) {
  const firstCity = destinations.find(
    (destination) => destination.id === selectedCities[0]
  );
  const secondCity = destinations.find(
    (destination) => destination.id === selectedCities[1]
  );

  if (!firstCity && !secondCity) return null;

  if (!firstCity || !secondCity) {
    const selected = firstCity || secondCity;

    return (
      <div className="absolute bottom-24 left-5 z-40 rounded-3xl bg-white/95 p-4 text-sm text-slate-700 shadow-2xl backdrop-blur">
        <p className="font-semibold text-slate-950">1ère ville : {selected.city}</p>
        <p>Maj + clic sur une deuxième ville.</p>
      </div>
    );
  }

  const route = trip.travelTimes[routeKey(firstCity.id, secondCity.id)];
  const duration = route?.[transportMode] || "À renseigner";
  const distanceKm = haversineDistanceKm(firstCity, secondCity);

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

      <div className="mt-3 grid grid-cols-2 gap-2">
        {trip.transportModes.map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => onTransportModeChange(mode)}
            className={`rounded-2xl border px-3 py-2 text-left text-sm font-semibold transition ${
              transportMode === mode
                ? "border-slate-950 bg-slate-950 text-white"
                : "border-slate-200 bg-slate-50 hover:bg-slate-100"
            }`}
          >
            {transportIcon(mode)} {mode}
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-2xl bg-slate-100 p-4">
        <p className="text-sm text-slate-500">Durée estimée</p>
        <p className="text-3xl font-bold text-slate-950">
          {transportIcon(transportMode)} {duration}
        </p>
        <p className="mt-1 text-sm text-slate-600">
          Distance directe : {distanceKm} km
        </p>
        <p className="mt-1 text-sm text-slate-600">
          {route?.note || "Trajet personnalisé"}
        </p>
      </div>
    </div>
  );
}
