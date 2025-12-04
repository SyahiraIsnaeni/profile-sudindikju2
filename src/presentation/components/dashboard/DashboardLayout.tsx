'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gray-50 flex-col lg:flex-row">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        {/* Navbar */}
        <Navbar />

        {/* Content */}
        <main className="flex-1 p-4 md:p-8 lg:p-8 mt-12 lg:mt-0 overflow-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-4 md:px-8 py-4 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="text-xs md:text-sm text-gray-600">
              <p>© 2025 SDN Sukapura 01. All Rights Reserved.</p>
              <p>Handcrafted and made with <span className="text-red-500">❤</span> by Tim IT Sudindik JU2</p>
            </div>
            <div className="text-xs text-gray-500">
              <p>Version 1.0.0</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};