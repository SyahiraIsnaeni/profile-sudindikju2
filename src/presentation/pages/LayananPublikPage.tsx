'use client';

import { DashboardLayout } from '@/presentation/components/dashboard/DashboardLayout';
import { LayananTab } from '@/presentation/components/layanan/LayananTab';

export const LayananPublikPage = () => {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Layanan Publik</h1>
                    <p className="text-gray-600 mt-2">Kelola layanan publik Suku Dinas Pendidikan Jakarta Utara Wilayah II</p>
                </div>

                <LayananTab />
            </div>
        </DashboardLayout>
    );
};
