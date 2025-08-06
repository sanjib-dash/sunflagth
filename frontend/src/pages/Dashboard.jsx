import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Boxes, ArrowDown, ArrowUp } from 'lucide-react';

const Dashboard = () => {
  const [counts, setCounts] = useState({
    inventoryCount: 0,
    stockIn: 0,
    stockOut: 0,
  });

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/dashboard')
      .then((res) => setCounts(res.data))
      .catch((err) => console.log(err));
  }, []);

  const stockData = [
    { name: 'Jan', stock: 400 },
    { name: 'Feb', stock: 300 },
    { name: 'Mar', stock: 500 },
  ];

  const productionData = [
    { name: 'Pending', value: 2 },
    { name: 'In Progress', value: 4 },
    { name: 'Completed', value: 6 },
  ];

  const categoryData = [
    { name: 'Raw', value: 3 },
    { name: 'Finished', value: 5 },
    { name: 'WIP', value: 2 },
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white shadow-md p-6 rounded-xl text-center">
            <Boxes className="mx-auto text-blue-500 mb-2" size={32} />
            <h2 className="text-lg font-semibold text-gray-700">Inventory Items</h2>
            <p className="text-3xl font-bold text-blue-600">{counts.inventoryCount}</p>
          </div>
          <div className="bg-white shadow-md p-6 rounded-xl text-center">
            <ArrowDown className="mx-auto text-green-500 mb-2" size={32} />
            <h2 className="text-lg font-semibold text-gray-700">Stock In</h2>
            <p className="text-3xl font-bold text-green-600">{counts.stockIn}</p>
          </div>
          <div className="bg-white shadow-md p-6 rounded-xl text-center">
            <ArrowUp className="mx-auto text-red-500 mb-2" size={32} />
            <h2 className="text-lg font-semibold text-gray-700">Stock Out</h2>
            <p className="text-3xl font-bold text-red-600">{counts.stockOut}</p>
          </div>
        </div>

        {/* First Row: Stock Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
          <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-2">Stock Trend</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stockData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stock" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Second Row: Pie Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Production Status */}
          <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-2">Production Status</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={productionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label
                >
                  {productionData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Inventory by Category */}
          <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-2">Inventory by Category</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
