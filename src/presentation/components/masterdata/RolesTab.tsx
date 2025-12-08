'use client';

import { useState } from 'react';
import { useMasterData } from '@/presentation/composables/useMasterData';
import { useRoleManagement } from '@/presentation/composables/useRoleManagement';
import { Pagination } from '@/presentation/components/shared/Pagination';
import { RoleFormModal } from '@/presentation/components/masterdata/RoleFormModal';
import { RolePermissionsModal } from '@/presentation/components/masterdata/RolePermissionsModal';
import { Edit2, Plus, Trash2 } from 'lucide-react';

interface RoleWithPermissions {
    id: number;
    name: string;
    status: number;
    permissions?: Array<{
        id: number;
        name: string;
        detail: string;
    }>;
    created_at: Date;
    updated_at: Date;
}

export const RolesTab = () => {
    // Master data hooks
    const {
        roles,
        loading,
        rolePage,
        setRolePage,
        pageSize,
        setPageSize,
        rolesMeta,
        refetchRoles,
    } = useMasterData();

    // Role management hooks
    const {
        permissions,
        groupedPermissions,
        createRole,
        updateRole,
    } = useRoleManagement();

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedRole, setSelectedRole] = useState<RoleWithPermissions | null>(
        null
    );
    const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
    const [selectedRoleForPermissions, setSelectedRoleForPermissions] =
        useState<RoleWithPermissions | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    // Handle add role button
    const handleAddRole = () => {
        setIsEditMode(false);
        setSelectedRole(null);
        setIsModalOpen(true);
    };

    // Handle edit role
    const handleEditRole = (role: RoleWithPermissions) => {
        setIsEditMode(true);
        setSelectedRole(role);
        setIsModalOpen(true);
    };

    // Handle view permissions
    const handleViewPermissions = (role: RoleWithPermissions) => {
        setSelectedRoleForPermissions(role);
        setIsPermissionsModalOpen(true);
    };

    // Handle form submit
    const handleFormSubmit = async (formData: {
        name: string;
        status: number;
        permission_ids: number[];
    }) => {
        try {
            if (isEditMode && selectedRole) {
                // Update existing role
                await updateRole(selectedRole.id, formData);
            } else {
                // Create new role
                await createRole(formData);
            }

            // Reset modal state
            setIsModalOpen(false);
            setSelectedRole(null);
            setIsEditMode(false);

            // Refresh roles data tanpa reload halaman
            await refetchRoles();
        } catch (error: any) {
            console.error('Error submitting form:', error);
            throw error;
        }
    };

    // Handle delete role
    const handleDeleteRole = async (roleId: number, roleName: string) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus role "${roleName}"?`)) {
            return;
        }

        setIsDeleting(true);
        setDeleteError(null);

        try {
            const response = await fetch(`/api/master-data/roles/${roleId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Gagal menghapus role');
            }

            // Refresh roles data tanpa reload halaman
            await refetchRoles();
        } catch (error: any) {
            setDeleteError(error.message);
            console.error('Error deleting role:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    // Loading state
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
        <div className="space-y-4">
            {/* Header with Add Button */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                    Daftar Role & Hak Akses
                </h3>
                <button
                    onClick={handleAddRole}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2 rounded-lg transition font-medium text-sm"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Role
                </button>
            </div>

            {/* Delete Error Alert */}
            {deleteError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 text-sm">{deleteError}</p>
                    <button
                        onClick={() => setDeleteError(null)}
                        className="text-red-600 text-sm font-medium mt-2 hover:text-red-700"
                    >
                        Tutup
                    </button>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-full">
                        <thead>
                            <tr className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Nama Role
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Hak Akses
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {roles.length > 0 ? (
                                roles.map((role, idx) => {
                                    const roleWithPerms = role as RoleWithPermissions;
                                    const permissionCount = roleWithPerms.permissions?.length || 0;

                                    return (
                                        <tr
                                            key={role.id}
                                            className={`transition ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                                } hover:bg-blue-50`}
                                        >
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 capitalize">
                                                {role.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${role.status === 1
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                        }`}
                                                >
                                                    {role.status === 1 ? 'Aktif' : 'Tidak Aktif'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                <div className="flex flex-wrap gap-1">
                                                    {permissionCount > 0 ? (
                                                        <button
                                                            onClick={() => handleViewPermissions(roleWithPerms)}
                                                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition cursor-pointer"
                                                        >
                                                            {permissionCount} permission
                                                        </button>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs italic">
                                                            Belum ada hak akses
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEditRole(roleWithPerms)}
                                                        className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-3 py-2 rounded-lg transition font-medium text-xs"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteRole(role.id, role.name)}
                                                        disabled={isDeleting}
                                                        className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-gray-400 text-white px-3 py-2 rounded-lg transition font-medium text-xs"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <p className="text-gray-500 font-medium">
                                            Tidak ada data role dan hak akses
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {rolesMeta && (
                    <Pagination
                        currentPage={rolePage}
                        totalPages={rolesMeta.totalPages}
                        pageSize={pageSize}
                        total={rolesMeta.total}
                        onPageChange={setRolePage}
                        onPageSizeChange={setPageSize}
                    />
                )}
            </div>

            {/* Role Form Modal */}
            <RoleFormModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedRole(null);
                    setIsEditMode(false);
                }}
                permissions={permissions}
                onSubmit={handleFormSubmit}
                editData={isEditMode ? selectedRole : undefined}
            />

            {/* Role Permissions Modal */}
            {selectedRoleForPermissions && (
                <RolePermissionsModal
                    isOpen={isPermissionsModalOpen}
                    onClose={() => {
                        setIsPermissionsModalOpen(false);
                        setSelectedRoleForPermissions(null);
                    }}
                    roleName={selectedRoleForPermissions.name}
                    roleStatus={selectedRoleForPermissions.status}
                    permissions={selectedRoleForPermissions.permissions || []}
                />
            )}
        </div>
    );
};
