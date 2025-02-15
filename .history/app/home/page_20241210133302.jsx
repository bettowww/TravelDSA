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
      <header
        className="py-5 bg-image-full"
        style={{
          backgroundImage: "pictures/homepage.jog",
        }}
      >
        <div className="text-center my-5">
          <img
            className="img-fluid rounded-circle mb-4"
            src="/pictures/company-logo.png" // Replace with your company logo path
            alt="Company Logo"
            style={{ width: "150px", height: "150px" }}
          />
          <h1 className="text-white fs-3 fw-bolder">Welcome to TravelDSA</h1>
          <p className="text-white-50 mb-0">
            Your trusted travel companion for exploring the world.
          </p>
        </div>
      </header>

      {/* Content Section */}
      <section className="py-5">
        <div className="container my-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="fw-bold text-center">About Us</h2>
              <p className="lead text-center">
                At TravelDSA, we bring your travel dreams to life. From curated
                itineraries to personalized recommendations, we ensure that
                every journey is memorable and seamless.
              </p>
              <p className="text-center">
                Whether you're exploring hidden gems or venturing to popular
                destinations, our platform is designed to guide and inspire.
                Travel with ease, explore the world, and let us take care of the
                details!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Showcase Section */}
      <div
        className="py-5 bg-image-full"
        style={{
          backgroundImage: "url('https://source.unsplash.com/4ulffa6qoKA/1200x800')",
        }}
      >
        <div style={{ height: "20rem" }}></div>
      </div>

      {/* Call to Action Section */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h3 className="fw-bold mb-3">Start Your Adventure Today</h3>
          <p className="lead">
            Ready to explore? Join our community of adventurers and start your
            journey now!
          </p>
          <button className="btn btn-primary btn-lg">Get Started</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 bg-dark">
        <div className="container">
          <p className="m-0 text-center text-white">
            Copyright &copy; TravelDSA 2023. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;