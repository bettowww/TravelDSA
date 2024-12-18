"use client";

import React, { useState, useEffect } from "react";
import { auth } from "../firebase/config"; // Importă configurarea Firebase
import { onAuthStateChanged } from "firebase/auth";

const ProfilePage = () => {
  const [user, setUser] = useState(null); // Utilizatorul curent
  const [loading, setLoading] = useState(true); // Indicator de încărcare
  const [error, setError] = useState(null); // Erorile

  useEffect(() => {
    // Ascultă modificările stării utilizatorului
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setError("No user is signed in.");
      }
      setLoading(false);
    });

    // Curăță ascultătorul la demontarea componentei
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>Profil utilizator</h1>
      <div>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>UID:</strong> {user.uid}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
