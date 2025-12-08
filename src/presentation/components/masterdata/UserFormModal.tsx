'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/presentation/components/shared/Modal';
import { Toggle } from '@/presentation/components/shared/Toggle';

interface Role {
    id: number;
    name: string;
}

export interface UserFormData {
    name: string;
    email: string;
    password?: string;
    role_id: number;
    status: number;
}

interface User {
    id: number;
    name: string;
    email: string;
    password?: string;
    role_id?: number | null;
    status: number;
    created_at?: Date;
    updated_at?: Date;
}

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    roles: Role[];
    onSubmit: (data: UserFormData, userId?: number) => Promise<void>;
    editingUser?: User | null;
}

export const UserFormModal = ({
    isOpen,
    onClose,
    roles,
    onSubmit,
    editingUser = null,
}: UserFormModalProps) => {
    const [formData, setFormData] = useState<UserFormData>({
        name: '',
        email: '',
        password: '',
        role_id: roles && roles.length > 0 ? roles[0].id : 0,
        status: 1,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize form with editing user data
    useEffect(() => {
        if (editingUser) {
            setFormData({
                name: editingUser.name || '',
                email: editingUser.email || '',
                password: '',
                role_id: editingUser.role_id || (roles.length > 0 ? roles[0].id : 0),
                status: editingUser.status || 1,
            });
        } else {
            setFormData({
                name: '',
                email: '',
                password: '',
                role_id: roles && roles.length > 0 ? roles[0].id : 0,
                status: 1,
            });
        }
        setError(null);
    }, [editingUser, isOpen, roles]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        if (name === 'role_id') {
            const roleId = parseInt(value);
            setFormData((prev) => ({
                ...prev,
                role_id: roleId > 0 ? roleId : 0,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleStatusChange = (checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            status: checked ? 1 : 0,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (roles.length === 0) {
            setError('Tidak ada role tersedia. Silakan tambahkan role terlebih dahulu.');
            setLoading(false);
            return;
        }

        if (formData.role_id === 0 || !formData.role_id) {
            setError('Pilih role untuk pengguna');
            setLoading(false);
            return;
        }

        // For edit mode, password is optional. For create mode, it's required.
        if (!editingUser && !formData.password) {
            setError('Password harus diisi untuk pengguna baru');
            setLoading(false);
            return;
        }

        try {
            const submitData: UserFormData = {
                name: formData.name,
                email: formData.email,
                role_id: formData.role_id,
                status: formData.status,
            };

            // Only include password if it's provided
            if (formData.password) {
                submitData.password = formData.password;
            }

            await onSubmit(submitData, editingUser?.id);

            // Reset form only if not editing (for create mode)
            if (!editingUser) {
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    role_id: roles && roles.length > 0 ? roles[0].id : 0,
                    status: 1,
                });
            }
            onClose();
        } catch (err: any) {
            setError(err.message || 'Gagal menyimpan data');
        } finally {
            setLoading(false);
        }
    };

    const isEditMode = !!editingUser;
    const modalTitle = isEditMode ? 'Edit Pengguna' : 'Tambah Pengguna';
    const submitButtonText = isEditMode
        ? (loading ? 'Memperbarui...' : 'Perbarui')
        : (loading ? 'Menyimpan...' : 'Simpan');

    return (
        <Modal isOpen={isOpen} title={modalTitle} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 border border-red-200 p-3 rounded text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Masukkan nama"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={isEditMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Masukkan email"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password {isEditMode && <span className="text-gray-500 text-xs">(kosongkan jika tidak ingin mengubah)</span>}
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required={!isEditMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder={isEditMode ? 'Kosongkan jika tidak ingin mengubah' : 'Masukkan password'}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="role_id"
                        value={formData.role_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="0">-- Pilih Role --</option>
                        {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                                {role.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Status
                    </label>
                    <Toggle
                        checked={formData.status === 1}
                        onChange={handleStatusChange}
                        label={formData.status === 1 ? 'Aktif' : 'Non-Aktif'}
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition"
                    >
                        {submitButtonText}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
