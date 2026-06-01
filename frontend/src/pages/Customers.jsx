import React, { useEffect, useState } from 'react'
import api from '../api/axios.js'
import { useToast } from '../App.jsx'
import CustomerForm from '../components/CustomerForm.jsx'
import { Trash2, Plus, X, Loader2 } from 'lucide-react'

export default function Customers() {
  const { showSuccess, showError } = useToast()
  
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const res = await api.get('/customers')
      setCustomers(res.data)
    } catch (err) {
      showError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const handleCreateCustomer = async (data) => {
    try {
      setIsSubmitting(true)
      await api.post('/customers', data)
      showSuccess(`Customer "${data.full_name}" created successfully!`)
      setShowAddModal(false)
      fetchCustomers()
    } catch (err) {
      showError(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCustomer = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete customer "${name}"?`)) return
    try {
      await api.delete(`/customers/${id}`)
      showSuccess(`Customer "${name}" deleted.`)
      fetchCustomers()
    } catch (err) {
      showError(err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-[#1C1917] tracking-tight">Customer directory</h1>
          <p className="text-sm text-[#78716C] mt-1">Manage accounts, emails, and contact details.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-[#1C1917] hover:bg-[#2C2925] text-white rounded-full px-5 py-2 text-xs font-semibold shadow-xs transition duration-200"
        >
          <Plus size={14} /> Add Customer
        </button>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-2">
          <Loader2 className="w-8 h-8 text-[#C17A3A] animate-spin" />
          <p className="text-sm text-[#78716C]">Loading customers list...</p>
        </div>
      ) : (
        /* Customers Table */
        <div className="bg-white rounded-2xl border border-[rgba(28,25,23,0.08)] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F2EDE6] border-b border-[rgba(28,25,23,0.08)] text-[10px] font-semibold text-[#78716C] uppercase tracking-wider">
                  <th className="px-6 py-3.5">Full Name</th>
                  <th className="px-6 py-3.5">Email Address</th>
                  <th className="px-6 py-3.5">Phone Number</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(28,25,23,0.06)] text-sm">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-[#78716C]">
                      No customers registered. Click "Add Customer" to register one.
                    </td>
                  </tr>
                ) : (
                  customers.map((c) => (
                    <tr key={c.id} className="hover:bg-[#FAF8F5]/50 transition-colors duration-150">
                      <td className="px-6 py-4 font-medium text-[#1C1917]">{c.full_name}</td>
                      <td className="px-6 py-4 text-[#78716C]">{c.email}</td>
                      <td className="px-6 py-4 text-[#78716C]">{c.phone}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteCustomer(c.id, c.full_name)}
                          className="p-1.5 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 rounded-md transition focus:outline-none"
                          title="Delete Customer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in border border-[#1C1917]/10">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#1C1917]/10">
              <h2 className="text-lg font-serif font-bold text-[#1C1917]">Register Customer</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none p-1"
              >
                <X size={16} />
              </button>
            </div>
            <CustomerForm 
              onSubmit={handleCreateCustomer} 
              onCancel={() => setShowAddModal(false)} 
              isSubmitting={isSubmitting} 
            />
          </div>
        </div>
      )}
    </div>
  )
}
