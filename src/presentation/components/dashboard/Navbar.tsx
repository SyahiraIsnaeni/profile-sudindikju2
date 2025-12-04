'use client';

import { usePathname } from 'next/navigation';

export const Navbar = () => {
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    const titles: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/dashboard/users': 'Manajemen Users',
      '/dashboard/articles': 'Manajemen Articles',
    };
    return titles[path] || 'Dashboard';
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 shadow-sm sticky top-0 z-20">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900">
        {getPageTitle(pathname)}
      </h1>
    </nav>
  );
};