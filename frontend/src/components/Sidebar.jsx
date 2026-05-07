import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, User, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isMobileOpen, onClose }) => {
  const { isAdmin } = useAuth();
  
  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/projects', icon: FolderKanban, label: 'Projects' },
    { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];
  
  const SidebarContent = () => (
    <nav className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 lg:hidden">
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg text-gray-800">Menu</span>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
      </div>
      <div className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar - Always visible */}
      <aside className="hidden lg:block w-64 bg-white shadow-lg min-h-screen fixed left-0 top-16 overflow-y-auto z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar - Overlay that slides in from left */}
      {isMobileOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
          <div className="fixed left-0 top-0 bottom-0 w-72 bg-white shadow-xl z-50 lg:hidden transform transition-transform duration-300 ease-out">
            <SidebarContent />
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;