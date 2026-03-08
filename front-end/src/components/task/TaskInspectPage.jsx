import { useEffect, useMemo, useState } from 'react';
import Header from '../Header';
import { getTaskById, getTaskCategories, updateTaskCategory } from '../../api/taskApi';
import './TaskInspectPage.css';

function handleEmail(event) {
  
}

function formatDate(value) {
  if (!value) {
    return 'Not set';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return String(value);
  }

  return parsed.toLocaleDateString();
}

function TaskInspectPage({ user, taskId, onNavigate, onLogout }) {
  const [task, setTask] = useState(null);
  const [status, setStatus] = useState('Loading task details...');
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [categoryStatus, setCategoryStatus] = useState('');

  useEffect(() => {
    async function loadTask() {
      if (!taskId) {
        setTask(null);
        setStatus('No task selected.');
        return;
      }

      setStatus('Loading task details...');
      try {
        const response = await getTaskById(taskId);
        const nextTask = response?.task || null;
        setTask(nextTask);
        setStatus(nextTask ? '' : 'Task not found.');
        setSelectedCategory(nextTask?.categories || '');
      } catch (error) {
        setTask(null);
        setStatus(error.message || 'Unable to load task details.');
      }
    }

    loadTask();
  }, [taskId]);

  useEffect(() => {
    async function loadCategoryOptions() {
      try {
        const response = await getTaskCategories();
        const normalized = (response?.categories || [])
          .map((row) => row?.cname)
          .filter(Boolean);
        setCategoryOptions(normalized);
      } catch {
        setCategoryOptions([]);
      }
    }

    loadCategoryOptions();
  }, []);

  const taskTitle = useMemo(() => {
    if (!task) {
      return 'Task Details';
    }

    return task.name || `Task #${task.tno || taskId}`;
  }, [task, taskId]);

  async function handleCategorySave(event) {
    event.preventDefault();
    if (!task?.tno || !selectedCategory) {
      return;
    }

    setIsSavingCategory(true);
    setCategoryStatus('');
    try {
      const response = await updateTaskCategory(task.tno, selectedCategory);
      const nextCategory = response?.category || selectedCategory;
      setTask((prev) => (prev ? { ...prev, categories: nextCategory } : prev));
      setSelectedCategory(nextCategory);
      setCategoryStatus('Category updated.');
      setIsCategoryMenuOpen(false);
    } catch (error) {
      setCategoryStatus(error.message || 'Unable to update category.');
    } finally {
      setIsSavingCategory(false);
    }
  }

  function handleCategoryCancel() {
    setSelectedCategory(task?.categories || '');
    setCategoryStatus('');
    setIsCategoryMenuOpen(false);
  }

  return (
    <div className="task-inspect-page">
      <Header user={user} onNavigate={onNavigate} onLogout={onLogout} activeView="main" />
      <main className="task-inspect-main">
        <section className="task-inspect-hero">
          <p className="task-inspect-eyebrow">Inspector</p>
          <h1 className="task-inspect-title">{taskTitle}</h1>
          <p className="task-inspect-subtitle">Review complete task information and due date details.</p>
        </section>

        <section className="task-inspect-card">
          <div className="task-inspect-actions">
            <button type="button" className="task-inspect-back-btn" onClick={() => onNavigate('main')}>
              <i className="fa-solid fa-arrow-left" aria-hidden="true" />
              <span>Back to Task List</span>
            </button>
          </div>

          {status && <p className="task-inspect-message">{status}</p>}

          {!status && task && (
            <div className="task-inspect-grid">
              <div className="task-inspect-item">
                <span className="task-inspect-label">Task ID</span>
                <span className="task-inspect-value">{task.tno || '-'}</span>
              </div>
              <div className="task-inspect-item">
                <span className="task-inspect-label">Status</span>
                <span className="task-inspect-value">{task.status || 'new'}</span>
              </div>
              <div className="task-inspect-item">
                <span className="task-inspect-label">Category</span>
                <div className="task-inspect-category-row">
                  <span className="task-inspect-value">{task.categories || 'Uncategorized'}</span>
                  <div className="task-inspect-category-actions">
                    <button
                      type="button"
                      className="task-inspect-category-btn"
                      onClick={() => {
                        setCategoryStatus('');
                        setIsCategoryMenuOpen((open) => !open);
                      }}
                    >
                      Change
                    </button>
                    {isCategoryMenuOpen && (
                      <form className="task-inspect-category-menu" onSubmit={handleCategorySave}>
                        <select
                          className="task-inspect-category-select"
                          value={selectedCategory}
                          onChange={(event) => setSelectedCategory(event.target.value)}
                          disabled={isSavingCategory}
                        >
                          <option value="">Select category</option>
                          {categoryOptions.map((categoryName) => (
                            <option key={categoryName} value={categoryName}>{categoryName}</option>
                          ))}
                        </select>
                        <div className="task-inspect-category-menu-actions">
                          <button
                            type="submit"
                            className="task-inspect-category-btn"
                            disabled={!selectedCategory || isSavingCategory}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="task-inspect-category-btn"
                            onClick={handleCategoryCancel}
                            disabled={isSavingCategory}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
                {categoryStatus && <span className="task-inspect-inline-message">{categoryStatus}</span>}
              </div>
              <div className="task-inspect-item">
                <span className="task-inspect-label">Due Date</span>
                <span className="task-inspect-value">{formatDate(task.due_date)}</span>
              </div>
              <div className="task-inspect-item task-inspect-item-wide">
                <span className="task-inspect-label">Summary</span>
                <span className="task-inspect-value">{task.summary || 'No summary available.'}</span>
              </div>
              <div className="task-inspect-item task-inspect-item-wide">
                <span className="task-inspect-label">Description</span>
                <span className="task-inspect-value">{task.description || 'No description available.'}</span>
              </div>
              <form className='task-inspect-item task-inspect-item-wide' onSubmit={handleEmail}>
                <span className="task-inspect-label">Reply to Customer</span>
                <textarea className='task-email-area' placeholder='Dear Mr/Ms/Mrs/Mx...'>
                </textarea>
                <button type='submit' className='EmailSend'>Send</button>
              </form>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default TaskInspectPage;
