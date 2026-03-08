import { request } from './httpClient';

function getTasks(params = {}) {
  const query = new URLSearchParams();

  if (params.category) {
    query.set('category', params.category);
  }

  const suffix = query.toString() ? `?${query.toString()}` : '';
  return request(`/task/${suffix}`);
}

function getTasksByEmployee(employeeId) {
  return request(`/task/email/${employeeId}`);
}

function getTaskById(taskId) {
  return request(`/task/${taskId}`);
}

function createTask(payload) {
  return request('/task/', {
    method: 'POST',
    body: {
      email: payload?.email || null,
      description: payload?.description || '',
      due_date: payload?.due_date ?? null,
    },
  });
}

function assignTask(taskId, employeeId = null) {
  const hasEmployeeId = employeeId !== null && employeeId !== undefined && employeeId !== '';
  const suffix = hasEmployeeId ? `?employee_id=${encodeURIComponent(employeeId)}` : '';

  return request(`/task/${taskId}/assign${suffix}`, {
    method: 'PATCH',
  });
}

export { getTasks, getTasksByEmployee, getTaskById, createTask, assignTask };
