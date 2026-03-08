import { useMemo, useState } from 'react';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import MainList from './components/MainList.jsx';
import AdminPanel from './components/admin/AdminPanel.jsx';
import TaskPage from './components/task/TaskPage.jsx';
import CalendarPage from './components/calendar/CalendarPage.jsx';
import { clearAuthToken, clearAuthenticatedEmployee, getAuthenticatedEmployee } from './api/authApi';
import './App.css';

function normalizeEmployee(employee) {
  if (!employee) {
    return null;
  }

  let authLevel = Number(employee.auth ?? employee.access_level ?? NaN);
  if (Number.isNaN(authLevel)) {
    const title = String(employee.title ?? '').toLowerCase();
    if (title.includes('tier 3')) {
      authLevel = 3;
    } else if (title.includes('tier 2')) {
      authLevel = 2;
    } else {
      authLevel = 1;
    }
  }

  return {
    ...employee,
    id: employee.id ?? employee.eno ?? 0,
    name: employee.name ?? employee.ename ?? employee.email ?? 'User',
    auth: authLevel,
    employees: Array.isArray(employee.employees) ? employee.employees : [],
  };
}

function App() {
  const [currentUser, setCurrentUser] = useState(() =>
    normalizeEmployee(getAuthenticatedEmployee())
  );
  const [screen, setScreen] = useState(currentUser ? 'main' : 'login');

  const handleNavigate = (nextScreen) => {
    setScreen(nextScreen);
  };

  const fallbackUser = useMemo(() => ({
    id: 0,
    name: 'User',
    auth: 1,
    employees: [],
  }), []);

  const user = currentUser || fallbackUser;

  const handleLoginSuccess = (employee) => {
    const normalized = normalizeEmployee(employee);
    if (!normalized) {
      return;
    }

    setCurrentUser(normalized);
    setScreen('main');
  };

  const handleLogout = () => {
    clearAuthenticatedEmployee();
    clearAuthToken();
    setCurrentUser(null);
    setScreen('login');
  };

  if (!currentUser && screen !== 'signup' && screen !== 'login') {
    return (
      <Login
        onShowSignup={() => setScreen('signup')}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  if (screen === 'admin') {
    return <AdminPanel user={user} onNavigate={handleNavigate} onLogout={handleLogout} />;
  }

  if (screen === 'create-task') {
    return <TaskPage user={user} onNavigate={handleNavigate} onLogout={handleLogout} />;
  }

  if (screen === 'calendar') {
    return <CalendarPage user={user} onNavigate={handleNavigate} onLogout={handleLogout} />;
  }

  if (screen === 'signup') {
    return <Signup onShowLogin={() => setScreen('login')} />;
  }

  if (screen === 'login') {
    return (
      <Login
        onShowSignup={() => setScreen('signup')}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <>
      <MainList user={user} onNavigate={handleNavigate} onLogout={handleLogout} />
    </>
  );
}

export default App;
