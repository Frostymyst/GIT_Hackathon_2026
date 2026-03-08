import React, { useState } from 'react';
import TaskInput from './TaskInput';
import TaskTextarea from './TaskTextarea';
import TaskSelect from './TaskSelect';
import TaskFormFooter from './TaskFormFooter';
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

  function handleChange(e) {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: Add validation and backend integration
    alert('Task created!');
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
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
      <TaskFormFooter />
    </form>
  );
}

export default TaskForm;
