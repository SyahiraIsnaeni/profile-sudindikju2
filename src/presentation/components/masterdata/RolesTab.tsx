'use client';

import { useMasterData } from '@/presentation/composables/useMasterData';
import { Edit2 } from 'lucide-react';

export const RolesTab = () => {
  const { roles, loading } = useMasterData();

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="w-full min-w-full">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Nama
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Hak Akses
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {roles.map((role) => (
            <tr key={role.id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 text-sm text-gray-900 capitalize">
                {role.name}
              </td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    role.status === 1
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {role.status === 1 ? 'Aktif' : 'Tidak Aktif'}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {/* Hak akses kosong dulu */}
              </td>
              <td className="px-6 py-4 text-sm">
                <button className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition">
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {roles.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Tidak ada data role dan hak akses
        </div>
      )}
    </div>
  );
};