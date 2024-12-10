"use client";  // Asigură-te că acest lucru este adăugat pentru a marca componenta ca fiind client-side
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";  // Importă useRouter din 'next/navigation'
import AuthForm from "../../components/AuthForm"; // Componenta ta pentru formulare
import { auth } from "../firebase/config"; // Configurarea Firebase
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { get, ref, set } from "firebase/database";
import { db } from "../firebase/config";

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
      let user;
      if (isSignUp) {
        // Crează un nou utilizator
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
  
        // După crearea utilizatorului, creează profilul în Firebase Realtime Database
        const userProfilesRef = ref(db, 'user_profiles/' + user.uid);
        await set(userProfilesRef, {
          email: user.email,
          uid: user.uid,
          firstName: "",  // Lasă aceste câmpuri goale pentru moment
          lastName: "",
          phone: "",
        }).then(() => {
          console.log("Profile data saved for user", user.uid);
        }).catch((err) => {
          console.error("Error saving profile:", err);
        });
  
        setSuccessMessage("Account created successfully! Please log in.");
        setIsSignUp(false); // Comută automat la Sign In
        setEmail(""); // Resetează câmpul Email
        setPassword(""); // Resetează câmpul Password
      } else {
        // Autentifică utilizatorul existent
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
        alert("Sign In successful!");
  
        // Verifică dacă profilul utilizatorului există în Firebase
        const userProfileRef = ref(db, 'user_profiles/' + user.uid);
        const snapshot = await get(userProfileRef);
        if (!snapshot.exists()) {
          // Dacă profilul nu există, adaugă-l
          await set(userProfileRef, {
            email: user.email,
            uid: user.uid,
            firstName: "",
            lastName: "",
            phone: "",
          }).then(() => {
            console.log("Profile data saved for user", user.uid);
          }).catch((err) => {
            console.error("Error saving profile:", err);
          });
        }
  
        // După autentificare, redirecționează utilizatorul la /home
        router.push("/home");  // Redirecționează la pagina principală
      }
    } catch (err) {
      setError(err.message); // Afișează eroarea în caz de eșec
    }
  };
  

  return (
    <div className="auth-page-container">
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
      <div className="auth-toggle-container">
        <p>
          {isSignUp
            ? "Already have an account? "
            : "Don't have an account yet? "}
          <button className="auth-toggle-button" onClick={toggleForm}>
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
