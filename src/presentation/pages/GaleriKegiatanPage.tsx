'use client';

import { DashboardLayout } from '@/presentation/components/dashboard/DashboardLayout';

export const GaleriKegiatanPage = () => {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Galeri Kegiatan</h1>
                    <p className="text-gray-600">Halaman ini akan menampilkan galeri kegiatan</p>
                </div>
            </div>
        </DashboardLayout>
    );
};
