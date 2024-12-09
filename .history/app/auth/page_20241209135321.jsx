"use client";  // Asigură-te că acest lucru este adăugat pentru a marca componenta ca fiind client-side
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";  // Importă useRouter din 'next/navigation'
import AuthForm from "../../components/AuthForm"; // Componenta ta pentru formulare
import { auth } from "../firebase/config"; // Configurarea Firebase
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

import "/styles/auth.css"; // Stilurile pentru paginile de autentificare

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false); // Controlează ce formular să afișeze
  const [email, setEmail] = useState(""); // Stochează email-ul
  const [password, setPassword] = useState(""); // Stochează parola
  const [error, setError] = useState(null); // Gestionarea erorilor
  const [successMessage, setSuccessMessage] = useState(""); // Mesajul de succes
  const router = useRouter(); // Folosește useRouter pentru a naviga

  const toggleForm = () => {
    setIsSignUp((prev) => !prev); // Comută între Sign Up și Sign In
    setError(null); // Resetează erorile
    setEmail(""); // Resetează câmpul Email
    setPassword(""); // Resetează câmpul Password
    setSuccessMessage(""); // Resetează mesajul de succes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Resetează erorile la trimiterea formularului

    try {
      if (isSignUp) {
        // Crează un nou utilizator
        await createUserWithEmailAndPassword(auth, email, password);
        setSuccessMessage("Account created successfully! Please log in.");
        setIsSignUp(false); // Comută automat la Sign In
        setEmail(""); // Resetează câmpul Email
        setPassword(""); // Resetează câmpul Password
      } else {
        // Autentifică utilizatorul
        await signInWithEmailAndPassword(auth, email, password);
        alert("Sign In successful!");

        // După autentificare, redirecționează utilizatorul la /home
        router.push("/home");  // Redirecționează la pagina principală
      }
    } catch (err) {
      setError(err.message); // Afișează eroarea în caz de eșec
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      {/* Afișează mesajul de succes dacă există */}
      {successMessage && <p className="success-message">{successMessage}</p>}

      {/* Formularele de autentificare și înregistrare */}
      <AuthForm
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        error={error}
        handleSubmit={handleSubmit}
        buttonText={isSignUp ? "Sign Up" : "Sign In"}
      />

      {/* Link pentru comutarea între Sign In și Sign Up */}
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <p>
          {isSignUp
            ? "Already have an account? "
            : "Don't have an account yet? "}
          <button
            onClick={toggleForm}
            style={{
              background: "none",
              border: "none",
              color: "#50D8D7",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
