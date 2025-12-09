'use client';

import { useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, ChevronDown } from 'lucide-react';
import { Database, Building2, Handshake, Phone, Briefcase, FileText, HelpCircle } from 'lucide-react';

interface MenuItem {
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    href?: string;
    submenu?: MenuItem[];
}

interface SidebarProps {
    isMobileOpen: boolean;
    setIsMobileOpen: (value: boolean) => void;
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
}

export const Sidebar = ({ isMobileOpen, setIsMobileOpen, isCollapsed, setIsCollapsed }: SidebarProps) => {
    const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
    const pathname = usePathname();

    const menuItems: MenuItem[] = [
        { label: 'Dashboard', icon: Home, href: '/dashboard' },
        { label: 'Master Data', icon: Database, href: '/dashboard/master-data' },
        { label: 'Profil Instansi', icon: Building2, href: '/dashboard/profil-instansi' },
        { label: 'Komitmen Pelayanan', icon: Handshake, href: '/dashboard/komitmen-pelayanan' },
        { label: 'Informasi Kontak', icon: Phone, href: '/dashboard/informasi-kontak' },
        { label: 'Layanan Publik', icon: Briefcase, href: '/dashboard/layanan-publik' },
        { label: 'Aplikasi', icon: Briefcase, href: '/dashboard/aplikasi' },
        {
            label: 'Media dan Publikasi',
            icon: FileText,
            submenu: [
                { label: 'Artikel', icon: FileText, href: '/dashboard/media/artikel' },
                { label: 'Pengumuman', icon: FileText, href: '/dashboard/media/pengumuman' },
                { label: 'Galeri Kegiatan', icon: FileText, href: '/dashboard/media/galeri-kegiatan' },
            ],
        },
        {
            label: 'Pertanyaan & Pengaduan',
            icon: HelpCircle,
            submenu: [
                { label: 'Pertanyaan', icon: HelpCircle, href: '/dashboard/pertanyaan-pengaduan/pertanyaan' },
                { label: 'Pengaduan', icon: HelpCircle, href: '/dashboard/pertanyaan-pengaduan/pengaduan' },
            ],
        },
    ];

    const toggleSubmenu = (label: string) => {
        setExpandedMenu(expandedMenu === label ? null : label);
    };

    const isActive = (href?: string) => {
        return href && pathname === href;
    };

    return (
        <>
            {/* Sidebar - FULL HEIGHT & COLLAPSIBLE */}
            <aside
                className={`
          fixed lg:static top-0 left-0 h-screen bg-blue-900 text-white
          transform lg:transform-none transition-all duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64
          z-40 shadow-lg flex flex-col overflow-visible
        `}
            >
                {/* Header dengan Logo */}
                <div className="p-4 lg:p-6 border-b border-blue-800 flex-shrink-0">
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} gap-3`}>
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                            <Image
                                src="/images/logo_sudindikju2.jpg"
                                alt="Logo Sudin"
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0 hidden lg:block">
                                <h1 className="text-[13px] font-bold leading-tight">
                                    Suku Dinas Pendidikan
                                </h1>
                                <p className="text-xs text-blue-100 mt-1">Jakarta Utara Wilayah II</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation - SCROLLABLE */}
                <nav className="flex-1 px-3 lg:px-4 py-6 space-y-1 overflow-y-auto overflow-x-hidden">
                    {menuItems.map((item) => (
                        <div key={item.label}>
                            {item.submenu ? (
                                // Menu dengan Submenu
                                <div>
                                    <button
                                        onClick={() => {
                                            toggleSubmenu(item.label);
                                            if (isMobileOpen) setIsMobileOpen(false);
                                        }}
                                        className={`w-full flex items-center px-4 py-3 rounded-lg transition text-sm font-medium ${expandedMenu === item.label
                                                ? 'bg-blue-800 border-l-4 border-white text-white'
                                                : 'hover:bg-blue-800 text-blue-100'
                                            } ${isCollapsed ? 'lg:justify-center lg:px-3' : ''}`}
                                        title={isCollapsed ? item.label : ''}
                                    >
                                        <item.icon className="w-5 h-5 flex-shrink-0" />
                                        {!isCollapsed && <span className="hidden lg:inline ml-3 flex-1 text-left">{item.label}</span>}
                                        <span className="lg:hidden ml-3">{item.label}</span>
                                        {!isCollapsed && (
                                            <ChevronDown className={`w-4 h-4 flex-shrink-0 hidden lg:block transition-transform ${expandedMenu === item.label ? 'rotate-180' : ''
                                                }`} />
                                        )}
                                    </button>
                                    {/* Submenu */}
                                    {expandedMenu === item.label && !isCollapsed && (
                                        <div className="mt-1 space-y-1 ml-4 border-l-2 border-blue-700 pl-0">
                                            {item.submenu.map((subitem) => (
                                                <a
                                                    key={subitem.label}
                                                    href={subitem.href}
                                                    className={`flex items-center px-4 py-2 rounded-lg transition text-sm ${isActive(subitem.href)
                                                            ? 'bg-blue-700 text-white'
                                                            : 'hover:bg-blue-700 text-blue-100'
                                                        }`}
                                                    onClick={() => setIsMobileOpen(false)}
                                                >
                                                    <subitem.icon className="w-4 h-4 flex-shrink-0" />
                                                    <span className="ml-3">{subitem.label}</span>
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // Menu biasa tanpa submenu
                                <a
                                    href={item.href}
                                    className={`flex items-center px-4 py-3 rounded-lg transition text-sm font-medium ${isActive(item.href)
                                            ? 'bg-blue-800 border-l-4 border-white text-white'
                                            : 'hover:bg-blue-800 text-blue-100'
                                        } ${isCollapsed ? 'lg:justify-center lg:px-3' : ''}`}
                                    onClick={() => setIsMobileOpen(false)}
                                    title={isCollapsed ? item.label : ''}
                                >
                                    <item.icon className="w-5 h-5 flex-shrink-0" />
                                    {!isCollapsed && <span className="hidden lg:inline ml-3">{item.label}</span>}
                                    <span className="lg:hidden ml-3">{item.label}</span>
                                </a>
                            )}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Overlay untuk mobile - AUTO CLOSE */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
        </>
    );
};
