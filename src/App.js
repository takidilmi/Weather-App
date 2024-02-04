import React, { useState, useEffect } from 'react';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Weather from './components/Weather';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from './utils/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const App = () => {
  const [userCountry, setUserCountry] = useState('United Kingdom');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
        setUser(user);
      } else {
        console.log('User is not signed in');
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUserCountry('United Kingdom');
      console.log('Sign out successful');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {user ? (
              <div>
                <p>Welcome, {user.displayName}!</p>
                <button onClick={handleSignOut}>Sign Out</button>
              </div>
            ) : (
              <div className='flex justify-center'>
                <Signup />
                <Signin />
              </div>
            )}
            <Weather key={userCountry} userCountry={userCountry} />
          </>
        )}
      </div>
    </>
  );
};

export default App;
