"use client";

import React, { useEffect, useRef } from "react";
import esriConfig from "@arcgis/core/config.js";
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";
import Query from "@arcgis/core/rest/support/Query.js"; // Pentru interogări



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
            url: "regiuni_romania.geojson", // Asigură-te că fișierul este în `public/geojson/`
            title: "Regiuni România",
            renderer: {
              type: "simple",
              symbol: {
                type: "simple-fill",
                color: [0, 255, 0, 0.2], // Alb transparent
                outline: {
                  color: [0, 100, 0], // Verde mai închis pentru contur
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

        // Adaugă layerul tematic selectat (daca a fost selectat)
        if (selectedLayer?.url) {
          console.log("Încerc să adaug layer-ul:", selectedLayer);

          const thematicLayer  = new FeatureLayer({
            url: selectedLayer.url,
            renderer: selectedLayer.renderer,
          });

          // Verifică dacă layer-ul este valid
          thematicLayer.when(() => {
            console.log("Layer încărcat cu succes:", thematicLayer);
          }).catch((error) => {
            console.error("Eroare la încărcarea layer-ului:", error);
          });

          map.add(thematicLayer);
        }

        // Detectare click pe regiune
        view.on("click", async (event) => {
            const response = await view.hitTest(event);
            const graphic = response.results.find((res) => res.layer === regionLayer)?.graphic;
  
            if (graphic) {
                const regionName = graphic.attributes.name;
                console.log(`Regiunea selectată: ${regionName}`);
                handleRegionSelection(regionName, graphic.geometry, map);
              } else {
                console.log("Nu ai selectat o regiune.");
              }
          });

      } catch (error) {
        console.error("Eroare la inițializarea hărții:", error);
      }
    };

    if (typeof window !== "undefined") {
      console.log("Inițializarea hărții pe client...");
      initializeMap();
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


// Funcție care gestionează selecția regiunii
const handleRegionSelection = (regionName, regionGeometry, map) => {
    alert(`Ai selectat: Experiența ${regionName}`);
  
    // Elimină layer-ul regiunilor
    const regionLayer = map.findLayerById("Regiuni România");
    if (regionLayer) {
      map.remove(regionLayer);
    }
  
    // Filtrează layer-ul tematic (dacă există)
    const thematicLayer = map.layers.find((layer) => layer.title !== "Regiuni România");
  
    if (thematicLayer) {
      const query = new Query();
      query.geometry = regionGeometry; // Folosește geometria regiunii pentru filtrare
      query.spatialRelationship = "intersects";
      query.returnGeometry = true;
      query.outFields = ["*"];
  
      thematicLayer.definitionExpression = ""; // Resetare filtru anterior
      thematicLayer.queryFeatures(query).then((results) => {
        if (results.features.length > 0) {
          console.log(`S-au găsit ${results.features.length} locații în regiunea selectată.`);
          thematicLayer.definitionExpression = `1=1`; // Aplica un filtru, dacă e nevoie
        } else {
          console.warn("Nu au fost găsite locații în regiunea selectată.");
          thematicLayer.definitionExpression = "1=0"; // Nu afișa nimic dacă nu există locații
        }
      }).catch((error) => {
        console.error("Eroare la filtrarea layer-ului tematic:", error);
      });
    } else {
      console.warn("Nu există layer tematic de filtrat.");
    }
  };
  
  export default MapComponent;