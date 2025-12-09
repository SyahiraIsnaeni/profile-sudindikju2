'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLogin } from '@/presentation/composables/useLogin';
import { LogOut, Menu, X, AlignJustify } from 'lucide-react';

interface NavbarProps {
    toggleMobileSidebar: () => void;
    isMobileOpen: boolean;
    isCollapsed: boolean;
    toggleCollapse: () => void;
}

export const Navbar = ({ toggleMobileSidebar, isMobileOpen, isCollapsed, toggleCollapse }: NavbarProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const { logout, getCurrentUser } = useLogin();
    const [isHydrated] = useState(() => typeof window !== 'undefined');
    const user = isHydrated ? getCurrentUser() : null;

    const getPageTitle = (path: string) => {
        const titles: Record<string, string> = {
            '/dashboard': 'Dashboard',
            '/dashboard/master-data': 'Master Data',
            '/dashboard/profil-instansi': 'Profil Instansi',
            '/dashboard/komitmen-pelayanan': 'Komitmen Pelayanan',
            '/dashboard/informasi-kontak': 'Informasi Kontak',
            '/dashboard/layanan-publik': 'Layanan Publik',
            '/dashboard/aplikasi': 'Aplikasi',
            '/dashboard/media/artikel': 'Artikel',
            '/dashboard/media/pengumuman': 'Pengumuman',
            '/dashboard/media/galeri-kegiatan': 'Galeri Kegiatan',
            '/dashboard/pertanyaan-pengaduan/pertanyaan': 'Pertanyaan',
            '/dashboard/pertanyaan-pengaduan/pengaduan': 'Pengaduan',
        };
        return titles[path] || 'Dashboard';
    };

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <nav className="bg-blue-950 border-b border-blue-900 px-4 md:px-8 py-4 shadow-lg sticky top-0 z-20">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    {/* Hamburger Button untuk Mobile */}
                    <button
                        onClick={toggleMobileSidebar}
                        className="lg:hidden flex items-center justify-center bg-blue-950 hover:bg-blue-900 text-white p-2 rounded-lg transition"
                        title={isMobileOpen ? 'Tutup Sidebar' : 'Buka Sidebar'}
                    >
                        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    {/* Collapse Button untuk Desktop */}
                    <button
                        onClick={toggleCollapse}
                        className="hidden lg:flex items-center justify-center bg-blue-950 hover:bg-blue-900 text-white p-2 rounded-lg transition"
                        title={isCollapsed ? 'Buka Sidebar' : 'Tutup Sidebar'}
                    >
                        <AlignJustify className="w-5 h-5" />
                    </button>

                    <h1 className="text-xl md:text-2xl font-bold text-white">
                        {getPageTitle(pathname)}
                    </h1>
                </div>

                {/* User Info & Logout */}
                <div className="flex items-center gap-4">
                    {isHydrated && user && (
                        <>
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-semibold text-white truncate max-w-xs">{user.name}</p>
                                <p className="text-xs text-blue-300 truncate max-w-xs">{user.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg transition text-sm font-medium px-3 py-2 text-white"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};