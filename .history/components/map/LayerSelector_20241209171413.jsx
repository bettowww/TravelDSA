import React, { useState } from "react";

const LayerSelector = ({ layers, selectedLayer, onSelectLayer }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLayerSelect = (layer) => {
    onSelectLayer(layer);
    setDropdownOpen(false); // Închide dropdown-ul după selecție
  };

  return (
    <div className="layer-dropdown">
      {/* Buton pentru deschiderea dropdown-ului */}
      <button className="dropbtn" onClick={toggleDropdown}>
        {selectedLayer ? selectedLayer.name : "Select Layer"}
      </button>

      {/* Conținutul dropdown-ului */}
      {dropdownOpen && (
        <div className="dropdown-content">
          {layers.map((layer) => (
            <div
              key={layer.name}
              className="menu-item"
              onClick={() => handleLayerSelect(layer)}
            >
              {layer.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LayerSelector;
