'use client';

import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface DashboardLayoutProps {
    children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleMobileSidebar = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="flex h-screen bg-gray-50 flex-col lg:flex-row">
            {/* Sidebar */}
            <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col w-full lg:w-auto overflow-hidden">
                {/* Navbar */}
                <Navbar toggleMobileSidebar={toggleMobileSidebar} isMobileOpen={isMobileOpen} isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />

                {/* Content */}
                <main className="flex-1 p-4 md:p-8 lg:p-8 mt-12 lg:mt-0 overflow-auto">
                    <div className="max-w-7xl mx-auto">{children}</div>
                </main>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-200 px-4 md:px-8 py-4 flex-shrink-0">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="text-xs md:text-sm text-gray-600">
                            <p>© 2025 Sudin Pendidikan Jakarta Utara Wilayah II. All Rights Reserved.</p>
                            <p>Handcrafted and made with <span className="text-red-500">❤</span> by Tim IT Sudindik JU2</p>
                        </div>
                        <div className="text-xs text-gray-500">
                            <p>Version 1.0.0</p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};