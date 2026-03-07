import React from 'react';

function TaskTextarea({ label, id, placeholder, ...props }) {
  return (
    <div className="task-input-group">
      <label htmlFor={id} className="task-label">{label}</label>
      <textarea
        id={id}
        className="task-input task-textarea"
        placeholder={placeholder}
        rows={4}
        {...props}
      />
    </div>
  );
}

export default TaskTextarea;
