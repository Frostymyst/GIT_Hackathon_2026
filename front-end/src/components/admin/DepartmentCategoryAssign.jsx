import { useEffect, useState } from 'react';
import {
  assignCategoryToDepartment,
  getDepartments,
  getTaskCategories,
  removeCategoryFromDepartment,
} from '../../api/adminApi';
import AdminSectionCard from './AdminSectionCard';

function DepartmentCategoryAssign() {
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [departmentId, setDepartmentId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [status, setStatus] = useState('');

  async function loadOptions() {
    try {
      const [deptResponse, categoryResponse] = await Promise.all([
        getDepartments().catch(() => ({ departments: [] })),
        getTaskCategories().catch(() => ({ categories: [] })),
      ]);

      setDepartments(deptResponse?.departments || deptResponse?.rows || []);
      setCategories(categoryResponse?.categories || categoryResponse?.rows || []);
    } catch {
      setDepartments([]);
      setCategories([]);
    }
  }

  useEffect(() => {
    loadOptions();
  }, []);

  async function handleAssign() {
    if (!departmentId || !categoryName) {
      setStatus('Select a department and category first.');
      return;
    }

    try {
      await assignCategoryToDepartment(departmentId, categoryName);
      setStatus('Category assigned to department.');
    } catch (error) {
      setStatus(error.message || 'Unable to assign category.');
    }
  }

  async function handleRemove() {
    if (!departmentId || !categoryName) {
      setStatus('Select a department and category first.');
      return;
    }

    try {
      await removeCategoryFromDepartment(departmentId, categoryName);
      setStatus('Category removed from department.');
    } catch (error) {
      setStatus(error.message || 'Unable to remove category assignment.');
    }
  }

  return (
    <AdminSectionCard title="Assign Categories to Departments">
      <div className="admin-form-grid">
        <select className="admin-input" value={departmentId} onChange={(event) => setDepartmentId(event.target.value)}>
          <option value="">Select department</option>
          {departments.map((dept) => (
            <option key={dept.id || dept.dno || dept.name} value={dept.id || dept.dno}>
              {dept.name || dept.dname || `Department ${dept.id || dept.dno}`}
            </option>
          ))}
        </select>

        <select className="admin-input" value={categoryName} onChange={(event) => setCategoryName(event.target.value)}>
          <option value="">Select category</option>
          {categories.map((category) => {
            const name = category.cname || category.name || category;
            return (
              <option key={name} value={name}>
                {name}
              </option>
            );
          })}
        </select>
      </div>
      <div className="admin-actions-row">
        <button type="button" className="admin-btn" onClick={handleAssign}>Assign</button>
        <button type="button" className="admin-btn admin-btn-alt" onClick={handleRemove}>Remove</button>
      </div>
      {status && <p className="admin-message">{status}</p>}
    </AdminSectionCard>
  );
}

export default DepartmentCategoryAssign;
