const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, config);
  let data = null;

  try {
    data = await response.json();
  } catch {
    // Backend may return an empty body for some status codes.
  }

  if (!response.ok) {
    const error = new Error(data?.detail || data?.message || 'Request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export { API_BASE_URL, request };
