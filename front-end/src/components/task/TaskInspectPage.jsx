import { useEffect, useMemo, useState } from 'react';
import Header from '../Header';
import { getTaskById } from '../../api/taskApi';
import './TaskInspectPage.css';

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
        setTask(response?.task || null);
        setStatus(response?.task ? '' : 'Task not found.');
      } catch (error) {
        setTask(null);
        setStatus(error.message || 'Unable to load task details.');
      }
    }

    loadTask();
  }, [taskId]);

  const taskTitle = useMemo(() => {
    if (!task) {
      return 'Task Details';
    }

    return task.name || `Task #${task.tno || taskId}`;
  }, [task, taskId]);

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
                <span className="task-inspect-value">{task.categories || 'Uncategorized'}</span>
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
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default TaskInspectPage;
