import React, { useState, useEffect } from 'react';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Weather from './components/Weather';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db, auth, rtdb } from './utils/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import UsersTable from './components/UsersTable';
import { ref, set } from 'firebase/database';

const App = () => {
  const [userCountry, setUserCountry] = useState('United Kingdom');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        const userStatusDatabaseRef = ref(rtdb, '/status/' + user.uid);
        // We'll create a key on user's profile in the Realtime database
        // The value will be 'online' if the user is online
        // When the user disconnects, the value will be set to 'offline'
        set(userStatusDatabaseRef, {
          state: 'online',
          last_changed: Date.now(),
        });

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
      const fetchUsers = async () => {
        const usersColelction = collection(db, 'users');
        const userSnapshot = await getDocs(usersColelction);
        const userList = userSnapshot.docs.map((doc) => doc.data());
        setUsers(userList);
      };
      fetchUsers();
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      const userStatusDatabaseRef = ref(rtdb, '/status/' + user.uid);
      set(userStatusDatabaseRef, {
        state: 'offline',
        last_changed: Date.now(),
      });
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
                <UsersTable users={users} />
                <button onClick={handleSignOut}>Sign Out</button>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-3">
                <Signup />
                <Signin />
              </div>
            )}

            <Weather
              key={userCountry}
              userCountry={userCountry}
            />
          </>
        )}
      </div>
    </>
  );
};

export default App;
