import { useRef, useState } from "react";
import {
  INITIAL_CENTER,
  INITIAL_ZOOM,
  MAX_ZOOM,
  MIN_ZOOM,
} from "../constants/map";
import { clamp, lngLatToWorld, worldToLngLat } from "../utils/geo";
import DestinationCard from "./DestinationCard";
import MapTiles from "./MapTiles";
import StatsPanel from "./StatsPanel";
import Timeline from "./Timeline";
import TransportTimeCard from "./TransportTimeCard";
import React from "react";
import { useEffect } from "react";
import { reverseGeocode, getPlaceImage } from "../utils/place";

export default function TravelMap({
  destinations,
  selectedId,
  activeCategoryId,
  selectedCitiesForTime,
  transportMode,
  checkedItems,
  favoriteCities,
  daysUntilDeparture,
  isOptimized,
  onSelectDestination,
  onSelectCategory,
  onClose,
  onShiftSelectCity,
  onTransportModeChange,
  onClearTransportSelection,
  onToggleItem,
  onToggleFavorite,
  onAddItem,
  onDeleteItem,
  onUpdateItem,
  onOptimizeOrder,
  onResetOrder,
  onExport,
  onAddDestination,
  onDeleteDestination,
  onUpdateDestination,
}) {
  const mapRef = useRef(null);
  const [size, setSize] = useState({ width: 1200, height: 720 });
  const [center, setCenter] = useState(INITIAL_CENTER);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [drag, setDrag] = useState(null);

  useEffect(() => {
  if (!destinations || destinations.length === 0) return;

  setCenter(getMapCenter(destinations));
}, [destinations]);

  const selectedPoint = selectedId
    ? destinations.find((point) => point.id === selectedId)
    : null;

  function syncSize() {
    const rect = mapRef.current?.getBoundingClientRect();

    if (!rect) return size;

    const nextSize = {
      width: rect.width,
      height: rect.height,
    };

    if (nextSize.width !== size.width || nextSize.height !== size.height) {
      setSize(nextSize);
    }

    return nextSize;
  }

  function getMarkerPosition(destination) {
    const world = lngLatToWorld(destination.lng, destination.lat, zoom);
    const centerWorld = lngLatToWorld(center.lng, center.lat, zoom);

    return {
      x: world.x - centerWorld.x + size.width / 2,
      y: world.y - centerWorld.y + size.height / 2,
    };
  }

  function startPan(event) {
    if (event.button !== 0) return;

    const currentSize = syncSize();

    setDrag({
      startX: event.clientX,
      startY: event.clientY,
      startCenter: center,
      width: currentSize.width,
      height: currentSize.height,
    });
  }

  function movePan(event) {
    if (!drag) return;

    const startWorld = lngLatToWorld(
      drag.startCenter.lng,
      drag.startCenter.lat,
      zoom
    );

    const nextWorld = {
      x: startWorld.x - (event.clientX - drag.startX),
      y: startWorld.y - (event.clientY - drag.startY),
    };

    setCenter(worldToLngLat(nextWorld.x, nextWorld.y, zoom));
  }

  function stopPan() {
    setDrag(null);
  }

  function changeZoom(nextZoom) {
    syncSize();
    setZoom(clamp(nextZoom, MIN_ZOOM, MAX_ZOOM));
  }

  function handleWheel(event) {
    const interactivePanel = event.target.closest?.('[data-no-map-zoom="true"]');

    if (interactivePanel) return;

    changeZoom(zoom + (event.deltaY < 0 ? 1 : -1));
  }

  function getMapCenter(destinations) {
  return {
    lat:
      destinations.reduce((sum, d) => sum + d.lat, 0) /
      destinations.length,
    lng:
      destinations.reduce((sum, d) => sum + d.lng, 0) /
      destinations.length,
  };
}

  function resetView() {
    setCenter(getMapCenter(destinations));
    setZoom(INITIAL_ZOOM);
  }

  async function handleDoubleClick(event) {
    event.preventDefault();

    const rect = mapRef.current.getBoundingClientRect();

    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const centerWorld = lngLatToWorld(center.lng, center.lat, zoom);

    const worldX = centerWorld.x + clickX - size.width / 2;
    const worldY = centerWorld.y + clickY - size.height / 2;

    const { lat, lng } = worldToLngLat(worldX, worldY, zoom);

    try {
      const place = await reverseGeocode(lat, lng);
      const image = await getPlaceImage(lat, lng);

      onAddDestination({
        city: place.city,
        country: place.country,
        dates: "",
        lat,
        lng,
        image,
        transport: "",
        notes: "",
      });
    } catch (error) {
      console.error(error);

      onAddDestination({
        city: "Nouvelle étape",
        country: "",
        dates: "",
        lat,
        lng,
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png",
        transport: "",
        notes: "",
      });
    }
  }

  return (
    <div
      ref={mapRef}
      className={`relative h-[92vh] min-h-[680px] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-200 shadow-2xl ${
        drag ? "cursor-grabbing" : "cursor-grab"
      }`}
      onPointerDown={startPan}
      onPointerMove={movePan}
      onPointerUp={stopPan}
      onPointerLeave={stopPan}
      onWheel={handleWheel}
      onDoubleClick={handleDoubleClick}
    >
      <MapTiles center={center} zoom={zoom} width={size.width} height={size.height} />

      <svg className="pointer-events-none absolute inset-0 h-full w-full">
        <polyline
          points={destinations
            .map((destination) => {
              const position = getMarkerPosition(destination);
              return `${position.x},${position.y}`;
            })
            .join(" ")}
          fill="none"
          stroke="currentColor"
          strokeDasharray="7 7"
          strokeWidth="3"
          className="text-slate-800/60"
        />
      </svg>

      {destinations.map((point, index) => {
        const position = getMarkerPosition(point);
        const isTimeSelected = selectedCitiesForTime.includes(point.id);
        const isFavorite = favoriteCities.includes(point.id);

        return (
          <button
            key={point.id}
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              if (event.shiftKey) {
                onShiftSelectCity(point.id);
              } else {
                onSelectDestination(point.id);
              }
            }}
            className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all ${
              selectedId === point.id || isTimeSelected
                ? "scale-125"
                : "hover:scale-110"
            }`}
            style={{ left: position.x, top: position.y }}
            aria-label={`Voir ${point.city}`}
          >
            <div
              className={`relative flex h-14 w-14 items-center justify-center rounded-full border-4 shadow-xl ${
                isTimeSelected
                  ? "border-yellow-300 bg-yellow-400 text-slate-950"
                  : selectedId === point.id
                    ? "border-white bg-slate-950 text-white"
                    : "border-white bg-white text-slate-800"
              }`}
            >
              {index + 1}
              {isFavorite && (
                <span className="absolute -right-1 -top-1 rounded-full bg-yellow-300 px-1 text-xs">
                  ★
                </span>
              )}
            </div>

            <div className="mt-2 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm">
              {point.city}
            </div>
          </button>
        );
      })}

      <div className="absolute left-5 top-5 z-30 flex flex-col overflow-hidden rounded-2xl bg-white/95 shadow-lg backdrop-blur">
        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => changeZoom(zoom + 1)}
          className="border-b px-4 py-3 text-xl font-bold text-slate-800 transition hover:bg-slate-100"
        >
          +
        </button>

        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => changeZoom(zoom - 1)}
          className="px-4 py-3 text-xl font-bold text-slate-800 transition hover:bg-slate-100"
        >
          −
        </button>
      </div>

      <button
        type="button"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={resetView}
        className="absolute left-5 top-32 z-30 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-slate-700 shadow-lg backdrop-blur transition hover:bg-white"
      >
        Recentrer
      </button>

      <div className="absolute left-5 top-44 z-30 rounded-2xl bg-white/95 px-4 py-3 text-xs font-semibold text-slate-700 shadow-lg backdrop-blur">
        Maj + clic sur 2 villes = temps de transport
      </div>

      <StatsPanel
        destinations={destinations}
        checkedItems={checkedItems}
        favoriteCities={favoriteCities}
        daysUntilDeparture={daysUntilDeparture}
        isOptimized={isOptimized}
        onExport={onExport}
      />

      <Timeline
        destinations={destinations}
        selectedId={selectedId}
        onSelectDestination={onSelectDestination}
        isOptimized={isOptimized}
        onOptimize={onOptimizeOrder}
        onResetOrder={onResetOrder}
      />

      {selectedCitiesForTime.length > 0 && (
        <TransportTimeCard
          selectedCities={selectedCitiesForTime}
          destinations={destinations}
          transportMode={transportMode}
          onTransportModeChange={onTransportModeChange}
          onClear={onClearTransportSelection}
        />
      )}

      {selectedPoint && (
        <div
          data-no-map-zoom="true"
          onWheel={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <DestinationCard
            destination={selectedPoint}
            activeCategoryId={activeCategoryId}
            checkedItems={checkedItems}
            favoriteCities={favoriteCities}
            onSelectCategory={onSelectCategory}
            onToggleItem={onToggleItem}
            onToggleFavorite={onToggleFavorite}
            onClose={onClose}
            onAddItem={onAddItem}
            onDeleteItem={onDeleteItem}
            onUpdateItem={onUpdateItem}
            onDeleteDestination={onDeleteDestination}
            onUpdateDestination={onUpdateDestination}
          />
        </div>
      )}
    </div>
  );

  
}
