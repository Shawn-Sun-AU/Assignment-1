import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// 使用代理，API 前缀为 /api
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

  // 获取所有开支
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
      fetchExpenses(); // 刷新列表
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
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ title: '', category: '', amount: '', date: '', description: '' });
  };

  return (
    <div className="container">
      <h1>Expense Tracker</h1>
      <form onSubmit={handleSubmit} className="expense-form">
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="category" placeholder="Category (such as catering, transportation)" value={form.category} onChange={handleChange} required />
        <input name="amount" type="number" step="0.01" placeholder="Amount" value={form.amount} onChange={handleChange} required />
        <input name="date" type="date" value={form.date} onChange={handleChange} required />
        <input name="description" placeholder="Description (Optional)" value={form.description} onChange={handleChange} />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
        {editingId && <button type="button" onClick={handleCancelEdit}>Cancel</button>}
      </form>
      <ul className="expense-list">
        {expenses.map(exp => (
          <li key={exp.id}>
            <div className="expense-info">
              <strong>{exp.title}</strong> - {exp.category} - ¥{exp.amount} - {exp.date}
              {exp.description && <span className="desc"> ({exp.description})</span>}
            </div>
            <div className="actions">
              <button onClick={() => handleEdit(exp)}>edit</button>
              <button onClick={() => handleDelete(exp.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;