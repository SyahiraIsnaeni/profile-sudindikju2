'use client';

import { useNavbar } from '@/presentation/composables/useNavbar';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { isOpen, setIsOpen, scrolled, navLinks } = useNavbar();

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-24 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
            SD
          </div>
          <div className="flex flex-col">
            <span
              className={`font-bold leading-none ${
                scrolled ? 'text-gray-900' : 'text-white'
              }`}
            >
              Sudin Pendidikan
            </span>
            <span
              className={`text-xs ${
                scrolled ? 'text-gray-500' : 'text-white/80'
              }`}
            >
              Wilayah II Jakarta Utara
            </span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-sm font-medium hover:text-blue-500 transition-colors ${
                scrolled ? 'text-gray-700' : 'text-white/90'
              }`}
            >
              {link.name}
            </a>
          ))}
          <button className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-600/30">
            Layanan Pendidikan
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className={scrolled ? 'text-gray-900' : 'text-white'} />
          ) : (
            <Menu className={scrolled ? 'text-gray-900' : 'text-white'} />
          )}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-t absolute top-full left-0 right-0 shadow-lg">
          <div className="flex flex-col p-4 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-blue-600 font-medium block py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <button className="bg-blue-600 text-white px-4 py-3 rounded-lg text-sm font-semibold w-full">
              Layanan Pendidikan
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};