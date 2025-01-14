"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDatabase, ref, get, remove } from "firebase/database"; // Importă funcțiile Firebase
import { auth } from "../firebase/config"; // Importă autentificarea

import "../../styles/saved_routes.css"; // Importă stilurile

const SavedRoutesPage = () => {
    const [savedRoutes, setSavedRoutes] = useState([]); // Starea pentru traseele salvate
    const [loading, setLoading] = useState(true); // Starea de încărcare
    const [error, setError] = useState(null); // Starea de eroare
    const [successMessage, setSuccessMessage] = useState(""); // Mesaj de succes pentru copiere
    const router = useRouter();

    useEffect(() => {
        // Preia traseele salvate
        const fetchSavedRoutes = async () => {
            try {
                if (!auth.currentUser) {
                    setError("Please sign in to view saved routes.");
                    setLoading(false);
                    return;
                }

                const userId = auth.currentUser.uid;
                const db = getDatabase();
                const routesRef = ref(db, `user_routes/${userId}`);
                const snapshot = await get(routesRef);

                if (snapshot.exists()) {
                    const routesData = snapshot.val();
                    const routesList = Object.entries(routesData).map(([id, data]) => ({
                        id,
                        ...data,
                    }));
                    setSavedRoutes(routesList);
                } else {
                    setSavedRoutes([]);
                }
            } catch (error) {
                console.error("Error fetching routes:", error);
                setError("Failed to load saved routes.");
            } finally {
                setLoading(false);
            }
        };

        fetchSavedRoutes();
    }, []);

    const handleShare = (routeId) => {
        // Placeholder pentru URL-ul de partajare (poți genera un URL real aici)
        const link = `https://example.com/routes/${routeId}`;
        navigator.clipboard.writeText(link)
            .then(() => {
                setSuccessMessage("Link copied to clipboard!");
                setTimeout(() => setSuccessMessage(""), 2000);
            })
            .catch((error) => {
                console.error("Failed to copy the link:", error);
                alert("An error occurred while copying the link.");
            });
    };

    const handleDelete = async (routeId) => {
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) {
                alert("Please sign in to delete routes.");
                return;
            }
    
            const db = getDatabase();
            const routeRef = ref(db, `user_routes/${userId}/${routeId}`);
            await remove(routeRef); // Șterge traseul din baza de date
    
            // Actualizează lista după ștergere
            setSavedRoutes((prevRoutes) => prevRoutes.filter((route) => route.id !== routeId));
            alert("The route was deleted successfully!");
        } catch (error) {
            console.error("Error deleting route:", error);
            alert("An error occurred while deleting the route.");
        }
    };

    const handleViewOnMap = (route) => {
        const routeData = encodeURIComponent(JSON.stringify(route));
        router.push(`/map?route=${routeData}`); // Navighează la pagina map cu parametru de query
    };
    

    if (loading) {
        return <p>Loading saved routes...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="saved-routes-container">
            <h2>Your Saved Routes</h2>
            {savedRoutes.length === 0 ? (
                <p>You don't have any saved routes yet.</p>
            ) : (
                <ul className="routes-list">
                    {savedRoutes.map((route) => (
                        <li key={route.id} className="route-card">
                            <h3>{route.name}</h3>
                            <p>Created: {new Date(route.created_at).toLocaleString()}</p>
                            <div className="route-actions">
                                <button
                                    onClick={() => handleViewOnMap(route)}
                                >
                                    View on Map
                                </button>
                                <button
                                    className="share-button"
                                    onClick={() => handleShare(route.id)}
                                >
                                    Share
                                </button>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDelete(route.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {successMessage && <p className="success-message">{successMessage}</p>}
            <button className="back-button" onClick={() => router.push("/profile")}>
                Back to Profile
            </button>
        </div>
    );
};

export default SavedRoutesPage;
