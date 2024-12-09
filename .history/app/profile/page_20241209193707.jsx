"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Pentru navigare
import { auth } from "../firebase/config"; // Configurarea Firebase
import { onAuthStateChanged, signOut } from "firebase/auth"; // Funcția de logout

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
    <div className='userprofile'>
        <Navbar/>
        <SingleBanner 
        heading={`My Profile`}
        bannerimage = 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80' 
        />
        {/* UserProfile , showing {activepage}
         */}

         <div className='userprofilein'>
            <div className='left'>
              <UserSidebar activepage={activepage}/>
            </div>
            <div className='right'>
              {activepage === 'accountsettings' && <AccountSettings/>}
              {activepage === 'changepassword' && <ChangePassword/>}
              {activepage === 'yourorders' && <YourOrders/>}
              {activepage === 'address' && <UserAddress/>}
              {activepage === 'legalnotice' && <LegalNotice/>}
            </div>
         </div>
        <Footer1/>
        <Footer2/>
        </div>
  )
};

export default ProfilePage;