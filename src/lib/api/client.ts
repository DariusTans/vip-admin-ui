export interface ApiResponse<T> {
  data: T
  message?: string
  status: 'success' | 'error'
}

// Base client — swap implementation to connect real Frappe API later
export async function apiGet<T>(endpoint: string): Promise<ApiResponse<T>> {
  // TODO: replace with real Frappe REST call: GET /api/resource/<doctype>
  throw new Error(`apiGet(${endpoint}) — no real API connected yet, use mock data`)
}

export async function apiPost<T>(endpoint: string, _body: unknown): Promise<ApiResponse<T>> {
  // TODO: replace with real Frappe REST call: POST /api/resource/<doctype>
  throw new Error(`apiPost(${endpoint}) — no real API connected yet, use mock data`)
}
