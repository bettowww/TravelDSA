"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Pentru navigare
import { auth } from "../firebase/config"; // Configurarea Firebase
import { onAuthStateChanged, signOut } from "firebase/auth"; // Funcția de logout

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
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>Profil utilizator</h1>
      <div>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>UID:</strong> {user.uid}</p>
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