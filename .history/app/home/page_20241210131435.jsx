"use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";

import "../../styles/home.css"; // Importă stilurile CSS
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const HomePage = () => {
  // const router = useRouter(); // Pentru navigare

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to TravelDSA!</h1>
      <img src="/pictures/logo.png" />
      <div className="container mt-5">
      <h1>Welcome to My Next.js App!</h1>
      <button className="btn btn-primary">Click Me</button>
    </div>
    </div>

    
  );
};

export default HomePage;
