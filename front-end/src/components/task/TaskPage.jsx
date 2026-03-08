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
          <p className="task-eyebrow">
            <i className="fa-solid fa-diagram-project" aria-hidden="true" />
            <span>Workflow</span>
          </p>
          <h1 className="task-page-title">
            <i className="fa-solid fa-clipboard-check" aria-hidden="true" />
            <span>Create New Task</span>
          </h1>
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
