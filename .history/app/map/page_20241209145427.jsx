"use client";

import React from "react";
import LayerSelector from "../../components/map/LayerSelector"; // Componenta pentru selector
import MapComponent from "../../components/map/MapComponent"; // Componenta pentru hartă
import useLayers from "../../hooks/useLayers"; // Hook pentru gestionarea layere-lor

const MapPage = () => {
  const { selectedLayer, setSelectedLayer, layers } = useLayers();

  return (
    <div className="map-page-container">
      <h1 className="map-title">Alege o tematica!</h1>

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
