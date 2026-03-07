import { useState } from 'react';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';

function App() {
  const [screen, setScreen] = useState('login');

  if (screen === 'signup') {
    return <Signup onShowLogin={() => setScreen('login')} />;
  }

  return <Login onShowSignup={() => setScreen('signup')} />;
}

export default App;
