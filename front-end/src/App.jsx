import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Ticket from './components/Ticket'

function App() {
  const [count, setCount] = useState(0)
  // eslint-disable-next-line no-unused-vars
  const [auth, setAuth] = useState(true)
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

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <Ticket 
      id="123-456-789"
      title="Test Issue" 
      desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit." 
      keywords={["Refund/Return", "Unassigned", "Supervisor Needed"]}
      user={User} />
    </>
  )
}

export default App
