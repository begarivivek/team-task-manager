import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const openMobileSidebar = () => setIsMobileSidebarOpen(true);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onMenuClick={openMobileSidebar} />
      <div className="flex">
        <Sidebar isMobileOpen={isMobileSidebarOpen} onClose={closeMobileSidebar} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;