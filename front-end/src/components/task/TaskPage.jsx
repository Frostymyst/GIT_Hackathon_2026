import React from 'react';
import TaskForm from './TaskForm';
import './TaskPage.css';

function TaskPage() {
  return (
    <div className="task-page-container">
      <div className="task-form-wrapper">
        <TaskForm />
      </div>
    </div>
  );
}

export default TaskPage;
