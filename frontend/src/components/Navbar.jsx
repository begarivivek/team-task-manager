import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu } from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowUserMenu(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Left section - Menu button + Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden text-gray-600 hover:text-gray-900 focus:outline-none p-1.5 sm:p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu size={22} />
            </button>

            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-1.5 sm:space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-base sm:text-lg">T</span>
              </div>
              {/* Full name - shows on tablet and desktop */}
              <span className="font-bold text-base sm:text-lg md:text-xl text-gray-800 hidden md:inline-block">
                Team Task Manager
              </span>
              {/* Short name - shows on mobile */}
              <span className="font-bold text-sm sm:text-base text-gray-800 md:hidden">
                Task Manager
              </span>
            </Link>
          </div>

          {/* Right section - User menu */}
          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-1.5 sm:space-x-2 focus:outline-none"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={14} className="sm:text-blue-600" />
                </div>
                {/* User name - hide on very small screens */}
                <span className="text-xs sm:text-sm font-medium text-gray-700 hidden xs:inline-block">
                  {user?.name?.split(' ')[0]}
                </span>
                {/* Role badge - hide on mobile */}
                <span className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 rounded-full text-gray-600 hidden sm:inline-block">
                  {user?.role}
                </span>
              </button>

              {/* User dropdown menu */}
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600 inline-block mt-1">
                        {user?.role}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-red-600 hover:bg-gray-50 w-full px-4 py-3 rounded-b-lg transition-colors"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;