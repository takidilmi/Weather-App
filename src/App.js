import React, { useState, useEffect } from 'react';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Weather from './components/Weather';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db, auth, rtdb } from './utils/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import UsersTable from './components/UsersTable';
import { ref, set, onDisconnect, update } from 'firebase/database';
import ChangeStatus from './components/ChangeStatus';

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
          displayName: user.displayName,
        });
        // When the user disconnects, only update the 'state' and 'last_changed' fields
        onDisconnect(userStatusDatabaseRef).update({
          state: 'offline',
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
        displayName: user.displayName,
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
      <div className="flex flex-col items-center gap-2">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="flex flex-col items-center">
            {user ? (
              <div className="relative flex flex-col items-center w-[80%] gap-3">
                <div>
                  <p>
                    Welcome, <strong>{user.displayName}</strong>!
                  </p>
                  <ChangeStatus />
                </div>
                <UsersTable users={users} />
                <button
                  className="buttonStyle signButton"
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
                <div class="background">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            ) : (
              <div className="relative flex flex-wrap justify-center w-[80%] gap-3">
                <Signup />
                <Signin />
                <div class="background">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div className="w-[80%]">
              <Weather
                key={userCountry}
                userCountry={userCountry}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default App;
