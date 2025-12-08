'use client';

import { DashboardLayout } from '@/presentation/components/dashboard/DashboardLayout';

export const LayananPublikPage = () => {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Layanan Publik</h1>
                    <p className="text-gray-600">Halaman ini akan menampilkan daftar layanan publik yang disediakan</p>
                </div>
            </div>
        </DashboardLayout>
    );
};
