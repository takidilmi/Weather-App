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
    <table className="text-center table-auto">
      <thead>
        <tr>
          <th className="px-4 py-2 border">Display Name</th>
          <th className="px-4 py-2 border">Status</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(usersStatus).map(
          ([uid, status]) =>
            status.state && (
              <tr
                key={uid}
                className={`${
                  status.state === 'online' ? 'bg-gray-300' : 'bg-gray-100'
                }`}
              >
                <td className="px-4 py-2 border">
                  <div>
                    <p className="relative">
                      {status.displayName}{' '}
                      <span
                        className={`${
                          status.state === 'online'
                            ? 'bg-green-500 bg-opacity-60 absolute right-[-1px] p-1 rounded-full'
                            : 'bg-gray-100'
                        }`}
                      ></span>
                    </p>
                  </div>
                </td>
                <td className="border">
                  <strong>{status.state}</strong>
                </td>
              </tr>
            )
        )}
      </tbody>
    </table>
  );
};

export default UsersTable;
