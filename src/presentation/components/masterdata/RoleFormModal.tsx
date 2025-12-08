'use client';

import { useState } from 'react';
import { Modal } from '@/presentation/components/shared/Modal';
import { Toggle } from '@/presentation/components/shared/Toggle';

interface Permission {
  id: number;
  name: string;
  detail: string;
}

interface RoleFormData {
  name: string;
  status: number;
  permission_ids: number[];
}

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  permissions: Permission[];
  onSubmit: (data: RoleFormData) => Promise<void>;
}

export const RoleFormModal = ({
  isOpen,
  onClose,
  permissions,
  onSubmit,
}: RoleFormModalProps) => {
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    status: 1,
    permission_ids: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Group permissions by name (menu)
  const groupedPermissions = permissions.reduce(
    (acc, perm) => {
      if (!acc[perm.name]) {
        acc[perm.name] = [];
      }
      acc[perm.name].push(perm);
      return acc;
    },
    {} as Record<string, Permission[]>
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      name: e.target.value,
    }));
  };

  const handleStatusChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      status: checked ? 1 : 0,
    }));
  };

  const handlePermissionToggle = (permissionId: number) => {
    setFormData((prev) => ({
      ...prev,
      permission_ids: prev.permission_ids.includes(permissionId)
        ? prev.permission_ids.filter((id) => id !== permissionId)
        : [...prev.permission_ids, permissionId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
      setFormData({
        name: '',
        status: 1,
        permission_ids: [],
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} title="Tambah Role" onClose={onClose} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 p-3 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Header */}
        <div className="space-y-4 pb-4 border-b">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Role
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={handleNameChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Masukkan nama role"
            />
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
        </div>

        {/* Permission Boxes */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Pilih Permission
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(groupedPermissions).map(([menuName, perms]) => (
              <div
                key={menuName}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <h4 className="font-semibold text-gray-800 mb-3 text-sm">
                  {menuName}
                </h4>

                <div className="space-y-2">
                  {perms.map((perm) => (
                    <label
                      key={perm.id}
                      className="flex items-center gap-3 cursor-pointer hover:bg-white p-2 rounded transition"
                    >
                      <input
                        type="checkbox"
                        checked={formData.permission_ids.includes(perm.id)}
                        onChange={() => handlePermissionToggle(perm.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{perm.detail}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg"
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </Modal>
  );
};