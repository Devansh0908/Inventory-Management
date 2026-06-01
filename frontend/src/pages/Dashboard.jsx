import React, { useEffect, useState } from 'react'
import api from '../api/axios.js'
import { Package, Users, ShoppingCart, AlertTriangle, Loader2 } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      const res = await api.get('/dashboard/stats')
      setStats(res.data)
      setError(null)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 text-[#C17A3A] animate-spin" />
        <p className="text-sm text-[#78716C] font-medium animate-pulse">Retrieving inventory metrics...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-2xl flex flex-col gap-3">
        <h3 className="font-serif text-lg font-bold">Failed to load statistics</h3>
        <p className="text-sm">{error}</p>
        <button
          onClick={fetchStats}
          className="w-fit px-4 py-2 bg-red-800 text-white rounded-full text-xs font-semibold hover:bg-red-900 transition duration-200"
        >
          Try Again
        </button>
      </div>
    )
  }

  const cards = [
    { name: 'Total Products', val: stats.total_products, icon: Package, col: 'text-blue-600 bg-blue-50 border-blue-100' },
    { name: 'Total Customers', val: stats.total_customers, icon: Users, col: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { name: 'Total Orders', val: stats.total_orders, icon: ShoppingCart, col: 'text-green-600 bg-green-50 border-green-100' },
  ]

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-serif text-[#1C1917] tracking-tight">System Dashboard</h1>
        <p className="text-sm text-[#78716C] mt-1">Operational summaries and immediate action triggers.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon
          return (
            <div key={i} className="bg-white rounded-2xl p-6 border border-[rgba(28,25,23,0.08)] shadow-xs flex items-center justify-between hover:shadow-md transition-shadow duration-300">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#78716C]">{card.name}</span>
                <span className="text-3xl font-serif font-bold text-[#1C1917] block mt-2">{card.val}</span>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${card.col}`}>
                <Icon size={20} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-white rounded-2xl border border-[rgba(28,25,23,0.08)] overflow-hidden shadow-xs">
        <div className="bg-[#F2EDE6] px-6 py-4 flex items-center justify-between border-b border-[rgba(28,25,23,0.08)]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-[#C17A3A]" size={18} />
            <h2 className="font-serif text-base font-bold text-[#1C1917]">Low Stock Alerts</h2>
          </div>
          <span className="bg-[#F0E4D0] text-[#9A5E22] text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {stats.low_stock_products.length} alerted
          </span>
        </div>

        {stats.low_stock_products.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#78716C] font-medium">
            🎉 All products have healthy inventory levels (above 5 units).
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[rgba(28,25,23,0.08)] text-[10px] font-semibold text-[#78716C] uppercase tracking-wider">
                  <th className="px-6 py-3.5">Product Name</th>
                  <th className="px-6 py-3.5">SKU</th>
                  <th className="px-6 py-3.5">Unit Price</th>
                  <th className="px-6 py-3.5">Stock Quantity</th>
                  <th className="px-6 py-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(28,25,23,0.06)] text-sm">
                {stats.low_stock_products.map((product) => (
                  <tr key={product.id} className="hover:bg-[#FAF8F5]/50 transition-colors duration-150">
                    <td className="px-6 py-4 font-medium text-[#1C1917]">{product.name}</td>
                    <td className="px-6 py-4 font-mono text-xs text-[#78716C]">{product.sku}</td>
                    <td className="px-6 py-4">₹{product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 font-semibold text-red-600">{product.quantity} units</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        product.quantity === 0
                          ? 'bg-red-50 text-red-700 border border-red-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {product.quantity === 0 ? 'Out of Stock' : 'Low Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
