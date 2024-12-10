"use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";

import "../../styles/home.css"; // Importă stilurile CSS
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const HomePage = () => {
  // const router = useRouter(); // Pentru navigare

  return (
    <div>
      {/* Header Section */}
      <header>
        <div className="text-center my-5">
          <h1 className="text-white fs-3 fw-bolder">
            Welcome to TravelDSA
          </h1>
          <p className="text-white-50 mb-0">
            Your trusted travel companion for exploring the world.
          </p>
        </div>
      </header>

      {/*Picture section */}
      <section
        style={{
          backgroundImage: `url("/pictures/homepage.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "70vh", // Ensure the section spans at least the full height of the viewport
          maxWidth: "00vh",
        }}
      >
      </section>


      {/* Call to Action Section */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h3 className="fw-bold mb-3">Start Your Adventure Today</h3>
          <p className="lead">
            Ready to explore? Join our community of adventurers and start your
            journey now!
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 bg-dark">
        <div className="container">
          <p className="m-0 text-center text-white">
            Copyright &copy; TravelDSA 2024. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;