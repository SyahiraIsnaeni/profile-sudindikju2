'use client';

import { useMasterData } from '@/presentation/composables/useMasterData';
import { Pagination } from '@/presentation/components/shared/Pagination';
import { Edit2 } from 'lucide-react';

export const UsersTab = () => {
  const {
    users,
    loading,
    userPage,
    setUserPage,
    pageSize,
    setPageSize,
    usersMeta,
  } = useMasterData();

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
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Table */}
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
                  className={`transition ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-blue-50`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        user.status === 1
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.status === 1 ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-3 py-2 rounded-lg transition font-medium text-xs">
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
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
  );
};