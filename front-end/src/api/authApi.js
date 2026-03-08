import { request } from './httpClient';

const AUTH_TOKEN_KEY = 'tasklist_auth_token';
const AUTH_EMPLOYEE_KEY = 'tasklist_employee';

function loginUser(payload) {
  const email = encodeURIComponent(payload?.email ?? '');
  const password = encodeURIComponent(payload?.password ?? '');

  return request(`/login?email=${email}&password=${password}`, {
    method: 'PUT',
  });
}

function signupUser(payload) {
  return request('/auth/signup', {
    method: 'POST',
    body: payload,
  });
}

function saveAuthToken(token, rememberMe = true) {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(AUTH_TOKEN_KEY, token);
}

function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
}

function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
}

function saveAuthenticatedEmployee(employee, rememberMe = true) {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(AUTH_EMPLOYEE_KEY, JSON.stringify(employee));
}

function getAuthenticatedEmployee() {
  const raw = localStorage.getItem(AUTH_EMPLOYEE_KEY) || sessionStorage.getItem(AUTH_EMPLOYEE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function clearAuthenticatedEmployee() {
  localStorage.removeItem(AUTH_EMPLOYEE_KEY);
  sessionStorage.removeItem(AUTH_EMPLOYEE_KEY);
}

export {
  AUTH_TOKEN_KEY,
  AUTH_EMPLOYEE_KEY,
  loginUser,
  signupUser,
  saveAuthToken,
  getAuthToken,
  clearAuthToken,
  saveAuthenticatedEmployee,
  getAuthenticatedEmployee,
  clearAuthenticatedEmployee,
};
