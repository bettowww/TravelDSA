"use client";

import React, { useState } from "react";
import MapComponent from "../../components/map/MapComponent";


const HomePage = () => {
  const [selectedLayer, setSelectedLayer] = useState(null);

  const layers = [
    {
      name: "Restaurante",
      url: "https://services8.arcgis.com/BBQ8y8wlr7sbDPZa/arcgis/rest/services/restaurante_bune_romania/FeatureServer",
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-marker",
          color: "red",
          size: "8px",
        },
      },
    },
    {
      name: "Muzee",
      url: "https://services8.arcgis.com/BBQ8y8wlr7sbDPZa/arcgis/rest/services/muzee_romania/FeatureServer",
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-marker",
          color: "blue",
          size: "8px",
        },
      },
    },
  ];

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <select
        onChange={(e) =>
          setSelectedLayer(
            layers.find((layer) => layer.name === e.target.value)
          )
        }
        defaultValue=""
      >
        <option value="" disabled>
          Selectează un layer
        </option>
        {layers.map((layer) => (
          <option key={layer.name} value={layer.name}>
            {layer.name}
          </option>
        ))}
      </select>

      <div style={{ flexGrow: 1 }}>
        <MapComponent selectedLayer={selectedLayer} />
      </div>
    </div>
  );
};

export default HomePage;
