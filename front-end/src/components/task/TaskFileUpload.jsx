import React from 'react';

function TaskFileUpload({ label, id, ...props }) {
  return (
    <div className="task-input-group">
      <label htmlFor={id} className="task-label">{label}</label>
      <input
        id={id}
        type="file"
        className="task-input"
        multiple
        {...props}
      />
    </div>
  );
}

export default TaskFileUpload;
