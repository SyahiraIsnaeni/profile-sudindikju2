'use client';

import { DashboardLayout } from '@/presentation/components/dashboard/DashboardLayout';
import { ProfileTabsWrapper } from '@/presentation/components/profiles/ProfileTabsWrapper';

export const ProfilInstansiPage = () => {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Kelola Profil Instansi</h1>
                    <p className="text-gray-600 mt-2">
                        Kelola informasi profile, visi, misi, struktur organisasi, dan tugas fungsi Suku Dinas Pendidikan Jakarta Utara Wilayah II
                    </p>
                </div>

                <ProfileTabsWrapper />
            </div>
        </DashboardLayout>
    );
};
