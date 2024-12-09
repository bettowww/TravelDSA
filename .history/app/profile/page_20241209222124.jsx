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

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });
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
            <p>{user?.email}</p> {/* Afișează email-ul utilizatorului */}
        </div>

        <div className="profile-settings">
            <h4>Profile Settings</h4>
            <div className="input-group">
            <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Mobile Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
            />

           
                <button className="save-button">Save Profile</button>
                <button className="view-routes-button"> View Saved Routes </button> </div>
        </div>




        <button className="logout-button" onClick={handleLogout}>
            Logout
        </button>
    </div>

    


  );
};

export default ProfilePage;