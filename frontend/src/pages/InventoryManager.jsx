import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../assets/global.css';

const InventoryManager = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    item_name: '',
    category: '',
    unit: '',
    quantity: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const API = 'http://localhost:5000/api/inventory';

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(API);
      setItems(res.data);
    } catch (err) {
      console.error('Error loading inventory:', err);
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, form);
        setMessage('Item updated successfully');
      } else {
        await axios.post(API, form);
        setMessage('Item added successfully');
      }
      setForm({ item_name: '', category: '', unit: '', quantity: '' });
      setEditingId(null);
      fetchItems();
    } catch (err) {
      setMessage('Error saving item');
    }
  };

  const handleEdit = item => {
    setForm(item);
    setEditingId(item.id);
  };

  const handleDelete = async id => {
    if (window.confirm('Delete this item?')) {
      try {
        await axios.delete(`${API}/${id}`);
        fetchItems();
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  return (
    <div className="page-container">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
          Inventory Manager
        </h1>

        {/* Add / Edit Form */}
        <form onSubmit={handleSubmit} className="form-card">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="item_name"
              value={form.item_name}
              onChange={handleChange}
              placeholder="Item Name"
              className="form-input"
              required
            />
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Category"
              className="form-input"
            />
            <input
              name="unit"
              value={form.unit}
              onChange={handleChange}
              placeholder="Unit (e.g. Kg, Pcs)"
              className="form-input"
            />
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

          <div className="mt-6">
            <button type="submit" className="btn-primary">
              {editingId ? 'Update Item' : 'Add Item'}
            </button>
          </div>

          {message && (
            <p className="mt-4 text-green-700 font-medium">{message}</p>
          )}
        </form>

        {/* Inventory Table */}
        <div className="table-card">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Inventory List
          </h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Unit</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>{item.item_name}</td>
                  <td>{item.category}</td>
                  <td>{item.unit}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:underline mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-4 text-gray-500 text-center">
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryManager;
