import React, { useEffect, useMemo, useState } from "react";
import TravelMap from "./components/TravelMap";
import { trip } from "./data/trip";
import { createTrip, loadTrip, saveTrip } from "./tripService";

function normalizeTripData(destinations) {
  return destinations.map((destination) => ({
    ...destination,
    categories: destination.categories.map((category) => ({
      ...category,
      items: category.items.map((item) =>
        typeof item === "string"
          ? { label: item, price: 0 }
          : {
              label: item.label ?? "",
              price: Number(item.price ?? 0),
            }
      ),
    })),
  }));
}

function getDaysUntilDeparture(departureDateValue) {
  const departureDate = new Date(departureDateValue || trip.departureDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffMs = departureDate.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export default function App() {
  const [orderedDestinations, setOrderedDestinations] = useState(() => {
    try {
      const saved = localStorage.getItem("trip-destinations");
      return saved
        ? normalizeTripData(JSON.parse(saved))
        : normalizeTripData(trip.destinations);
    } catch {
      return normalizeTripData(trip.destinations);
    }
  });

  const [selectedId, setSelectedId] = useState(null);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [selectedCitiesForTime, setSelectedCitiesForTime] = useState([]);
  const [transportMode, setTransportMode] = useState("voiture");

  const [checkedItems, setCheckedItems] = useState([]);
  const [favoriteCities, setFavoriteCities] = useState([]);

  const [shareSlug, setShareSlug] = useState(null);
  const [editToken, setEditToken] = useState(null);


  const daysUntilDeparture = useMemo(
  () => getDaysUntilDeparture(trip.departureDate),
  []
);

const isOptimized = false;

function exportTrip() {
  const payload = {
    trip: {
      ...trip,
      destinations: orderedDestinations,
    },
    checkedItems,
    favoriteCities,
    exportedAt: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "travel-itinerary.json";
  link.click();

  URL.revokeObjectURL(url);
}

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("trip");
    const edit = params.get("edit");

    if (!slug) return;

    setShareSlug(slug);
    setEditToken(edit);

    loadTrip(slug).then((data) => {
      setOrderedDestinations(normalizeTripData(data.destinations));
    });
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "trip-destinations",
      JSON.stringify(orderedDestinations)
    );
  }, [orderedDestinations]);

  useEffect(() => {
    if (!shareSlug || !editToken) return;

    const timeout = setTimeout(() => {
      saveTrip(shareSlug, editToken, {
        ...trip,
        destinations: orderedDestinations,
      });
    }, 800);

    return () => clearTimeout(timeout);
  }, [orderedDestinations, shareSlug, editToken]);

  const selectedDestination = useMemo(
    () => orderedDestinations.find((destination) => destination.id === selectedId),
    [orderedDestinations, selectedId]
  );

  function addItem(destId, catId, value) {
    const cleanValue = value.trim();
    if (!cleanValue) return;

    setOrderedDestinations((current) =>
      current.map((destination) =>
        destination.id !== destId
          ? destination
          : {
              ...destination,
              categories: destination.categories.map((category) =>
                category.id !== catId
                  ? category
                  : {
                      ...category,
                      items: [
                        ...category.items,
                        { label: cleanValue, price: 0 },
                      ],
                    }
              ),
            }
      )
    );
  }

  function deleteItem(destId, catId, index) {
    setOrderedDestinations((current) =>
      current.map((destination) =>
        destination.id !== destId
          ? destination
          : {
              ...destination,
              categories: destination.categories.map((category) =>
                category.id !== catId
                  ? category
                  : {
                      ...category,
                      items: category.items.filter((_, itemIndex) => itemIndex !== index),
                    }
              ),
            }
      )
    );
  }

  function updateItem(destId, catId, index, updatedItem) {
    setOrderedDestinations((current) =>
      current.map((destination) =>
        destination.id !== destId
          ? destination
          : {
              ...destination,
              categories: destination.categories.map((category) =>
                category.id !== catId
                  ? category
                  : {
                      ...category,
                      items: category.items.map((item, itemIndex) =>
                        itemIndex === index
                          ? {
                              label: updatedItem.label ?? "",
                              price: Number(updatedItem.price ?? 0),
                            }
                          : item
                      ),
                    }
              ),
            }
      )
    );
  }

  async function handleCreateLink() {
    const result = await createTrip({
      ...trip,
      destinations: orderedDestinations,
    });

    setShareSlug(result.share_slug);
    setEditToken(result.edit_token);

    const readLink = `${window.location.origin}?trip=${result.share_slug}`;
    const editLink = `${window.location.origin}?trip=${result.share_slug}&edit=${result.edit_token}`;

    console.log("Lecture:", readLink);
    console.log("Edition:", editLink);

    alert("Lien créé. Regarde la console.");
  }

  function selectDestination(id) {
    const destination = orderedDestinations.find((item) => item.id === id);
    setSelectedId(id);
    setActiveCategoryId(destination?.categories[0]?.id || null);
  }

  function closeDestinationCard() {
    setSelectedId(null);
    setActiveCategoryId(null);
  }

  function clearTransportSelection() {
    setSelectedCitiesForTime([]);
  }

  function toggleItem(key) {
    setCheckedItems((current) =>
      current.includes(key)
        ? current.filter((itemKey) => itemKey !== key)
        : [...current, key]
    );
  }

  function toggleFavorite(id) {
    setFavoriteCities((current) =>
      current.includes(id)
        ? current.filter((cityId) => cityId !== id)
        : [...current, id]
    );
  }

  function shiftSelectCity(id) {
    setSelectedCitiesForTime((current) =>
      current.includes(id)
        ? current.filter((cityId) => cityId !== id)
        : current.length < 2
          ? [...current, id]
          : [current[1], id]
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex gap-2">
          <button
            onClick={handleCreateLink}
            className="rounded-xl bg-white px-4 py-2"
          >
            Créer lien
          </button>

          {shareSlug && (
            <button
              onClick={() =>
                navigator.clipboard.writeText(
                  `${window.location.origin}?trip=${shareSlug}`
                )
              }
              className="rounded-xl bg-slate-100 px-4 py-2"
            >
              Copier lien lecture
            </button>
          )}

          {shareSlug && editToken && (
            <button
              onClick={() =>
                navigator.clipboard.writeText(
                  `${window.location.origin}?trip=${shareSlug}&edit=${editToken}`
                )
              }
              className="rounded-xl bg-green-300 px-4 py-2"
            >
              Copier lien édition
            </button>
          )}
        </div>

        <TravelMap
          destinations={orderedDestinations}
          selectedId={selectedDestination?.id || null}
          activeCategoryId={activeCategoryId}
          selectedCitiesForTime={selectedCitiesForTime}
          transportMode={transportMode}
          checkedItems={checkedItems}
          favoriteCities={favoriteCities}
          daysUntilDeparture={daysUntilDeparture}
          isOptimized={isOptimized}
          onExport={exportTrip}
          onTransportModeChange={setTransportMode}
          onSelectDestination={selectDestination}
          onSelectCategory={setActiveCategoryId}
          onShiftSelectCity={shiftSelectCity}
          onToggleItem={toggleItem}
          onToggleFavorite={toggleFavorite}
          onClose={closeDestinationCard}
          onClearTransportSelection={clearTransportSelection}
          onAddItem={addItem}
          onDeleteItem={deleteItem}
          onUpdateItem={updateItem}
        />
      </div>
    </div>
  );
}