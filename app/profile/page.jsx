"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Pentru navigare
import { auth } from "../firebase/config"; // Configurarea Firebase
import { onAuthStateChanged, signOut } from "firebase/auth"; // Funcția de logout
import { getDatabase, ref, set, get } from "firebase/database"; // Funcții pentru citire/scriere
import "../../styles/profile.css";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
    });

    const router = useRouter();
    const db = getDatabase(); // Inițializăm Firebase Realtime Database

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
            setUser(currentUser);
            fetchProfileData(currentUser.uid); // Preia datele profilului din Firebase
        } else {
            setError("No user is signed in.");
            router.push("/auth"); // Redirecționează dacă utilizatorul nu este autentificat
        }
        setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    // Funcție pentru preluarea datelor profilului
    const fetchProfileData = async (uid) => {
        try {
        const userProfileRef = ref(db, `user_profiles/${uid}`);
        const snapshot = await get(userProfileRef);
        if (snapshot.exists()) {
            const data = snapshot.val();
            setProfileData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            phone: data.phone || "",
            email: data.email || "",
            });
        }
        } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to load profile data.");
        }
    };

    const handleLogout = async () => {
        try {
        await signOut(auth);
        router.push("/auth");
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
        if (!profileData.firstName || !profileData.lastName || !profileData.phone) {
        setError("Please complete all fields!");
        setSuccessMessage("");
        setTimeout(() => {
            setError("");
        }, 1000);
        } else {
        try {
            const userProfileRef = ref(db, "user_profiles/" + user.uid);
            await set(userProfileRef, {
            email: user.email,
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            phone: profileData.phone,
            });
            setSuccessMessage("Your profile has been updated!");
            setError(""); 
            setTimeout(() => {
            setSuccessMessage("");
            setIsEditing(false); 
            }, 1000);
        } catch (err) {
            console.error("Error saving profile:", err);
            setError("Failed to update profile. Please try again.");
            setSuccessMessage("");
        }
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error && !isEditing) {
        return <p>{error}</p>;
    }

    
    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-picture">
                    <img
                        src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                        alt="Profile Picture"
                    />
                    <h4>{profileData.firstName || "Your Name"}</h4>
                    <p>{user?.email}</p>
                </div>
    
                <div className="profile-settings">
                    <h4>Profile Information</h4>
                    {isEditing ? (
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
                            {successMessage && <p className="success-message">{successMessage}</p>}
                            {error && <p className="error-message">{error}</p>}
                        </div>
                    ) : (
                        <div className="display-group">
                            <p>
                                <strong>First Name:</strong> {profileData.firstName || "Set first name"}
                            </p>
                            <p>
                                <strong>Last Name:</strong> {profileData.lastName || "Set last name"}
                            </p>
                            <p>
                                <strong>Mobile Number:</strong> {profileData.phone || "Set phone number"}
                            </p>
                            <p>
                                <strong>Email:</strong> {profileData.email}
                            </p>
                            <div className="profile-actions">
                                <button
                                    className="edit-button"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Change Profile Settings
                                </button>
                                <button
                                    className="view-routes-button"
                                    onClick={() => router.push("/saved_routes")}
                                >
                                    View Saved Routes
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <button className="logout-button" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
    
       
};

export default ProfilePage;
