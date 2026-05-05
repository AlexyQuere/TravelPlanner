export const trip = {
  title: "Indonésie depuis Singapour",
  dates: "10 - 19 juillet 2026",
  departureDate: "2026-07-10T00:00:00",

  transportModes: ["voiture", "scooter"],

  travelTimes: {
    "1-2": { voiture: "2h", note: "Ubud → Mont Batur" },
    "2-3": { voiture: "2h30", note: "Batur → Canggu" },
    "3-4": { voiture: "1h", note: "Canggu → Uluwatu" }
  },

  destinations: [
    {
      id: 1,
      city: "Ubud",
      country: "Indonésie",
      dates: "10 - 12 juillet",
      lat: -8.5069,
      lng: 115.2625,
      status: "Randonnée",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      transport: "Arrivée depuis Singapour → Ubud",

      budget: { hotel: 40, food: 25, activities: 30, transport: 20 },

      categories: [
        {
          id: "ubud-admin",
          type: "admin",
          title: "Administratif",
          items: ["Visa", "Assurance", "SIM locale"]
        },
        {
          id: "ubud-activities",
          type: "activity",
          title: "Randonnée",
          items: [
            "Campuhan Ridge Walk",
            "Rizières Tegallalang",
            "Temple Tirta Empul"
          ]
        },
        {
          id: "ubud-food",
          type: "food",
          title: "Restauration",
          items: ["Zest", "Clear Café"]
        },
        {
          id: "ubud-hotel",
          type: "hotel",
          title: "Hôtel",
          items: ["Guesthouse jungle"]
        }
      ],

      notes: "Début tranquille + randonnées pour s’acclimater"
    },

    {
      id: 2,
      city: "Mont Batur",
      country: "Indonésie",
      dates: "12 - 13 juillet",
      lat: -8.2425,
      lng: 115.375,
      status: "Ascension",
      image: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=1200&q=80",
      transport: "Depuis Ubud",

      budget: { hotel: 30, food: 20, activities: 50, transport: 15 },

      categories: [
        {
          id: "batur-admin",
          type: "admin",
          title: "Administratif",
          items: ["Réserver guide", "Lampe frontale"]
        },
        {
          id: "batur-activities",
          type: "activity",
          title: "Activités",
          items: ["Ascension sunrise", "Sources chaudes"]
        },
        {
          id: "batur-food",
          type: "food",
          title: "Restauration",
          items: ["Petit déjeuner au sommet"]
        },
        {
          id: "batur-hotel",
          type: "hotel",
          title: "Hôtel",
          items: ["Nuit proche volcan"]
        }
      ],

      notes: "Ascension au lever du soleil 🔥"
    },

    {
      id: 3,
      city: "Canggu",
      country: "Indonésie",
      dates: "13 - 16 juillet",
      lat: -8.6478,
      lng: 115.1385,
      status: "Surf",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      transport: "Depuis Batur",

      budget: { hotel: 50, food: 30, activities: 60, transport: 20 },

      categories: [
        {
          id: "canggu-admin",
          type: "admin",
          title: "Administratif",
          items: ["Location planche", "Réserver cours"]
        },
        {
          id: "canggu-activities",
          type: "activity",
          title: "Surf",
          items: ["3 jours surf", "Cours", "Sessions sunset"]
        },
        {
          id: "canggu-food",
          type: "food",
          title: "Restauration",
          items: ["Crate Café", "Motion Café"]
        },
        {
          id: "canggu-hotel",
          type: "hotel",
          title: "Hôtel",
          items: ["Surf hostel"]
        }
      ],

      notes: "Bloc surf intensif 🏄"
    },

    {
      id: 4,
      city: "Uluwatu",
      country: "Indonésie",
      dates: "16 - 19 juillet",
      lat: -8.8296,
      lng: 115.0849,
      status: "Plage",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      transport: "Depuis Canggu",

      budget: { hotel: 60, food: 35, activities: 40, transport: 20 },

      categories: [
        {
          id: "ulu-admin",
          type: "admin",
          title: "Administratif",
          items: ["Vol retour"]
        },
        {
          id: "ulu-activities",
          type: "activity",
          title: "Plage",
          items: ["Padang Padang", "Bingin Beach", "Temple Uluwatu"]
        },
        {
          id: "ulu-food",
          type: "food",
          title: "Restauration",
          items: ["Single Fin"]
        },
        {
          id: "ulu-hotel",
          type: "hotel",
          title: "Hôtel",
          items: ["Villa vue mer"]
        }
      ],

      notes: "Fin chill plage + sunset 🌅"
    }
  ]
};