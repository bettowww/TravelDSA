"use client";

import React, { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";
import { MAP_CENTER, MAP_ZOOM } from "../../arcgis/constants";
import "../../styles/map.css"; // Importă stilurile dintr-un fișier CSS separat

const MapComponent = ({ selectedLayer }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    let view;

    loadModules(
      ["esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer"],
      { css: true }
    )
      .then(([Map, MapView, FeatureLayer]) => {
        const map = new Map({ basemap: "streets-vector" });

        view = new MapView({
          container: mapRef.current,
          map: map,
          center: MAP_CENTER,
          zoom: MAP_ZOOM,
        });

        if (selectedLayer && selectedLayer.url) {
          const layer = new FeatureLayer({
            url: selectedLayer.url,
            renderer: selectedLayer.renderer,
          });
          map.add(layer);
        }
      })
      .catch((error) => {
        console.error("Eroare la încărcarea modulelor Esri:", error);
      });

    return () => {
      if (view) view.destroy();
    };
  }, [selectedLayer]);

  return <div ref={mapRef} className="map-container" />;
};

export default MapComponent;
