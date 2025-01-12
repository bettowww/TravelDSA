"use client";

import React from "react";
import { useRouter } from "next/navigation";
import MapComponent from "../../components/map/MapComponent";
import LayerSelector from "../../components/map/LayerSelector";
import useLayers from "../../hooks/useLayers";

import "../../styles/map.css";

const HomePage = () => {
  const { selectedLayer, setSelectedLayer, layers } = useLayers();
  const router = useRouter(); // Pentru navigare

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginBottom: "20px", color: "#333" }}>Harta cu Layere</h1>
      <button
        onClick={() => router.push("/profile")}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          backgroundColor: "#50D8D7",
          border: "none",
          color: "#fff",
          cursor: "pointer",
          borderRadius: "5px",
          fontSize: "16px",
        }}
      >
        Vezi Profilul
      </button>
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
