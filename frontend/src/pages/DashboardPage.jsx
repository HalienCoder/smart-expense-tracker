import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Pie } from 'react-chartjs-2';
import { fetchExpenses, addExpense, deleteExpense, updateExpense } from '../services/expenseService';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
  });

  // Fetch expenses on mount
  useEffect(() => {
    const getExpenses = async () => {
      try {
        const data = await fetchExpenses(user.id);
        setExpenses(data);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
      setLoading(false);
    };

    if (user) getExpenses();
  }, [user]);

  // Chart Data Preparation
  const categoryData = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: 'Expenses by Category',
        data: Object.values(categoryData),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newExpense = {
      ...formData,
      amount: parseFloat(formData.amount),
      user_id: user.id,
    };

    try {
      const added = await addExpense(newExpense);
      setExpenses([added, ...expenses]);
      setFormData({ title: '', amount: '', category: '' });
    } catch (error) {
      console.error('Error adding expense:', error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      setExpenses(expenses.filter((exp) => exp.id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error.message);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
  
  <div className="flex justify-between items-center pb-4 mb-8 border-b border-gray-200">
  <h1 className="text-4xl font-bold text-gray-900">
    Expense Dashboard
  </h1>  
  <button
    onClick={logout}
    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
  >
    Logout
  </button>
</div>

  <div className="flex flex-col md:flex-row gap-8 mb-8">
    {/* Pie Chart Section */}
    <div className="flex-1 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Expenses Overview</h2>
      <div className="w-full max-w-md mx-auto">
        <Pie data={chartData} />
      </div>
    </div>

    {/* Add Expense Form */}
    <form 
      onSubmit={handleSubmit}
      className="flex-1 bg-white p-8 rounded-xl shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800">Add New Expense</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Expense Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          required
        />
      </div>
      <button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Add Expense
      </button>
    </form>
  </div>

  {/* Expense List */}
  <div className="bg-white p-8 rounded-xl shadow-lg">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold text-gray-800">Recent Expenses</h2>
      <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors">
        View All Expenses
      </button>
    </div>
    
    <ul className="space-y-4">
      {expenses.slice(0, 5).map((expense) => (
        <li 
          key={expense.id}
          className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div>
            <span className="font-medium text-gray-900">{expense.title}</span>
            <span className="text-sm text-gray-500 ml-3">({expense.category})</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="font-medium text-gray-900">₹{expense.amount}</span>
            <button
              onClick={() => handleDelete(expense.id)}
              className="text-red-500 hover:text-red-700 px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>
</div>
  );
}
