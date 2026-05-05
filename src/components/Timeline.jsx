import React from "react";

export default function Timeline({
  destinations,
  selectedId,
  onSelectDestination,
  isOptimized,
  onOptimize,
  onResetOrder,
}) {
  return (
    <div className="absolute bottom-5 left-1/2 z-30 flex max-w-[calc(100%-2rem)] -translate-x-1/2 gap-2 overflow-x-auto rounded-3xl bg-white/95 p-2 shadow-2xl backdrop-blur">
      <button
        type="button"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={isOptimized ? onResetOrder : onOptimize}
        className="min-w-36 rounded-2xl bg-slate-950 px-3 py-2 text-left text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        {isOptimized ? "Ordre initial" : "Optimiser trajet"}
      </button>

      {destinations.map((destination, index) => (
        <button
          key={destination.id}
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => onSelectDestination(destination.id)}
          className={`min-w-32 rounded-2xl px-3 py-2 text-left text-sm transition ${
            selectedId === destination.id
              ? "bg-slate-950 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <p className="text-xs opacity-70">Étape {index + 1}</p>
          <p className="font-bold">{destination.city}</p>
          <p className="text-xs opacity-80">{destination.dates}</p>
        </button>
      ))}
    </div>
  );
}
