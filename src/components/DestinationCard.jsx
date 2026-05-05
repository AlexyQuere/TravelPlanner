import React, { useState } from "react";
import { categoryTheme } from "../constants/theme";

function normalizeItem(item) {
  if (typeof item === "string") {
    return { label: item, price: 0 };
  }

  return {
    label: item?.label ?? "",
    price: Number(item?.price ?? 0),
  };
}

function getDestinationBudget(destination) {
  return destination.categories.reduce((total, category) => {
    return (
      total +
      category.items.reduce((sum, item) => {
        const normalizedItem = normalizeItem(item);
        return sum + Number(normalizedItem.price || 0);
      }, 0)
    );
  }, 0);
}

export default function DestinationCard({
  destination,
  activeCategoryId,
  checkedItems,
  favoriteCities,
  onSelectCategory,
  onToggleItem,
  onToggleFavorite,
  onAddItem,
  onDeleteItem,
  onUpdateItem,
  onClose,
}) {
  const activeCategory =
    destination.categories.find((category) => category.id === activeCategoryId) ||
    destination.categories[0];

  const totalBudget = getDestinationBudget(destination);
  const isFavorite = favoriteCities.includes(destination.id);

  const [newItemsByCategory, setNewItemsByCategory] = useState({});
  const newItemKey = `${destination.id}:${activeCategory.id}`;

  return (
    <aside
      onWheel={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
      className="absolute bottom-5 right-5 top-5 z-40 flex w-[390px] max-w-[calc(100%-2.5rem)] flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl"
    >
      <div className="relative h-48 shrink-0">
        <img
          src={destination.image}
          alt={destination.city}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

        <div className="absolute right-4 top-4 flex gap-2">
          <button
            type="button"
            onClick={() => onToggleFavorite(destination.id)}
            className="rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-slate-700 shadow-sm"
          >
            {isFavorite ? "★ Favori" : "☆ Favori"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-slate-700 shadow-sm"
          >
            Fermer
          </button>
        </div>

        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-sm opacity-90">
            {destination.country} · {destination.dates}
          </p>
          <h2 className="text-3xl font-bold">{destination.city}</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <p className="rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-700">
          🚆 {destination.transport}
        </p>

        <div className="mt-3 rounded-2xl bg-slate-950 p-3 text-white">
          <p className="text-xs text-white/60">Budget estimé</p>
          <p className="text-2xl font-bold">{totalBudget} €</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {destination.categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory(category.id)}
              className={`rounded-2xl border px-3 py-3 text-left text-sm font-semibold ${
                activeCategory.id === category.id
                  ? "bg-black text-white"
                  : categoryTheme[category.type]
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>

        <div
          className={`mt-4 rounded-3xl border p-4 ${categoryTheme[activeCategory.type]}`}
        >
          <p className="text-lg font-bold">{activeCategory.title}</p>

          <ul className="mt-3 space-y-2 text-sm">
            {activeCategory.items.map((rawItem, index) => {
              const item = normalizeItem(rawItem);
              const itemKey = `${destination.id}:${activeCategory.id}:${item.label}`;
              const checked = checkedItems.includes(itemKey);

              return (
                <li key={index} className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleItem(itemKey)}
                    className={`rounded-xl px-3 py-2 ${
                      checked ? "bg-green-100 text-green-700" : "bg-white"
                    }`}
                  >
                    {checked ? "✓" : "○"}
                  </button>

                  <input
                    value={item.label || ""}
                    onChange={(event) =>
                      onUpdateItem(destination.id, activeCategory.id, index, {
                        label: event.target.value,
                        price: item.price,
                      })
                    }
                    className={`min-w-0 flex-1 rounded-xl px-3 py-2 bg-white ${
                      checked ? "line-through text-slate-400" : ""
                    }`}
                  />

                  <input
                    type="number"
                    value={item.price ?? 0}
                    onChange={(event) =>
                      onUpdateItem(destination.id, activeCategory.id, index, {
                        label: item.label,
                        price: Number(event.target.value),
                      })
                    }
                    className="w-24 rounded-xl px-3 py-2 bg-white"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      onDeleteItem(destination.id, activeCategory.id, index)
                    }
                    className="rounded-xl bg-red-50 px-3 py-2 font-bold text-red-500"
                  >
                    ×
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-3 flex gap-2">
          <input
            value={newItemsByCategory[newItemKey] || ""}
            onChange={(event) =>
              setNewItemsByCategory((current) => ({
                ...current,
                [newItemKey]: event.target.value,
              }))
            }
            placeholder="Ajouter"
            className="min-w-0 flex-1 rounded-xl px-3 py-2 bg-white"
          />

          <button
            type="button"
            onClick={() => {
              const value = newItemsByCategory[newItemKey] || "";
              onAddItem(destination.id, activeCategory.id, value);

              setNewItemsByCategory((current) => ({
                ...current,
                [newItemKey]: "",
              }));
            }}
            className="bg-black text-white px-3 rounded-xl"
          >
            +
          </button>
        </div>

        <p className="mt-4 rounded-2xl border border-dashed p-3 text-sm text-slate-600">
          📝 {destination.notes}
        </p>
      </div>
    </aside>
  );
}