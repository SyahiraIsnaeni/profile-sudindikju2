'use client';

import { usePathname } from 'next/navigation';

export const Navbar = () => {
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    const titles: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/dashboard/users': 'Users',
      '/dashboard/articles': 'Articles',
    };
    return titles[path] || 'Dashboard';
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-8 py-4 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900">
        {getPageTitle(pathname)}
      </h1>
    </nav>
  );
};