'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLogin } from '@/presentation/composables/useLogin';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, Home, Menu, X, AlignLeft, ChevronDown } from 'lucide-react';
import { Database, Building2, Handshake, Phone, Briefcase, FileText, HelpCircle } from 'lucide-react';

interface MenuItem {
    label: string;
    icon: React.ComponentType<any>;
    href?: string;
    submenu?: MenuItem[];
}

export const Sidebar = () => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
    const [isHydrated, setIsHydrated] = useState(false);
    const { logout, getCurrentUser } = useLogin();
    const router = useRouter();
    const pathname = usePathname();
    const user = isHydrated ? getCurrentUser() : null;

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

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

    const toggleMobileSidebar = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleSubmenu = (label: string) => {
        setExpandedMenu(expandedMenu === label ? null : label);
    };

    const isActive = (href?: string) => {
        return href && pathname === href;
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={toggleMobileSidebar}
                className="lg:hidden fixed top-4 left-4 z-50 bg-blue-900 text-white p-2 rounded-lg hover:bg-blue-800 transition"
                title={isMobileOpen ? 'Tutup Sidebar' : 'Buka Sidebar'}
            >
                {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

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
                {/* Header dengan Logo & Collapse Button */}
                <div className="p-4 lg:p-6 border-b border-blue-800 flex-shrink-0 relative">
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} gap-3`}>
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

                        {/* Collapse Toggle Button - Half Inside Half Outside */}
                        <button
                            onClick={toggleCollapse}
                            className="hidden lg:flex absolute top-1/2 -translate-y-1/2 -right-5 items-center justify-center w-9 h-9 rounded-lg bg-white text-blue-900 hover:bg-gray-100 transition shadow-xl border-2 border-blue-900 z-50 flex-shrink-0"
                            title={isCollapsed ? 'Buka Sidebar' : 'Tutup Sidebar'}
                        >
                            {isCollapsed ? (
                                <AlignLeft className="w-5 h-5 stroke-[3]" />
                            ) : (
                                <AlignLeft className="w-5 h-5 stroke-[3]" />
                            )}
                        </button>
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
                                        className={`w-full flex items-center px-4 py-3 rounded-lg transition text-sm font-medium ${
                                            expandedMenu === item.label
                                                ? 'bg-blue-800 border-l-4 border-white text-white'
                                                : 'hover:bg-blue-800 text-blue-100'
                                        } ${isCollapsed ? 'lg:justify-center lg:px-3' : ''}`}
                                        title={isCollapsed ? item.label : ''}
                                    >
                                        <item.icon className="w-5 h-5 flex-shrink-0" />
                                        {!isCollapsed && <span className="hidden lg:inline ml-3 flex-1 text-left">{item.label}</span>}
                                        <span className="lg:hidden ml-3">{item.label}</span>
                                        {!isCollapsed && (
                                            <ChevronDown className={`w-4 h-4 flex-shrink-0 hidden lg:block transition-transform ${
                                                expandedMenu === item.label ? 'rotate-180' : ''
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
                                                    className={`flex items-center px-4 py-2 rounded-lg transition text-sm ${
                                                        isActive(subitem.href)
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
                                    className={`flex items-center px-4 py-3 rounded-lg transition text-sm font-medium ${
                                        isActive(item.href)
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

                {/* Footer - User Info - FIXED */}
                <div
                    className={`border-t border-blue-800 p-4 space-y-4 flex-shrink-0 bg-blue-950 ${
                        isCollapsed ? 'lg:p-3' : ''
                    }`}
                >
                    {!isCollapsed && (
                        <div className="space-y-2 hidden lg:block">
                            <p className="text-xs text-blue-200">Logged in as</p>
                            <p className="text-sm font-semibold truncate">{user?.name}</p>
                            <p className="text-xs text-blue-100 truncate">{user?.email}</p>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className={`flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg transition text-sm font-medium ${
                            isCollapsed ? 'lg:p-2 lg:space-x-0 w-full' : 'w-full px-4 py-2'
                        }`}
                        title={isCollapsed ? 'Logout' : ''}
                    >
                        <LogOut className="w-4 h-4 flex-shrink-0" />
                        {!isCollapsed && <span className="hidden lg:inline">Logout</span>}
                        <span className="lg:hidden">Logout</span>
                    </button>
                </div>
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
