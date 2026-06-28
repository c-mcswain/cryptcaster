import { ApiResponse } from "../../shared/types"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? ""

function getApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  // If path is already a full URL, leave it alone.
  if (/^https?:\/\//i.test(path)) {
    return path
  }

  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(getApiUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  })

  const json = (await res.json()) as ApiResponse<T>

  if (!res.ok || !json.success || json.data === undefined) {
    throw new Error(json.error || "Request failed")
  }

  return json.data
}
