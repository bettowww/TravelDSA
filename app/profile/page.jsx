"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Pentru navigare

import { auth } from "../firebase/config"; // Configurarea Firebase
import { onAuthStateChanged, signOut } from "firebase/auth"; // Funcția de logout
// import { doc, getDoc, setDoc } from "firebase/firestore"; // Funcții pentru Firestore
import { getDatabase, ref, set } from "firebase/database";

import "../../styles/profile.css"

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // Mesajul de succes
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  const router = useRouter();
  const db = getDatabase(); // Inițializăm Firebase Realtime Database

  useEffect(() => {
    // Ascultă modificările stării de autentificare
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setProfileData((prevData) => ({
          ...prevData,
          email: currentUser.email,
        }));
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // Verifică dacă toate câmpurile necesare sunt completate
    if (!profileData.firstName || !profileData.lastName || !profileData.phone) {
      setError(null); // Afișează mesajul de eroare
      setSuccessMessage("Your profile cannot be updated!"); // Resetăm mesajul de succes
      // Setează mesajul de succes să dispară după 3 secunde
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } else {
      try {
        const userProfileRef = ref(db, 'user_profiles/' + user.uid);
        await set(userProfileRef, {
          email: user.email,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phone: profileData.phone,
        });
        setSuccessMessage("Your profile has been updated!"); // Mesaj de succes
        setError(null); // Resetăm mesajul de eroare
  
        // Setează mesajul de succes să dispară după 3 secunde
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } catch (err) {
          console.error("Error saving profile:", err);
          setError("Failed to update profile. Please try again.");
          setSuccessMessage(""); // Resetăm mesajul de succes dacă apare eroare
      }
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
      {/* Mesajul de succes afisat sus */}
      {successMessage && <div className="toast-message">{successMessage}</div>}
      <div className="profile-picture">
        <img
          src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
          alt="Profile Picture"
        />
        <h4>{profileData.firstName || "Your Name"}</h4>
        <p>{user?.email}</p>
      </div>

      <div className="profile-settings">
        <h4>Profile Settings</h4>
        <div className="input-group">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={profileData.firstName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={profileData.lastName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="phone"
            placeholder="Mobile Number"
            value={profileData.phone}
            onChange={handleChange}
          />
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={profileData.email || user.email}
            readOnly
          />
          <button className="save-button" onClick={handleSave}>
            Save Profile
          </button>
          <button className="view-routes-button" /*onClick={handleRoutes}*/>
            View Saved Routes
          </button>
        </div>
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default ProfilePage;