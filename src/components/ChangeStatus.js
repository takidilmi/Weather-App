import React from 'react';
import { ref, set, onValue } from 'firebase/database';
import { rtdb, auth } from '../utils/firebase';

const ChangeStatus = () => {
  const [status, setStatus] = React.useState('online');

  React.useEffect(() => {
    const userStatusDatabaseRef = ref(rtdb, '/status/' + auth.currentUser.uid);
    onValue(userStatusDatabaseRef, (snapshot) => {
      setStatus(snapshot.val().state);
    });
  }, []);

  const handleChangeStatus = async (e) => {
    const newStatus = e.target.value;
    const userStatusDatabaseRef = ref(rtdb, '/status/' + auth.currentUser.uid);
    await set(userStatusDatabaseRef, {
      state: newStatus,
      last_changed: Date.now(),
      displayName: auth.currentUser.displayName,
    });
    setStatus(newStatus);
  };

  return (
    <>
      <div>
        <p>Current status: {status}</p>
        <select
          value={status}
          onChange={handleChangeStatus}
        >
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
      </div>
    </>
  );
};

export default ChangeStatus;
