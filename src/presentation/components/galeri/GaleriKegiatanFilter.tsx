'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface GaleriKegiatanFilterProps {
  onFilter: (filters: {
    status?: number;
    searchValue?: string;
  }) => void;
}

export const GaleriKegiatanFilter = ({ onFilter }: GaleriKegiatanFilterProps) => {
  const [status, setStatus] = useState<string>('');
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    const filters: {
      status?: number;
      searchValue?: string;
    } = {};

    if (status) {
      filters.status = parseInt(status);
    }
    if (searchValue.trim()) {
      filters.searchValue = searchValue.trim();
    }

    onFilter(filters);
  };

  const handleClear = () => {
    setStatus('');
    setSearchValue('');
    onFilter({});
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
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

        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cari Judul Kegiatan
          </label>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Masukkan judul kegiatan..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
        </div>

        {/* Spacer for alignment */}
        <div />
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
