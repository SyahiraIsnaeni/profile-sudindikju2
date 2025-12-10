'use client';

import { DashboardLayout } from '@/presentation/components/dashboard/DashboardLayout';
import { KomitmenPelayananTab } from '@/presentation/components/komitmen/KomitmenPelayananTab';

export const KomitmenPelayananPage = () => {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Komitmen Pelayanan</h1>
                    <p className="text-gray-600 mt-2">Kelola komitmen pelayanan Suku Dinas Pendidikan Jakarta Utara Wilayah II</p>
                </div>

                <KomitmenPelayananTab />
            </div>
        </DashboardLayout>
    );
};
