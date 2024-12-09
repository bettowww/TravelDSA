"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import MapComponent from "../../components/map/MapComponent";
import LayerSelector from "../../components/map/LayerSelector";
import useLayers from "../../hooks/useLayers";

import "../../styles/home.css"; // Importă stilurile CSS

const HomePage = () => {
  const { selectedLayer, setSelectedLayer, layers } = useLayers();
  const router = useRouter(); // Pentru navigare
  const [menuOpen, setMenuOpen] = useState(false); // Stare pentru meniul dropdown

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleProfileClick = () => {
    router.push("/profile");
    setMenuOpen(false); // Închide meniul după navigare
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Harta cu Layere</h1>

      {/* Butonul de meniu */}
      <div className="dropdown">
        <button className="dropbtn">MENU &#9660;</button>
        <div className="dropdown-content">
          <button className="menu-item" onClick={() => router.push("/profile")}>
            Profile
          </button>

          <button className="menu-item" onClick={() => router.push("/map")}>
      Go to Map
    </button>
        </div>
      </div>


      {/* Selectorul de layere */}
      <div className="layer-selector-container">
        <LayerSelector
          layers={layers}
          selectedLayer={selectedLayer}
          onSelectLayer={setSelectedLayer}
        />
      </div>

      {/* Componenta pentru hartă */}
      <div className="map-container">
        <MapComponent selectedLayer={selectedLayer} />
      </div>
    </div>
  );
};

export default HomePage;
