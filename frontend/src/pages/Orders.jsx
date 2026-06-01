import React, { useEffect, useState } from 'react'
import api from '../api/axios.js'
import { useToast } from '../App.jsx'
import OrderForm from '../components/OrderForm.jsx'
import { Trash2, Plus, X, Eye, EyeOff, Loader2 } from 'lucide-react'

export default function Orders() {
  const { showSuccess, showError } = useToast()
  
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  
  // Expandable row state
  const [expandedOrderId, setExpandedOrderId] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [ordersRes, customersRes, productsRes] = await Promise.all([
        api.get('/orders'),
        api.get('/customers'),
        api.get('/products')
      ])
      setOrders(ordersRes.data)
      setCustomers(customersRes.data)
      setProducts(productsRes.data)
    } catch (err) {
      showError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreateOrder = async (data) => {
    try {
      setIsSubmitting(true)
      // Format items appropriately for backend API schema
      const formattedItems = data.items.map(item => ({
        product_id: parseInt(item.product_id, 10),
        quantity: parseInt(item.quantity, 10)
      }))

      await api.post('/orders', {
        customer_id: parseInt(data.customer_id, 10),
        items: formattedItems
      })

      showSuccess('Order created successfully!')
      setShowAddModal(false)
      fetchData()
    } catch (err) {
      showError(err) // Displays the descriptive backend error message directly
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteOrder = async (id) => {
    if (!window.confirm(`Are you sure you want to cancel order #${id}? This will restore stock levels.`)) return
    try {
      await api.delete(`/orders/${id}`)
      showSuccess(`Order #${id} has been cancelled. Stock levels restored.`)
      fetchData()
    } catch (err) {
      showError(err)
    }
  }

  const toggleExpandRow = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-[#1C1917] tracking-tight">Orders Register</h1>
          <p className="text-sm text-[#78716C] mt-1">Generate invoices, review snapshots, and manage cancellations.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-[#1C1917] hover:bg-[#2C2925] text-white rounded-full px-5 py-2 text-xs font-semibold shadow-xs transition duration-200"
        >
          <Plus size={14} /> Create Order
        </button>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-2">
          <Loader2 className="w-8 h-8 text-[#C17A3A] animate-spin" />
          <p className="text-sm text-[#78716C]">Loading orders register...</p>
        </div>
      ) : (
        /* Orders Table */
        <div className="bg-white rounded-2xl border border-[rgba(28,25,23,0.08)] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F2EDE6] border-b border-[rgba(28,25,23,0.08)] text-[10px] font-semibold text-[#78716C] uppercase tracking-wider">
                  <th className="px-6 py-3.5 w-16">ID</th>
                  <th className="px-6 py-3.5">Customer Name</th>
                  <th className="px-6 py-3.5">Total Amount</th>
                  <th className="px-6 py-3.5">Order Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(28,25,23,0.06)] text-sm">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-[#78716C]">
                      No orders found. Click "Create Order" to submit your first one.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const isExpanded = expandedOrderId === order.id
                    const orderDate = new Date(order.created_at).toLocaleString()

                    return (
                      <React.Fragment key={order.id}>
                        {/* Main Order Row */}
                        <tr className="hover:bg-[#FAF8F5]/50 transition-colors duration-150">
                          <td className="px-6 py-4 font-mono font-bold text-xs">#{order.id}</td>
                          <td className="px-6 py-4 font-medium text-[#1C1917]">{order.customer_name || `Customer #${order.customer_id}`}</td>
                          <td className="px-6 py-4 font-semibold text-[#1C1917]">₹{order.total_amount.toFixed(2)}</td>
                          <td className="px-6 py-4 text-[#78716C]">{orderDate}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => toggleExpandRow(order.id)}
                                className={`p-1.5 border rounded-md transition focus:outline-none ${
                                  isExpanded 
                                    ? 'bg-[#1C1917] text-white border-[#1C1917]' 
                                    : 'bg-gray-50 text-[#78716C] border-[#E8E0D5] hover:bg-[#F2EDE6]'
                                }`}
                                title={isExpanded ? 'Hide Details' : 'View Details'}
                              >
                                {isExpanded ? <EyeOff size={13} /> : <Eye size={13} />}
                              </button>
                              <button
                                onClick={() => handleDeleteOrder(order.id)}
                                className="p-1.5 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 rounded-md transition focus:outline-none"
                                title="Cancel Order"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded Items Row */}
                        {isExpanded && (
                          <tr className="bg-[#FAF8F5]/70">
                            <td colSpan="5" className="px-8 py-4 border-t border-[rgba(28,25,23,0.04)] border-b border-[rgba(28,25,23,0.06)]">
                              <div className="bg-white rounded-xl border border-[rgba(28,25,23,0.08)] overflow-hidden">
                                <table className="w-full text-left border-collapse text-xs">
                                  <thead>
                                    <tr className="bg-[#F2EDE6]/40 border-b border-[rgba(28,25,23,0.08)] text-[9px] font-semibold text-[#78716C] uppercase tracking-wider">
                                      <th className="px-4 py-2 w-12">No.</th>
                                      <th className="px-4 py-2">Product Name</th>
                                      <th className="px-4 py-2">Snapshot Price</th>
                                      <th className="px-4 py-2">Quantity</th>
                                      <th className="px-4 py-2 text-right">Subtotal</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-[rgba(28,25,23,0.04)] font-sans">
                                    {order.items.map((item, idx) => (
                                      <tr key={idx} className="hover:bg-gray-50/50">
                                        <td className="px-4 py-2.5 font-mono text-[#78716C]">{idx + 1}</td>
                                        <td className="px-4 py-2.5 font-medium text-[#1C1917]">{item.product_name || `Product #${item.product_id}`}</td>
                                        <td className="px-4 py-2.5">₹{item.unit_price.toFixed(2)}</td>
                                        <td className="px-4 py-2.5">{item.quantity} units</td>
                                        <td className="px-4 py-2.5 text-right font-semibold">₹{(item.quantity * item.unit_price).toFixed(2)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Order Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-fade-in border border-[#1C1917]/10">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#1C1917]/10">
              <h2 className="text-lg font-serif font-bold text-[#1C1917]">Create New Order</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none p-1"
              >
                <X size={16} />
              </button>
            </div>
            <OrderForm 
              customers={customers}
              products={products}
              onSubmit={handleCreateOrder}
              onCancel={() => setShowAddModal(false)}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}
    </div>
  )
}
