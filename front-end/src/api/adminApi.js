import { request } from './httpClient';

function createCategory(cname) {
  return request('/admin/categories', {
    method: 'POST',
    body: { cname },
  });
}

function deleteCategory(cname) {
  return request(`/admin/categories/${encodeURIComponent(cname)}`, {
    method: 'DELETE',
  });
}

function getLeaderboard(limit = 20) {
  return request(`/admin/leaderboard?limit=${limit}`);
}

function searchEmployees(query) {
  return request(`/employee/search?query=${encodeURIComponent(query)}`);
}

function getDepartments() {
  return request('/admin/departments');
}

function createDepartment(payload) {
  return request('/admin/departments', {
    method: 'POST',
    body: {
      dname: payload?.dname ?? payload?.name ?? '',
    },
  });
}

function deleteDepartment(dname) {
  return request(`/admin/departments/${encodeURIComponent(dname)}`, {
    method: 'DELETE',
  });
}

function updateDepartment(departmentId, payload) {
  return request(`/admin/departments/${departmentId}`, {
    method: 'PATCH',
    body: payload,
  });
}

function assignCategoryToDepartment(departmentId, cname) {
  return request(`/admin/departments/${departmentId}/categories`, {
    method: 'POST',
    body: { cname },
  });
}

function removeCategoryFromDepartment(departmentId, cname) {
  return request(`/admin/departments/${departmentId}/categories/${encodeURIComponent(cname)}`, {
    method: 'DELETE',
  });
}

function getTaskCategories() {
  return request('/admin/categories');
}

export {
  createCategory,
  deleteCategory,
  getLeaderboard,
  searchEmployees,
  getDepartments,
  createDepartment,
  deleteDepartment,
  updateDepartment,
  assignCategoryToDepartment,
  removeCategoryFromDepartment,
  getTaskCategories,
};
