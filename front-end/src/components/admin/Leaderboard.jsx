import { useEffect, useState } from 'react';
import { getLeaderboard } from '../../api/adminApi';
import AdminSectionCard from './AdminSectionCard';

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [status, setStatus] = useState('Loading leaderboard...');

  async function loadLeaderboard() {
    setStatus('Loading leaderboard...');

    try {
      const result = await getLeaderboard(20);
      const rows = result?.leaderboard || result?.rows || [];
      setLeaders(Array.isArray(rows) ? rows : []);
      setStatus(rows.length ? '' : 'No completed task data yet.');
    } catch (error) {
      setLeaders([]);
      setStatus(error.message || 'Unable to load leaderboard.');
    }
  }

  useEffect(() => {
    loadLeaderboard();
  }, []);

  return (
    <AdminSectionCard title="Leaderboard (Completed Tasks)">
      <div className="admin-actions-row">
        <button type="button" className="admin-btn" onClick={loadLeaderboard}>Refresh</button>
      </div>
      {status && <p className="admin-message">{status}</p>}
      {leaders.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Employee</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((row, index) => (
              <tr key={`${row.employee_id || row.name || index}-${index}`}>
                <td>{index + 1}</td>
                <td>{row.name || row.employee_name || row.employee_id || 'Unknown'}</td>
                <td>{row.completed || row.completed_tasks || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminSectionCard>
  );
}

export default Leaderboard;
