import { useState } from 'react';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Ticket from './components/Ticket.jsx';
import Header from './components/Header.jsx';

function App() {
  const [screen, setScreen] = useState('login');
  //const [auth, setAuth] = useState(true)
  const User = {
    id:1,
    name:"Matt",
    auth:3,
    employees: [
      "Sawyer",
      "Zaki",
      "Ethan",
      "Kelvin"
    ]
  }

  if (screen === 'signup') {
    return <Signup onShowLogin={() => setScreen('login')} />;
  }

  return (
  <>
  <Header user={User} />
  <Login onShowSignup={() => setScreen('signup')} />
    {/*
  <Ticket 
      id="123-456-789"
      title="Test Issue" 
      desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit." 
      keywords={["Refund/Return", "Unassigned", "Supervisor Needed"]}
      user={User} />
    */}
  </>
)
}

export default App;
