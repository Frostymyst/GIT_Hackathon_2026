import React, { useState } from 'react';
import CompanyInput from './CompanyInput';
import CompanySelect from './CompanySelect';
import CompanyFormFooter from './CompanyFormFooter';
import './CompanyForm.css';

const companySizeOptions = [
  { value: '1-10', label: '1-10' },
  { value: '11-50', label: '11-50' },
  { value: '51-200', label: '51-200' },
  { value: '201-500', label: '201-500' },
  { value: '501-1000', label: '501-1000' },
  { value: '1000+', label: '1000+' },
];

const industryOptions = [
  { value: 'hr', label: 'Human Resources' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'retail', label: 'Retail' },
  { value: 'it', label: 'IT' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'other', label: 'Other' },
];

function CompanyForm() {
  // Add more fields as needed
  const [form, setForm] = useState({
    companyName: '',
    companySize: '',
    industry: '',
    country: '',
    website: '',
    contactEmail: '',
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.id]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: Add validation and backend integration
    alert('Company created!');
  }

  return (
    <form className="company-form" onSubmit={handleSubmit}>
      <CompanyInput
        label="Company Name"
        id="companyName"
        placeholder="Please enter company name"
        value={form.companyName}
        onChange={handleChange}
        required
      />
      <CompanySelect
        label="Company Size"
        id="companySize"
        options={companySizeOptions}
        value={form.companySize}
        onChange={handleChange}
        required
      />
      <CompanySelect
        label="Industry"
        id="industry"
        options={industryOptions}
        value={form.industry}
        onChange={handleChange}
        required
      />
      <CompanyInput
        label="Country"
        id="country"
        placeholder="Please enter a country"
        value={form.country}
        onChange={handleChange}
        required
      />
      <CompanyInput
        label="Website"
        id="website"
        placeholder="https://example.com"
        value={form.website}
        onChange={handleChange}
        type="url"
      />
      <CompanyInput
        label="Contact Email"
        id="contactEmail"
        placeholder="contact@email.com"
        value={form.contactEmail}
        onChange={handleChange}
        type="email"
      />
      <CompanyFormFooter />
    </form>
  );
}

export default CompanyForm;
