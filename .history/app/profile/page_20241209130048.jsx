"use client"; // Componenta este client-side
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, database } from "../firebase/config"; // Configurarea Firebase
import { ref, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null); // Datele utilizatorului
  const [authUser, setAuthUser] = useState(null); // Utilizatorul autentificat
  const [error, setError] = useState(null); // Gestionarea erorilor
  const [loading, setLoading] = useState(true); // Indicator de încărcare
  const router = useRouter();

  useEffect(() => {
    // Ascultă modificările stării de autentificare
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAuthUser(user);
        try {
          // Obține datele utilizatorului din Firebase Realtime Database
          const userRef = ref(database, `users/${user.uid}`);
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
        router.push("/auth"); // Redirecționează la autentificare dacă nu există utilizator
      }
      setLoading(false); // Finalizează încărcarea
    });

    // Curăță ascultătorul când componenta este demontată
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <h1>Profil utilizator</h1>
      {userData && (
        <div>
          <p><strong>Nume:</strong> {userData.first_name} {userData.last_name}</p>
          <p><strong>Email:</strong> {authUser?.email}</p>
          <h2>Trasee salvate:</h2>
          {userData.saved_routes ? (
            <ul>
              {userData.saved_routes.map((route, index) => (
                <li key={index}>{route}</li>
              ))}
            </ul>
          ) : (
            <p>Nu aveți trasee salvate.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
