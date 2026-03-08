import { useState } from 'react';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import MainList from './components/MainList.jsx';
import AdminPanel from './components/admin/AdminPanel.jsx';
import './App.css';

function App() {
  const [screen, setScreen] = useState('main');

  const handleNavigate = (nextScreen) => {
    setScreen(nextScreen);
  };

  const User = {
    id: 1,
    name: 'Matt',
    auth:3,
    employees: [
      'Sawyer',
      'Zaki',
      'Ethan',
      'Kelvin'
    ],
  };

  if (screen === 'admin') {
    return <AdminPanel user={User} onNavigate={handleNavigate} />;
  }

  if (screen === 'signup') {
    return <Signup onShowLogin={() => setScreen('login')} />;
  }

  if (screen === 'login') {
    return <Login onShowSignup={() => setScreen('signup')} />;
  }

  return (
    <>
      <MainList user={User} onNavigate={handleNavigate} />
    </>
  );
}

export default App;
