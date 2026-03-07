import { request } from './httpClient';

const AUTH_TOKEN_KEY = 'tasklist_auth_token';

function loginUser(payload) {
  return request('/auth/login', {
    method: 'POST',
    body: payload,
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

export {
  AUTH_TOKEN_KEY,
  loginUser,
  signupUser,
  saveAuthToken,
  getAuthToken,
  clearAuthToken,
};
