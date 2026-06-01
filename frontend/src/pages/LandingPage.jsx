import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios.js'
import {
  Package,
  ShoppingCart,
  Users,
  BarChart2,
  LayoutDashboard,
  Shield,
  Check,
  ArrowRight,
  Menu,
  X
} from 'lucide-react'

// Reusable Text Roll Hover Animation Component
const TextRoll = ({ text }) => {
  return (
    <span className="overflow-hidden inline-block h-[18px] relative">
      <span
        className="flex flex-col transition-transform duration-[450ms] group-hover:-translate-y-1/2"
        style={{
          transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
        }}
      >
        <span className="h-[18px] flex items-center">{text}</span>
        <span className="h-[18px] flex items-center">{text}</span>
      </span>
    </span>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: 'GitHub Repo', url: 'https://github.com/Devansh0908/Inventory-Management', external: true },
    { name: 'Frontend Hosted URL', url: 'https://inventory-management-flame-pi.vercel.app/', external: true },
    { name: 'Backend API Hosted URL', url: 'https://inventory-management-cegq.onrender.com', external: true },
    { name: 'Backend Docker Hub Image', url: 'https://hub.docker.com/r/devansh0908/kargo-backend', external: true }
  ]

  const [liveStats, setLiveStats] = useState({
    total_products: 0,
    total_customers: 0,
    total_orders: 0,
    total_revenue: 0,
    low_stock_products: []
  })
  const [liveProducts, setLiveProducts] = useState([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats')
        setLiveStats(res.data)
      } catch (err) {
        console.error('Failed to load live metrics for landing page dashboard', err)
      }
    }
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products')
        setLiveProducts(res.data)
      } catch (err) {
        console.error('Failed to load live products for landing page dashboard', err)
      }
    }
    fetchStats()
    fetchProducts()
  }, [])

  // IntersectionObserver scroll reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    )

    const elements = document.querySelectorAll('.reveal')
    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] selection:bg-[#F0E4D0] selection:text-[#9A5E22]">
      {/* ────────────────────────────────────────────────────────
          SECTION 1: HERO
          ──────────────────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col justify-between bg-[#FAF8F5]">

        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-sm border-b border-[rgba(28,25,23,0.08)]">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-4 sm:py-5 flex items-center justify-between">
            {/* Left Brand */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#1C1917] rounded-[6px] flex items-center justify-center text-white text-xs font-serif font-medium italic">
                K/
              </div>
              <span className="font-sans font-medium text-[15px] tracking-tight text-[#1C1917]">
                Kargo
              </span>

              {/* Nav links */}
              <div className="hidden md:flex items-center gap-5 lg:gap-6 ml-6 lg:ml-8">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="font-sans text-[12px] text-[#78716C] hover:text-[#1C1917] transition-colors duration-200 whitespace-nowrap"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Right CTAs */}
            <div className="hidden md:flex items-center gap-4">
              {/* Status Pill */}
              <div className="border border-[rgba(28,25,23,0.14)] rounded-full px-3 py-1 flex items-center gap-2 text-[12px] font-sans font-medium text-[#78716C]">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span>System operational</span>
              </div>

              {/* Filled CTA */}
              <button
                onClick={() => navigate('/dashboard')}
                className="group bg-[#1C1917] text-white rounded-full px-5 py-1.5 text-[13px] font-medium font-sans hover:bg-[#2C2925] transition-colors duration-200 flex items-center justify-center"
              >
                <TextRoll text="Get started" />
              </button>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden bg-[#1C1917] text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-[#2C2925] transition-colors"
              aria-label="Open mobile menu"
            >
              <Menu size={16} />
            </button>
          </div>
        </nav>

        {/* Mobile Menu Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#1C1917]/30 backdrop-blur-xs">
            <div className="absolute inset-0" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative bg-white w-full mx-3 mb-3 rounded-2xl p-6 shadow-2xl flex flex-col gap-6 animate-slide-up max-w-md">

              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#1C1917] rounded-[6px] flex items-center justify-center text-white text-xs font-serif italic">
                    K/
                  </div>
                  <span className="font-sans font-medium text-[15px]">Kargo</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-[#FAF8F5] text-[#1C1917] rounded-full w-8 h-8 flex items-center justify-center border border-[#1C1917]/10"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Links */}
              <div className="flex flex-col gap-4 py-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-serif text-lg italic text-[#1C1917] hover:text-[#C17A3A] transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  navigate('/dashboard')
                }}
                className="w-full bg-[#1C1917] text-white py-3 rounded-full text-sm font-medium hover:bg-[#2C2925] transition-colors"
              >
                Get started
              </button>
            </div>
          </div>
        )}

        {/* Hero Content */}
        <div className="flex-1 flex flex-col justify-center max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-24 pb-16">
          <div className="max-w-[720px] reveal">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 border border-[rgba(28,25,23,0.14)] rounded-full px-4 py-1.5 bg-[#F0E4D0] mb-6 sm:mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C17A3A]"></span>
              <span className="font-sans text-[12px] font-medium text-[#9A5E22] tracking-wide uppercase">
                Inventory & Order Management
              </span>
            </div>

            {/* Headline H1 */}
            <h1
              className="text-[#1C1917] leading-[1.05] tracking-[-0.02em] mb-6 sm:mb-8 font-serif"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)' }}
            >
              Products, orders, customers —
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              controlled from <span style={{ color: 'var(--accent)' }}>one place.</span>
            </h1>

            {/* Subheadline */}
            <p className="font-sans text-[15px] sm:text-[16px] text-[#78716C] font-normal leading-relaxed max-w-[620px] mb-10 sm:mb-12">
              Real-time stock tracking, automatic order deduction, and bulletproof business logic. Built with FastAPI, React, and PostgreSQL — fully containerized and ready to scale.
            </p>

            {/* CTA row */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="group bg-[#1C1917] text-white rounded-full pl-5 pr-2 py-2 inline-flex items-center gap-4 hover:bg-[#2C2925] transition-colors duration-200"
              >
                <TextRoll text="Start" />
                <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#1C1917] group-hover:-rotate-45 transition-transform duration-300">
                  <ArrowRight size={13} />
                </span>
              </button>
            </div>


          </div>
        </div>

        {/* Hero Visual - Dashboard Preview */}
        <div className="max-w-[1440px] mx-auto w-full px-6 sm:px-10 lg:px-16 pb-12 reveal" style={{ transitionDelay: '80ms' }}>
          <div
            className="relative w-full bg-[#F2EDE6] rounded-2xl sm:rounded-3xl overflow-hidden aspect-[16/10] max-h-[580px] shadow-[0_24px_80px_rgba(28,25,23,0.12)] border border-[rgba(28,25,23,0.08)]"
          >
            {/* Mock Dashboard Layout */}
            <div className="w-full h-full flex transform scale-[0.98] origin-center transition-all duration-500">

              {/* Sidebar */}
              <aside className="w-44 bg-[#1C1917] h-full flex flex-col justify-between p-4 hidden md:flex">
                <div>
                  <div className="flex items-center gap-2 pb-5 border-b border-white/5">
                    <div className="w-6 h-6 bg-white text-[#1C1917] rounded-[4px] flex items-center justify-center font-serif italic text-[10px]">K/</div>
                    <span className="text-white text-[12px] font-sans font-medium tracking-tight">Kargo</span>
                  </div>

                  <nav className="flex flex-col gap-1 mt-4">
                    {[
                      { name: 'Dashboard', icon: LayoutDashboard, active: false },
                      { name: 'Inventory', icon: Package, active: true },
                      { name: 'Orders', icon: ShoppingCart, active: false },
                      { name: 'Customers', icon: Users, active: false },
                      { name: 'Reports', icon: BarChart2, active: false }
                    ].map((item) => {
                      const Icon = item.icon
                      return (
                        <div
                          key={item.name}
                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] font-sans transition-all duration-200 cursor-pointer ${item.active ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'
                            }`}
                        >
                          <Icon size={12} />
                          <span>{item.name}</span>
                        </div>
                      )
                    })}
                  </nav>
                </div>

              </aside>

              {/* Main Content Pane */}
              <main className="flex-1 bg-[#FAF8F5] p-4 sm:p-5 flex flex-col overflow-hidden">

                {/* Dashboard Header */}
                <div className="flex justify-between items-center mb-4 sm:mb-5">
                  <h3 className="text-sm font-sans font-bold text-[#1C1917] tracking-tight">Inventory Overview</h3>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-[#1C1917] text-white text-[10px] font-sans font-medium rounded-full px-3 py-1 hover:bg-[#2C2925]"
                  >
                    + Add Product
                  </button>
                </div>

                {/* Stats cards grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-5">
                  {[
                    { title: 'Total Products', val: liveStats.total_products.toLocaleString(), trend: 'Live', trendColor: 'text-green-600 bg-green-50' },
                    { title: 'Active Orders', val: liveStats.total_orders.toLocaleString(), trend: 'Live', trendColor: 'text-green-600 bg-green-50' },
                    { title: 'Low Stock', val: liveStats.low_stock_products.length.toString(), trend: liveStats.low_stock_products.length > 0 ? 'Warning' : 'OK', trendColor: liveStats.low_stock_products.length > 0 ? 'text-amber-700 bg-amber-50' : 'text-green-600 bg-green-50' },
                    { title: 'Revenue (MTD)', val: `₹${liveStats.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, trend: 'Live', trendColor: 'text-green-600 bg-green-50' },
                  ].map((card, i) => (
                    <div key={i} className="bg-white rounded-lg p-2.5 sm:p-3.5 border border-[rgba(28,25,23,0.06)] shadow-xs">
                      <span className="text-[10px] font-sans text-[#78716C] block mb-1">{card.title}</span>
                      <div className="flex items-baseline justify-between">
                        <span className="text-base sm:text-lg font-serif font-bold text-[#1C1917]">{card.val}</span>
                        <span className={`text-[8px] sm:text-[9px] font-medium px-1 rounded-sm ${card.trendColor}`}>{card.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg border border-[rgba(28,25,23,0.06)] overflow-hidden flex-1 flex flex-col shadow-xs">
                  {/* Table Header */}
                  <div className="bg-[#F2EDE6] px-3.5 py-2 flex items-center justify-between text-[9px] font-semibold text-[#78716C] uppercase tracking-wider">
                    <span className="w-1/3">Product</span>
                    <span className="w-1/6 hidden sm:block">SKU</span>
                    <span className="w-1/6">Stock</span>
                    <span className="w-1/6">Price</span>
                    <span className="w-1/6 text-right">Status</span>
                  </div>

                  {/* Table Body */}
                  <div className="divide-y divide-[rgba(28,25,23,0.06)] flex-1 overflow-y-auto">
                    {(liveProducts.length > 0 ? liveProducts.slice(0, 4) : [
                      { name: 'Wireless Keyboard Pro', sku: 'WKP-001', quantity: 342, price: 89.99 },
                      { name: 'USB-C Hub 7-Port', sku: 'UCH-007', quantity: 28, price: 49.99 },
                      { name: 'Mechanical Mouse', sku: 'MMX-103', quantity: 0, price: 129.99 },
                      { name: '4K Webcam', sku: 'WBC-4K1', quantity: 156, price: 199.99 }
                    ]).map((row, i) => {
                      const qty = row.quantity
                      const status = qty === 0 ? 'Out of Stock' : qty <= 5 ? 'Low Stock' : 'In Stock'
                      const statusColor = qty === 0
                        ? 'bg-red-50 text-red-700'
                        : qty <= 5
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-green-50 text-green-700'

                      return (
                        <div key={i} className="px-3.5 py-2 flex items-center justify-between text-[11px] text-[#1C1917] hover:bg-[#FAF8F5]">
                          <span className="w-1/3 font-medium truncate">{row.name}</span>
                          <span className="w-1/6 hidden sm:block font-mono text-gray-500 text-[10px]">{row.sku}</span>
                          <span className="w-1/6">{qty} units</span>
                          <span className="w-1/6">₹{row.price.toFixed(2)}</span>
                          <span className="w-1/6 text-right">
                            <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-medium ${statusColor}`}>{status}</span>
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

              </main>
            </div>
          </div>
        </div>

      </section>

      {/* ────────────────────────────────────────────────────────
          SECTION 2: FEATURES
          ──────────────────────────────────────────────────────── */}
      <section id="features" className="bg-[#F2EDE6] py-20 sm:py-28 lg:py-36">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">

          {/* Header Row */}
          <div className="reveal mb-12 sm:mb-16">


            <h2 className="text-[#1C1917] tracking-[-0.02em] font-serif leading-[1.1]" style={{ fontSize: 'clamp(1.6rem, 4vw, 3.4rem)' }}>
              Built for the way real
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              businesses actually work.
            </h2>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">

            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[rgba(28,25,23,0.08)] hover:border-[rgba(28,25,23,0.14)] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(28,25,23,0.07)] group reveal">
              <div className="w-10 h-10 rounded-xl bg-[#F0E4D0] flex items-center justify-center mb-5 text-[#C17A3A]">
                <Package size={18} />
              </div>
              <h3 className="text-base font-serif font-medium text-[#1C1917] mb-2">
                Live Inventory Tracking
              </h3>
              <p className="font-sans text-[13px] text-[#78716C] leading-relaxed">
                Monitor stock levels in real-time. Get instant alerts when products dip below your defined thresholds — before you run out.
              </p>
            </div>

            {/* Card 2 (Featured Dark Card) */}
            <div className="bg-[#1C1917] text-white rounded-2xl p-6 sm:p-8 border border-[rgba(28,25,23,0.15)] hover:border-black transition-all duration-300 hover:shadow-[0_12px_40px_rgba(28,25,23,0.15)] group reveal" style={{ transitionDelay: '80ms' }}>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-5 text-white">
                <ShoppingCart size={18} />
              </div>
              <h3 className="text-base font-serif font-medium text-white mb-2">
                Order Lifecycle Control
              </h3>
              <p className="font-sans text-[13px] text-white/60 leading-relaxed">
                From creation to fulfillment. Automatically deduct stock on order, track status, and restore inventory on cancellation.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[rgba(28,25,23,0.08)] hover:border-[rgba(28,25,23,0.14)] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(28,25,23,0.07)] group reveal" style={{ transitionDelay: '160ms' }}>
              <div className="w-10 h-10 rounded-xl bg-[#F0E4D0] flex items-center justify-center mb-5 text-[#C17A3A]">
                <Shield size={18} />
              </div>
              <h3 className="text-base font-serif font-medium text-[#1C1917] mb-2">
                Bulletproof Business Rules
              </h3>
              <p className="font-sans text-[13px] text-[#78716C] leading-relaxed">
                Unique SKUs, email validation, negative stock prevention, and automatic total calculation — enforced at every layer.
              </p>
            </div>

          </div>

          {/* Bottom Tech Stack Strip */}
          <div className="mt-16 sm:mt-20 bg-white border border-[rgba(28,25,23,0.08)] rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-12 reveal">
            <div>
              <h4 className="text-lg font-serif italic text-[#1C1917] mb-1">
                Full-Stack, Fully Containerized
              </h4>
              <p className="font-sans text-[13px] text-[#78716C] leading-relaxed max-w-[620px]">
                Python FastAPI backend, React frontend, PostgreSQL database — all orchestrated with Docker Compose and deployable in one command.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {[
                { name: 'FastAPI', color: 'bg-green-400' },
                { name: 'React', color: 'bg-blue-400' },
                { name: 'PostgreSQL', color: 'bg-indigo-400' },
                { name: 'Docker', color: 'bg-sky-400' },
                { name: 'Render', color: 'bg-purple-400' },
                { name: 'Vercel', color: 'bg-black' }
              ].map((tech) => (
                <div
                  key={tech.name}
                  className="flex items-center gap-2 border border-[rgba(28,25,23,0.14)] rounded-full px-4 py-2 text-[12px] font-sans font-semibold text-[#1C1917]"
                >
                  <span className={`w-2 h-2 rounded-full ${tech.color}`}></span>
                  <span>{tech.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          SECTION 3: ENDPOINTS / API
          ──────────────────────────────────────────────────────── */}
      <section id="api" className="bg-[#FAF8F5] py-20 sm:py-28 lg:py-36">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">

          {/* Header */}
          <div className="reveal mb-12 sm:mb-16">


            <h2 className="text-[#1C1917] tracking-[-0.02em] font-serif leading-[1.1]" style={{ fontSize: 'clamp(1.6rem, 4vw, 3.4rem)' }}>
              Every endpoint,
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              every edge case — handled.
            </h2>
          </div>

          {/* Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[55%_1fr] gap-10 lg:gap-16">

            {/* Left API Reference Cards */}
            <div className="flex flex-col gap-4 reveal">

              {/* Group 1: Products */}
              <div className="bg-white border border-[rgba(28,25,23,0.08)] rounded-2xl overflow-hidden shadow-xs">
                <div className="bg-[#F2EDE6] px-5 py-3 flex items-center gap-2.5">
                  <Package size={14} className="text-[#78716C]" />
                  <span className="text-[13px] font-sans font-semibold text-[#1C1917]">Products</span>
                  <span className="text-[11px] font-sans text-[#78716C] ml-auto">5 endpoints</span>
                </div>
                <div className="divide-y divide-[rgba(28,25,23,0.06)]">
                  {[
                    { method: 'POST', path: '/products', desc: 'Create product', col: 'bg-green-50 text-green-700 border-green-100' },
                    { method: 'GET', path: '/products', desc: 'List all products', col: 'bg-blue-50 text-blue-700 border-blue-100' },
                    { method: 'GET', path: '/products/{id}', desc: 'Get product details', col: 'bg-blue-50 text-blue-700 border-blue-100' },
                    { method: 'PUT', path: '/products/{id}', desc: 'Update product', col: 'bg-amber-50 text-amber-700 border-amber-100' },
                    { method: 'DELETE', path: '/products/{id}', desc: 'Delete product', col: 'bg-red-50 text-red-700 border-red-100' }
                  ].map((row, idx) => (
                    <div key={idx} className="flex items-center gap-4 px-5 py-3 hover:bg-[#FAF8F5]">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${row.col} font-mono w-16 text-center`}>
                        {row.method}
                      </span>
                      <span className="font-mono text-xs text-[#1C1917] truncate">{row.path}</span>
                      <span className="text-xs text-[#78716C] ml-auto">{row.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Group 2: Orders */}
              <div className="bg-white border border-[rgba(28,25,23,0.08)] rounded-2xl overflow-hidden shadow-xs">
                <div className="bg-[#F2EDE6] px-5 py-3 flex items-center gap-2.5">
                  <ShoppingCart size={14} className="text-[#78716C]" />
                  <span className="text-[13px] font-sans font-semibold text-[#1C1917]">Orders</span>
                  <span className="text-[11px] font-sans text-[#78716C] ml-auto">4 endpoints</span>
                </div>
                <div className="divide-y divide-[rgba(28,25,23,0.06)]">
                  {[
                    { method: 'POST', path: '/orders', desc: 'Create order & snapshot price', col: 'bg-green-50 text-green-700 border-green-100' },
                    { method: 'GET', path: '/orders', desc: 'List all orders', col: 'bg-blue-50 text-blue-700 border-blue-100' },
                    { method: 'GET', path: '/orders/{id}', desc: 'Get order details & items', col: 'bg-blue-50 text-blue-700 border-blue-100' },
                    { method: 'DELETE', path: '/orders/{id}', desc: 'Cancel order & restore stock', col: 'bg-red-50 text-red-700 border-red-100' }
                  ].map((row, idx) => (
                    <div key={idx} className="flex items-center gap-4 px-5 py-3 hover:bg-[#FAF8F5]">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${row.col} font-mono w-16 text-center`}>
                        {row.method}
                      </span>
                      <span className="font-mono text-xs text-[#1C1917] truncate">{row.path}</span>
                      <span className="text-xs text-[#78716C] ml-auto">{row.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Group 3: Dashboard */}
              <div className="bg-white border border-[rgba(28,25,23,0.08)] rounded-2xl overflow-hidden shadow-xs">
                <div className="bg-[#F2EDE6] px-5 py-3 flex items-center gap-2.5">
                  <BarChart2 size={14} className="text-[#78716C]" />
                  <span className="text-[13px] font-sans font-semibold text-[#1C1917]">Dashboard</span>
                  <span className="text-[11px] font-sans text-[#78716C] ml-auto">1 endpoint</span>
                </div>
                <div className="px-5 py-3 flex items-center gap-4 hover:bg-[#FAF8F5]">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border bg-blue-50 text-blue-700 border-blue-100 font-mono w-16 text-center">
                    GET
                  </span>
                  <span className="font-mono text-xs text-[#1C1917]">/dashboard/stats</span>
                  <span className="text-xs text-[#78716C] ml-auto">Summary stats & low stock</span>
                </div>
              </div>

            </div>

            {/* Right Business Rules Visual Card */}
            <div className="bg-[#1C1917] rounded-2xl p-6 sm:p-8 flex flex-col justify-between reveal" style={{ transitionDelay: '80ms' }}>
              <div>
                <span className="text-[11px] font-sans font-semibold text-white/40 uppercase tracking-widest block mb-4">
                  Business logic
                </span>
                <h3 className="text-white text-2xl font-serif italic leading-snug mb-6">
                  Rules enforced
                  <br />
                  at every layer.
                </h3>

                {/* Rules List */}
                <div className="flex flex-col gap-4">
                  {[
                    'Unique SKU & email validation across all entities',
                    'Stock floor: quantity can never go negative',
                    'Orders blocked if insufficient inventory',
                    'Stock auto-deducted on order creation',
                    'Price snapshots captured at time of order'
                  ].map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-3.5">
                      <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={11} className="text-white" />
                      </div>
                      <span className="font-sans text-[13px] text-white/70 leading-normal">
                        {rule}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Bottom */}
              <div
                onClick={() => navigate('/dashboard')}
                className="group mt-10 pt-6 border-t border-white/10 flex items-center justify-between cursor-pointer"
              >
                <span className="text-white font-sans text-[13px] font-semibold">
                  <TextRoll text="Explore the API docs" />
                </span>

                <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#1C1917] group-hover:-rotate-45 transition-transform duration-300">
                  <ArrowRight size={12} />
                </span>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          FOOTER
          ──────────────────────────────────────────────────────── */}
      <footer className="bg-[#1C1917] py-12 border-t border-white/5">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">

          {/* Left Brand */}
          <div>
            <div className="flex items-center gap-2 text-white">
              <div className="w-6 h-6 bg-white text-[#1C1917] rounded-[4px] flex items-center justify-center font-serif italic text-[10px] font-bold">
                K/
              </div>
              <span className="font-sans font-medium text-[13px] tracking-tight">Kargo</span>
            </div>
            <p className="text-white/40 text-[12px] font-sans mt-1">
              Inventory, simplified.
            </p>
          </div>

          {/* Links */}
          <div className="hidden sm:flex items-center gap-6 text-[12px] font-sans text-white/50">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="hover:text-white/80 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

        </div>
      </footer>
    </div>
  )
}
