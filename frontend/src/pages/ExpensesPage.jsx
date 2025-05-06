import { useState, useEffect } from 'react'
import { fetchExpenses, updateExpense, deleteExpense } from '../services/expenseService'
import { useAuth } from '../contexts/AuthContext'
import ExpenseForm from '../components/ExpenseForm'

export default function ExpensesPage() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // expense object or null

  // Fetch on mount / when user changes
  useEffect(() => {
    if (!user) return
    fetchExpenses(user.id)
      .then((data) => setExpenses(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user])

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id)
      setExpenses((prev) => prev.filter((e) => e.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const startEdit = (expense) => setEditing(expense)
  const cancelEdit = () => setEditing(null)

  const handleUpdate = async (updated) => {
    try {
      const data = await updateExpense(editing.id, updated)
      setExpenses((prev) =>
        prev.map((e) => (e.id === data.id ? data : e))
      )
      setEditing(null)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8 max-w-3xl mx-auto min-h-screen">
  <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
    <h1 className="text-3xl font-bold text-gray-900">All Expenses</h1>
    <div className="flex gap-2">
      {/* Add any additional header buttons if needed */}
    </div>
  </div>

  <ul className="space-y-3">
    {expenses.map((exp) => (
      <li
        key={exp.id}
        className="group flex justify-between items-center bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
      >
        <div className="space-y-1">
          <div className="font-semibold text-gray-900 text-lg">{exp.title}</div>
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <span className="font-medium text-green-600">₹{exp.amount}</span>
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
              {exp.category}
            </span>
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            <span className="text-gray-500">
              {new Date(exp.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => startEdit(exp)}
            className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(exp.id)}
            className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </li>
    ))}
  </ul>

  {/* Edit Modal/Form */}
  {editing && (
    <div className="fixed inset-0 bg-opacity-10 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Expense</h2>
          <button
            onClick={cancelEdit}
            className="text-gray-700 hover:text-gray-600 border py-1 px-3 rounded-xl"
          >
            ×
          </button>
        </div>
        <ExpenseForm
          initialData={editing}
          onCancel={cancelEdit}
          onSave={handleUpdate}
        />
      </div>
    </div>
  )}
</div>
  )
}
