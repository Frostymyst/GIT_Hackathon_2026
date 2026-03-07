import React from 'react';

function TaskInput({ label, id, type = 'text', placeholder, ...props }) {
  return (
    <div className="task-input-group">
      <label htmlFor={id} className="task-label">{label}</label>
      <input
        id={id}
        type={type}
        className="task-input"
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
}

export default TaskInput;
