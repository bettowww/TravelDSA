"use client";

import React from "react";
import dynamic from "next/dynamic"; // Importă dynamic pentru dezactivarea SSR
import useLayers from "../../hooks/useLayers"; // Hook pentru gestionarea layere-lor
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
        <MapComponent selectedLayer={selectedLayer} />
      </div>
    </div>
  );
};

export default MapPage;
