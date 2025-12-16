'use client';

import { useEffect, useState } from 'react';
import { useLayananPublik } from '@/presentation/composables/useLayananPublik';
import { useModal } from '@/presentation/composables/useModal';
import { Pagination } from '@/presentation/components/shared/Pagination';
import { ConfirmationModal } from '@/presentation/components/shared/ConfirmationModal';
import { Alert } from '@/presentation/components/shared/Alert';
import { LayananFormModal, LayananFormData } from '@/presentation/components/layanan/LayananFormModal';
import { LayananFilter } from '@/presentation/components/layanan/LayananFilter';
import { Edit2, Plus, Trash2, Download } from 'lucide-react';

interface Layanan {
    id: number;
    nama: string;
    deskripsi?: string | null;
    file?: string | null;
    icon?: string | null;
    urutan?: number | null;
    status: number;
    created_at: Date;
    updated_at: Date;
}

export const LayananTab = () => {
    const {
        layanans,
        loading,
        page,
        setPage,
        pageSize,
        setPageSize,
        meta,
        refetchLayanans,
    } = useLayananPublik();

    const { isOpen: isFormOpen, open: openForm, close: closeForm } = useModal();
    const { isOpen: isDeleteConfirmOpen, open: openDeleteConfirm, close: closeDeleteConfirm } = useModal();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [editingLayanan, setEditingLayanan] = useState<Layanan | null>(null);
    const [layananToDelete, setLayananToDelete] = useState<Layanan | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [filteredLayanans, setFilteredLayanans] = useState<Layanan[]>([]);
    const [isFilterActive, setIsFilterActive] = useState(false);

    // Handle add or update layanan
    const handleSaveLayanan = async (formData: LayananFormData, layananId?: number, remainingExistingFiles?: string[]) => {
        try {
            const isUpdating = !!editingLayanan && layananId !== undefined && layananId > 0;

            if (editingLayanan && (!layananId || isNaN(layananId) || layananId <= 0)) {
                throw new Error('ID layanan tidak valid untuk update');
            }

            const endpoint = isUpdating
                ? `/api/dashboard/layanans/${layananId}`
                : '/api/dashboard/layanans/create';
            const method = isUpdating ? 'PUT' : 'POST';

            // Create FormData for file upload
            const form = new FormData();
            form.append('nama', formData.nama);
            form.append('deskripsi', formData.deskripsi || '');
            form.append('icon', formData.icon || '');
            form.append('urutan', (formData.urutan || '').toString());
            form.append('status', formData.status.toString());

            // Handle new files (from user upload in modal)
            // formData.file hanya berisi File objects yang baru di-upload
            if (formData.file && Array.isArray(formData.file) && formData.file.length > 0) {
                for (const file of formData.file) {
                    if (file instanceof File) {
                        form.append('file', file);
                    }
                }
            }

            // Handle remaining existing files (files yang tidak dihapus user)
            if (isUpdating) {
                // remainingExistingFiles adalah array of file paths yang user tidak hapus
                const remainingFilesStr = remainingExistingFiles && remainingExistingFiles.length > 0
                    ? remainingExistingFiles.join(',')
                    : 'null';
                form.append('existingFiles', remainingFilesStr);
                console.log('[FILE LOGIC] Remaining existing files:', remainingFilesStr);
            }

            console.log(`[API] ${method} ${endpoint}`, {
                layananId,
                isUpdating,
                remainingExistingFiles,
                hasNewFiles: formData.file && Array.isArray(formData.file) && formData.file.length > 0,
                newFilesCount: formData.file && Array.isArray(formData.file) ? formData.file.length : 0,
                formDataEntries: Array.from(form.entries()).map(([k, v]) => ({
                    key: k,
                    value: v instanceof File ? `File: ${v.name}` : v
                })),
            });

            const response = await fetch(endpoint, {
                method,
                body: form,
            });

            const responseData = await response.json();

            if (!response.ok) {
                console.error(`[API] Error response:`, responseData);
                throw new Error(responseData.error || (isUpdating ? 'Gagal memperbarui layanan publik' : 'Gagal menambahkan layanan publik'));
            }

            console.log(`[API] Success response:`, responseData);

            const successMsg = isUpdating ? 'Layanan publik berhasil diperbarui' : 'Layanan publik berhasil ditambahkan';
            setSuccessMessage(successMsg);
            closeForm();
            setEditingLayanan(null);

            // Reload table data
            await refetchLayanans();

            // Clear message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error: any) {
            setErrorMessage(error.message);
            setTimeout(() => setErrorMessage(null), 4000);
            throw error;
        }
    };

    // Handle open edit form
    const handleEditLayanan = (layanan: Layanan) => {
        setEditingLayanan(layanan);
        openForm();
    };

    // Handle close form
    const handleCloseForm = () => {
        setEditingLayanan(null);
        closeForm();
    };

    // Handle open delete confirmation
    const handleOpenDeleteConfirm = (layanan: Layanan) => {
        setLayananToDelete(layanan);
        openDeleteConfirm();
    };

    // Handle close delete confirmation
    const handleCloseDeleteConfirm = () => {
        setLayananToDelete(null);
        closeDeleteConfirm();
    };

    // Handle filter
    const handleFilter = (filters: {
        status?: number;
        searchValue?: string;
    }) => {
        if (Object.keys(filters).length === 0) {
            // Clear filter
            setFilteredLayanans([]);
            setIsFilterActive(false);
            return;
        }

        // Apply filter
        let result = [...layanans];

        if (filters.status !== undefined) {
            result = result.filter((layanan) => layanan.status === filters.status);
        }

        if (filters.searchValue) {
            const searchTerm = filters.searchValue.toLowerCase();
            result = result.filter((layanan) =>
                layanan.nama.toLowerCase().includes(searchTerm)
            );
        }

        setFilteredLayanans(result);
        setIsFilterActive(true);
        setPage(1); // Reset to first page
    };

    // Parse and get file list from comma-separated string
    const getFilesList = (fileString: string | undefined | null): string[] => {
        if (!fileString) return [];
        return fileString.split(',').map(f => f.trim()).filter(f => f);
    };

    // Extract filename from path
    const getFileName = (filePath: string): string => {
        return filePath.split('/').pop() || filePath;
    };

    // Handle confirm delete layanan
    const handleConfirmDelete = async () => {
        if (!layananToDelete || !layananToDelete.id) return;

        setIsDeleting(true);
        try {
            console.log('[API] DELETE', `/api/dashboard/layanans/${layananToDelete.id}`);

            const response = await fetch(`/api/dashboard/layanans/${layananToDelete.id}`, {
                method: 'DELETE',
            });

            const responseData = await response.json();

            if (!response.ok) {
                console.error('[API] Delete error response:', responseData);
                throw new Error(responseData.error || 'Gagal menghapus layanan publik');
            }

            console.log('[API] Delete success:', responseData);
            setSuccessMessage('Layanan publik berhasil dihapus');
            handleCloseDeleteConfirm();

            // Reload table data setelah berhasil menghapus
            await refetchLayanans();

            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error: any) {
            console.error('[DELETE] Error:', error);
            setErrorMessage(error.message || 'Gagal menghapus layanan publik');
            setTimeout(() => setErrorMessage(null), 4000);
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mb-4">
                    <svg
                        className="animate-spin h-5 w-5 text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                </div>
                <p className="text-gray-600">Loading data...</p>
            </div>
        );
    }

    const displayLayanans = isFilterActive ? filteredLayanans : layanans;

    return (
        <>
            {/* Alert Messages */}
            <div className="mb-4 space-y-2">
                {successMessage && (
                    <Alert
                        type="success"
                        message={successMessage}
                        duration={3000}
                        onClose={() => setSuccessMessage(null)}
                    />
                )}
                {errorMessage && (
                    <Alert
                        type="error"
                        message={errorMessage}
                        duration={4000}
                        onClose={() => setErrorMessage(null)}
                    />
                )}
            </div>

            {/* Filter Section */}
            <LayananFilter onFilter={handleFilter} />

            {/* Header with Add Button */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Daftar Layanan Publik</h2>
                    {isFilterActive && (
                        <p className="text-sm text-gray-600 mt-1">
                            Menampilkan {displayLayanans.length} dari {layanans.length} layanan
                        </p>
                    )}
                </div>
                <button
                    onClick={openForm}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2 rounded-lg transition font-medium text-sm"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Data
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <table className="w-full border-collapse table-fixed">
                        <colgroup>
                            <col style={{ width: '35%', minWidth: '280px' }} />
                            <col style={{ width: '25%', minWidth: '160px' }} />
                            <col style={{ width: '8%', minWidth: '50px' }} />
                            <col style={{ width: '8%', minWidth: '60px' }} />
                            <col style={{ width: '12%', minWidth: '70px' }} />
                            <col style={{ width: '12%', minWidth: '90px' }} />
                        </colgroup>
                        <thead className="sticky top-0 z-10">
                            <tr className="bg-gradient-to-r from-blue-800 to-blue-900 border-b-2 border-blue-950">
                                <th className="px-2 xs:px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                    Nama Layanan
                                </th>
                                <th className="px-2 xs:px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                    File
                                </th>
                                <th className="px-2 xs:px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                                    Icon
                                </th>
                                <th className="px-2 xs:px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                                    Urutan
                                </th>
                                <th className="px-2 xs:px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-2 xs:px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center text-xs font-bold text-white uppercase tracking-wider sticky right-0 bg-gradient-to-r from-blue-800 to-blue-900">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {displayLayanans.length > 0 ? (
                                displayLayanans.map((layanan, idx) => (
                                    <tr
                                        key={layanan.id}
                                        className={`transition hover:bg-blue-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                    >
                                        <td className="px-2 xs:px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900 overflow-hidden">
                                            <span className="block line-clamp-3">{layanan.nama}</span>
                                        </td>
                                        <td className="px-2 xs:px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs text-gray-600">
                                            {layanan.file ? (
                                                <div className="space-y-0.5 sm:space-y-1">
                                                    {getFilesList(layanan.file).map((filePath, idx) => {
                                                        const fileName = getFileName(filePath);
                                                        const fileCount = getFilesList(layanan.file).length;
                                                        return (
                                                            <div key={idx} className="flex items-center min-w-0">
                                                                <a
                                                                    href={filePath}
                                                                    download
                                                                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline transition text-xs font-medium min-w-0 group"
                                                                    title={`Download: ${fileName}`}
                                                                >
                                                                    <Download className="w-3 h-3 flex-shrink-0" />
                                                                    <span className="truncate">
                                                                        {fileName}
                                                                    </span>
                                                                    {fileCount > 1 && (
                                                                        <span className="text-gray-500 flex-shrink-0 text-xs ml-0.5">
                                                                            ({idx + 1}/{fileCount})
                                                                        </span>
                                                                    )}
                                                                </a>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-xs">-</span>
                                            )}
                                        </td>
                                        <td className="px-2 xs:px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-sm text-gray-600 text-center">
                                            {layanan.icon ? (
                                                <span className="inline-block text-lg">{layanan.icon}</span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-2 xs:px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 text-center">
                                            <span className="inline-block font-semibold text-gray-700">
                                                {layanan.urutan || '-'}
                                            </span>
                                        </td>
                                        <td className="px-2 xs:px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-sm text-center">
                                            <div className="flex items-center justify-center">
                                                <span
                                                    className={`inline-flex items-center px-1.5 sm:px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${layanan.status === 1
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}
                                                    title={layanan.status === 1 ? 'Status Aktif' : 'Status Non-Aktif'}
                                                >
                                                    <span
                                                        className={`inline-block w-2 h-2 rounded-full mr-1 ${layanan.status === 1 ? 'bg-green-500' : 'bg-red-500'
                                                            }`}
                                                    />
                                                    <span className="hidden sm:inline">
                                                        {layanan.status === 1 ? 'Aktif' : 'Non-Aktif'}
                                                    </span>
                                                    <span className="inline sm:hidden">
                                                        {layanan.status === 1 ? 'A' : 'NA'}
                                                    </span>
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-2 xs:px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-sm text-center sticky right-0 bg-inherit">
                                            <div className="flex items-center justify-center gap-1 sm:gap-1.5">
                                                <button
                                                    onClick={() => handleEditLayanan(layanan)}
                                                    className="inline-flex items-center justify-center gap-0.5 sm:gap-1 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white px-1.5 sm:px-2.5 py-1.5 sm:py-2 rounded transition font-medium text-xs flex-shrink-0"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-3 h-3" />
                                                    <span className="hidden sm:inline">Edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleOpenDeleteConfirm(layanan)}
                                                    className="inline-flex items-center justify-center gap-0.5 sm:gap-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-1.5 sm:px-2.5 py-1.5 sm:py-2 rounded transition font-medium text-xs flex-shrink-0"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                    <span className="hidden sm:inline">Hapus</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-3 sm:px-4 lg:px-6 py-8 sm:py-12 text-center">
                                        <p className="text-gray-500 font-medium">
                                            Tidak ada data layanan publik
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {meta && (
                    <Pagination
                        currentPage={page}
                        totalPages={meta.totalPages}
                        pageSize={pageSize}
                        total={meta.total}
                        onPageChange={setPage}
                        onPageSizeChange={setPageSize}
                    />
                )}
            </div>

            {/* Layanan Form Modal */}
            <LayananFormModal
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                onSubmit={handleSaveLayanan}
                editingLayanan={editingLayanan}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={isDeleteConfirmOpen}
                title="Hapus Layanan Publik"
                message={`Apakah Anda yakin ingin menghapus layanan publik "${layananToDelete?.nama}"? Tindakan ini tidak dapat dibatalkan.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCloseDeleteConfirm}
                confirmText="Hapus"
                cancelText="Batal"
                isDangerous={true}
                isLoading={isDeleting}
            />

        </>
    );
};
