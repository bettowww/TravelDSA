"use client"; // Componenta este client-side
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, database } from "../firebase/config"; // Importă configurarea Firebase
import { ref, get } from "firebase/database";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const user = auth.currentUser;

      if (user) {
        try {
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
        router.push("/auth"); // Redirecționează la autentificare dacă utilizatorul nu este conectat
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
      <h1>Profil utilizator</h1>
      {userData && (
        <div>
          <p><strong>Nume:</strong> {userData.first_name} {userData.last_name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
