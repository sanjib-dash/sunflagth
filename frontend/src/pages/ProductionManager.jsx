// src/pages/ProductionManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const ProductionManager = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [productions, setProductions] = useState([]);
  const [form, setForm] = useState({
    item_id: '',
    product_name: '',
    quantity: '',
  });
  const [availableQty, setAvailableQty] = useState(0);
  const [message, setMessage] = useState('');

  const API = 'http://localhost:5000/api/production';

  useEffect(() => {
    fetchInventory();
    fetchProductions();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/inventory');
      setInventoryItems(res.data);
    } catch (err) {
      console.error('Error loading inventory:', err);
    }
  };

  const fetchProductions = async () => {
    try {
      const res = await axios.get(API);
      setProductions(res.data);
    } catch (err) {
      console.error('Error loading productions:', err);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === 'item_id') {
      const selectedItem = inventoryItems.find(item => item.id === parseInt(value));
      setAvailableQty(selectedItem ? selectedItem.quantity : 0);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(API, form);
      setMessage('Production recorded');
      setForm({ item_id: '', product_name: '', quantity: '' });
      setAvailableQty(0);
      fetchProductions();
    } catch (err) {
      console.error('Production error:', err);
      setMessage('Error saving production');
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-8 min-h-screen bg-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-center">Production Manager</h2>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded p-6 max-w-2xl mx-auto mb-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Select Raw Material</label>
              <select
                name="item_id"
                value={form.item_id}
                onChange={handleChange}
                required
                className="border p-2 rounded w-full"
              >
                <option value="">-- Select Item --</option>
                {inventoryItems.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.item_name} ({item.quantity} {item.unit})
                  </option>
                ))}
              </select>
              {availableQty > 0 && (
                <p className="text-sm mt-1 text-gray-600">Available: {availableQty}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Production Quantity</label>
              <input
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">Product Name</label>
              <input
                name="product_name"
                value={form.product_name}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                placeholder="Final product name"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Production
          </button>

          {message && <p className="mt-4 text-blue-600">{message}</p>}
        </form>

        {/* Table */}
        <div className="bg-white shadow-md rounded p-6 max-w-5xl mx-auto">
          <h3 className="text-xl font-semibold mb-4">Production Records</h3>
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Product</th>
                <th className="border p-2">Raw Material</th>
                <th className="border p-2">Qty Used</th>
                <th className="border p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {productions.map(p => (
                <tr key={p.id} className="text-center">
                  <td className="border p-2">{p.product_name}</td>
                  <td className="border p-2">{p.item_name}</td>
                  <td className="border p-2">{p.quantity}</td>
                  <td className="border p-2">{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {productions.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-gray-500 p-4">
                    No production records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ProductionManager;
