import React from 'react';

function TaskFormFooter() {
  return (
    <div className="task-form-footer">
      <button type="submit" className="task-submit-btn">
        <i className="fa-solid fa-paper-plane" aria-hidden="true" />
        <span>Create Task</span>
      </button>
    </div>
  );
}

export default TaskFormFooter;
