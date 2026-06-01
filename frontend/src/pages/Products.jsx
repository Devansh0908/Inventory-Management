import React, { useEffect, useState } from 'react'
import api from '../api/axios.js'
import { useToast } from '../App.jsx'
import ProductForm from '../components/ProductForm.jsx'
import { Edit2, Trash2, Plus, X, Check, Loader2 } from 'lucide-react'

export default function Products() {
  const { showSuccess, showError } = useToast()
  
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  
  // Inline edit state
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', sku: '', price: '', quantity: '' })
  const [editErrors, setEditErrors] = useState({})

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await api.get('/products')
      setProducts(res.data)
    } catch (err) {
      showError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Create Product handler
  const handleCreateProduct = async (data) => {
    try {
      setIsSubmitting(true)
      await api.post('/products', {
        name: data.name,
        sku: data.sku,
        price: parseFloat(data.price),
        quantity: parseInt(data.quantity, 10)
      })
      showSuccess(`Product "${data.name}" added successfully!`)
      setShowAddModal(false)
      fetchProducts()
    } catch (err) {
      showError(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete Product handler
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete product "${name}"?`)) return
    try {
      await api.delete(`/products/${id}`)
      showSuccess(`Product "${name}" deleted.`)
      fetchProducts()
    } catch (err) {
      showError(err)
    }
  }

  // Toggle Inline Edit Mode
  const startEdit = (product) => {
    setEditingId(product.id)
    setEditForm({
      name: product.name,
      sku: product.sku,
      price: product.price,
      quantity: product.quantity
    })
    setEditErrors({})
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ name: '', sku: '', price: '', quantity: '' })
    setEditErrors({})
  }

  // Validate Inline Edit Fields
  const validateEdit = () => {
    const errors = {}
    if (!editForm.name.trim()) errors.name = 'Required'
    if (!editForm.sku.trim()) errors.sku = 'Required'
    
    const priceNum = parseFloat(editForm.price)
    if (isNaN(priceNum) || priceNum <= 0) {
      errors.price = 'Must be > 0'
    }

    const qtyNum = parseInt(editForm.quantity, 10)
    if (isNaN(qtyNum) || qtyNum < 0 || !Number.isInteger(parseFloat(editForm.quantity))) {
      errors.quantity = 'Must be Integer >= 0'
    }

    setEditErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Save Inline Edit
  const handleUpdateProduct = async (id) => {
    if (!validateEdit()) return
    try {
      setIsSubmitting(true)
      await api.put(`/products/${id}`, {
        name: editForm.name,
        sku: editForm.sku,
        price: parseFloat(editForm.price),
        quantity: parseInt(editForm.quantity, 10)
      })
      showSuccess('Product updated successfully!')
      setEditingId(null)
      fetchProducts()
    } catch (err) {
      showError(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-[#1C1917] tracking-tight">Products Inventory</h1>
          <p className="text-sm text-[#78716C] mt-1">Manage items, stock quantities, and SKU identifiers.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-[#1C1917] hover:bg-[#2C2925] text-white rounded-full px-5 py-2 text-xs font-semibold shadow-xs transition duration-200"
        >
          <Plus size={14} /> Add Product
        </button>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-2">
          <Loader2 className="w-8 h-8 text-[#C17A3A] animate-spin" />
          <p className="text-sm text-[#78716C]">Loading products list...</p>
        </div>
      ) : (
        /* Products Table Card */
        <div className="bg-white rounded-2xl border border-[rgba(28,25,23,0.08)] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F2EDE6] border-b border-[rgba(28,25,23,0.08)] text-[10px] font-semibold text-[#78716C] uppercase tracking-wider">
                  <th className="px-6 py-3.5 w-1/3">Name</th>
                  <th className="px-6 py-3.5 w-1/6">SKU</th>
                  <th className="px-6 py-3.5 w-1/6">Price</th>
                  <th className="px-6 py-3.5 w-1/6">Quantity</th>
                  <th className="px-6 py-3.5 text-right w-1/6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(28,25,23,0.06)] text-sm">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-[#78716C]">
                      No products found. Click "Add Product" to create one.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const isEditing = editingId === product.id

                    return (
                      <tr 
                        key={product.id} 
                        className={`transition-colors duration-150 ${isEditing ? 'bg-amber-50/20' : 'hover:bg-[#FAF8F5]/50'}`}
                      >
                        {/* Name Cell */}
                        <td className="px-6 py-3">
                          {isEditing ? (
                            <div className="flex flex-col">
                              <input
                                type="text"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                className={`px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-[#C17A3A] focus:outline-none ${editErrors.name ? 'border-red-400' : 'border-[#E8E0D5]'}`}
                              />
                              {editErrors.name && <span className="text-[10px] text-red-500 mt-0.5">{editErrors.name}</span>}
                            </div>
                          ) : (
                            <span className="font-medium text-[#1C1917]">{product.name}</span>
                          )}
                        </td>

                        {/* SKU Cell */}
                        <td className="px-6 py-3 font-mono text-xs text-[#78716C]">
                          {isEditing ? (
                            <div className="flex flex-col">
                              <input
                                type="text"
                                value={editForm.sku}
                                onChange={(e) => setEditForm({ ...editForm, sku: e.target.value })}
                                className={`px-2 py-1 border rounded text-xs font-mono focus:ring-1 focus:ring-[#C17A3A] focus:outline-none ${editErrors.sku ? 'border-red-400' : 'border-[#E8E0D5]'}`}
                              />
                              {editErrors.sku && <span className="text-[10px] text-red-500 mt-0.5">{editErrors.sku}</span>}
                            </div>
                          ) : (
                            product.sku
                          )}
                        </td>

                        {/* Price Cell */}
                        <td className="px-6 py-3">
                          {isEditing ? (
                            <div className="flex flex-col w-24">
                              <input
                                type="number"
                                step="0.01"
                                value={editForm.price}
                                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                className={`px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-[#C17A3A] focus:outline-none ${editErrors.price ? 'border-red-400' : 'border-[#E8E0D5]'}`}
                              />
                              {editErrors.price && <span className="text-[10px] text-red-500 mt-0.5">{editErrors.price}</span>}
                            </div>
                          ) : (
                            `₹${product.price.toFixed(2)}`
                          )}
                        </td>

                        {/* Quantity Cell */}
                        <td className="px-6 py-3">
                          {isEditing ? (
                            <div className="flex flex-col w-20">
                              <input
                                type="number"
                                value={editForm.quantity}
                                onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                                className={`px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-[#C17A3A] focus:outline-none ${editErrors.quantity ? 'border-red-400' : 'border-[#E8E0D5]'}`}
                              />
                              {editErrors.quantity && <span className="text-[10px] text-red-500 mt-0.5">{editErrors.quantity}</span>}
                            </div>
                          ) : (
                            <span className={product.quantity <= 5 ? 'text-red-600 font-semibold' : 'text-gray-800'}>
                              {product.quantity} units
                            </span>
                          )}
                        </td>

                        {/* Actions Cell */}
                        <td className="px-6 py-3 text-right">
                          {isEditing ? (
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => handleUpdateProduct(product.id)}
                                disabled={isSubmitting}
                                className="p-1.5 bg-green-50 text-green-600 border border-green-200 rounded-md hover:bg-green-100 transition focus:outline-none"
                                title="Save"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                onClick={cancelEdit}
                                disabled={isSubmitting}
                                className="p-1.5 bg-gray-50 text-gray-600 border border-gray-200 rounded-md hover:bg-gray-100 transition focus:outline-none"
                                title="Cancel"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => startEdit(product)}
                                className="p-1.5 bg-gray-50 text-[#78716C] border border-[#E8E0D5] hover:bg-[#F2EDE6] hover:text-[#1C1917] rounded-md transition focus:outline-none"
                                title="Edit"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id, product.name)}
                                className="p-1.5 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 rounded-md transition focus:outline-none"
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in border border-[#1C1917]/10">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#1C1917]/10">
              <h2 className="text-lg font-serif font-bold text-[#1C1917]">Create New Product</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none p-1"
              >
                <X size={16} />
              </button>
            </div>
            <ProductForm 
              onSubmit={handleCreateProduct} 
              onCancel={() => setShowAddModal(false)} 
              isSubmitting={isSubmitting} 
            />
          </div>
        </div>
      )}
    </div>
  )
}
