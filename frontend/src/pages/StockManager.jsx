import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const StockManager = () => {
  const [stockEntries, setStockEntries] = useState([]);
  const [form, setForm] = useState({
    item_name: '',
    type: 'in', // 'in' or 'out'
    quantity: '',
  });
  const [message, setMessage] = useState('');

  const API = 'http://localhost:5000/api/stock';

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      const res = await axios.get(API);
      setStockEntries(res.data);
    } catch (err) {
      console.error('Error loading stock entries:', err);
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(API, form);
      setMessage('Stock entry saved');
      setForm({ item_name: '', type: 'in', quantity: '' });
      fetchStock();
    } catch (err) {
      setMessage('Error saving stock entry');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Stock In / Out</h2>

        <form onSubmit={handleSubmit} className="bg-white rounded shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="item_name"
              value={form.item_name}
              onChange={handleChange}
              placeholder="Item Name"
              className="form-input"
              required
            />
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="form-input"
            >
              <option value="in">Stock In</option>
              <option value="out">Stock Out</option>
            </select>
            <input
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              placeholder="Quantity"
              type="number"
              className="form-input"
              required
            />
          </div>
          <div className="mt-4">
            <button type="submit" className="btn-primary">
              Add Entry
            </button>
            {message && <p className="text-green-600 mt-2">{message}</p>}
          </div>
        </form>

        <div className="bg-white shadow-md rounded p-6">
          <h3 className="text-xl font-semibold mb-4">Stock Entries</h3>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stockEntries.map(entry => (
                <tr key={entry.id}>
                  <td>{entry.item_name}</td>
                  <td className={entry.type === 'in' ? 'text-green-600' : 'text-red-600'}>
                    {entry.type === 'in' ? 'In' : 'Out'}
                  </td>
                  <td>{entry.quantity}</td>
                  <td>{new Date(entry.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {stockEntries.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-gray-400">No stock records</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockManager;
