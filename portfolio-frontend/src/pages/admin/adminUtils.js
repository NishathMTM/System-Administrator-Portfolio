export function errorMessage(error, fallback) {
  const errors = error?.response?.data?.errors;
  if (errors) return Object.values(errors).flat().join(' ');
  if (error?.response?.status === 401) return 'Your session has expired. Please sign in again.';
  return error?.response?.data?.message || fallback;
}

export function splitList(value) {
  return value.split(',').map(item => item.trim()).filter(Boolean);
}
