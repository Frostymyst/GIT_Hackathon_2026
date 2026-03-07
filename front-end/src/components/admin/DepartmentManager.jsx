import { useEffect, useState } from 'react';
import { createDepartment, getDepartments, updateDepartment } from '../../api/adminApi';
import AdminSectionCard from './AdminSectionCard';

function DepartmentManager() {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState('');
  const [status, setStatus] = useState('');

  async function loadDepartments() {
    try {
      const result = await getDepartments();
      setDepartments(result?.departments || result?.rows || []);
      setStatus('');
    } catch (error) {
      setDepartments([]);
      setStatus(error.message || 'Unable to load departments.');
    }
  }

  useEffect(() => {
    loadDepartments();
  }, []);

  async function handleAddDepartment(event) {
    event.preventDefault();

    if (!name.trim()) {
      setStatus('Please enter a department name.');
      return;
    }

    try {
      await createDepartment({ name: name.trim() });
      setStatus('Department added.');
      setName('');
      loadDepartments();
    } catch (error) {
      setStatus(error.message || 'Unable to add department.');
    }
  }

  async function handleUpdateDepartment() {
    if (!editId || !name.trim()) {
      setStatus('Select a department and enter a new name.');
      return;
    }

    try {
      await updateDepartment(editId, { name: name.trim() });
      setStatus('Department updated.');
      setName('');
      setEditId('');
      loadDepartments();
    } catch (error) {
      setStatus(error.message || 'Unable to update department.');
    }
  }

  return (
    <AdminSectionCard title="Department Management">
      <form onSubmit={handleAddDepartment} className="admin-form-row">
        <input
          type="text"
          className="admin-input"
          placeholder="Department name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <button type="submit" className="admin-btn">Add</button>
      </form>

      <div className="admin-form-row">
        <select className="admin-input" value={editId} onChange={(event) => setEditId(event.target.value)}>
          <option value="">Select department to update</option>
          {departments.map((dept) => (
            <option key={dept.id || dept.dno || dept.name} value={dept.id || dept.dno}>
              {dept.name || dept.dname || `Department ${dept.id || dept.dno}`}
            </option>
          ))}
        </select>
        <button type="button" className="admin-btn admin-btn-alt" onClick={handleUpdateDepartment}>
          Update Name
        </button>
      </div>

      <div className="admin-actions-row">
        <button type="button" className="admin-btn" onClick={loadDepartments}>Reload Departments</button>
      </div>

      {status && <p className="admin-message">{status}</p>}

      {departments.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id || dept.dno || dept.name}>
                <td>{dept.id || dept.dno || '-'}</td>
                <td>{dept.name || dept.dname || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminSectionCard>
  );
}

export default DepartmentManager;
