'use client';

import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                SD
              </div>
              <div className="flex flex-col">
                <span className="font-bold leading-none text-white">Sudin Pendidikan</span>
                <span className="text-xs text-gray-400">Wilayah II Jakarta Utara</span>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Mewujudkan pendidikan yang tuntas dan berkualitas untuk semua.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Tautan Cepat</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="#hero" className="hover:text-blue-400 transition-colors">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-blue-400 transition-colors">
                  Profil
                </a>
              </li>
              <li>
                <a href="#programs" className="hover:text-blue-400 transition-colors">
                  Program
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-blue-400 transition-colors">
                  Layanan
                </a>
              </li>
              <li>
                <a href="#news" className="hover:text-blue-400 transition-colors">
                  Berita
                </a>
              </li>
            </ul>
          </div>

          {/* Main Services */}
          <div>
            <h3 className="text-lg font-bold mb-6">Layanan Utama</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  PPDB Online
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Data Pokok Pendidikan
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Info GTK
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Pengaduan
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-bold mb-6">Ikuti Kami</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-400 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>
            &copy; 2025 Suku Dinas Pendidikan Wilayah II Jakarta Utara – Dinas Pendidikan Provinsi
            DKI Jakarta.
          </p>
        </div>
      </div>
    </footer>
  );
};