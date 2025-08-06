import React from 'react';
import { FaHome, FaBox, FaIndustry, FaClipboardList } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const SidebarLayout = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { to: '/dashboard', icon: <FaHome />, label: 'Dashboard' },
    { to: '/inventory', icon: <FaBox />, label: 'Inventory' },
    { to: '/stock', icon: <FaClipboardList />, label: 'Stock In/Out' },
    { to: '/production', icon: <FaIndustry />, label: 'Production' },
    { to: '/logs', icon: <FaClipboardList />, label: 'Logs' },
    { to: '/reports', icon: <FaClipboardList />, label: 'Reports' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-md p-6 space-y-6">
        <h1 className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 tracking-wide">
          Inventory System
        </h1>
        <nav className="space-y-1">
          {navItems.map(({ to, icon, label }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-white'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="text-lg">{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 transition-all">
        {children}
      </main>
    </div>
  );
};

export default SidebarLayout;
