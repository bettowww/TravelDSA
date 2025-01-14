"use client";

import React from "react";
// import "../../styles/pointsList.css";  // Importă stilurile pentru listă

const SelectedPointsList = ({ selectedPoints, onReset, onCalculateRoute, onRemovePoint}) => {
  return (
    <div className="routing-container">
        <div className="list-container">
        <h4>Puncte Selectate</h4>
        {selectedPoints.length === 0 ? (
            <p>Nu ai selectat niciun punct.</p>
        ) : (
            <ul>
            {selectedPoints.map((point, index) => (
                <li key={index} className="list-item">
                <strong>{point.name}</strong><br />
                {point.address}<br />
                Rating: {point.rating} ⭐<br />
                <a href={point.url} target="_blank" rel="noopener noreferrer">
                    Vezi mai multe
                </a>

                <button
                    className="delete-point-button"
                    onClick={() => onRemovePoint(index)}
                >
                    Șterge obiectiv
                </button>
                </li>
            ))}
            </ul>
        )}

            

        </div>
        <div className="buttons-container">
            <button onClick={onReset} className="reset-button">
            Resetează Lista
            </button>
            <button
            className="compute-button"
            onClick={onCalculateRoute}
            disabled={selectedPoints.length < 2}
            >
            Calculează Ruta
            </button>
        </div>
    </div>
  );
};

export default SelectedPointsList;
