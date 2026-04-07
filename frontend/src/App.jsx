import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = '/api/expenses';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    title: '',
    category: '',
    amount: '',
    date: '',
    description: ''
  });
  const [editingId, setEditingId] = useState(null);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(API_URL);
      setExpenses(res.data);
    } catch (err) {
      console.error('Failed to fetch expenses', err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post(API_URL, form);
      }
      setForm({ title: '', category: '', amount: '', date: '', description: '' });
      fetchExpenses();
    } catch (err) {
      console.error('Save failed', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchExpenses();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense.id);
    setForm({
      title: expense.title,
      category: expense.category,
      amount: expense.amount,
      date: expense.date,
      description: expense.description || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ title: '', category: '', amount: '', date: '', description: '' });
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Expense Tracker</h1>
        <p className="subtitle">Track your daily spending</p>
      </header>
      <div className="form-card">
        <h2>{editingId ? 'Edit Expense' : 'Add New Expense'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Title</label>
              <input
                name="title"
                placeholder="e.g., Groceries"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input
                name="category"
                placeholder="e.g., Food, Transport"
                value={form.category}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Amount ($)</label>
              <input
                type="number"
                step="0.01"
                name="amount"
                placeholder="0.00"
                value={form.amount}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Description (optional)</label>
              <input
                name="description"
                placeholder="Add a note..."
                value={form.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingId ? 'Update Expense' : 'Add Expense'}
            </button>
            {editingId && (
              <button type="button" className="btn-secondary" onClick={handleCancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="expenses-list">
        <h2>Your Expenses</h2>
        {expenses.length === 0 ? (
          <p className="empty-message">No expenses yet. Add your first expense above!</p>
        ) : (
          <div className="expenses-grid">
            {expenses.map((exp) => (
              <div key={exp.id} className="expense-card">
                <div className="expense-header">
                  <h3>{exp.title}</h3>
                  <span className="expense-category">{exp.category}</span>
                </div>
                <div className="expense-details">
                  <span className="expense-amount">${parseFloat(exp.amount).toFixed(2)}</span>
                  <span className="expense-date">{exp.date}</span>
                </div>
                {exp.description && <p className="expense-description">{exp.description}</p>}
                <div className="expense-actions">
                  <button onClick={() => handleEdit(exp)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(exp.id)} className="delete-btn">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;