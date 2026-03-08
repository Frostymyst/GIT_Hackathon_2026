import React from 'react';

function TaskFormFooter({ isSubmitting = false }) {
  return (
    <div className="task-form-footer">
      <button type="submit" className="task-submit-btn" disabled={isSubmitting}>
        <i className="fa-solid fa-paper-plane" aria-hidden="true" />
        <span>{isSubmitting ? 'Creating Task...' : 'Create Task'}</span>
      </button>
    </div>
  );
}

export default TaskFormFooter;
