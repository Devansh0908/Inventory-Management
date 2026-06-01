import React, { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'

export default function OrderForm({ customers, products, onSubmit, onCancel, isSubmitting }) {
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      customer_id: '',
      items: [{ product_id: '', quantity: 1 }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  })

  const watchItems = watch('items')

  // Calculate a live total price based on the selected items and quantities
  const [totalPreview, setTotalPreview] = useState(0.0)

  useEffect(() => {
    let total = 0.0
    if (watchItems && watchItems.length > 0) {
      watchItems.forEach((item) => {
        const prod = products.find((p) => String(p.id) === String(item.product_id))
        if (prod && item.quantity > 0) {
          total += parseFloat(prod.price) * parseInt(item.quantity, 10)
        }
      })
    }
    setTotalPreview(total)
  }, [watchItems, products])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
      {/* Customer Field */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1.5">
          Select Customer
        </label>
        <select
          {...register('customer_id', { required: 'Please select a customer' })}
          className={`w-full px-3.5 py-2.5 bg-[#FAF8F5] border rounded-lg text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#C17A3A] focus:border-[#C17A3A] ${
            errors.customer_id ? 'border-red-400 bg-red-50/10' : 'border-[#E8E0D5]'
          }`}
        >
          <option value="">-- Choose Customer --</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.full_name} ({c.email})
            </option>
          ))}
        </select>
        {errors.customer_id && (
          <p className="mt-1 text-xs text-red-500 font-medium">{errors.customer_id.message}</p>
        )}
      </div>

      {/* Dynamic Order Line Items */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C]">
            Order Items
          </label>
          <button
            type="button"
            onClick={() => append({ product_id: '', quantity: 1 })}
            className="flex items-center gap-1 text-[11px] text-[#C17A3A] hover:text-[#9A5E22] font-semibold transition"
          >
            <Plus size={12} /> Add Item
          </button>
        </div>

        {fields.length === 0 && (
          <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100 font-medium">
            Please add at least one product item to this order.
          </p>
        )}

        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-[10px] text-[#78716C] mb-0.5">Product</label>
                <select
                  {...register(`items.${index}.product_id`, { required: 'Required' })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E8E0D5] rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#C17A3A] focus:border-[#C17A3A]"
                >
                  <option value="">-- Select Product --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (₹{p.price.toFixed(2)}) — Stock: {p.quantity}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-24">
                <label className="block text-[10px] text-[#78716C] mb-0.5">Qty</label>
                <input
                  type="number"
                  {...register(`items.${index}.quantity`, {
                    required: 'Required',
                    min: { value: 1, message: 'Min 1' },
                    validate: {
                      isInteger: (val) => Number.isInteger(parseFloat(val)) || 'Whole number'
                    }
                  })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E8E0D5] rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#C17A3A] focus:border-[#C17A3A]"
                  placeholder="1"
                />
              </div>

              <button
                type="button"
                onClick={() => remove(index)}
                className="p-2 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 rounded-lg transition"
                aria-label="Remove item"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Live Total Cost Preview */}
      <div className="bg-[#F2EDE6] p-4 rounded-xl flex justify-between items-center border border-[#E8E0D5]">
        <span className="text-xs font-semibold text-[#78716C] uppercase tracking-wider">
          Total Amount Preview
        </span>
        <span className="text-lg font-bold text-[#1C1917]">
          ₹{totalPreview.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      {/* Form Action Controls */}
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
          disabled={isSubmitting || fields.length === 0}
        >
          {isSubmitting ? 'Creating...' : 'Create Order'}
        </button>
      </div>
    </form>
  )
}
