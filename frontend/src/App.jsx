import React, { createContext, useContext, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Products from './pages/Products.jsx'
import Customers from './pages/Customers.jsx'
import Orders from './pages/Orders.jsx'
import Navbar from './components/Navbar.jsx'

// Create Context for Toasts
export const ToastContext = createContext({
  showSuccess: () => {},
  showError: () => {},
})

export const useToast = () => useContext(ToastContext)

export default function App() {
  const [toasts, setToasts] = useState([])

  const addToast = (type, message) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9)
    
    // Auto-dismiss success toast in 3 seconds
    if (type === 'success') {
      setTimeout(() => {
        removeToast(id)
      }, 3000)
    }

    setToasts((prev) => [...prev, { id, type, message }])
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showSuccess: (msg) => addToast('success', msg), showError: (msg) => addToast('error', msg) }}>
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* App Dashboard Pages wrapped in Navbar */}
          <Route
            path="/dashboard"
            element={
              <Navbar>
                <Dashboard />
              </Navbar>
            }
          />
          <Route
            path="/products"
            element={
              <Navbar>
                <Products />
              </Navbar>
            }
          />
          <Route
            path="/customers"
            element={
              <Navbar>
                <Customers />
              </Navbar>
            }
          />
          <Route
            path="/orders"
            element={
              <Navbar>
                <Orders />
              </Navbar>
            }
          />

          {/* Catch-all Route redirecting to root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

      {/* Global Toast Notification System */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto flex items-start justify-between p-4 rounded-xl shadow-lg border transition-all duration-300 transform translate-y-0 ${
              toast.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex-1 text-sm font-medium pr-2">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-current opacity-70 hover:opacity-100 font-semibold text-xs leading-none p-1 focus:outline-none"
              aria-label="Dismiss toast"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
