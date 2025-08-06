import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import InventoryManager from './pages/InventoryManager';
import StockManager from './pages/StockManager';
import ProductionManager from './pages/ProductionManager';
import StockLogs from './pages/StockLogs';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<InventoryManager />} />
        <Route path="/stock" element={<StockManager />} />
        <Route path="/production" element={<ProductionManager />} />
        <Route path="/logs" element={<StockLogs />} />
      </Routes>
      
    </Router>
  );
}

export default App;
