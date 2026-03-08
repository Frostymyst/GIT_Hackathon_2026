import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { getLeaderboard } from '../../api/adminApi';
import AdminSectionCard from './AdminSectionCard';

const columns = [
  {
    name: 'Rank',
    cell: (row) => {
      if (row.rank === 1) {
        return (
          <span className="leader-rank leader-rank-gold">
            <i className="fa-solid fa-medal" aria-hidden="true" />
            <span>1</span>
          </span>
        );
      }
      if (row.rank === 2) {
        return (
          <span className="leader-rank leader-rank-silver">
            <i className="fa-solid fa-medal" aria-hidden="true" />
            <span>2</span>
          </span>
        );
      }
      if (row.rank === 3) {
        return (
          <span className="leader-rank leader-rank-bronze">
            <i className="fa-solid fa-medal" aria-hidden="true" />
            <span>3</span>
          </span>
        );
      }

      return (
        <span className="leader-rank leader-rank-default">
          <span className="leader-rank-icon-placeholder" aria-hidden="true" />
          <span>{row.rank}</span>
        </span>
      );
    },
    width: '110px',
    sortable: true,
  },
  {
    name: 'Employee',
    selector: (row) => row.employee,
    sortable: true,
    grow: 2,
  },
  {
    name: 'Completed',
    selector: (row) => row.completed,
    sortable: true,
    right: true,
    width: '130px',
  },
];

const tableStyles = {
  headRow: {
    style: {
      backgroundColor: '#ecfdf3',
      borderBottomColor: '#cfeadf',
      minHeight: '44px',
    },
  },
  headCells: {
    style: {
      color: '#3d9970',
      fontWeight: 700,
      fontSize: '0.88rem',
    },
  },
  rows: {
    style: {
      minHeight: '42px',
      fontSize: '0.9rem',
    },
  },
};

const rankStyles = `
  .leader-rank {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-weight: 700;
  }

  .leader-rank i,
  .leader-rank-icon-placeholder {
    width: 1rem;
    min-width: 1rem;
    display: inline-block;
    text-align: center;
  }

  .leader-rank-default {
    color: #0f172a;
  }

  .leader-rank-gold {
    color: #b7791f;
  }

  .leader-rank-silver {
    color: #64748b;
  }

  .leader-rank-bronze {
    color: #9a5b2b;
  }
`;

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [status, setStatus] = useState('Loading leaderboard...');

  async function loadLeaderboard() {
    setStatus('Loading leaderboard...');

    try {
      const result = await getLeaderboard(5);
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

  const tableRows = leaders.map((row, index) => ({
    id: `${row.employee_id || row.name || index}-${index}`,
    rank: index + 1,
    employee: row.name || row.employee_name || row.employee_id || 'Unknown',
    completed: row.completed || row.completed_tasks || 0,
  }));

  return (
    <AdminSectionCard title="Leaderboard (Completed Tasks)">
      <style>{rankStyles}</style>
      <div className="admin-actions-row">
        <button type="button" className="admin-btn" onClick={loadLeaderboard}>Refresh</button>
      </div>
      {status && <p className="admin-message">{status}</p>}
      {leaders.length > 0 && (
        <DataTable
          columns={columns}
          data={tableRows}
          customStyles={tableStyles}
          dense
          noHeader
          pagination={false}
        />
      )}
    </AdminSectionCard>
  );
}

export default Leaderboard;
