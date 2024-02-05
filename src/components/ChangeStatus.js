import React from 'react';
import { ref, set, onValue, update } from 'firebase/database';
import { rtdb, auth } from '../utils/firebase';

const ChangeStatus = () => {
  const [status, setStatus] = React.useState('online');

  React.useEffect(() => {
    const userStatusDatabaseRef = ref(rtdb, '/status/' + auth.currentUser.uid);
    onValue(userStatusDatabaseRef, (snapshot) => {
      setStatus(snapshot.val()?.state || '');
    });
  }, []);

  const handleChangeStatus = async (e) => {
    const newStatus = e.target.value;
    const userStatusDatabaseRef = ref(rtdb, '/status/' + auth.currentUser.uid);
    if (newStatus === 'remove') {
      await update(userStatusDatabaseRef, {
        state: null,
        last_changed: Date.now(),
      });
      setStatus('');
    } else {
      await set(userStatusDatabaseRef, {
        state: newStatus,
        last_changed: Date.now(),
        displayName: auth.currentUser.displayName,
      });
      setStatus(newStatus);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <p>Current status: {status || 'No status'}</p>
      <div className="flex gap-2">
        <p>Change Status:</p>
        <select
          className='border w-[80px]'
          value={status}
          onChange={handleChangeStatus}
        >
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="remove">Remove state</option>
        </select>
      </div>
    </div>
  );
};

export default ChangeStatus;
