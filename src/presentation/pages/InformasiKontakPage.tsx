'use client';

import { DashboardLayout } from '@/presentation/components/dashboard/DashboardLayout';
import { ContactForm } from '@/presentation/components/contacts/ContactForm';
import { useContact } from '@/presentation/composables/useContact';

export const InformasiKontakPage = () => {
    const { contact, loading, updateContact } = useContact();

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Kelola Informasi Kontak</h1>
                    <p className="text-gray-600 mt-2">
                        Kelola nomor telepon, faksimile, media sosial, dan lokasi Google Maps Suku Dinas Pendidikan Jakarta Utara Wilayah II
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow p-8">
                    {loading && !contact ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-gray-600">Memuat data kontak...</span>
                        </div>
                    ) : (
                        <ContactForm
                            contact={contact}
                            loading={loading}
                            onUpdate={updateContact}
                        />
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};
