import { useState } from 'react';
import { searchEmployees } from '../../api/adminApi';
import AdminSectionCard from './AdminSectionCard';

function EmployeeLookup() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('Search by employee name or ID.');
  const [isSearching, setIsSearching] = useState(false);

  async function handleSearch(event) {
    event.preventDefault();

    if (!query.trim()) {
      setStatus('Enter a name or ID to search.');
      setResults([]);
      return;
    }

    setIsSearching(true);
    setStatus('Searching...');

    try {
      const response = await searchEmployees(query.trim());
      const rows = response?.employees || response?.results || [];
      setResults(Array.isArray(rows) ? rows : []);
      setStatus(rows.length ? '' : 'No matching employees found.');
    } catch (error) {
      setResults([]);
      setStatus(error.message || 'Unable to search employees.');
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <AdminSectionCard title="Employee Lookup">
      <form onSubmit={handleSearch} className="admin-form-row">
        <input
          type="text"
          className="admin-input"
          placeholder="Search by employee name or ID"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button type="submit" className="admin-btn" disabled={isSearching}>
          Search
        </button>
      </form>
      {status && <p className="admin-message">{status}</p>}
      {results.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {results.map((employee) => (
              <tr key={employee.eno || employee.id || employee.employee_id || employee.email}>
                <td>{employee.eno || employee.id || employee.employee_id || '-'}</td>
                <td>{employee.name || employee.ename || '-'}</td>
                <td>{employee.email || '-'}</td>
                <td>{employee.department || employee.dname || employee.dno || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminSectionCard>
  );
}

export default EmployeeLookup;
