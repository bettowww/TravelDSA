"use client";

import React, { useEffect, useRef, useState } from "react";
import esriConfig from "@arcgis/core/config.js";
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";
import Query from "@arcgis/core/rest/support/Query.js"; // Pentru interogări

import "../../styles/map.css";
import SelectedPointsList from "./SelectedPointsList";


const MapComponent = ({ selectedLayer }) => {
  const mapRef = useRef(null);
  const [selectedPoints, setSelectedPoints] = useState([]);

  useEffect(() => {
    setSelectedPoints([]);
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
          center: [25.276987, 45.943161],
          zoom: 6,
          popup: {
            dockEnabled: false,
            dockOptions: {
              buttonEnabled: true,
              breakpoint: false,
            },
          },
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
            title: "regiuni_romania",
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

          const thematicLayer = new FeatureLayer({
            url: selectedLayer.url,
            renderer: selectedLayer.renderer,
            outFields: ["*"]
          });

          thematicLayer.when(() => {
            console.log("Layer încărcat cu succes:", thematicLayer);
          }).catch((error) => {
            console.error("Eroare la încărcarea layer-ului:", error);
          });

          map.add(thematicLayer);

          // Detectare click pe layerul tematic pentru popup
          view.on("click", async (event) => {
            const response = await view.hitTest(event);

            const graphic = response.results.find(
              (res) => res.graphic?.layer?.id === thematicLayer.id
            )?.graphic;
            
            if (graphic && graphic.attributes) {
              const newPoint = {
                id: graphic.attributes.OBJECTID || graphic.attributes.id || Date.now(),  // Asigură un ID unic
                name: graphic.attributes.name || "Fără titlu",
                address: graphic.attributes.formatted_address || "Adresă necunoscută",
                rating: graphic.attributes.rating || "N/A",
                url: graphic.attributes.url || "#"
              };
            
              // Verificare pentru a evita dublarea punctelor
              setSelectedPoints((prevPoints) => {
                const isDuplicate = prevPoints.some(point => point.id === newPoint.id);
                if (!isDuplicate) {
                  const updatedPoints = [...prevPoints, newPoint];
                  console.log("Lista actualizată:", updatedPoints);
                  return updatedPoints;
                } else {
                  console.log("Punctul există deja în listă.");
                  return prevPoints;
                }
              });
            } else {
              console.log("Niciun punct detectat.");
            }
          });
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

  return (
    <div className="map-page-container">
      <div className="map-content-container">
        {/* 🗺️ Harta */}
        <div ref={mapRef} className="map-container" />

        {/* 📋 Lista de puncte */}
        <SelectedPointsList
          selectedPoints={selectedPoints}
          onReset={() => setSelectedPoints([])}
        />
      </div>
    </div>
  );
};


// Funcție care gestionează selecția regiunii
const handleRegionSelection = async (regionName, regionGeometry, map) => {
    alert(`Ai selectat regiunea: ${regionName}`);
  
    // Elimină layer-ul regiunilor
    const regionLayer = map.layers.find((layer) => layer.title == "regiuni_romania");
    if (regionLayer) {
    //   alert("deleting region layer");
      map.remove(regionLayer);
    }
  
    // Filtrează layer-ul tematic (dacă există)
    const thematicLayer = map.layers.find((layer) => layer.title !== "regiuni_romania");
    
  
    if (thematicLayer) {
    //   alert("found thematic layer");
      const query = new Query();
      query.geometry = regionGeometry; // Folosește geometria regiunii pentru filtrare
      query.spatialRelationship = "intersects"; // Doar punctele care se intersectează cu regiunea
      query.returnGeometry = true;
      query.outFields = ["*"];
      query.geometry.spatialReference = thematicLayer.spatialReference;

      
      

  
      // thematicLayer.definitionExpression = ""; // Resetare filtru anterior
      try {
        const results = await thematicLayer.queryFeatures(query);
        results.features.forEach((feature, index) => {
            console.log(`Atributele locației ${index + 1}:`, feature.attributes);
          });

        if (results.features.length > 0) {
          console.log(`S-au găsit ${results.features.length} locații în regiunea selectată.`);

          // Construiește un filtru pe baza ID-urilor locațiilor găsite
          const objectIds = results.features.map((feature) => feature.attributes.ObjectId);
          console.log("Lista ID-urilor:", objectIds);
          
          thematicLayer.definitionExpression = `OBJECTID IN (${objectIds.join(",")})`; // Afișează doar punctele din regiune
          
        } else {
          console.warn("Nu au fost găsite locații în regiunea selectată.");
          thematicLayer.definitionExpression = "1=0"; // Ascunde toate punctele dacă nu sunt rezultate
        }
      } catch (error) {
        console.error("Eroare la filtrarea layer-ului tematic:", error);
      }
    } else {
      console.warn("Nu există layer tematic de filtrat.");
    }
  };
  
  export default MapComponent;