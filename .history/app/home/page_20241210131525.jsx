"use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";

import "../../styles/home.css"; // Importă stilurile CSS
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const HomePage = () => {
  // const router = useRouter(); // Pentru navigare

  return (
    <>
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container px-5">
          <a className="navbar-brand" href="#">Start Bootstrap</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" href="#">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Contact</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Pricing</a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  id="navbarDropdownBlog"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Blog
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="navbarDropdownBlog"
                >
                  <li>
                    <a className="dropdown-item" href="#">Blog Home</a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">Blog Post</a>
                  </li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  id="navbarDropdownPortfolio"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Portfolio
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="navbarDropdownPortfolio"
                >
                  <li>
                    <a className="dropdown-item" href="#">Portfolio Overview</a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">Portfolio Item</a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="bg-dark py-5">
        <div className="container px-5">
          <div className="row gx-5 align-items-center justify-content-center">
            <div className="col-lg-8 col-xl-7 col-xxl-6">
              <div className="my-5 text-center text-xl-start">
                <h1 className="display-5 fw-bolder text-white mb-2">
                  A Bootstrap 5 template for modern businesses
                </h1>
                <p className="lead fw-normal text-white-50 mb-4">
                  Quickly design and customize responsive mobile-first sites
                  with Bootstrap, the world’s most popular front-end open
                  source toolkit!
                </p>
                <div className="d-grid gap-3 d-sm-flex justify-content-sm-center justify-content-xl-start">
                  <a className="btn btn-primary btn-lg px-4 me-sm-3" href="#features">
                    Get Started
                  </a>
                  <a className="btn btn-outline-light btn-lg px-4" href="#">
                    Learn More
                  </a>
                </div>
              </div>
            </div>
            <div className="col-xl-5 col-xxl-6 d-none d-xl-block text-center">
              <img
                className="img-fluid rounded-3 my-5"
                src="https://dummyimage.com/600x400/343a40/6c757d"
                alt="..."
              />
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-5" id="features">
        <div className="container px-5 my-5">
          <div className="row gx-5">
            <div className="col-lg-4 mb-5 mb-lg-0">
              <h2 className="fw-bolder mb-0">A better way to start building.</h2>
            </div>
            <div className="col-lg-8">
              <div className="row gx-5 row-cols-1 row-cols-md-2">
                {/* Feature Items */}
                {Array(4).fill().map((_, i) => (
                  <div className="col mb-5 h-100" key={i}>
                    <div className="feature bg-primary bg-gradient text-white rounded-3 mb-3">
                      <i className="bi bi-collection"></i>
                    </div>
                    <h2 className="h5">Featured title</h2>
                    <p className="mb-0">
                      Paragraph of text beneath the heading to explain the heading.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <div className="py-5 bg-light">
        <div className="container px-5 my-5">
          <div className="text-center">
            <div className="fs-4 mb-4 fst-italic">
              "Working with Start Bootstrap templates has saved me tons of
              development time when building new projects! Starting with a
              Bootstrap template just makes things easier!"
            </div>
            <div className="d-flex align-items-center justify-content-center">
              <img
                className="rounded-circle me-3"
                src="https://dummyimage.com/40x40/ced4da/6c757d"
                alt="..."
              />
              <div className="fw-bold">
                Tom Ato <span className="fw-bold text-primary mx-1">/</span> CEO,
                Pomodoro
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark py-4 mt-auto">
        <div className="container px-5">
          <div className="row align-items-center justify-content-between flex-column flex-sm-row">
            <div className="col-auto">
              <div className="small m-0 text-white">
                Copyright &copy; Your Website 2023
              </div>
            </div>
            <div className="col-auto">
              <a className="link-light small" href="#">
                Privacy
              </a>
              <span className="text-white mx-1">&middot;</span>
              <a className="link-light small" href="#">
                Terms
              </a>
              <span className="text-white mx-1">&middot;</span>
              <a className="link-light small" href="#">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default HomePage;