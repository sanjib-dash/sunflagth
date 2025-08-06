import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar shadow-md">
      <div className="navbar-title">Inventory System</div>
      <div className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/inventory">Inventory</Link>
        <Link to="/stock">Stock In/Out</Link>
        <Link to="/production">Production</Link>
        <Link to="/logs">Logs</Link>
      </div>
    </nav>
  );
};

export default Navbar;
