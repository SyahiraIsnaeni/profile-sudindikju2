'use client';

import { useEffect, useState } from 'react';
import { useKomitmenPelayanan } from '@/presentation/composables/useKomitmenPelayanan';
import { useModal } from '@/presentation/composables/useModal';
import { Pagination } from '@/presentation/components/shared/Pagination';
import { ConfirmationModal } from '@/presentation/components/shared/ConfirmationModal';
import { Alert } from '@/presentation/components/shared/Alert';
import { KomitmenFormModalV2, KomitmenFormData } from '@/presentation/components/komitmen/KomitmenFormModalV2';
import { Edit2, Plus, Trash2, Eye, X, Download } from 'lucide-react';

interface Commitment {
    id: number;
    name: string;
    description?: string | null;
    file?: string | null;
    icon?: string | null;
    sort_order?: number | null;
    status: number;
    created_at: Date;
    updated_at: Date;
}

export const KomitmenPelayananTab = () => {
    const {
        commitments,
        loading,
        page,
        setPage,
        pageSize,
        setPageSize,
        meta,
        refetchCommitments,
    } = useKomitmenPelayanan();

    const { isOpen: isFormOpen, open: openForm, close: closeForm } = useModal();
    const { isOpen: isDeleteConfirmOpen, open: openDeleteConfirm, close: closeDeleteConfirm } = useModal();
    const { isOpen: isImageModalOpen, open: openImageModal, close: closeImageModal } = useModal();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [editingCommitment, setEditingCommitment] = useState<Commitment | null>(null);
    const [commitmentToDelete, setCommitmentToDelete] = useState<Commitment | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

    // Handle add or update commitment
    const handleSaveCommitment = async (formData: KomitmenFormData, commitmentId?: number) => {
        try {
            const isUpdating = !!commitmentId && !!editingCommitment;

            if (isUpdating && (!commitmentId || commitmentId <= 0)) {
                throw new Error('ID komitmen tidak valid untuk update');
            }

            const endpoint = isUpdating
                ? `/api/dashboard/commitments/${commitmentId}`
                : '/api/dashboard/commitments/create';
            const method = isUpdating ? 'PUT' : 'POST';

            // Create FormData for file upload
            const form = new FormData();
            form.append('name', formData.name);
            form.append('description', formData.description || '');
            form.append('icon', formData.icon || '');
            form.append('sort_order', (formData.sort_order || '').toString());
            form.append('status', formData.status.toString());

            if (formData.file) {
                form.append('file', formData.file);
            }

            if (isUpdating) {
                form.append('existingFile', editingCommitment?.file || 'null');
            }

            console.log(`[API] ${method} ${endpoint}`, {
                commitmentId,
                isUpdating,
                formDataKeys: Array.from(form.entries()).map(([k]) => k),
            });

            const response = await fetch(endpoint, {
                method,
                body: form,
            });

            const responseData = await response.json();

            if (!response.ok) {
                console.error(`[API] Error response:`, responseData);
                throw new Error(responseData.error || (isUpdating ? 'Gagal memperbarui komitmen pelayanan' : 'Gagal menambahkan komitmen pelayanan'));
            }

            console.log(`[API] Success response:`, responseData);

            const successMsg = isUpdating ? 'Komitmen pelayanan berhasil diperbarui' : 'Komitmen pelayanan berhasil ditambahkan';
            setSuccessMessage(successMsg);
            closeForm();
            setEditingCommitment(null);

            // Reload table data
            await refetchCommitments();

            // Clear message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error: any) {
            setErrorMessage(error.message);
            setTimeout(() => setErrorMessage(null), 4000);
            throw error;
        }
    };

    // Handle open edit form
    const handleEditCommitment = (commitment: Commitment) => {
        setEditingCommitment(commitment);
        openForm();
    };

    // Handle close form
    const handleCloseForm = () => {
        setEditingCommitment(null);
        closeForm();
    };

    // Handle open delete confirmation
    const handleOpenDeleteConfirm = (commitment: Commitment) => {
        setCommitmentToDelete(commitment);
        openDeleteConfirm();
    };

    // Handle close delete confirmation
    const handleCloseDeleteConfirm = () => {
        setCommitmentToDelete(null);
        closeDeleteConfirm();
    };

    // Handle view image
    const handleViewImage = (imageUrl: string) => {
        setSelectedImageUrl(imageUrl);
        openImageModal();
    };

    // Handle close image modal
    const handleCloseImageModal = () => {
        setSelectedImageUrl(null);
        closeImageModal();
    };

    // Handle confirm delete commitment
    const handleConfirmDelete = async () => {
        if (!commitmentToDelete || !commitmentToDelete.id) return;

        setIsDeleting(true);
        try {
            console.log('[API] DELETE', `/api/dashboard/commitments/${commitmentToDelete.id}`);

            const response = await fetch(`/api/dashboard/commitments/${commitmentToDelete.id}`, {
                method: 'DELETE',
            });

            const responseData = await response.json();

            if (!response.ok) {
                console.error('[API] Delete error response:', responseData);
                throw new Error(responseData.error || 'Gagal menghapus komitmen pelayanan');
            }

            console.log('[API] Delete success:', responseData);
            setSuccessMessage('Komitmen pelayanan berhasil dihapus');
            handleCloseDeleteConfirm();

            // Reload table data setelah berhasil menghapus
            await refetchCommitments();

            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error: any) {
            console.error('[DELETE] Error:', error);
            setErrorMessage(error.message || 'Gagal menghapus komitmen pelayanan');
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

            {/* Header with Add Button */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Daftar Komitmen Pelayanan</h2>
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
                <div className="overflow-x-auto">
                    <table className="w-full min-w-full">
                        <thead>
                            <tr className="bg-gradient-to-r from-blue-800 to-blue-900 border-b">
                                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                    Nama Komitmen
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                    File
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                    Icon
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                    Urutan
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {commitments.length > 0 ? (
                                commitments.map((commitment, idx) => (
                                    <tr
                                        key={commitment.id}
                                        className={`transition ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                            } hover:bg-blue-50`}
                                    >
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {commitment.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {commitment.file ? (
                                                <button
                                                    onClick={() => handleViewImage(commitment.file!)}
                                                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline transition"
                                                    title="Lihat foto"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Lihat Foto
                                                </button>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 text-left">
                                            {commitment.icon ? (
                                                <span className="inline-block text-sm">{commitment.icon}</span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {commitment.sort_order || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${commitment.status === 1
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {commitment.status === 1 ? 'Aktif' : 'Non-Aktif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEditCommitment(commitment)}
                                                    className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-lg transition font-medium text-xs"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleOpenDeleteConfirm(commitment)}
                                                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition font-medium text-xs"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <p className="text-gray-500 font-medium">
                                            Tidak ada data komitmen pelayanan
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

            {/* Komitmen Form Modal V2 */}
            <KomitmenFormModalV2
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                onSubmit={handleSaveCommitment}
                editingCommitment={editingCommitment}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={isDeleteConfirmOpen}
                title="Hapus Komitmen Pelayanan"
                message={`Apakah Anda yakin ingin menghapus komitmen pelayanan "${commitmentToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCloseDeleteConfirm}
                confirmText="Hapus"
                cancelText="Batal"
                isDangerous={true}
                isLoading={isDeleting}
            />

            {/* Image Preview Modal */}
            <>
                {/* Backdrop */}
                <div
                    className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isImageModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                    onClick={handleCloseImageModal}
                />

                {/* Modal */}
                <div
                    className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isImageModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                >
                    <div
                        className={`bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col transition-all duration-300 transform ${isImageModalOpen ? 'scale-100' : 'scale-95'
                            }`}
                    >
                        {/* Close Button */}
                        <div className="absolute top-4 right-4 z-10">
                            <button
                                onClick={handleCloseImageModal}
                                className="text-gray-500 hover:text-gray-700 transition bg-white rounded-full p-2 hover:bg-gray-100 shadow-md hover:shadow-lg"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Image Container - Scrollable */}
                        {selectedImageUrl && (
                            <div className="flex-1 overflow-y-auto flex items-center justify-center bg-gray-50 px-8 pt-12 pb-8">
                                <img
                                    src={selectedImageUrl}
                                    alt="Preview"
                                    className="max-w-full max-h-full object-contain rounded-lg"
                                />
                            </div>
                        )}

                        {/* Footer */}
                        {selectedImageUrl && (
                            <div className="px-6 py-4 bg-white flex justify-end gap-2 border-t border-gray-200 shrink-0">
                                <a
                                    href={selectedImageUrl}
                                    download
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition inline-flex items-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Download
                                </a>
                                <button
                                    type="button"
                                    onClick={handleCloseImageModal}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition"
                                >
                                    Tutup
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </>
        </>
    );
};
