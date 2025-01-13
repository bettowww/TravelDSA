"use client";

import React from "react";
import { useRouter } from "next/navigation";
import "../../styles/saved_routes.css"; // Creăm un fișier pentru stilizare

const SavedRoutesPage = () => {
    const router = useRouter();

    // Date statice temporare
    const savedRoutes = [
        { id: 1, name: "Traseul Bucovina", description: "Un traseu minunat în Bucovina." },
        { id: 2, name: "Traseul Munții Apuseni", description: "Explorează peisajele din Apuseni." },
        { id: 3, name: "Traseul Mănăstiri Moldovenești", description: "Un circuit al mănăstirilor." },
    ];

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
                            <button onClick={() => alert(`Feature pending: Show ${route.name} on map`)}>
                                View on Map
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            <button className="back-button" onClick={() => router.push("/profile")}>
                Back to Profile
            </button>
        </div>
    );
};

export default SavedRoutesPage;
