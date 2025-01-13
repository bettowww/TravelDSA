"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../../styles/saved_routes.css"; // Creăm un fișier pentru stilizare

const SavedRoutesPage = () => {
    const [successMessage, setSuccessMessage] = useState(""); // Mesaj de succes pentru copiere
    const router = useRouter();

    // Date statice temporare
    const savedRoutes = [
        { id: 1, name: "Traseul Bucovina", description: "Un traseu minunat în Bucovina." },
        { id: 2, name: "Traseul Munții Apuseni", description: "Explorează peisajele din Apuseni." },
        { id: 3, name: "Traseul Mănăstiri Moldovenești", description: "Un circuit al mănăstirilor." },
    ];

    const handleShare = (routeId) => {
        // Placeholder pentru URL (poate fi înlocuit cu link-ul real)
        const link = "This is a test link for sharing.";
        try {
            if (!navigator.clipboard) {
                alert("Clipboard API not supported.");
                return;
            }
            navigator.clipboard.writeText(link).then(() => {
                setSuccessMessage("Link copied to clipboard!");
                setTimeout(() => setSuccessMessage(""), 1000);
            });
        } catch (error) {
            console.error("Failed to copy the link:", error);
            alert("An error occurred while copying the link.");
        }
    };

    return (
        <div className="saved-routes-container">
            <h2>Saved Routes</h2>
            {savedRoutes.length === 0 ? (
                <p>You don't have any saved routes yet.</p>
            ) : (
                <ul className="routes-list">
                    {savedRoutes.map((route) => (
                        <li key={route.id} className="route-card">
                            <h3>{route.name}</h3>
                            <p>{route.description}</p>
                            <div className = "route-actions">
                                <button
                                    onClick={() => alert(`Feature pending: Show ${route.name} on map`)}>
                                View on Map
                                </button>
                                <button
                                    className="share-button"
                                    onClick={() => handleShare("example-route-id")}>
                                Share
                                </button>
                            </div>
                        </li>
                    ))}
                    {successMessage && <p className="success-message">{successMessage}</p>}
                </ul>
            )}

            <button className="back-button" onClick={() => router.push("/profile")}>
                Back to Profile
            </button>
        </div>
    );
};

export default SavedRoutesPage;
