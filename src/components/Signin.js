import React, { useState } from 'react';
import { auth } from '../utils/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { rtdb } from '../utils/firebase';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log('Signin successful');
      const userStatusDatabaseRef = ref(rtdb, '/status/' + user.uid);
      set(userStatusDatabaseRef, {
        state: 'online',
        last_changed: Date.now(),
        displayName: user.displayName,
      });
      setEmail('');
      setPassword('');
    } catch (error) {
      setError(error.message);
    }
  };
  

  return (
    <div className="flex-1">
      <form onSubmit={handleSignin}>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Sign In</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Signin;
