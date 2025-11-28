'use client';

import { useNavbar } from '@/presentation/composables/useNavbar';
import { useState } from 'react';

export const Navbar = () => {
  const { isOpen, setIsOpen, isScrolled, activeMenu, handleMenuClick, menuItems } =
    useNavbar();
  const [hoverItem, setHoverItem] = useState<string | null>(null);

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 group cursor-pointer hover:scale-105 transition-transform">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Sudin JU2
            </div>
            <div className="text-xs text-gray-600 hidden sm:block">
              Jakarta Utara Wilayah 2
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleMenuClick(item.name)}
                onMouseEnter={() => setHoverItem(item.name)}
                onMouseLeave={() => setHoverItem(null)}
                className={`relative text-sm font-medium transition-colors py-2 ${
                  activeMenu === item.name
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {item.name}

                {/* Animated underline */}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ${
                    activeMenu === item.name || hoverItem === item.name
                      ? 'w-full'
                      : 'w-0'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <button
            className="hidden md:block px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Hubungi Kami
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="space-y-1.5">
              <div
                className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                  isOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <div
                className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                  isOpen ? 'opacity-0' : ''
                }`}
              />
              <div
                className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                  isOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isOpen ? 'max-h-64' : 'max-h-0'
          }`}
        >
          <div className="py-4 space-y-3 border-t border-gray-100">
            {menuItems.map((item, index) => (
              <button
                key={item.name}
                onClick={() => handleMenuClick(item.name)}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeMenu === item.name
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                style={{
                  transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? 'translateX(0)' : 'translateX(-20px)',
                  transition: 'all 0.3s ease',
                }}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Animated gradient line bottom */}
      <div
        className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 transition-opacity duration-300 ${
          isScrolled ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </nav>
  );
};