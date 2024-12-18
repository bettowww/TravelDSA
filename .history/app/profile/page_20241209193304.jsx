"use client"; // Componenta este client-side
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Navigare între pagini
import { getAuth } from "firebase/auth"; // Importă Firebase Auth
import { getDatabase, ref, get } from "firebase/database"; // Importă Firebase Database

import "/styles/profile.css"; // Stiluri personalizate pentru profil

const ProfilePage = () => {
  const [userData, setUserData] = useState(null); // Stochează datele utilizatorului
  const [error, setError] = useState(null); // Gestionarea erorilor
  const [loading, setLoading] = useState(true); // Indică dacă datele sunt în curs de încărcare
  const router = useRouter(); // Pentru navigare

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        try {
          const db = getDatabase();
          const userRef = ref(db, `users/${user.uid}`);
          const snapshot = await get(userRef);

          if (snapshot.exists()) {
            setUserData(snapshot.val());
          } else {
            setError("No user data found.");
          }
        } catch (err) {
          setError("Failed to fetch user data.");
        }
      } else {
        // Redirecționează la autentificare dacă utilizatorul nu este conectat
        router.push("/auth");
      }
      setLoading(false);
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (

  );
};

export default ProfilePage;
