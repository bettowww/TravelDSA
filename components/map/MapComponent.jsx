"use client";

import React, { useEffect, useRef, useState } from "react";
import esriConfig from "@arcgis/core/config.js";
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";
import Query from "@arcgis/core/rest/support/Query.js";
import Graphic from "@arcgis/core/Graphic.js";

import "../../styles/map.css";
import SelectedPointsList from "./SelectedPointsList";

const MapComponent = ({ selectedLayer }) => {
    const mapRef = useRef(null);
    const [selectedPoints, setSelectedPoints] = useState([]);
    const [isMapBlocked, setIsMapBlocked] = useState(true); // Harta blocată inițial
    const [instruction, setInstruction] = useState("Vă rugăm să selectați o tema pentru vacanța!");

    useEffect(() => {
        setSelectedPoints([]);
        esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurA68jFcPXz-dC0bjRMxYCtOcFXikjbCIslC1pYzC4PnuBx9o1IKmNwKh6jhMI_gDo3fEzuUQOlsOfPNou5BEHTfW4wPvKgNaXtY4JTU0BndU-7d0K_l77KD2QxGVRl8NxYvv8kcmvQtXbw8amy8q1Ydvl2gk5iXNxO_h_JNid9t6CINTjtjsHvkxXsc_VoajW5fRhH9kX6zN9V0644k1Ydxq88_UX5X-Af7f6SW86alWAT1_AaAKiXG1";
        console.log("Configurare cheie API completată:", esriConfig.apiKey);

        const initializeMap = async () => {
            try {
                const map = createMap();
                const view = createMapView(map);

                const regionLayer = createRegionLayer(map);
                map.add(regionLayer);

                if (selectedLayer?.url) {
                    const thematicLayer = createThematicLayer(map, view, selectedLayer);
                    map.add(thematicLayer);
                    handleThematicLayerClick(view, thematicLayer);
                }

                view.when(() => console.log("MapView încărcat cu succes!"));
                handleRegionLayerClick(view, regionLayer, map);
            } catch (error) {
                console.error("Eroare la inițializarea hărții:", error);
            }
        };

        if (typeof window !== "undefined") {
            console.log("Inițializarea hărții pe client...");
            initializeMap();
        }

        return () => {
            console.log("Curățare resurse MapView...");
            if (mapRef.current) {
                mapRef.current.innerHTML = "";
            }
        };
    }, [selectedLayer]);

    const createMap = () => {
        return new Map({
            basemap: "streets-vector",
        });
    };

    const createMapView = (map) => {
        return new MapView({
            container: mapRef.current,
            map: map,
            center: [25.276987, 45.943161],
            zoom: 6,
            popup: {
                dockEnabled: false,
                dockOptions: { buttonEnabled: true, breakpoint: false },
            },
        });
    };

    const createRegionLayer = (map) => {
        return new GeoJSONLayer({
            url: "regiuni_romania.geojson",
            title: "regiuni_romania",
            renderer: {
                type: "simple",
                symbol: {
                    type: "simple-fill",
                    color: [0, 255, 0, 0.2],
                    outline: { color: [0, 100, 0], width: 1 },
                },
            },
            labelingInfo: [
                {
                    labelExpressionInfo: { expression: `'Vacanta in ' + $feature.name` },
                    symbol: {
                        type: "text",
                        color: "black",
                        haloColor: "white",
                        haloSize: "2px",
                        font: { size: 12, weight: "bold" },
                    },
                    labelPlacement: "always-horizontal",
                },
            ],
        });
    };

    const createThematicLayer = (map, view, selectedLayer) => {
        const thematicLayer = new FeatureLayer({
            url: selectedLayer.url,
            renderer: selectedLayer.renderer,
            outFields: ["*"],
        });

        thematicLayer.when(() => {
            console.log("Layer încărcat cu succes:", thematicLayer);
            setIsMapBlocked(false);
            setInstruction("Selectați o regiune de pe hartă");
        }).catch((error) => {
            console.error("Eroare la încărcarea layer-ului:", error);
        });

        return thematicLayer;
    };

    const handleThematicLayerClick = (view, thematicLayer) => {
        view.on("click", async (event) => {
            const response = await view.hitTest(event);
            const graphic = response.results.find(
                (res) => res.graphic?.layer?.id === thematicLayer.id
            )?.graphic;

            if (graphic) {
                setInstruction("");
                handleFeatureClick(graphic);
            }
        });
    };

    const handleFeatureClick = (graphic) => {
        const newPoint = {
            id: graphic.attributes.OBJECTID || graphic.attributes.id || Date.now(),
            name: graphic.attributes.name || "Fără titlu",
            address: graphic.attributes.formatted_address || "Adresă necunoscută",
            rating: graphic.attributes.rating || "N/A",
            url: graphic.attributes.url || "#",
            geometry: graphic.geometry || NULL
        };

        setSelectedPoints((prevPoints) => {
            const isDuplicate = prevPoints.some((point) => point.name === newPoint.name);
            return isDuplicate ? prevPoints : [...prevPoints, newPoint];
        });
    };

    const handleRegionLayerClick = (view, regionLayer, map) => {
        view.on("click", async (event) => {
            const response = await view.hitTest(event);
            const graphic = response.results.find((res) => res.layer === regionLayer)?.graphic;

            if (graphic) {
                const regionName = graphic.attributes.name;
                console.log(`Regiunea selectată: ${regionName}`);
                handleRegionSelection(regionName, graphic.geometry, map);
            }
        });
    };

    const handleRegionSelection = async (regionName, regionGeometry, map) => {
        const thematicLayer = map.layers.find((layer) => layer.title !== "regiuni_romania");
        if (!thematicLayer) {
            alert(`Intai selecteaza o tematica!`);
            return;
        }

        alert(`Ai selectat regiunea: ${regionName} si tematica: ${thematicLayer.title}`);

        const regionLayer = map.layers.find((layer) => layer.title === "regiuni_romania");
        if (regionLayer) {
            map.remove(regionLayer);
        }

        const query = new Query();
        query.geometry = regionGeometry;
        query.spatialRelationship = "intersects";
        query.returnGeometry = true;
        query.outFields = ["*"];
        query.geometry.spatialReference = thematicLayer.spatialReference;

        try {
            const results = await thematicLayer.queryFeatures(query);
            results.features.forEach((feature, index) => {
                console.log(`Atributele locației ${index + 1}:`, feature.attributes);
            });

            if (results.features.length > 0) {
                const objectIds = results.features.map((feature) => feature.attributes.ObjectId);
                console.log("Lista ID-urilor:", objectIds);
                thematicLayer.definitionExpression = `OBJECTID IN (${objectIds.join(",")})`;
            } else {
                console.warn("Nu au fost găsite locații în regiunea selectată.");
                thematicLayer.definitionExpression = "1=0";
            }
        } catch (error) {
            console.error("Eroare la filtrarea layer-ului tematic:", error);
        }
    };

    const calculateRoute = async () => {
        if (selectedPoints.length < 2) {
            alert("Trebuie să selectați cel puțin două puncte pentru a calcula o rută.");
            return;
        }
    
        console.log("Puncte selectate:", selectedPoints); // Afișează lista de puncte selectate în consolă
        // return;
        const stops = selectedPoints.map((point) => `${point.geometry.x},${point.geometry.y}`).join(";");
        const apiKey = esriConfig.apiKey;
        const routeUrl = `https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve`;

        console.log("Ruta:", stops); // Afișează lista de puncte selectate în consolă
    
        try {
            const response = await fetch(`${routeUrl}?stops=${stops}&f=json&token=${apiKey}`);
            const data = await response.json();
            if (data.routes) {
                alert("Ruta a fost calculată cu succes!");
            } else {
                alert("Nu s-a putut calcula ruta.");
            }
        } catch (error) {
            console.error("Eroare la calcularea rutei:", error);
        }
    };
    

    return (
        <div className="map-page-container">
            <div className="map-content-container">
                {isMapBlocked && (
                    <div className="map-overlay">
                        <p className="map-instruction">{instruction}</p>
                    </div>
                )}
                <div ref={mapRef} className="map-container" />
                <SelectedPointsList selectedPoints={selectedPoints} onReset={() => setSelectedPoints([])} />
                <button 
                    className="calculate-route-btn" 
                    onClick={calculateRoute} 
                    disabled={selectedPoints.length < 2}
                >
                    Calculează Ruta
                </button>

            </div>
        </div>
    );
};

export default MapComponent;
