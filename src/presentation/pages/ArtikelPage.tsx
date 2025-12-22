'use client';

import { DashboardLayout } from '@/presentation/components/dashboard/DashboardLayout';
import { ArtikelTab } from '@/presentation/components/artikel/ArtikelTab';

export const ArtikelPage = () => {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Artikel</h1>
                    <p className="text-gray-600 mt-2">Kelola artikel di website Suku Dinas Pendidikan Jakarta Utara Wilayah II</p>
                </div>

                <ArtikelTab />
            </div>
        </DashboardLayout>
    );
};
