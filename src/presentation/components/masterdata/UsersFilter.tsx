'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface Role {
  id: number;
  name: string;
}

interface UsersFilterProps {
  roles: Role[];
  onFilter: (filters: {
    status?: number;
    role_id?: number;
    searchBy?: 'name' | 'email';
    searchValue?: string;
  }) => void;
}

export const UsersFilter = ({ roles, onFilter }: UsersFilterProps) => {
  const [status, setStatus] = useState<string>('');
  const [roleId, setRoleId] = useState<string>('');
  const [searchBy, setSearchBy] = useState<'name' | 'email'>('name');
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    const filters: {
      status?: number;
      role_id?: number;
      searchBy?: 'name' | 'email';
      searchValue?: string;
    } = {};

    if (status) {
      filters.status = parseInt(status);
    }
    if (roleId) {
      filters.role_id = parseInt(roleId);
    }
    if (searchValue.trim()) {
      filters.searchBy = searchBy;
      filters.searchValue = searchValue.trim();
    }

    onFilter(filters);
  };

  const handleClear = () => {
    setStatus('');
    setRoleId('');
    setSearchValue('');
    setSearchBy('name');
    onFilter({});
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          >
            <option value="">Semua Status</option>
            <option value="1">Aktif</option>
            <option value="0">Non-Aktif</option>
          </select>
        </div>

        {/* Role Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          <select
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          >
            <option value="">Semua Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search By Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cari Berdasarkan
          </label>
          <select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value as 'name' | 'email')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          >
            <option value="name">Nama</option>
            <option value="email">Email</option>
          </select>
        </div>

        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kata Kunci
          </label>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={`Cari ${searchBy === 'name' ? 'nama' : 'email'}...`}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSearch}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-6 py-2 rounded-lg transition font-medium text-sm"
        >
          <Search className="w-4 h-4" />
          Cari
        </button>
        <button
          onClick={handleClear}
          className="inline-flex items-center gap-2 bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-800 px-6 py-2 rounded-lg transition font-medium text-sm"
        >
          <X className="w-4 h-4" />
          Hapus Filter
        </button>
      </div>
    </div>
  );
};
