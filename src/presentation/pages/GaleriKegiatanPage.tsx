'use client';

import { DashboardLayout } from '@/presentation/components/dashboard/DashboardLayout';
import { GaleriKegiatanTab } from '@/presentation/components/galeri/GaleriKegiatanTab';

export const GaleriKegiatanPage = () => {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Galeri Kegiatan</h1>
                    <p className="text-gray-600 mt-2">Kelola galeri kegiatan Suku Dinas Pendidikan Jakarta Utara Wilayah II</p>
                </div>

                <GaleriKegiatanTab />
            </div>
        </DashboardLayout>
    );
};
