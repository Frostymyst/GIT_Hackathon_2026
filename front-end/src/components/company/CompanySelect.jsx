import React from 'react';

function CompanySelect({ label, id, options, ...props }) {
  return (
    <div className="company-input-group">
      <label htmlFor={id} className="company-label">{label}</label>
      <select id={id} className="company-input" {...props}>
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

export default CompanySelect;
