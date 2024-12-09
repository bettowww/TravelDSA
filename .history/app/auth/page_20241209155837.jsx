"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "../../components/AuthForm";
import { auth } from "../firebase/config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

import "/styles/auth.css";

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const toggleForm = () => {
    setIsSignUp((prev) => !prev);
    setError(null);
    setEmail("");
    setPassword("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        setSuccessMessage("Account created successfully! Please log in.");
        setIsSignUp(false);
        setEmail("");
        setPassword("");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Sign In successful!");
        router.push("/home");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page-container">
      {successMessage && <p className="success-message">{successMessage}</p>}

      <AuthForm
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        error={error}
        handleSubmit={handleSubmit}
        buttonText={isSignUp ? "Sign Up" : "Sign In"}
      />

      <div className="auth-toggle-container">
        <p>
          {isSignUp ? "Already have an account? " : "Don't have an account yet? "}
          <button className="auth-toggle-button" onClick={toggleForm}>
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
