'use client';

import { useEffect, useState } from 'react';
import { useMasterData } from '@/presentation/composables/useMasterData';
import { useModal } from '@/presentation/composables/useModal';
import { Pagination } from '@/presentation/components/shared/Pagination';
import { UserFormModal, UserFormData } from '@/presentation/components/masterdata/UserFormModal';
import { ConfirmationModal } from '@/presentation/components/shared/ConfirmationModal';
import { Alert } from '@/presentation/components/shared/Alert';
import { Edit2, Plus, Trash2 } from 'lucide-react';

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    status: number;
    role_id?: number | null;
    role?: {
        id: number;
        name: string;
    } | null;
    created_at: Date;
    updated_at: Date;
}

export const UsersTab = () => {
    const {
        users,
        loading,
        userPage,
        setUserPage,
        pageSize,
        setPageSize,
        usersMeta,
        refetchUsers,
    } = useMasterData();

    const { isOpen: isFormOpen, open: openForm, close: closeForm } = useModal();
    const { isOpen: isDeleteConfirmOpen, open: openDeleteConfirm, close: closeDeleteConfirm } = useModal();
    const [roles, setRoles] = useState<Role[]>([]);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch roles
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch('/api/master-data/roles');
                if (response.ok) {
                    const data = await response.json();
                    setRoles(data.data || []);
                }
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };

        fetchRoles();
    }, []);

    // Handle add or update user
    const handleSaveUser = async (formData: UserFormData, userId?: number) => {
        try {
            const isUpdating = !!userId && editingUser;
            const endpoint = isUpdating
                ? `/api/master-data/users/${userId}`
                : '/api/master-data/users/create';
            const method = isUpdating ? 'PUT' : 'POST';

            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || (isUpdating ? 'Gagal memperbarui pengguna' : 'Gagal menambahkan pengguna'));
            }

            const successMsg = isUpdating ? 'Pengguna berhasil diperbarui' : 'Pengguna berhasil ditambahkan';
            setSuccessMessage(successMsg);
            closeForm();
            setEditingUser(null);

            // Reload table data
            await refetchUsers();

            // Clear message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error: any) {
            setErrorMessage(error.message);
            setTimeout(() => setErrorMessage(null), 4000);
            throw error;
        }
    };

    // Handle open edit form
    const handleEditUser = (user: User) => {
        setEditingUser(user);
        openForm();
    };

    // Handle close form
    const handleCloseForm = () => {
        setEditingUser(null);
        closeForm();
    };

    // Handle open delete confirmation
    const handleOpenDeleteConfirm = (user: User) => {
        setUserToDelete(user);
        openDeleteConfirm();
    };

    // Handle close delete confirmation
    const handleCloseDeleteConfirm = () => {
        setUserToDelete(null);
        closeDeleteConfirm();
    };

    // Handle confirm delete user
    const handleConfirmDelete = async () => {
        if (!userToDelete) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/master-data/users/${userToDelete.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Gagal menghapus pengguna');
            }

            setSuccessMessage('Pengguna berhasil dihapus');
            handleCloseDeleteConfirm();

            // Reload table data setelah berhasil menghapus user
            await refetchUsers();

            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error: any) {
            setErrorMessage(error.message);
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
                <h2 className="text-lg font-bold text-gray-900">Daftar Pengguna</h2>
                <button
                    onClick={openForm}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Tambah Pengguna
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-full">
                        <thead>
                            <tr className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Nama
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.length > 0 ? (
                                users.map((user, idx) => (
                                    <tr
                                        key={user.id}
                                        className={`transition ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                            } hover:bg-blue-50`}
                                    >
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {user.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {user.role?.name || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${user.status === 1
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {user.status === 1 ? 'Aktif' : 'Non-Aktif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEditUser(user)}
                                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition font-medium text-xs"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleOpenDeleteConfirm(user)}
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
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <p className="text-gray-500 font-medium">
                                            Tidak ada data pengguna
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {usersMeta && (
                    <Pagination
                        currentPage={userPage}
                        totalPages={usersMeta.totalPages}
                        pageSize={pageSize}
                        total={usersMeta.total}
                        onPageChange={setUserPage}
                        onPageSizeChange={setPageSize}
                    />
                )}
            </div>

            {/* User Form Modal */}
            <UserFormModal
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                roles={roles}
                onSubmit={handleSaveUser}
                editingUser={editingUser}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={isDeleteConfirmOpen}
                title="Hapus Pengguna"
                message={`Apakah Anda yakin ingin menghapus pengguna "${userToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
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