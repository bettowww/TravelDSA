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
    <div className="container">
    <div className="profile-picture">
        <img
            src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
            alt="Profile Picture"
        />
        <h4>your-name</h4>
        <p>your-email</p>
    </div>

    <div className="profile-settings">
        <h4>Profile Settings</h4>
        <input type="text" placeholder="First Name" />
        <input type="text" placeholder="Surname" />
        <input type="text" placeholder="Mobile Number" />
        <input type="text" placeholder="Email ID" />
        <button className="save-button">Save Profile</button>
    </div>

    <div className="profile-saved-routes">
        <h4>Edit Experience</h4>
        <input type="text" placeholder="Experience in Designing" />
        <input type="text" placeholder="Additional Details" />
    </div>

    <button className="logout-button" onClick={handleLogout}>
        Logout
    </button>
</div>

  );
};

export default ProfilePage;