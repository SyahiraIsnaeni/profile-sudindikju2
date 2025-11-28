'use client';

import { useState, useEffect } from 'react';

interface MenuItem {
  name: string;
  href: string;
}

export const useNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Beranda');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems: MenuItem[] = [
    { name: 'Beranda', href: '#' },
    { name: 'Profil', href: '#profil' },
    { name: 'Artikel', href: '#artikel' },
    { name: 'Kegiatan', href: '#kegiatan' },
    { name: 'Kontak', href: '#kontak' },
  ];

  const handleMenuClick = (menuName: string) => {
    setActiveMenu(menuName);
    setIsOpen(false);
  };

  return {
    isOpen,
    setIsOpen,
    isScrolled,
    activeMenu,
    handleMenuClick,
    menuItems,
  };
};