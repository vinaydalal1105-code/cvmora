const API = '/api'

function getToken(): string | null {
  return localStorage.getItem('cvmora_token')
}

export async function api<T>(
  path: string,
  options: Omit<RequestInit, 'body'> & { body?: object } = {}
): Promise<T> {
  const { body, ...rest } = options
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  const token = getToken()
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`

  const res = await fetch(API + path, {
    ...rest,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error((data as { error?: string }).error || res.statusText)
  return data as T
}

/** Parsed resume structure returned by the server when parsing PDF/Word */
export interface ParsedResumeData {
  contact?: Partial<{
    fullName: string
    email: string
    phone: string
    location: string
    address: string
    city: string
    state: string
    country: string
    website: string
    linkedin: string
  }>
  summary?: string
  experience?: Array<{
    id: string
    jobTitle: string
    company: string
    location: string
    startDate: string
    endDate: string
    current: boolean
    description: string
  }>
  education?: Array<{
    id: string
    degree: string
    school: string
    location: string
    startDate: string
    endDate: string
    description: string
  }>
  skills?: string[]
}

export async function apiUploadResume(
  file: File
): Promise<{ text: string; pages?: number; data?: ParsedResumeData | null }> {
  const form = new FormData()
  form.append('file', file)
  let res: Response
  try {
    res = await fetch(API + '/upload/resume', {
      method: 'POST',
      body: form,
    })
  } catch (err) {
    const base = err instanceof Error ? err.message : 'Network error'
    const hint = import.meta.env?.DEV ? ' Make sure the API server is running at http://localhost:3001.' : ''
    throw new Error(base + hint)
  }
  const raw = await res.text()
  let data: { text?: string; pages?: number; data?: ParsedResumeData | null; error?: string } = {}

  if (raw) {
    try {
      data = JSON.parse(raw) as typeof data
    } catch {
      if (!res.ok) throw new Error(raw || 'Upload failed')
      return { text: raw }
    }
  }

  if (!res.ok) {
    const status = `${res.status} ${res.statusText}`.trim()
    const rawHint = raw && raw.length <= 160 ? raw : ''
    throw new Error(data.error || rawHint || `Upload failed (${status || 'unknown error'})`)
  }
  return {
    text: data.text ?? '',
    pages: data.pages,
    data: data.data ?? null,
  }
}
