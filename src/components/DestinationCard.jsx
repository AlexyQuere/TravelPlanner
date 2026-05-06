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
  onDeleteDestination,
  onUpdateDestination,
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
      className="absolute bottom-5 right-5 top-5 z-40 flex w-[410px] max-w-[calc(100%-2.5rem)] flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl"
    >
      <div className="relative h-48 shrink-0">
        <img
          src={destination.image}
          alt={destination.city}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

        <div className="absolute right-4 top-4 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={() => onToggleFavorite(destination.id)}
            className="rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-slate-700 shadow-sm"
          >
            {isFavorite ? "★" : "☆"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-slate-700 shadow-sm"
          >
            Fermer
          </button>

          <button
            type="button"
            onClick={() => onDeleteDestination(destination.id)}
            className="rounded-full bg-red-500 px-3 py-1 text-sm font-semibold text-white shadow-sm"
          >
            Supprimer
          </button>
        </div>

        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-sm opacity-90">
            {destination.country || "Pays"} · {destination.dates || "Dates"}
          </p>
          <h2 className="text-3xl font-bold">{destination.city || "Ville"}</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2 rounded-2xl bg-slate-100 p-3">
          <input
            value={destination.city || ""}
            onChange={(event) =>
              onUpdateDestination(destination.id, { city: event.target.value })
            }
            placeholder="Ville"
            className="w-full rounded-xl bg-white px-3 py-2 text-sm outline-none"
          />

          <input
            value={destination.country || ""}
            onChange={(event) =>
              onUpdateDestination(destination.id, { country: event.target.value })
            }
            placeholder="Pays"
            className="w-full rounded-xl bg-white px-3 py-2 text-sm outline-none"
          />

          <input
            value={destination.dates || ""}
            onChange={(event) =>
              onUpdateDestination(destination.id, { dates: event.target.value })
            }
            placeholder="Dates"
            className="w-full rounded-xl bg-white px-3 py-2 text-sm outline-none"
          />

          <input
            value={destination.startDate || ""}
            onChange={(e) =>
              onUpdateDestination(destination.id, { startDate: e.target.value })
            }
            placeholder="Date début jj/mm/aaaa"
            className="w-full rounded-xl bg-white px-3 py-2 text-sm"
          />

          <input
            value={destination.transport || ""}
            onChange={(event) =>
              onUpdateDestination(destination.id, {
                transport: event.target.value,
              })
            }
            placeholder="Transport"
            className="w-full rounded-xl bg-white px-3 py-2 text-sm outline-none"
          />
        </div>

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
          className={`mt-4 rounded-3xl border p-4 ${
            categoryTheme[activeCategory.type]
          }`}
        >
          <p className="text-lg font-bold">{activeCategory.title}</p>

          <ul className="mt-3 space-y-2 text-sm">
            {activeCategory.items.map((rawItem, index) => {
              const item = normalizeItem(rawItem);
              const itemKey = `${destination.id}:${activeCategory.id}:${item.label}`;
              const checked = checkedItems.includes(itemKey);

              return (
                <li key={`${activeCategory.id}-${index}`} className="flex gap-2">
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
                    value={item.label}
                    onChange={(event) =>
                      onUpdateItem(destination.id, activeCategory.id, index, {
                        label: event.target.value,
                        price: item.price,
                      })
                    }
                    className={`min-w-0 flex-1 rounded-xl bg-white px-3 py-2 outline-none ${
                      checked ? "text-slate-400 line-through" : ""
                    }`}
                  />

                  <input
                    type="number"
                    value={item.price}
                    onChange={(event) =>
                      onUpdateItem(destination.id, activeCategory.id, index, {
                        label: item.label,
                        price: Number(event.target.value),
                      })
                    }
                    className="w-24 rounded-xl bg-white px-3 py-2 outline-none"
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
            placeholder="Ajouter un élément"
            className="min-w-0 flex-1 rounded-xl bg-slate-100 px-3 py-2 outline-none"
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
            className="rounded-xl bg-black px-3 py-2 font-semibold text-white"
          >
            +
          </button>
        </div>

        <label className="mt-4 block rounded-2xl border border-dashed p-3 text-sm text-slate-600">
          <span className="font-semibold">Notes</span>
          <textarea
            value={destination.notes || ""}
            onChange={(event) =>
              onUpdateDestination(destination.id, { notes: event.target.value })
            }
            className="mt-2 min-h-24 w-full rounded-xl bg-slate-100 p-3 outline-none"
          />
        </label>
      </div>
    </aside>
  );
}