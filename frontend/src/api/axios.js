import axios from 'axios'

const getBaseURL = () => {
  // If VITE_API_URL is injected at build time, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  // Otherwise, dynamically determine it from the browser URL (for local dev)
  const { protocol, hostname } = window.location
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
    return `${protocol}//${hostname}:8001/api`
  }
  return 'http://localhost:8001/api'
}

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'An error occurred. Please try again.'
    
    if (error.response) {
      const data = error.response.data
      if (data && data.detail) {
        if (typeof data.detail === 'string') {
          errorMessage = data.detail
        } else if (Array.isArray(data.detail)) {
          // Parse FastAPI validation errors
          errorMessage = data.detail
            .map((err) => {
              const field = err.loc && err.loc.length > 1 ? err.loc.slice(1).join('.') : ''
              return field ? `${field}: ${err.msg}` : err.msg
            })
            .join(' | ')
        } else {
          errorMessage = JSON.stringify(data.detail)
        }
      } else if (data && data.message) {
        errorMessage = data.message
      } else {
        errorMessage = `Request failed with status code ${error.response.status}`
      }
    } else if (error.request) {
      errorMessage = 'No response received from server. Please check your connection.'
    } else {
      errorMessage = error.message
    }

    return Promise.reject(errorMessage)
  }
)

export default api
