"use client";

import React, { useEffect, useRef } from "react";
import esriConfig from "@arcgis/core/config.js";
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";
import Query from "@arcgis/core/rest/support/Query.js";

const MapComponent = ({ selectedLayer }) => {
  const mapRef = useRef(null);
  let regionLayer; // Referință pentru layer-ul regiunilor

  useEffect(() => {
    esriConfig.apiKey = process.env.REACT_APP_ARCGIS_API_KEY;

    const initializeMap = async () => {
      const map = new Map({
        basemap: "streets-vector",
      });

      const view = new MapView({
        container: mapRef.current,
        map: map,
        center: [25.276987, 45.943161],
        zoom: 6,
      });

      // Layer GeoJSON pentru regiunile României
      regionLayer = new GeoJSONLayer({
        url: "/geojson/romania_regions.geojson",
        title: "Regiuni România",
        renderer: {
          type: "simple",
          symbol: {
            type: "simple-fill",
            color: [0, 255, 0, 0.2],
            outline: {
              color: [0, 100, 0],
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

      let thematicLayer;
      if (selectedLayer?.url) {
        thematicLayer = new FeatureLayer({
          url: selectedLayer.url,
          renderer: selectedLayer.renderer,
        });
        map.add(thematicLayer);
      }

      // Detectare click pe regiune
      view.on("click", async (event) => {
        const response = await view.hitTest(event);
        const graphic = response.results.find((res) => res.layer === regionLayer)?.graphic;

        if (graphic) {
          const regionName = graphic.attributes.name; // Numele regiunii selectate
          console.log(`Regiunea selectată: ${regionName}`);
          map.remove(regionLayer); // Elimină layer-ul regiunilor

          if (thematicLayer) {
            // Aplică filtrarea layer-ului tematic
            filterLayerByRegion(thematicLayer, graphic.geometry);
          }
        }
      });

      return () => {
        view.destroy();
      };
    };

    const filterLayerByRegion = (layer, regionGeometry) => {
      const query = new Query();
      query.geometry = regionGeometry; // Filtrare pe baza geometriei regiunii
      query.spatialRelationship = "intersects"; // Intersecție cu regiunea selectată
      query.returnGeometry = true;
      query.outFields = ["*"];

      layer.definitionExpression = ""; // Resetează orice filtru anterior

      layer.queryFeatures(query).then((results) => {
        if (results.features.length > 0) {
          console.log(`S-au găsit ${results.features.length} locații în regiunea selectată.`);
        } else {
          console.warn("Nu au fost găsite locații în regiunea selectată.");
        }
      }).catch((error) => {
        console.error("Eroare la filtrarea layer-ului:", error);
      });
    };

    if (typeof window !== "undefined") {
      initializeMap();
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = "";
      }
    };
  }, [selectedLayer]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
};

export default MapComponent;
