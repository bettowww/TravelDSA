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

        const routeName = `Traseu Tematic ${themeTitle || "General"} - ${selectedRegion || "Necunoscut"}`;
        const routeData = {
            name: routeName,
            points: selectedPoints.map((point) => ({
                name: point.name,
                latitude: point.geometry.latitude,
                longitude: point.geometry.longitude,
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
        />
      </div>
    </div>
  );
};

export default MapPage;
