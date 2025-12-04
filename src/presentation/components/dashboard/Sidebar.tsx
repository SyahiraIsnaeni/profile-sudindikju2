'use client';

import { useLogin } from '@/presentation/composables/useLogin';
import { useRouter } from 'next/navigation';
import { LogOut, Home, Users, FileText } from 'lucide-react';

export const Sidebar = () => {
  const { logout, getCurrentUser } = useLogin();
  const router = useRouter();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const menuItems = [
    { label: 'Dashboard', icon: Home, href: '/dashboard' },
    { label: 'Users', icon: Users, href: '/dashboard/users' },
    { label: 'Articles', icon: FileText, href: '/dashboard/articles' },
  ];

  return (
    <div className="w-64 bg-blue-900 text-white h-screen flex flex-col shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-blue-800">
        <h1 className="text-lg font-bold">Suku Dinas</h1>
        <p className="text-xs text-blue-100">Wilayah II Jakarta Utara</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      {/* Footer - User Info */}
      <div className="border-t border-blue-800 p-4">
        <div className="mb-4">
          <p className="text-xs text-blue-200">Logged in as</p>
          <p className="font-semibold truncate">{user?.name}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};