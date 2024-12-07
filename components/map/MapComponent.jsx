"use client";

import React, { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";

const MapComponent = ({ selectedLayer }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    let view;

    loadModules(["esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer"]).then(
      ([Map, MapView, FeatureLayer]) => {
        const map = new Map({
          basemap: "topo-vector", // Hartă de bază
        });

        view = new MapView({
          container: mapRef.current, // Asociază harta cu acest container
          map: map,
          center: [25, 45], // România
          zoom: 6,
        });

        // Adaugă layerul selectat dacă este specificat
        if (selectedLayer) {
          const featureLayer = new FeatureLayer({
            url: selectedLayer.url,
            renderer: selectedLayer.renderer,
          });
          map.add(featureLayer);
        }
      }
    );

    // Curăță resursele când componenta este demontată
    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, [selectedLayer]);

  return (
    <div
      id="map-container"
      ref={mapRef}
      style={{
        width: "100%",      // Ocupă întreaga lățime
        height: "100vh",    // Fixează înălțimea la dimensiunea viewport-ului
        overflow: "hidden", // Previne scroll-ul intern
      }}
    ></div>
  );
};

export default MapComponent;
