import { useState, useEffect } from 'react';

interface NavLink {
  name: string;
  href: string;
}

export const useNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: NavLink[] = [
    { name: 'Beranda', href: '#hero' },
    { name: 'Profil', href: '#about' },
    { name: 'Program', href: '#programs' },
    { name: 'Layanan', href: '#services' },
    { name: 'Berita', href: '#news' },
    { name: 'Kontak', href: '#contact' },
  ];

  return {
    isOpen,
    setIsOpen,
    scrolled,
    navLinks,
  };
};