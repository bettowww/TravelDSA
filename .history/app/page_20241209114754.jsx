"use client";

import { useEffect } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {app, auth} from "./firebase/config"; // Asigură-te că acest import funcționează

export default function Home() {
  useEffect(() => {
    const auth = getAuth(app);

    signInWithEmailAndPassword(auth, "dadada@gmail.com", "dadada")
      .then((userCredential) => {
        console.log("User logged in:", userCredential.user);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return <h1>Welcome to Next.js with Firebase!</h1>;
}
