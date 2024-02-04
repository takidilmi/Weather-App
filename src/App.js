import React from 'react';
import './App.css';
import Signup from './components/Signup';
import Signin from './components/Signin';

const App = () => {
  return (
    <>
      <div>
        <Signup />
        <Signin />
      </div>
    </>
  );
};

export default App;
