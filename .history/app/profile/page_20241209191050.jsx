"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Exemplu de date mock
        setSavedRoutes(["Route 1", "Route 2", "Route 3"]);
        setReviews(["Review 1", "Review 2"]);
        setProfilePhoto("/default-profile.jpg"); // Poza implicită
      } else {
        router.push("/auth");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/auth");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const handleSave = () => {
    console.log("Data saved!");
    setIsDataChanged(false);
  };

  const handleChangePhoto = () => {
    console.log("Change photo clicked");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-photo">
          <img src={profilePhoto} alt="Profile" />
          <button className="change-photo-btn" onClick={handleChangePhoto}>
            Change Photo
          </button>
        </div>
        <div className="profile-info">
          <h1>{user?.email}</h1>
          <p>User ID: {user?.uid}</p>
        </div>
      </div>

      <div className="profile-sections">
        <section className="saved-routes">
          <h2>Saved Routes</h2>
          {savedRoutes.length ? (
            <ul>
              {savedRoutes.map((route, index) => (
                <li key={index}>{route}</li>
              ))}
            </ul>
          ) : (
            <p>No saved routes yet.</p>
          )}
        </section>

        <section className="reviews">
          <h2>Reviews</h2>
          {reviews.length ? (
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

      <div className="profile-actions">
        <button className="save-btn" onClick={handleSave} disabled={!isDataChanged}>
          Save
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
