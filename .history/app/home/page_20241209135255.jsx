"use client";

import React from "react";
import MapComponent from "../../components/map/MapComponent";
import LayerSelector from "../../components/map/LayerSelector";
import useLayers from "../../hooks/useLayers";

// Importă stiluri specifice
import "../../styles/map.css"; // Stiluri pentru hartă
// import "../../styles/layer-selector.css"; // Stiluri pentru selector de layere

const HomePage = () => {
  const { selectedLayer, setSelectedLayer, layers } = useLayers();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor: "#f5f5f5",
        padding: "20px",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginBottom: "20px", color: "#333" }}>Harta cu Layere</h1>
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          marginBottom: "20px",
        }}
      >
        <LayerSelector
          layers={layers}
          selectedLayer={selectedLayer}
          onSelectLayer={setSelectedLayer}
        />
      </div>
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          flexGrow: 1,
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        <MapComponent selectedLayer={selectedLayer} />
      </div>
    </div>
  );
};

export default HomePage;
