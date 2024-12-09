"use client";

import React from "react";
import { useRouter } from "next/navigation";

import "../styles/globals.css"; // Importă stilurile globale

const RootLayout = ({ children }) => {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push("/home");
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  const handleMapClick = () => {
    router.push("/map");
  };

  return (
    <html lang="en">
      <body>
        {/* Meniul global */}
        <div className="menu-dropdown">
        <button className="menu-dropbtn">
            <img src="../pictures/logo.png" alt="MENU" className="menu-logo" />
        </button>
          <div className="menu-dropdown-content">
            <button className="menu-item" onClick={handleHomeClick}>
              Home
            </button>
            <button className="menu-item" onClick={handleProfileClick}>
              Profile
            </button>
            <button className="menu-item" onClick={handleMapClick}>
              Go to Map
            </button>
          </div>
        </div>

        {/* Pagina curentă */}
        <div>{children}</div>
      </body>
    </html>
  );
};

export default RootLayout;
