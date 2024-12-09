"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import "../../styles/home.css"; // Importă stilurile CSS

const HomePage = () => {
  // const router = useRouter(); // Pentru navigare

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to TravelDSA!</h1>
    </div>
  );
};

export default HomePage;
