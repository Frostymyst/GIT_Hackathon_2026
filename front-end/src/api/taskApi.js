import { request } from './httpClient';

function getTasks(params = {}) {
  const query = new URLSearchParams();

  if (params.category) {
    query.set('category', params.category);
  }

  const suffix = query.toString() ? `?${query.toString()}` : '';
  return request(`/task/${suffix}`);
}

export { getTasks };
