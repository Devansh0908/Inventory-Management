import React from 'react'
import { useForm } from 'react-hook-form'

export default function CustomerForm({ onSubmit, onCancel, isSubmitting }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      full_name: '',
      email: '',
      phone: ''
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1.5">
          Full Name
        </label>
        <input
          type="text"
          {...register('full_name', { required: 'Customer full name is required' })}
          className={`w-full px-3.5 py-2.5 bg-[#FAF8F5] border rounded-lg text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#C17A3A] focus:border-[#C17A3A] ${
            errors.full_name ? 'border-red-400 bg-red-50/10' : 'border-[#E8E0D5]'
          }`}
          placeholder="e.g. Aryan K."
        />
        {errors.full_name && (
          <p className="mt-1 text-xs text-red-500 font-medium">{errors.full_name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1.5">
          Email Address
        </label>
        <input
          type="email"
          {...register('email', {
            required: 'Email address is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Please enter a valid email format'
            }
          })}
          className={`w-full px-3.5 py-2.5 bg-[#FAF8F5] border rounded-lg text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#C17A3A] focus:border-[#C17A3A] ${
            errors.email ? 'border-red-400 bg-red-50/10' : 'border-[#E8E0D5]'
          }`}
          placeholder="e.g. aryan.k@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500 font-medium">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1.5">
          Phone Number
        </label>
        <input
          type="text"
          {...register('phone', { required: 'Phone number is required' })}
          className={`w-full px-3.5 py-2.5 bg-[#FAF8F5] border rounded-lg text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#C17A3A] focus:border-[#C17A3A] ${
            errors.phone ? 'border-red-400 bg-red-50/10' : 'border-[#E8E0D5]'
          }`}
          placeholder="e.g. +1-555-0199"
        />
        {errors.phone && (
          <p className="mt-1 text-xs text-red-500 font-medium">{errors.phone.message}</p>
        )}
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
          {isSubmitting ? 'Saving...' : 'Add Customer'}
        </button>
      </div>
    </form>
  )
}
