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
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <h1 className="text-2xl font-bold">Profil utilizator</h1>

      {userData && (
        <div className="profile-details">
          <p><strong>Nume:</strong> {userData.first_name} {userData.last_name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <h2 className="text-xl mt-4 font-semibold">Trasee salvate:</h2>
          {userData.saved_routes ? (
            <ul className="list-disc ml-4">
              {userData.saved_routes.map((route, index) => (
                <li key={index}>{route}</li>
              ))}
            </ul>
          ) : (
            <p>Nu aveți trasee salvate încă.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
