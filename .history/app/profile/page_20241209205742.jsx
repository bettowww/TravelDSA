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
    <div>
         <div className="profile-container">
      <img
        src={user.photoURL || "/placeholder-image.png"} // Imagine de profil
        alt="Profile Picture"
        className="profile-image"
      />
      <h1 className="profile-name">{user.name || "John Doe"}</h1>
      <p className="profile-id">@{user.username || "johndoe"}</p>
      <button className="edit-profile-btn">Edit Profile</button>
      <p className="profile-description">
        {user.description ||
          "Software Developer passionate about creating beautiful applications."}
      </p>
      <div className="social-icons">
        <i className="fab fa-twitter"></i>
        <i className="fab fa-facebook-f"></i>
        <i className="fab fa-linkedin-in"></i>
        <i className="fab fa-instagram"></i>
      </div>
      <span className="profile-joined">Joined {user.joinedDate || "May, 2021"}</span>
    </div>

        <button
        onClick={handleLogout}
        style={{
        marginTop: "20px",
        padding: "10px 20px",
        backgroundColor: "#e74c3c",
        border: "none",
        color: "#fff",
        cursor: "pointer",
        borderRadius: "5px",
        fontSize: "16px",

        }}
    >
        Logout
    </button>
  </div>

  );
};

export default ProfilePage;