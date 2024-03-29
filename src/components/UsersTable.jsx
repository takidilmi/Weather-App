import React, { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { rtdb, db, auth } from '../utils/firebase';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';

const UsersTable = ({ users, friends }) => {
  const [usersStatus, setUsersStatus] = useState({});
  const [userFriends, setUserFriends] = useState(friends);

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
  const addUser = async (friendUid) => {
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, {
        friends: arrayUnion(friendUid),
      });
      setUserFriends((prevFriends) => [...prevFriends, friendUid]);
      console.log('Friend added successfully');
    } catch (error) {
      console.error('Error adding friend: ', error);
    }
  };

  const deleteUser = async (friendUid) => {
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, {
        friends: arrayRemove(friendUid),
      });
      setUserFriends((prevFriends) =>
        prevFriends.filter((uid) => uid !== friendUid)
      );
      console.log('Friend deleted successfully');
    } catch (error) {
      console.error('Error deleting friend: ', error);
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };
  return (
    <div className="max-h-[500px] p-2 overflow-y-auto">
      <table className="text-center ">
        <thead>
          <tr>
            <th className="px-4 py-2">Display Name</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Join Date</th> {/* New column */}
            <th className="px-4 py-2">Actions</th>
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
                  <td className="px-4 py-2 borderHere">
                    <div>
                      <p className="relative">
                        {status.displayName}{' '}
                        <span
                          className={`${
                            status.state === 'online'
                              ? 'activeStatus'
                              : 'bg-gray-100'
                          }`}
                        ></span>
                      </p>
                    </div>
                  </td>
                  <td className="borderHere">
                    <strong>{status.state}</strong>
                  </td>
                  <td className="borderHere">
                    {formatDate(
                      users.find((user) => user.uid === uid)?.joinDate
                    )}
                  </td>
                  <td className="borderHere">
                    {uid !== auth.currentUser.uid &&
                      ((userFriends || []).includes(uid) ? (
                        <button onClick={() => deleteUser(uid)}>
                          Delete Friend
                        </button>
                      ) : (
                        <button onClick={() => addUser(uid)}>Add Friend</button>
                      ))}
                  </td>
                </tr>
              )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
