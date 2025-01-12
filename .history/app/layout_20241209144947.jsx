"use client";

import React from "react";
import { useRouter } from "next/navigation";
import "../styles/globals.css"; // Importă stilurile globale

const RootLayout = ({ children }) => {
  const router = useRouter();

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
        <div className="dropdown">
          <button className="dropbtn">MENU &#9660;</button>
          <div className="dropdown-content">
            <button className="menu-item" onClick={handleProfileClick}>
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
