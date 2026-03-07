import React from 'react';

function TaskSelect({ label, id, options, ...props }) {
  return (
    <div className="task-input-group">
      <label htmlFor={id} className="task-label">{label}</label>
      <select id={id} className="task-input" {...props}>
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

export default TaskSelect;
