const API = 'http://localhost:8080/api/v1';

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Error en la petición');
  }

  return res.status === 204 ? null : res.json();
}