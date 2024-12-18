"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";

import "../../styles/profile.css"
const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [profileData, setProfileData] = useState({});
    const [savedRoutes, setSavedRoutes] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [isDataChanged, setIsDataChanged] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isChangePasswordPopupOpen, setIsChangePasswordPopupOpen] = useState(false);
    const router = useRouter();
  
    const handleLogout = async () => {
      try {
        await signOut(auth);
        router.push("/auth");
      } catch (err) {
        console.error("Error logging out:", err);
      }
    };
  
    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text).then(() => {
        notify({ message: "Copied to clipboard", type: "info", displayTime: 1000 });
      });
    };
  
    const handleChangePassword = () => {
      setIsChangePasswordPopupOpen(true);
    };
  
    const handleSaveData = () => {
      notify({ message: "Data saved successfully!", type: "success", displayTime: 2000 });
      setIsDataChanged(false);
    };
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          setProfileData({
            name: currentUser.displayName || "John Doe",
            email: currentUser.email,
            phone: "+1 (123) 456-7890", // Extragerea telefonului dintr-o sursă reală
            address: "123 Main Street",
            city: "Springfield",
            state: "IL",
            country: "USA",
            id: currentUser.uid,
          });
          setSavedRoutes(["Route A", "Route B", "Route C"]); // Exemplu, înlocuiește cu date reale
          setReviews(["Great route!", "Challenging but fun!"]); // Exemplu, înlocuiește cu date reale
        } else {
          router.push("/auth");
        }
        setLoading(false);
      });
  
      return () => unsubscribe();
    }, [router]);
  
    if (loading) {
      return <p>Loading...</p>;
    }
  
    if (error) {
      return <p className="error-message">{error}</p>;
    }
  
    return (
      <div className="user-profile-container">
        <div className="user-profile-header">
          <div className="profile-image">
            <img src="/default-profile.jpg" alt="User Profile" />
          </div>
          <div className="profile-info">
            <h1>{profileData.name}</h1>
            <p>
              <strong>Email:</strong> {profileData.email}
              <button
                className="clipboard-btn"
                onClick={() => copyToClipboard(profileData.email)}
              >
                Copy
              </button>
            </p>
            <p>
              <strong>ID:</strong> {profileData.id}
              <button
                className="clipboard-btn"
                onClick={() => copyToClipboard(profileData.id)}
              >
                Copy
              </button>
            </p>
          </div>
        </div>
  
        <div className="user-profile-content">
          <section className="profile-section">
            <h2>Saved Routes</h2>
            {savedRoutes.length > 0 ? (
              <ul>
                {savedRoutes.map((route, index) => (
                  <li key={index}>{route}</li>
                ))}
              </ul>
            ) : (
              <p>No saved routes available.</p>
            )}
          </section>
  
          <section className="profile-section">
            <h2>Reviews</h2>
            {reviews.length > 0 ? (
              <ul>
                {reviews.map((review, index) => (
                  <li key={index}>{review}</li>
                ))}
              </ul>
            ) : (
              <p>No reviews yet.</p>
            )}
          </section>
        </div>
  
        <div className="user-profile-actions">
          <button className="change-password-btn" onClick={handleChangePassword}>
            Change Password
          </button>
          <button className="save-btn" onClick={handleSaveData} disabled={!isDataChanged}>
            Save Changes
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    );
  };
  
  export default UserProfile;