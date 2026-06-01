import React from 'react'
import { useForm } from 'react-hook-form'

export default function ProductForm({ onSubmit, initialData, onCancel, isSubmitting }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      name: '',
      sku: '',
      price: '',
      quantity: ''
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1.5">
          Product Name
        </label>
        <input
          type="text"
          {...register('name', { required: 'Product name is required' })}
          className={`w-full px-3.5 py-2.5 bg-[#FAF8F5] border rounded-lg text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#C17A3A] focus:border-[#C17A3A] ${
            errors.name ? 'border-red-400 bg-red-50/10' : 'border-[#E8E0D5]'
          }`}
          placeholder="e.g. Wireless Keyboard Pro"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500 font-medium">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1.5">
          SKU Code
        </label>
        <input
          type="text"
          {...register('sku', { required: 'SKU code is required' })}
          className={`w-full px-3.5 py-2.5 bg-[#FAF8F5] border rounded-lg text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#C17A3A] focus:border-[#C17A3A] ${
            errors.sku ? 'border-red-400 bg-red-50/10' : 'border-[#E8E0D5]'
          }`}
          placeholder="e.g. WKP-001"
        />
        {errors.sku && (
          <p className="mt-1 text-xs text-red-500 font-medium">{errors.sku.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1.5">
            Price (₹)
          </label>
          <input
            type="number"
            step="0.01"
            {...register('price', {
              required: 'Price is required',
              validate: {
                positive: (val) => parseFloat(val) > 0 || 'Price must be greater than 0'
              }
            })}
            className={`w-full px-3.5 py-2.5 bg-[#FAF8F5] border rounded-lg text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#C17A3A] focus:border-[#C17A3A] ${
              errors.price ? 'border-red-400 bg-red-50/10' : 'border-[#E8E0D5]'
            }`}
            placeholder="89.99"
          />
          {errors.price && (
            <p className="mt-1 text-xs text-red-500 font-medium">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1.5">
            Quantity in Stock
          </label>
          <input
            type="number"
            {...register('quantity', {
              required: 'Quantity is required',
              validate: {
                nonNegative: (val) => parseInt(val, 10) >= 0 || 'Quantity must be 0 or more',
                integer: (val) => Number.isInteger(parseFloat(val)) || 'Quantity must be a whole number'
              }
            })}
            className={`w-full px-3.5 py-2.5 bg-[#FAF8F5] border rounded-lg text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#C17A3A] focus:border-[#C17A3A] ${
              errors.quantity ? 'border-red-400 bg-red-50/10' : 'border-[#E8E0D5]'
            }`}
            placeholder="100"
          />
          {errors.quantity && (
            <p className="mt-1 text-xs text-red-500 font-medium">{errors.quantity.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-[#1C1917]/10">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-[#F2EDE6] hover:bg-[#E8E0D5] text-[#1C1917] rounded-full text-xs font-semibold transition duration-200"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-[#1C1917] hover:bg-[#2C2925] text-white rounded-full text-xs font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  )
}
