'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) => {
  const pageSizeOptions = [10, 25, 50, 100];
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, total);

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 border-t">
      {/* Left: Info & Page Size */}
      <div className="flex items-center gap-6">
        <div className="text-sm text-gray-600">
          Menampilkan <span className="font-semibold">{startIndex}</span> hingga{' '}
          <span className="font-semibold">{endIndex}</span> dari{' '}
          <span className="font-semibold">{total}</span> data
        </div>

        {/* Page Size Selector */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 font-medium">
            Items per halaman:
          </label>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right: Navigation */}
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600">
          Halaman <span className="font-semibold">{currentPage}</span> dari{' '}
          <span className="font-semibold">{totalPages}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={currentPage >= totalPages}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};