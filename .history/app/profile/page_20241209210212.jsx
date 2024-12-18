"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Pentru navigare
import { auth } from "../firebase/config"; // Configurarea Firebase
import { onAuthStateChanged, signOut } from "firebase/auth"; // Funcția de logout

import "../../styles/profile.css"

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Ascultă modificările stării de autentificare
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setError("No user is signed in.");
        router.push("/auth"); // Redirecționează dacă utilizatorul nu este autentificat
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Deconectează utilizatorul
      router.push("/auth"); // Redirecționează la pagina de autentificare
    } catch (err) {
      console.error("Error logging out:", err);
      setError("Failed to log out.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container rounded bg-white mt-5 mb-5">
    <div className="row">
      <div className="col-md-3 border-right">
        <div className="d-flex flex-column align-items-center text-center p-3 py-5">
          <img
            className="rounded-circle mt-5"
            width="150px"
            src={
              user?.photoURL ||
              "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
            }
            alt="Profile"
          />
          <span className="font-weight-bold">{user?.displayName || "Edogaru"}</span>
          <span className="text-black-50">{user?.email || "edogaru@mail.com.my"}</span>
        </div>
      </div>
      <div className="col-md-5 border-right">
        <div className="p-3 py-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="text-right">Profile Settings</h4>
          </div>
          <div className="row mt-2">
            <div className="col-md-6">
              <label className="labels">Name</label>
              <input type="text" className="form-control" placeholder="First Name" />
            </div>
            <div className="col-md-6">
              <label className="labels">Surname</label>
              <input type="text" className="form-control" placeholder="Surname" />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-12">
              <label className="labels">Mobile Number</label>
              <input type="text" className="form-control" placeholder="Enter phone number" />
            </div>
            <div className="col-md-12">
              <label className="labels">Address Line 1</label>
              <input type="text" className="form-control" placeholder="Enter address line 1" />
            </div>
            <div className="col-md-12">
              <label className="labels">Email ID</label>
              <input type="text" className="form-control" placeholder="Enter email ID" />
            </div>
            <div className="col-md-12">
              <label className="labels">Education</label>
              <input type="text" className="form-control" placeholder="Education" />
            </div>
          </div>
          <div className="mt-5 text-center">
            <button className="btn btn-primary profile-button" type="button">
              Save Profile
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="p-3 py-5">
          <div className="d-flex justify-content-between align-items-center experience">
            <span>Edit Experience</span>
            <span className="border px-3 p-1 add-experience">
              <i className="fa fa-plus"></i>&nbsp;Experience
            </span>
          </div>
          <br />
          <div className="col-md-12">
            <label className="labels">Experience in Designing</label>
            <input type="text" className="form-control" placeholder="Experience" />
          </div>
        </div>
      </div>
    </div>

    <button
      onClick={handleLogout}
      className="logout-button"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "10px 20px",
        backgroundColor: "#e74c3c",
        border: "none",
        color: "#fff",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  </div>

  );
};

export default ProfilePage;