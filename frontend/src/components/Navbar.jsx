import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, Users, Menu, X } from 'lucide-react'

export default function Navbar({ children }) {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Orders', path: '/orders', icon: ShoppingCart },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#1C1917] text-white p-6 justify-between flex-shrink-0 border-r border-[#1C1917]/10">
        <div>
          {/* Logo / Brand */}
          <div className="flex items-center gap-3 mb-10 pt-2">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white text-[#1C1917] rounded-[6px] flex items-center justify-center font-bold font-serif italic text-xs">
                K/
              </div>
              <span className="font-semibold tracking-tight text-[15px] font-sans">Kargo</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                    active
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-white/60 hover:text-white/95 hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

      </aside>

      {/* Top Navigation for Mobile */}
      <header className="md:hidden flex items-center justify-between bg-[#1C1917] text-white px-5 py-4 border-b border-[#1C1917]/10">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white text-[#1C1917] rounded-[6px] flex items-center justify-center font-bold font-serif italic text-xs">
            K/
          </div>
          <span className="font-semibold tracking-tight text-sm">Kargo</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1 rounded-md hover:bg-white/10 focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity duration-300" 
            onClick={() => setMobileOpen(false)} 
          />
          <nav className="relative flex flex-col w-64 max-w-xs bg-[#1C1917] text-white p-6 shadow-2xl z-50 transition-transform duration-300">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white text-[#1C1917] rounded-[6px] flex items-center justify-center font-bold font-serif italic text-xs">
                  K/
                </div>
                <span className="font-semibold tracking-tight text-[15px]">Kargo</span>
              </div>
              <button 
                onClick={() => setMobileOpen(false)} 
                className="p-1 rounded-md hover:bg-white/10 focus:outline-none"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                      active
                        ? 'bg-white/10 text-white shadow-sm'
                        : 'text-white/60 hover:text-white/95 hover:bg-white/5'
                    }`}
                  >
                    <Icon size={16} />
                    {item.name}
                  </Link>
                )
              })}
            </div>

            <div className="mt-auto text-[11px] text-white/30 border-t border-white/5 pt-4">
              © 2025 Kargo SaaS
            </div>
          </nav>
        </div>
      )}

      {/* Main Page Area */}
      <main className="flex-1 overflow-x-auto min-h-screen">
        <div className="max-w-6.5xl mx-auto px-6 py-8 sm:px-8 sm:py-10 md:px-10 lg:px-12">
          {children}
        </div>
      </main>
    </div>
  )
}
