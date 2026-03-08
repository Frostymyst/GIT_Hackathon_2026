import { useEffect, useState } from 'react';
import { createCategory, deleteCategory, getCategories } from '../../api/adminApi';
import AdminSectionCard from './AdminSectionCard';

function CategoryManager() {
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function loadCategories() {
    try {
      const response = await getCategories();
      const rows = response?.categories || response?.rows || [];
      setCategories(Array.isArray(rows) ? rows : []);
    } catch {
      setCategories([]);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleCreateCategory(event) {
    event.preventDefault();
    if (!categoryName.trim()) {
      setStatus('Please enter a category name.');
      return;
    }

    setIsSaving(true);
    setStatus('');

    try {
      await createCategory(categoryName.trim());
      setStatus(`Category \"${categoryName.trim()}\" created.`);
      setCategoryName('');
      loadCategories();
    } catch (error) {
      setStatus(error.message || 'Unable to create category.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteCategory() {
    const deleteTarget = selectedCategory || categoryName.trim();

    if (!deleteTarget) {
      setStatus('Enter a category to delete.');
      return;
    }

    setIsSaving(true);
    setStatus('');

    try {
      await deleteCategory(deleteTarget);
      setStatus(`Category \"${deleteTarget}\" deleted.`);
      setCategoryName('');
      setSelectedCategory('');
      loadCategories();
    } catch (error) {
      setStatus(error.message || 'Unable to delete category.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AdminSectionCard title="Category Management">
      <form onSubmit={handleCreateCategory} className="admin-form-row">
        <input
          type="text"
          value={categoryName}
          onChange={(event) => setCategoryName(event.target.value)}
          placeholder="Add or delete a task category"
          className="admin-input"
        />
        <button type="submit" className="admin-btn" disabled={isSaving}>
          Add
        </button>
        <button type="button" className="admin-btn admin-btn-alt" onClick={handleDeleteCategory} disabled={isSaving}>
          Delete
        </button>
      </form>

      <div className="admin-form-row">
        <select
          className="admin-input"
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
        >
          <option value="">Select category to delete</option>
          {categories.map((category) => {
            const name = category.cname || category.name || category;
            return (
              <option key={name} value={name}>
                {name}
              </option>
            );
          })}
        </select>
        <button type="button" className="admin-btn" onClick={loadCategories} disabled={isSaving}>
          Refresh
        </button>
      </div>

      {status && <p className="admin-message">{status}</p>}

      {categories.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => {
              const name = category.cname || category.name || category;
              return (
                <tr key={name}>
                  <td>{name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </AdminSectionCard>
  );
}

export default CategoryManager;
