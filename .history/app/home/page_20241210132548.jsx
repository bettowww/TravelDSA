"use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";

import "../../styles/home.css"; // Importă stilurile CSS
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const HomePage = () => {
  // const router = useRouter(); // Pentru navigare
  return (
    <>
      {/* Responsive Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand">Travel DSA</a>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              
            </ul>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <header
        className="py-5 bg-image-full"
        style={{
          backgroundImage: "url('https://source.unsplash.com/wfh8dDlNFOk/1600x900')",
        }}
      >
        <div className="text-center my-5">
          <img
            className="img-fluid rounded-circle mb-4"
            src="https://dummyimage.com/150x150/6c757d/dee2e6.jpg"
            alt="..."
          />
          <h1 className="text-white fs-3 fw-bolder">Full Width Pics</h1>
          <p className="text-white-50 mb-0">Landing Page Template</p>
        </div>
      </header>

      {/* Content Section */}
      <section className="py-5">
        <div className="container my-5">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <h2>Full Width Backgrounds</h2>
              <p className="lead">
                A single, lightweight helper class allows you to add engaging,
                full width background images to sections of your page.
              </p>
              <p className="mb-0">
                The universe is almost 14 billion years old, and, wow! Life had
                no problem starting here on Earth! I think it would be
                inexcusably egocentric of us to suggest that we're alone in the
                universe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Section */}
      <div
        className="py-5 bg-image-full"
        style={{
          backgroundImage: "url('https://source.unsplash.com/4ulffa6qoKA/1200x800')",
        }}
      >
        <div style={{ height: "20rem" }}></div>
      </div>

      {/* Content Section */}
      <section className="py-5">
        <div className="container my-5">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <h2>Engaging Background Images</h2>
              <p className="lead">
                The background images used in this template are sourced from
                Unsplash and are open source and free to use.
              </p>
              <p className="mb-0">
                I can't tell you how many people say they were turned off from
                science because of a science teacher that completely sucked out
                all the inspiration and enthusiasm they had for the course.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-5 bg-dark">
        <div className="container">
          <p className="m-0 text-center text-white">
            Copyright &copy; Your Website 2023
          </p>
        </div>
      </footer>
    </>
  );
};

export default HomePage;