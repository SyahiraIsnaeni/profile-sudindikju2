'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLogin } from '@/presentation/composables/useLogin';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, Home, Menu, X } from 'lucide-react';
import { Database } from 'lucide-react';

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, getCurrentUser } = useLogin();
  const router = useRouter();
  const pathname = usePathname();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const menuItems = [
    { label: 'Dashboard', icon: Home, href: '/dashboard' },
    { label: 'Master Data', icon: Database, href: '/dashboard/master-data' },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 bg-blue-900 text-white p-2 rounded-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static top-0 left-0 h-screen w-64 bg-blue-900 text-white
          transform lg:transform-none transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          z-40 shadow-lg flex flex-col
        `}
      >
        {/* Header dengan Logo */}
        <div className="p-6 border-b border-blue-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
              <Image
                src="/images/logo_sudindikju2.jpg"
                alt="Logo Sudin"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-sm font-bold leading-tight">Suku Dinas</h1>
              <p className="text-xs text-blue-100">Wilayah II Jakarta Utara</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition text-sm font-medium ${
                isActive(item.href)
                  ? 'bg-blue-800 border-l-4 border-white text-white'
                  : 'hover:bg-blue-800 text-blue-100'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Footer - User Info */}
        <div className="border-t border-blue-800 p-4 space-y-4">
          <div className="space-y-2">
            <p className="text-xs text-blue-200">Logged in as</p>
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-blue-100 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 active:bg-red-800 px-4 py-2 rounded-lg transition text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay untuk mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};