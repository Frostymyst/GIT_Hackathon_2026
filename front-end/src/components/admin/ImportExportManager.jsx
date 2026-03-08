import { useRef, useState } from 'react';
import { exportAdminData, importAdminData } from '../../api/adminApi';
import AdminSectionCard from './AdminSectionCard';

function ImportExportManager() {
  const fileInputRef = useRef(null);
  const [status, setStatus] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  function buildExportFileName() {
    const now = new Date();
    const stamp = now.toISOString().replace(/[:.]/g, '-');
    return `admin-export-${stamp}.json`;
  }

  async function handleExport() {
    setIsBusy(true);
    setStatus('');

    try {
      const payload = await exportAdminData();
      const json = JSON.stringify(payload, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = buildExportFileName();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setStatus('Export complete. JSON file downloaded.');
    } catch (error) {
      setStatus(error.message || 'Unable to export admin data.');
    } finally {
      setIsBusy(false);
    }
  }

  function triggerImportPicker() {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  }

  async function handleImportFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setIsBusy(true);
    setStatus('');

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const response = await importAdminData(parsed);
      const imported = response?.imported || {};

      setStatus(
        `Import complete. Categories: ${imported.categories ?? 0}, Departments: ${imported.departments ?? 0}, Dept mappings: ${imported.dept_categories ?? 0}.`
      );
    } catch (error) {
      if (error instanceof SyntaxError) {
        setStatus('Invalid JSON file. Please choose a valid export file.');
      } else {
        setStatus(error.message || 'Unable to import admin data.');
      }
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <AdminSectionCard title="Import / Export">
      <div className="admin-actions-row">
        <button type="button" className="admin-btn" onClick={handleExport} disabled={isBusy}>
          <i className="fa-solid fa-file-arrow-down" aria-hidden="true" />
          <span>Export JSON</span>
        </button>

        <button type="button" className="admin-btn admin-btn-alt" onClick={triggerImportPicker} disabled={isBusy}>
          <i className="fa-solid fa-file-arrow-up" aria-hidden="true" />
          <span>Import JSON</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="admin-file-input-hidden"
          onChange={handleImportFileChange}
        />
      </div>

      <p className="admin-message">
        Import expects JSON from the Export button format.
      </p>

      {status && <p className="admin-message">{status}</p>}
    </AdminSectionCard>
  );
}

export default ImportExportManager;
