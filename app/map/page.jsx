"use client";

import React from "react";
import dynamic from "next/dynamic"; // Importă dynamic pentru dezactivarea SSR
import useLayers from "../../hooks/useLayers"; // Hook pentru gestionarea layere-lor
import { useSearchParams } from "next/navigation";
import { getDatabase, ref, push, set } from "firebase/database";
import { auth } from "../firebase/config"; // Importă autentificarea

import "../../styles/map.css"; // Importă stilurile CSS

// Dezactivează SSR pentru LayerSelector și MapComponent
const LayerSelector = dynamic(() => import("../../components/map/LayerSelector"), {
  ssr: false, // Dezactivează SSR
});

const MapComponent = dynamic(() => import("../../components/map/MapComponent"), {
  ssr: false, // Dezactivează SSR
});

const MapPage = () => {
  const { selectedLayer, setSelectedLayer, layers } = useLayers();
  const searchParams = useSearchParams();

  const routeParam = searchParams.get("route");
  const initialRoute = routeParam ? JSON.parse(decodeURIComponent(routeParam)) : null;
  console.log(`initial route found ${initialRoute}`)

  const handleSaveRoute = async (selectedPoints, selectedRegion, themeTitle) => {
    if (!Array.isArray(selectedPoints) || selectedPoints.length < 2) {
        alert("Traseul trebuie să conțină cel puțin două puncte.");
        return;
    }

    if (auth.currentUser == null) {
        alert("Trebuie să fiți autentificat pentru a salva traseul.");
        return;
    }

    try {
        const userId = auth.currentUser.uid;
        const db = getDatabase();
        const routesRef = ref(db, `user_routes/${userId}`);
        const newRouteRef = push(routesRef);

        const routeName = `Vacanta in ${selectedRegion || "Necunoscut"} cu tematica ${themeTitle || "General"}`;
        const routeData = {
            name: routeName,
            region: selectedRegion || "Necunoscut",  // Adaugă regiunea
            theme: themeTitle || "General",  // Adaugă tematica
            points: selectedPoints.map((point) => ({
                name: point.name,
                geometry: {
                    latitude: point.geometry.latitude,
                    longitude: point.geometry.longitude,
                  },
            })),
            created_at: new Date().toISOString(),
        };

        await set(newRouteRef, routeData);
        alert("Traseul a fost salvat cu succes!");
    } catch (error) {
        console.error("Eroare la salvarea traseului:", error);
        alert("A apărut o eroare la salvarea traseului.");
    }
  };


  return (
    <div className="map-page-container">
      {/* Selectorul de layere */}
      <div className="layer-selector-container">
        <LayerSelector
          layers={layers}
          selectedLayer={selectedLayer}
          onSelectLayer={setSelectedLayer}
        />
      </div>

      {/* Harta */}
      <div className="map-container">
        <MapComponent
            selectedLayer={selectedLayer}
            onSaveRoute={handleSaveRoute} // Transmiți funcția ca referință, fără să o apelezi
            initialRoute={initialRoute} // Transmitem ruta inițială către MapComponent
        />
      </div>
    </div>
  );
};

export default MapPage;
