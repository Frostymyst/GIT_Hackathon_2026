import React from 'react';

function CompanyInput({ label, id, type = 'text', placeholder, ...props }) {
  return (
    <div className="company-input-group">
      <label htmlFor={id} className="company-label">{label}</label>
      <input
        id={id}
        type={type}
        className="company-input"
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
}

export default CompanyInput;
