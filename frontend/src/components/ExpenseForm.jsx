import { useState } from 'react'

export default function ExpenseForm({ initialData = {}, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: initialData.title || '',
    amount: initialData.amount || '',
    category: initialData.category || '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      title: form.title,
      amount: parseFloat(form.amount),
      category: form.category,
    }
    onSave(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl space-y-6">
  <div className="space-y-6">
    <input
      type="text"
      placeholder="Title"
      value={form.title}
      onChange={(e) => setForm({ ...form, title: e.target.value })}
      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
      required
    />
    
    <input
      type="number"
      placeholder="Amount"
      value={form.amount}
      onChange={(e) => setForm({ ...form, amount: e.target.value })}
      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
      required
    />
    
    <input
      type="text"
      placeholder="Category"
      value={form.category}
      onChange={(e) => setForm({ ...form, category: e.target.value })}
      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
      required
    />
  </div>

  <div className="flex justify-end gap-4">
    <button
      type="button"
      onClick={onCancel}
      className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
    >
      Cancel
    </button>
    <button
      type="submit"
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
    >
      Save
    </button>
  </div>
</form>
  )
}
