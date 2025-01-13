"use client";

import React, { useEffect, useRef } from "react";
import esriConfig from "@arcgis/core/config.js";
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";


const MapComponent = ({ selectedLayer }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Configurare API Key
    esriConfig.apiKey =
      "AAPTxy8BH1VEsoebNVZXo8HurA68jFcPXz-dC0bjRMxYCtOcFXikjbCIslC1pYzC4PnuBx9o1IKmNwKh6jhMI_gDo3fEzuUQOlsOfPNou5BEHTfW4wPvKgNaXtY4JTU0BndU-7d0K_l77KD2QxGVRl8NxYvv8kcmvQtXbw8amy8q1Ydvl2gk5iXNxO_h_JNid9t6CINTjtjsHvkxXsc_VoajW5fRhH9kX6zN9V0644k1Ydxq88_UX5X-Af7f6SW86alWAT1_AaAKiXG1";

    console.log("Configurare cheie API completată:", esriConfig.apiKey);

    const initializeMap = async () => {
      try {
        // Creează harta
        const map = new Map({
          basemap: "streets-vector", // Basemap-ul utilizat
        });

        console.log("Harta a fost creată:", map);

        // Creează vizualizarea hărții
        const view = new MapView({
          container: mapRef.current,
          map: map,
          center: [25.276987, 45.943161], // Centrul României
          zoom: 6, // Nivelul de zoom inițial
        });

        console.log("Vizualizarea hărții a fost creată:", view);


        // Așteaptă încărcarea completă a vizualizării
        view.when(() => {
          console.log("MapView încărcat cu succes!");
        }).catch((error) => {
          console.error("Eroare la încărcarea MapView:", error);
        });

        // Layer GeoJSON pentru regiunile României
        const regionLayer = new GeoJSONLayer({
            url: "/geojson/romania_regions.geojson", // Asigură-te că fișierul este în `public/geojson/`
            title: "Regiuni România",
            renderer: {
              type: "simple",
              symbol: {
                type: "simple-fill",
                color: [255, 255, 255, 0.1], // Alb transparent
                outline: {
                  color: [0, 0, 0],
                  width: 1,
                },
              },
            },
            labelingInfo: [
              {
                labelExpressionInfo: { expression: `'Experiența ' + $feature.name` },
                symbol: {
                  type: "text",
                  color: "black",
                  haloColor: "white",
                  haloSize: "2px",
                  font: {
                    size: 12,
                    weight: "bold",
                  },
                },
                labelPlacement: "always-horizontal",
              },
            ],
          });
  
          map.add(regionLayer);

        // Adaugă un FeatureLayer dacă există
        if (selectedLayer?.url) {
          console.log("Încerc să adaug layer-ul:", selectedLayer);

          const layer = new FeatureLayer({
            url: selectedLayer.url,
            renderer: selectedLayer.renderer,
          });

          // Verifică dacă layer-ul este valid
          layer.when(() => {
            console.log("Layer încărcat cu succes:", layer);
          }).catch((error) => {
            console.error("Eroare la încărcarea layer-ului:", error);
          });

          map.add(layer);
        }
      } catch (error) {
        console.error("Eroare la inițializarea hărții:", error);
      }
    };

    if (typeof window !== "undefined") {
      console.log("Inițializarea hărții pe client...");
      initializeMap();
    } else {
      console.warn("Componenta încearcă să se execute pe server, dar a fost blocată.");
    }

    // Curăță resursele la demontarea componentei
    return () => {
      console.log("Curățare resurse MapView...");
      if (mapRef.current) {
        mapRef.current.innerHTML = ""; // Golirea containerului pentru hartă
      }
    };
  }, [selectedLayer]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
};

const handleRegionSelection = (regionName) => {
    alert(`Experiența selectată: ${regionName}`);
    // Aici poți seta filtrarea layer-ului de puncte (e.g., restaurante) pentru regiunea selectată
  };


export default MapComponent;
