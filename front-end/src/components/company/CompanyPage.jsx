import React from 'react';
import CompanyForm from './CompanyForm';
import './CompanyPage.css';

function CompanyPage() {
  return (
    <div className="company-page-container">
      <div className="company-form-wrapper">
        <CompanyForm />
      </div>
    </div>
  );
}

export default CompanyPage;
