# Travel Itinerary App

Application React gratuite pour visualiser un itinéraire de voyage sur une carte OpenStreetMap.

## Fonctionnalités

- Carte OpenStreetMap gratuite
- Zoom / dézoom
- Déplacement sur la carte
- Fiches ville avec photo
- Catégories : administratif, activités, restauration, hôtel
- Checklist sauvegardée en localStorage
- Favoris
- Budget par ville + budget total
- Timeline du voyage
- Maj + clic sur deux villes pour afficher temps de transport + distance
- Optimisation simple de l'ordre du trajet
- Export JSON

## Lancer en local

```bash
npm install
npm run dev
```

Puis ouvre l'URL affichée par Vite.

## Build production

```bash
npm run build
npm run preview
```

## Déploiement gratuit

Tu peux déployer gratuitement sur :

- Vercel
- Netlify
- GitHub Pages avec Vite

## Structure

```txt
src/
  App.jsx
  main.jsx
  index.css
  components/
    DestinationCard.jsx
    MapTiles.jsx
    StatsPanel.jsx
    Timeline.jsx
    TransportTimeCard.jsx
    TravelMap.jsx
  constants/
    map.js
    theme.js
  data/
    trip.js
  utils/
    geo.js
    storage.js
    trip.js
```
