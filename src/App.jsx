import React, { useEffect, useMemo, useState } from "react";
import TravelMap from "./components/TravelMap";
import { trip } from "./data/trip";
import { createTrip, loadTrip, saveTrip, listTrips, deleteTrip } from "./tripService";

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

  const [tripsList, setTripsList] = useState([]);

  useEffect(() => {
        refreshTrips();
      }, []);

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

  function addDestination(data = {}) {
    const newId = Date.now();

    const lat = Number(data.lat);
    const lng = Number(data.lng);

    const destination = {
      id: newId,
      city: data.city || "Nouvelle étape",
      country: data.country || "",
      dates: data.dates || "",
      lat: Number.isFinite(lat) ? lat : -8.5069,
      lng: Number.isFinite(lng) ? lng : 115.2625,
      status: "À préparer",
      image:
        data.image ||
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png",
      transport: data.transport || "",
      notes: data.notes || "",
      budget: { hotel: 0, food: 0, activities: 0, transport: 0 },
      categories: [
        { id: `${newId}-admin`, type: "admin", title: "Administratif", items: [] },
        { id: `${newId}-activity`, type: "activity", title: "Activités", items: [] },
        { id: `${newId}-food`, type: "food", title: "Restauration", items: [] },
        { id: `${newId}-hotel`, type: "hotel", title: "Hôtel", items: [] },
      ],
    };

    setOrderedDestinations((current) => [...current, destination]);
    setSelectedId(newId);
    setActiveCategoryId(`${newId}-admin`);
  }

  function deleteDestination(id) {
    setOrderedDestinations((current) =>
      current.filter((destination) => destination.id !== id)
    );

    if (selectedId === id) {
      setSelectedId(null);
      setActiveCategoryId(null);
    }
  }

  function updateDestination(id, patch) {
    setOrderedDestinations((current) =>
      current.map((destination) =>
        destination.id === id
          ? {
              ...destination,
              ...patch,
              lat: patch.lat !== undefined ? Number(patch.lat) : destination.lat,
              lng: patch.lng !== undefined ? Number(patch.lng) : destination.lng,
            }
          : destination
      )
    );
  }

  function parseFrenchDate(dateString) {
    if (!dateString) return null;

    const match = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) return null;

    const [, day, month, year] = match;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  function sortDestinationsByDate() {
    setOrderedDestinations((current) =>
      [...current].sort((a, b) => {
        const dateA = parseFrenchDate(a.startDate || a.dates);
        const dateB = parseFrenchDate(b.startDate || b.dates);

        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;

        return dateA - dateB;
      })
    );
  }

  async function refreshTrips() {
    const trips = await listTrips();
    setTripsList(trips);
  }

  async function createNewTrip() {
    const emptyTrip = {
      ...trip,
      title: "Nouveau voyage",
      dates: "",
      departureDate: "",
      destinations: [],
    };

    const result = await createTrip(emptyTrip);

    setShareSlug(result.share_slug);
    setEditToken(result.edit_token);
    setOrderedDestinations([]);

    await refreshTrips();
  }

  async function openTrip(slug, token) {
    const data = await loadTrip(slug);

    setShareSlug(slug);
    setEditToken(token);
    setOrderedDestinations(normalizeTripData(data.destinations || []));
  }

  async function removeTrip(slug, token) {
    await deleteTrip(slug, token);

    if (shareSlug === slug) {
      setShareSlug(null);
      setEditToken(null);
      setOrderedDestinations([]);
    }

    await refreshTrips();
  }

  async function updateTripTitle(slug, token, newTitle) {
    try {
      await saveTrip(slug, token, {
        title: newTitle,
        destinations: orderedDestinations,
      });

      setTripsList((current) =>
        current.map((trip) =>
          trip.share_slug === slug
            ? { ...trip, title: newTitle }
            : trip
        )
      );
    } catch (e) {
      console.error(e);
    }
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

          <button
            onClick={sortDestinationsByDate}
            className="rounded-xl bg-blue-500 px-4 py-2 text-white"
          >
            Trier par date
          </button>
        </div>

        <div className="mb-4 rounded-2xl bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Mes voyages</h2>

            <button
              onClick={createNewTrip}
              className="rounded-xl bg-black px-4 py-2 text-white"
            >
              + Nouveau voyage
            </button>
          </div>

          <div className="mt-3 space-y-2">
            {tripsList.map((savedTrip) => (
              <div
                key={savedTrip.share_slug}
                className="flex items-center justify-between rounded-xl bg-slate-100 p-3"
              >
                <button
                  onClick={() => openTrip(savedTrip.share_slug, savedTrip.edit_token)}
                  className="text-left"
                >
                  <input
                    value={savedTrip.title || ""}
                    onChange={(e) =>
                      updateTripTitle(savedTrip.share_slug, savedTrip.edit_token, e.target.value)
                    }
                    className="font-semibold bg-transparent outline-none"
                    placeholder="Nom du voyage"
                  />
                  <p className="text-xs text-slate-500">{savedTrip.share_slug}</p>
                </button>

                <button
                  onClick={() => removeTrip(savedTrip.share_slug, savedTrip.edit_token)}
                  className="rounded-xl bg-red-500 px-3 py-2 text-white"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
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
          onAddDestination={addDestination}
          onDeleteDestination={deleteDestination}
          onUpdateDestination={updateDestination}
        />
      </div>
    </div>
  );
}