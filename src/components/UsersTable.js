import React, { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { rtdb } from '../utils/firebase';
const UsersTable = () => {
    const [usersStatus, setUsersStatus] = useState({});
  
    useEffect(() => {
      const statusRef = ref(rtdb, 'status'); // path to the status
  
      // Listen for changes in the status
      const unsubscribe = onValue(statusRef, (snapshot) => {
        const val = snapshot.val();
        setUsersStatus(val);
      });
  
      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    }, []);
  
    return (
      <div>
        {Object.entries(usersStatus).map(([uid, status]) => (
          <div key={uid}>
            User {status.displayName} is currently: <strong>{status.state}</strong>
          </div>
        ))}
      </div>
    );
  };
  
  export default UsersTable;