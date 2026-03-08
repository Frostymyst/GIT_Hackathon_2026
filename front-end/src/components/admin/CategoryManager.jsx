import { useState } from 'react';
import { createCategory, deleteCategory } from '../../api/adminApi';
import AdminSectionCard from './AdminSectionCard';

function CategoryManager() {
  const [categoryName, setCategoryName] = useState('');
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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
    } catch (error) {
      setStatus(error.message || 'Unable to create category.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteCategory() {
    if (!categoryName.trim()) {
      setStatus('Enter a category to delete.');
      return;
    }

    setIsSaving(true);
    setStatus('');

    try {
      await deleteCategory(categoryName.trim());
      setStatus(`Category \"${categoryName.trim()}\" deleted.`);
      setCategoryName('');
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
      {status && <p className="admin-message">{status}</p>}
    </AdminSectionCard>
  );
}

export default CategoryManager;
