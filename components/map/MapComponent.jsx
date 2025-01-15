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


const MapComponent = ({ selectedLayer, onSaveRoute, initialRoute}) => {
    const mapRef = useRef(null);  // Referință la containerul DOM al hărții
    const viewRef = useRef(null); // Referință la obiectul `MapView`
    const [selectedPoints, setSelectedPoints] = useState([]);
    const [isMapBlocked, setIsMapBlocked] = useState(true); // Harta blocată inițial
    const [instruction, setInstruction] = useState("Vă rugăm să selectați o tema pentru vacanța!");
    const [selectedRegion, setSelectedRegion] = useState(""); // Pentru regiune
    const [themeTitle, setThemeTitle] = useState(""); // Pentru tematica

    useEffect(() => {
        setSelectedPoints([]);
        esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurA68jFcPXz-dC0bjRMxYCtOcFXikjbCIslC1pYzC4PnuBx9o1IKmNwKh6jhMI_gDo3fEzuUQOlsOfPNou5BEHTfW4wPvKgNaXtY4JTU0BndU-7d0K_l77KD2QxGVRl8NxYvv8kcmvQtXbw8amy8q1Ydvl2gk5iXNxO_h_JNid9t6CINTjtjsHvkxXsc_VoajW5fRhH9kX6zN9V0644k1Ydxq88_UX5X-Af7f6SW86alWAT1_AaAKiXG1";
        console.log("Configurare cheie API completată:", esriConfig.apiKey);

        const initializeMap = async () => {
            try {
                const map = createMap();
                const view = createMapView(map);
                viewRef.current = view; // Stochează `view` în `viewRef`
                
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

    // Effect pentru afisarea initialRoute
    useEffect(() => {
        if (initialRoute && initialRoute.points.length > 0) {
            console.log("Displaying initial route:", initialRoute);
            console.log("Tema si regiune: ", initialRoute.region, initialRoute.theme);
    
            // Setează regiunea și tematica
            setSelectedRegion(initialRoute.region);
            setThemeTitle(initialRoute.theme);
    
            // Deblochează harta și ascunde overlay-ul
            setIsMapBlocked(false);
            setInstruction("");
    
            // Afișează ruta fără a trece prin flow-ul complet
            calculateRoute(initialRoute.points);
            setSelectedPoints(initialRoute.points);
        }
    }, [initialRoute]);

    const handleShare = () => {
        const currentUrl = window.location.href; // URL-ul complet al paginii curente
    
        navigator.clipboard.writeText(currentUrl)
            .then(() => {
                alert("Link copiat cu succes!");
            })
            .catch((error) => {
                console.error("Eroare la copierea linkului:", error);
                alert("A apărut o problemă la copierea linkului.");
            });
    };

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
                    color: [0, 255, 0, 0.1],
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
            title: selectedLayer.name || "Layer fără titlu", // Folosește `name` în loc de `title`
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
            alert(`Va rugam selectati o tema!`);
            return;
        }

        setSelectedRegion(regionName); // Setează regiunea selectată
        setThemeTitle(thematicLayer.title); // Setează tematica din `selectedLayer`
        console.log(`Selected region: ${regionName}. Selected theme: ${thematicLayer.title}`);

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

    const calculateRoute = async (points) => {
        resetRoute();
        const routePoints = Array.isArray(points) ? points : selectedPoints;  // Folosește `selectedPoints` dacă `points` este `undefined`

        if (!Array.isArray(routePoints) || routePoints.length < 2) {
            alert("Trebuie să selectați cel puțin două obiective pentru a calcula o rută.");
            return;
        }

        console.log("Puncte selectate:", routePoints); // Afișează lista de puncte selectate în consolă

        const stops = routePoints
        .map((point) => {
            // Folosim direct latitude și longitude dacă există
            const { latitude, longitude } = point.geometry;
            if (latitude && longitude) {
                return `${longitude},${latitude}`;
            } else {
                console.error("Punctul nu conține latitude/longitude:", point);
                throw new Error("Punct invalid. Nu are coordonate corecte.");
            }
        })
        .join(";");

        const apiKey = esriConfig.apiKey;
        const routeUrl = `https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve`;

        console.log("Extracted stops from list.")
    
        const params = new URLSearchParams({
            stops,
            f: "json",
            token: apiKey,
        });
    
        try {
            const response = await fetch(`${routeUrl}?${params.toString()}`, {
                method: "GET",
            });
            const data = await response.json();

            console.log("Route calculated.");
    
            if (data.routes && data.routes.features.length > 0) {
            const routeGeometry = data.routes.features[0].geometry;

            console.log("Route Geometry created.");

            // Creează un obiect `Graphic` pentru a afișa ruta pe hartă
            const routeGraphic = new Graphic({
                geometry: {
                    type: "polyline",
                    paths: routeGeometry.paths, // Folosește câmpul `paths` din răspuns
                    spatialReference: { wkid: 4326 },
                },
                symbol: {
                    type: "simple-line",
                    color: [0, 0, 255, 0.8], // Albastru semi-transparent
                    width: 4, // Grosimea liniei
                },
            });

            console.log("Route Graphic created.");

            // Afișează ruta pe hartă folosind `viewRef.current` pentru a accesa `graphics`
            viewRef.current.graphics.add(routeGraphic);

            console.log("Ruta a fost afișată pe hartă.");

        } else {
            alert("Nu s-a putut calcula ruta.");
            return;
        }
        } catch (error) {
            console.error("Eroare la calcularea rutei:", error);
        }
    };
    
    const resetRoute = () => {
        if (viewRef.current) {
          viewRef.current.graphics.removeAll();  // Elimină toate graficele (inclusiv ruta)
        }
    };

    const removePoint = (index) => {
        setSelectedPoints((prevPoints) => {
            const updatedPoints = prevPoints.filter((_, i) => i !== index);
            resetRoute(); // Șterge ruta veche

            // Dacă rămân cel puțin două puncte, recalculăm ruta imediat
            if (updatedPoints.length >= 2) {
                calculateRoute(updatedPoints); // Trimite lista actualizată
            }

            return updatedPoints;
        });
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
                <SelectedPointsList
                    selectedPoints={selectedPoints}
                    onReset={() => {
                        setSelectedPoints([]);
                        resetRoute();
                    }}
                    onCalculateRoute={calculateRoute}
                    onRemovePoint={removePoint}
                />
                {initialRoute ? (
                <div className="route-info-box">
                    <h3>Detalii Rută</h3>
                    <p><strong>Nume rută:</strong> {initialRoute.name}</p>
                    <p><strong>Tematică:</strong> {themeTitle}</p>
                    <p><strong>Regiune:</strong> {selectedRegion}</p>
                    <p><strong>Număr puncte:</strong> {initialRoute.points.length}</p>
                    <button
                        className="share-button"
                        onClick={() => handleShare()}
                    >
                        Share
                    </button>
                </div>
            ) : (
                <button
                    className="save-route-button"
                    disabled={selectedPoints.length < 2}
                    onClick={() => onSaveRoute(selectedPoints, selectedRegion, themeTitle)} // Folosim funcție anonimă pentru a pasa funcția corect
                >
                    Salvează Traseul
                </button>
            )}
            </div>
            
        </div>
    );
};

export default MapComponent;
