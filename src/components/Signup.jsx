import React, { useState, useEffect } from 'react';
import { auth } from '../utils/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db, rtdb } from '../utils/firebase';
import Countries from './Countries';
import { ref, set } from 'firebase/database';

const Signup = () => {
  const [name, setName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();

    // Check if a country is selected
    if (!country) {
      setError('Please select a country.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(user, { displayName: `${name} ${familyName}` });

      // Add the new user to the "users" collection in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: `${name}`,
        familyName: `${familyName}`,
        displayName: `${name} ${familyName}`,
        email: email,
        country: country,
        joinDate : new Date().toISOString(),
      });
      setSuccessMessage('Signup successful');
      // After the user is created and their profile is updated
      const userStatusDatabaseRef = ref(rtdb, '/status/' + user.uid);
      set(userStatusDatabaseRef, {
        state: 'online',
        last_changed: Date.now(),
        displayName: `${name} ${familyName}`,
      });

      setName('');
      setFamilyName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      setError(error.message);
    }
  };
  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  }, [successMessage]);

  return (
    <>
      {successMessage && <p className="success-message">{successMessage}</p>}
      <div className="flex-1">
        <form onSubmit={handleSignup}>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
          <input
            type="text"
            name="familyName"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            placeholder="Family Name"
            required
          />
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <Countries onCountryChange={setCountry} />
          <button
            className="buttonStyle signButton"
            type="submit"
          >
            Sign Up
          </button>
        </form>
        {error && <p>{error}</p>}
      </div>
    </>
  );
};

export default Signup;
