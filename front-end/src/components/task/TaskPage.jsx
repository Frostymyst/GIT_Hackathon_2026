import React from 'react';
import TaskForm from './TaskForm';
import Header from '../Header';
import './TaskPage.css';

function TaskPage({ user, onNavigate, onLogout }) {
  return (
    <>
      <Header user={user} onNavigate={onNavigate} onLogout={onLogout} activeView="create-task" />
      <div className="task-page-container">
        <section className="task-page-hero">
          <p className="task-eyebrow">Workflow</p>
          <h1 className="task-page-title">Create New Task</h1>
          <p className="task-page-subtitle">
            Capture issues quickly and route work to the right team with clear priority and due dates.
          </p>
        </section>
        <div className="task-form-wrapper">
          <TaskForm />
        </div>
      </div>
    </>
  );
}

export default TaskPage;
