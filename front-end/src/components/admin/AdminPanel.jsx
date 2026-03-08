import Header from '../Header';
import CategoryManager from './CategoryManager';
import Leaderboard from './Leaderboard';
import EmployeeLookup from './EmployeeLookup';
import DepartmentCategoryAssign from './DepartmentCategoryAssign';
import DepartmentManager from './DepartmentManager';
import './AdminPanel.css';

function AdminPanel({ user, onNavigate, onLogout }) {
  return (
    <div className="admin-page">
      <Header user={user} onNavigate={onNavigate} onLogout={onLogout} activeView="admin" />
      <main className="admin-main">
        <section className="admin-hero">
          <div>
            <p className="admin-eyebrow">Control Center</p>
            <h1 className="admin-title">Admin Panel</h1>
            <p className="admin-subtitle">
              Manage categories, departments, and team performance from one place.
            </p>
          </div>
        </section>

        <section className="admin-grid">
          <CategoryManager />
          <Leaderboard />
          <EmployeeLookup />
          <DepartmentCategoryAssign />
          <DepartmentManager />
        </section>
      </main>
    </div>
  );
}

export default AdminPanel;
