import React from "react";

export default function StatsPanel({
  destinations,
  checkedItems,
  favoriteCities,
  daysUntilDeparture,
  isOptimized,
  onExport,
}) {
  const allItems = destinations.flatMap((destination) =>
    destination.categories.flatMap((category) =>
      category.items.map((item) => ({
        ...item,
        destinationId: destination.id,
        categoryId: category.id,
      }))
    )
  );

  const totalBudget = allItems.reduce((sum, item) => {
    return sum + Number(item.price || 0);
  }, 0);

  const totalItems = allItems.length;

  return (
    <div className="absolute right-5 top-5 z-30 w-64 rounded-3xl bg-white/95 p-4 text-slate-800 shadow-2xl backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Résumé voyage
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-2xl bg-slate-950 p-3 text-white">
          <p className="text-xs text-white/60">Départ</p>
          <p className="text-xl font-bold">
            {daysUntilDeparture >= 0 ? `J-${daysUntilDeparture}` : "Parti"}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-100 p-3">
          <p className="text-xs text-slate-500">Budget</p>
          <p className="text-xl font-bold">{totalBudget} €</p>
        </div>

        <div className="rounded-2xl bg-slate-100 p-3">
          <p className="text-xs text-slate-500">Checklist</p>
          <p className="text-xl font-bold">
            {checkedItems.length}/{totalItems}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-100 p-3">
          <p className="text-xs text-slate-500">Favoris</p>
          <p className="text-xl font-bold">{favoriteCities.length}</p>
        </div>

        <div className="rounded-2xl bg-slate-100 p-3">
          <p className="text-xs text-slate-500">Ordre</p>
          <p className="text-xl font-bold">
            {isOptimized ? "Optim." : "Initial"}
          </p>
        </div>

        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={onExport}
          className="rounded-2xl bg-slate-950 p-3 text-left text-sm font-semibold text-white hover:bg-slate-800"
        >
          Export JSON
        </button>
      </div>
    </div>
  );
}