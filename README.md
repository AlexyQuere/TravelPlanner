# Travel Itinerary App

A modern React application to visualize and manage your travel itinerary on an interactive map using OpenStreetMap (100% free).

---

## Features

### Map & Navigation

* Interactive OpenStreetMap integration (no API cost)
* Smooth zoom in / zoom out
* Pan and explore freely
* Dynamic centering based on destinations

### Destinations

* City cards with images
* Organized categories:

  * Administrative
  * Activities
  * Food & Restaurants
  * Accommodation
* Editable content directly from the UI

### Productivity

* Interactive checklist (persisted in localStorage)
* Favorite destinations
* Add / edit / delete tasks in real time

### Budget Tracking

* Budget calculated automatically from activities
* Price per item (activity, hotel, etc.)
* Total budget per destination
* Global trip budget overview

### Travel Planning

* Timeline view of the trip
* Transport time & distance between cities (Shift + Click)
* Transport mode selection
* Route optimization (basic)

### Data & Sharing

* Local persistence (localStorage)
* Supabase integration (optional)
* Share trip via unique link
* Read-only & edit modes

### Export

* Export full itinerary as JSON

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the app locally

```bash
npm run dev
```

Open the URL displayed by Vite (usually [http://localhost:5173](http://localhost:5173)).

---

## Production Build

```bash
npm run build
npm run preview
```

---

## Deployment (Free)

You can deploy this app for free on:

* **Vercel** (recommended)
* Netlify
* GitHub Pages (with Vite config)

### Recommended: Vercel

1. Push your code to GitHub
2. Import the project on [https://vercel.com](https://vercel.com)
3. Deploy in one click

---

## Environment Variables (if using Supabase)

Create a `.env.local` file:

```env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

⚠️ Never commit this file to GitHub.

In production (Vercel), add these variables in:

```
Project Settings → Environment Variables
```

---

## Project Structure

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

---

## Tech Stack

* React (Vite)
* TailwindCSS
* OpenStreetMap (no API key required)
* Supabase (optional backend)

---

## Future Improvements

* Real-time collaboration
* Drag & drop itinerary builder
* AI-based itinerary suggestions
* Mobile optimization
* Offline-first mode

---

## License

Free for personal and educational use.

---

## Contributing

Feel free to fork and improve the project.

---

## Author

Built as a personal project to learn full-stack product development and create a real, shareable travel planning tool.
