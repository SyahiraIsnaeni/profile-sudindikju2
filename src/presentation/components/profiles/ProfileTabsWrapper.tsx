'use client';

import { useProfile } from '@/presentation/composables/useProfile';
import { DeskripsiMottoTab } from './DeskripsiMottoTab';
import { VisiMisiTab } from './VisiMisiTab';
import { StrukturOrganisasiTab } from './StrukturOrganisasiTab';
import { MaklumatOrganisasiTab } from './MaklumatOrganisasiTab';
import { TugasFungsiTab } from './TugasFungsiTab';

const TABS = [
    { id: 0, label: 'Deskripsi & Motto' },
    { id: 1, label: 'Visi & Misi' },
    { id: 2, label: 'Struktur Organisasi' },
    { id: 3, label: 'Maklumat Organisasi' },
    { id: 4, label: 'Tugas & Fungsi' },
];

export function ProfileTabsWrapper() {
    const {
        profile,
        loading,
        error,
        activeTab,
        setActiveTab,
        updateDeskripsiMotto,
        updateVisiMisi,
        updateStrukturOrganisasi,
        updateMaklumatOrganisasi,
        updateTugasFungsi,
        clearError,
    } = useProfile();

    return (
        <div className="space-y-6">
            {/* Error Alert */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start justify-between">
                    <div>
                        <h3 className="font-semibold text-red-800">Terjadi Kesalahan</h3>
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                    <button
                        onClick={clearError}
                        className="text-red-600 hover:text-red-800"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-700">Memuat data...</p>
                </div>
            )}

            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
                <div className="flex gap-0 overflow-x-auto">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 font-medium transition border-b-2 whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg p-6">
                {profile ? (
                    <>
                        {activeTab === 0 && (
                            <DeskripsiMottoTab
                                profile={profile}
                                loading={loading}
                                onUpdate={updateDeskripsiMotto}
                            />
                        )}

                        {activeTab === 1 && (
                            <VisiMisiTab
                                profile={profile}
                                loading={loading}
                                onUpdate={updateVisiMisi}
                            />
                        )}

                        {activeTab === 2 && (
                            <StrukturOrganisasiTab
                                profile={profile}
                                loading={loading}
                                onUpdate={updateStrukturOrganisasi}
                            />
                        )}

                        {activeTab === 3 && (
                            <MaklumatOrganisasiTab
                                profile={profile}
                                loading={loading}
                                onUpdate={updateMaklumatOrganisasi}
                            />
                        )}

                        {activeTab === 4 && (
                            <TugasFungsiTab
                                profile={profile}
                                loading={loading}
                                onUpdate={updateTugasFungsi}
                            />
                        )}
                    </>
                ) : (
                    <p className="text-gray-500">Tidak ada data profile</p>
                )}
            </div>
        </div>
    );
}
