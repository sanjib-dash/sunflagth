import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StockLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/stock-logs')
      .then(res => setLogs(res.data))
      .catch(err => console.error('Error loading logs:', err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Stock Logs</h1>
      <div className="bg-white shadow-md rounded p-6 max-w-6xl mx-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Item</th>
              <th className="border p-2">Action</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Source</th>
              <th className="border p-2">Reference ID</th>
              <th className="border p-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td className="border p-2">{log.item_name}</td>
                <td className="border p-2">{log.action}</td>
                <td className="border p-2">{log.quantity}</td>
                <td className="border p-2">{log.source}</td>
                <td className="border p-2">{log.reference_id || '-'}</td>
                <td className="border p-2">{new Date(log.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No stock logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockLogs;
