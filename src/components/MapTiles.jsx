import { TILE_SIZE } from "../constants/map";
import { lngLatToWorld } from "../utils/geo";
import React from "react";

export default function MapTiles({ center, zoom, width, height }) {
  const centerWorld = lngLatToWorld(center.lng, center.lat, zoom);
  const topLeft = {
    x: centerWorld.x - width / 2,
    y: centerWorld.y - height / 2,
  };

  const firstTileX = Math.floor(topLeft.x / TILE_SIZE);
  const firstTileY = Math.floor(topLeft.y / TILE_SIZE);
  const lastTileX = Math.floor((topLeft.x + width) / TILE_SIZE);
  const lastTileY = Math.floor((topLeft.y + height) / TILE_SIZE);
  const maxTile = 2 ** zoom;
  const tiles = [];

  for (let x = firstTileX; x <= lastTileX; x += 1) {
    for (let y = firstTileY; y <= lastTileY; y += 1) {
      if (y < 0 || y >= maxTile) continue;

      const wrappedX = ((x % maxTile) + maxTile) % maxTile;

      tiles.push({
        id: `${zoom}-${x}-${y}`,
        url: `https://tile.openstreetmap.org/${zoom}/${wrappedX}/${y}.png`,
        left: x * TILE_SIZE - topLeft.x,
        top: y * TILE_SIZE - topLeft.y,
      });
    }
  }

  return (
    <div className="absolute inset-0 bg-slate-200">
      {tiles.map((tile) => (
        <img
          key={tile.id}
          src={tile.url}
          alt=""
          draggable="false"
          className="absolute h-64 w-64 select-none"
          style={{ left: tile.left, top: tile.top }}
        />
      ))}

      <div className="absolute bottom-2 left-3 rounded bg-white/80 px-2 py-1 text-[11px] text-slate-600 shadow-sm">
        © OpenStreetMap contributors
      </div>
    </div>
  );
}
