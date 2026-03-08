import React, { useEffect, useState } from 'react';
import TaskInput from './TaskInput';
import TaskTextarea from './TaskTextarea';
import TaskSelect from './TaskSelect';
import TaskFormFooter from './TaskFormFooter';
import { assignTask, createTask } from '../../api/taskApi';
import { getDepartments, searchEmployees } from '../../api/adminApi';
import './TaskForm.css';

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

function TaskForm() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    contact: '',
    priority: '',
    assignedTo: '',
    dueDate: '',
    department: '',
  });
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [teamMemberOptions, setTeamMemberOptions] = useState([
    { value: '', label: 'Unassigned' },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    async function loadDepartments() {
      try {
        const response = await getDepartments();
        const rows = Array.isArray(response?.departments) ? response.departments : [];
        const options = rows.map((dept) => ({
          value: String(dept.dno ?? dept.id ?? dept.name ?? dept.dname ?? ''),
          label: dept.dname ?? dept.name ?? `Department ${dept.dno ?? dept.id ?? ''}`,
        })).filter((option) => option.value && option.label);

        setDepartmentOptions(options);
      } catch {
        setDepartmentOptions([]);
      }
    }

    loadDepartments();
  }, []);

  useEffect(() => {
    async function loadTeamMembers() {
      try {
        const response = await searchEmployees('');
        const rows = Array.isArray(response?.employees) ? response.employees : [];
        const options = rows
          .map((employee) => {
            const id = employee?.eno ?? employee?.id;
            const name = employee?.ename ?? employee?.name;
            if (id === undefined || id === null || !name) {
              return null;
            }
            return { value: String(id), label: name };
          })
          .filter(Boolean);

        setTeamMemberOptions([{ value: '', label: 'Unassigned' }, ...options]);
      } catch {
        setTeamMemberOptions([{ value: '', label: 'Unassigned' }]);
      }
    }

    loadTeamMembers();
  }, []);

  function handleChange(e) {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setFormError('');
    setFormSuccess('');

    if (!form.description.trim()) {
      setFormError('Task description is required.');
      return;
    }

    let dueTimestamp = null;
    if (form.dueDate) {
      const dueDate = new Date(`${form.dueDate}T00:00:00`);
      if (Number.isNaN(dueDate.getTime())) {
        setFormError('Due date is invalid.');
        return;
      }
      dueTimestamp = Math.floor(dueDate.getTime() / 1000);
    }

    setIsSubmitting(true);

    try {
      const selectedDepartment = departmentOptions.find((option) => option.value === form.department);
      const departmentLine = selectedDepartment ? `\n\nDepartment: ${selectedDepartment.label}` : '';
      const normalizedDescription = form.title.trim()
        ? `${form.title.trim()}\n\n${form.description.trim()}${departmentLine}`
        : `${form.description.trim()}${departmentLine}`;

      const response = await createTask({
        email: form.contact.trim() || null,
        description: normalizedDescription,
        due_date: dueTimestamp,
      });

      const createdTaskId = response?.task_id;
      if (createdTaskId && form.assignedTo) {
        await assignTask(createdTaskId, Number(form.assignedTo));
      }

      setFormSuccess(`Task created successfully (ID: ${createdTaskId ?? 'new'}).`);
      setForm({
        title: '',
        description: '',
        contact: '',
        priority: '',
        assignedTo: '',
        dueDate: '',
        department: '',
      });
    } catch (error) {
      setFormError(error.message || 'Unable to create task right now.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      {formError && <p className="task-form-message task-form-message-error">{formError}</p>}
      {formSuccess && <p className="task-form-message task-form-message-success">{formSuccess}</p>}

      <TaskInput
        label="Task Title"
        id="title"
        placeholder="Enter a short title for the task"
        value={form.title}
        onChange={handleChange}
        required
      />
      <TaskTextarea
        label="Task Description"
        id="description"
        placeholder="Describe the task, problem, or request"
        value={form.description}
        onChange={handleChange}
        required
      />

      <div className="task-form-grid">
        <TaskInput
          label="Related Contact Email (Optional)"
          id="contact"
          type="email"
          placeholder="Enter email if this task relates to a person"
          value={form.contact}
          onChange={handleChange}
        />
        <TaskSelect
          label="Priority"
          id="priority"
          options={priorityOptions}
          value={form.priority}
          onChange={handleChange}
          required
        />
      </div>

      <div className="task-form-grid">
        <TaskSelect
          label="Assigned To"
          id="assignedTo"
          options={teamMemberOptions}
          value={form.assignedTo}
          onChange={handleChange}
        />
        <TaskInput
          label="Due Date"
          id="dueDate"
          type="date"
          value={form.dueDate}
          onChange={handleChange}
          required
        />
      </div>

      <TaskSelect
        label="Department"
        id="department"
        options={departmentOptions}
        value={form.department}
        onChange={handleChange}
        required
      />
      <TaskFormFooter isSubmitting={isSubmitting} />
    </form>
  );
}

export default TaskForm;
