"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Pentru navigare
import { auth } from "../firebase/config"; // Configurarea Firebase
import { onAuthStateChanged, signOut } from "firebase/auth"; // Funcția de logout
import Avatar from '@sabfry/avatarium';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Ascultă modificările stării de autentificare
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setError("No user is signed in.");
        router.push("/auth"); // Redirecționează dacă utilizatorul nu este autentificat
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Deconectează utilizatorul
      router.push("/auth"); // Redirecționează la pagina de autentificare
    } catch (err) {
      console.error("Error logging out:", err);
      setError("Failed to log out.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="profile-page">
      <h1>Profile Page</h1>
      <div className="profile-info">
        <Avatar theme="blobs" />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <Formik
          initialValues={{ name: user.name, email: user.email }}
          onSubmit={(values, { setSubmitting }) => {
            axios.post('https://api.example.com/user/update', values)
              .then(response => {
                setUser(response.data);
                setSubmitting(false);
              })
              .catch(error => {
                console.error('Error updating user data:', error);
                setSubmitting(false);
              });
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div>
                <label htmlFor="name">Name</label>
                <Field id="name" name="name" placeholder="John Doe" />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <Field id="email" name="email" placeholder="john.doe@example.com" type="email" />
              </div>
              <button type="submit" disabled={isSubmitting}>
                Update
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ProfilePage;
