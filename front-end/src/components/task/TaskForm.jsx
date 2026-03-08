import React, { useState } from 'react';
import TaskInput from './TaskInput';
import TaskTextarea from './TaskTextarea';
import TaskSelect from './TaskSelect';
import TaskFormFooter from './TaskFormFooter';
import { createTask } from '../../api/taskApi';
import './TaskForm.css';

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const categoryOptions = [
  { value: 'hr', label: 'HR' },
  { value: 'customer-support', label: 'Customer Support' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'it', label: 'IT' },
  { value: 'sales', label: 'Sales' },
  { value: 'other', label: 'Other' },
];

// This would be fetched from backend in real app
const teamMembers = [
  { value: 'unassigned', label: 'Unassigned' },
  { value: 'alice', label: 'Alice Smith' },
  { value: 'bob', label: 'Bob Johnson' },
  { value: 'carol', label: 'Carol Lee' },
];

function TaskForm() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    contact: '',
    priority: '',
    assignedTo: '',
    dueDate: '',
    category: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

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
      const normalizedDescription = form.title.trim()
        ? `${form.title.trim()}\n\n${form.description.trim()}`
        : form.description.trim();

      const response = await createTask({
        email: form.contact.trim() || null,
        description: normalizedDescription,
        due_date: dueTimestamp,
      });

      setFormSuccess(`Task created successfully (ID: ${response?.task_id ?? 'new'}).`);
      setForm({
        title: '',
        description: '',
        contact: '',
        priority: '',
        assignedTo: '',
        dueDate: '',
        category: '',
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
          options={teamMembers}
          value={form.assignedTo}
          onChange={handleChange}
          required
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
        label="Category / Department"
        id="category"
        options={categoryOptions}
        value={form.category}
        onChange={handleChange}
        required
      />
      <TaskFormFooter isSubmitting={isSubmitting} />
    </form>
  );
}

export default TaskForm;
