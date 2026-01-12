'use client';

import { useEffect, useState } from 'react';
import { useArtikel } from '@/presentation/composables/useArtikel';
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Pagination } from '@/presentation/components/shared/Pagination';
import Link from 'next/link';

export const PengumumanList = () => {
    const router = useRouter();
    const {
        artikels,
        loading,
        page,
        setPage,
        pageSize,
        setPageSize,
        meta,
        refetchArtikels,
        setFilterKategori,
        setFilterStatus,
        filterStatus
    } = useArtikel();

    // Default to 'Berita' and 'Pengumuman' categories might be tricky if backend only supports exact match.
    // Based on repository, it supports single string match.
    // For now, let's assume we want to show all 'Pengumuman' or 'Berita' or provide a filter UI.
    // The user asked for "Pengumuman". Let's stick to "Pengumuman" category for now, or allow switching.
    // But since the form allowed "Berita" by default, maybe we should focus on "Berita" too.
    // Let's make "Kategori" filterable in this view, defaulting to ALL (null) but maybe visually distinct.
    // Or just filter by 'Pengumuman' if this is strict.
    // Given the form had Berita/Pengumuman/Program, let's show all three or let user filter.

    // Setting initial filter to null to show all, but we might want to restrict to "Media" types.
    // Ideally we'd modify backend to support "in" array for categories, but for now let's just show all or add client side filter if needed, 
    // OR just rely on the existing filter UI.

    // Actually, looking at the Sidebar, "Pengumuman" is a specific menu. "Artikel" is another.
    // Maybe we should filter by specific categories relevant to "News".

    useEffect(() => {
        // Optional: Pre-set a specific category if we want this page to ONLY show Pengumuman
        // setFilterKategori('Pengumuman'); 
        // But since we want to manage "Berita Terkini", which might be Berita/Pengumuman, let's leave it open or allow filter.
    }, []);

    const [activeTab, setActiveTab] = useState<'all' | 'published' | 'draft'>('all');

    const handleTabChange = (tab: 'all' | 'published' | 'draft') => {
        setActiveTab(tab);
        if (tab === 'all') setFilterStatus(undefined);
        if (tab === 'published') setFilterStatus(1);
        if (tab === 'draft') setFilterStatus(0);
        setPage(1);
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Daftar Pengumuman & Berita</h1>
                    <p className="text-gray-600">Kelola informasi yang ditampilkan di halaman depan.</p>
                </div>
                <Link
                    href="/dashboard/pengumuman/create"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-medium"
                >
                    <Plus size={20} />
                    Buat Baru
                </Link>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => handleTabChange('all')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'all'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                >
                    Semua
                </button>
                <button
                    onClick={() => handleTabChange('published')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'published'
                            ? 'border-green-500 text-green-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                >
                    Sudah Dipost (Published)
                </button>
                <button
                    onClick={() => handleTabChange('draft')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'draft'
                            ? 'border-amber-500 text-amber-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                >
                    Belum Dipost (Draft)
                </button>
            </div>

            {/* List Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading data...</div>
                ) : artikels.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penulis</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {artikels.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900 line-clamp-2">{item.judul}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                                                {item.kategori || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.penulis || 'Admin'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(item.tanggal)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {item.status === 1 ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <CheckCircle className="w-3 h-3" /> Published
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    <XCircle className="w-3 h-3" /> Draft
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                className="text-amber-600 hover:text-amber-900 mr-4"
                                                title="Edit"
                                                // TODO: Connect to Edit Page
                                                onClick={() => alert('Fitur Edit akan segera hadir')}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-900"
                                                title="Hapus"
                                                // TODO: Connect to Delete Action from useArtikel if exposed or add it
                                                onClick={() => alert('Fitur Hapus ada di Menu Artikel')}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-500">
                        Belum ada data pengumuman.
                    </div>
                )}

                {/* Pagination */}
                {meta && (
                    <div className="border-t border-gray-200">
                        <Pagination
                            currentPage={page}
                            totalPages={meta.totalPages}
                            pageSize={pageSize}
                            total={meta.total}
                            onPageChange={setPage}
                            onPageSizeChange={setPageSize}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
