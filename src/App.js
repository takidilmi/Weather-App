import React, { useState, useEffect } from 'react';
import './App.css';
import Signup from './components/Signup';
import Signin from './components/Signin';
import WeatherComponent from './components/Weather';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from './utils/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const App = () => {
  const [userCountry, setUserCountry] = useState('United Kingdom');
  const [user, setUser] = useState(null); // Add a new state variable for the user

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserCountry(docSnap.data().country);
        } else {
          console.log('No such document!');
        }
        setUser(user); // Set the user state
      } else {
        // User is signed out
        console.log('User is not signed in');
        setUser(null); // Reset the user state
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('Sign out successful');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <>
      <div>
        {user ? (
          <div>
            <p>Welcome, {user.displayName}!</p>
            <button onClick={handleSignOut}>Sign Out</button>            
            <WeatherComponent userCountry={userCountry} />
          </div>
        ) : (
          <div>
            <Signup />
            <Signin />
            <WeatherComponent userCountry={userCountry} />
          </div>
        )}
      </div>
    </>
  );
};

export default App;
