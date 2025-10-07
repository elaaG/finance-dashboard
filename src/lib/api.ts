const API_BASE = '/api'

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Transactions API
export const transactionsApi = {
  getAll: (filters?: { type?: string; category?: string }) => 
    apiFetch(`/transactions?${new URLSearchParams(filters as any)}`),
  
  create: (data: any) => 
    apiFetch('/transactions', { method: 'POST', body: JSON.stringify(data) }),
  
  update: (id: string, data: any) => 
    apiFetch(`/transactions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  
  delete: (id: string) => 
    apiFetch(`/transactions/${id}`, { method: 'DELETE' }),
}

// Budgets API
export const budgetsApi = {
  getAll: () => apiFetch('/budgets'),
  create: (data: any) => 
    apiFetch('/budgets', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id: string) => 
    apiFetch(`/budgets/${id}`, { method: 'DELETE' }),
}

// Investments API
export const investmentsApi = {
  getAll: () => apiFetch('/investments'),
  create: (data: any) => 
    apiFetch('/investments', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id: string) => 
    apiFetch(`/investments/${id}`, { method: 'DELETE' }),
}