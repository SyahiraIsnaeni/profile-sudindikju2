'use client';

import { useEffect, useState } from 'react';
import { useArtikel } from '@/presentation/composables/useArtikel';
import { useModal } from '@/presentation/composables/useModal';
import { Pagination } from '@/presentation/components/shared/Pagination';
import { ConfirmationModal } from '@/presentation/components/shared/ConfirmationModal';
import { Alert } from '@/presentation/components/shared/Alert';
import { ArtikelFormModal, ArtikelFormData } from '@/presentation/components/artikel/ArtikelFormModal';
import { ArtikelFilter } from '@/presentation/components/artikel/ArtikelFilter';
import { Edit2, Plus, Trash2, Download, Image as ImageIcon } from 'lucide-react';

interface Artikel {
  id: number;
  judul: string;
  deskripsi?: string | null;
  kategori?: string | null;
  gambar?: string | null;
  file?: string | null;
  penulis?: string | null;
  tanggal: Date;
  status: number;
  created_at: Date;
  updated_at: Date;
}

export const ArtikelTab = () => {
  const {
    artikels,
    loading,
    page,
    setPage,
    pageSize,
    setPageSize,
    meta,
    refetchArtikels,
  } = useArtikel();

  const { isOpen: isFormOpen, open: openForm, close: closeForm } = useModal();
  const { isOpen: isDeleteConfirmOpen, open: openDeleteConfirm, close: closeDeleteConfirm } = useModal();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editingArtikel, setEditingArtikel] = useState<Artikel | null>(null);
  const [artikelToDelete, setArtikelToDelete] = useState<Artikel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filteredArtikels, setFilteredArtikels] = useState<Artikel[]>([]);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [kategoris, setKategoris] = useState<string[]>([]);

  // Fetch available kategoris
  useEffect(() => {
    const fetchKategoris = async () => {
      try {
        const res = await fetch('/api/dashboard/artikels/kategoris');
        if (res.ok) {
          const data = await res.json();
          setKategoris(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching kategoris:', error);
      }
    };

    fetchKategoris();
  }, []);

  const handleSaveArtikel = async (formData: ArtikelFormData, artikelId?: number, remainingExistingFiles?: string[], existingGambar?: string) => {
    try {
      const isUpdating = !!editingArtikel && artikelId !== undefined && artikelId > 0;

      if (editingArtikel && (!artikelId || isNaN(artikelId) || artikelId <= 0)) {
        throw new Error('ID artikel tidak valid untuk update');
      }

      const endpoint = isUpdating
        ? `/api/dashboard/artikels/${artikelId}`
        : '/api/dashboard/artikels/create';
      const method = isUpdating ? 'PUT' : 'POST';

      // Create FormData for file upload
      const form = new FormData();
      form.append('judul', formData.judul);
      form.append('deskripsi', formData.deskripsi || '');
      form.append('kategori', formData.kategori || '');
      form.append('penulis', formData.penulis || '');
      form.append('tanggal', formData.tanggal.toISOString());
      form.append('status', formData.status.toString());

      // Handle gambar
      if (formData.gambar instanceof File) {
        form.append('gambar', formData.gambar);
      }

      if (isUpdating && existingGambar) {
        form.append('existingGambar', existingGambar);
      }

      // Handle files
      if (formData.file && Array.isArray(formData.file) && formData.file.length > 0) {
        for (const file of formData.file) {
          if (file instanceof File) {
            form.append('file', file);
          }
        }
      }

      // Handle remaining existing files
      if (isUpdating) {
        const remainingFilesStr = remainingExistingFiles && remainingExistingFiles.length > 0
          ? remainingExistingFiles.join(',')
          : 'null';
        form.append('existingFiles', remainingFilesStr);
      }

      console.log(`[API] ${method} ${endpoint}`, {
        artikelId,
        isUpdating,
      });

      const response = await fetch(endpoint, {
        method,
        body: form,
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error(`[API] Error response:`, responseData);
        throw new Error(responseData.error || (isUpdating ? 'Gagal memperbarui artikel' : 'Gagal menambahkan artikel'));
      }

      console.log(`[API] Success response:`, responseData);

      const successMsg = isUpdating ? 'Artikel berhasil diperbarui' : 'Artikel berhasil ditambahkan';
      setSuccessMessage(successMsg);
      closeForm();
      setEditingArtikel(null);

      // Reload table data
      await refetchArtikels();

      // Clear message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      setErrorMessage(error.message);
      setTimeout(() => setErrorMessage(null), 4000);
      throw error;
    }
  };

  const handleEditArtikel = (artikel: Artikel) => {
    setEditingArtikel(artikel);
    openForm();
  };

  const handleCloseForm = () => {
    setEditingArtikel(null);
    closeForm();
  };

  const handleOpenDeleteConfirm = (artikel: Artikel) => {
    setArtikelToDelete(artikel);
    openDeleteConfirm();
  };

  const handleCloseDeleteConfirm = () => {
    setArtikelToDelete(null);
    closeDeleteConfirm();
  };

  const handleFilter = (filters: {
    status?: number;
    kategori?: string;
    searchValue?: string;
  }) => {
    if (Object.keys(filters).length === 0) {
      setFilteredArtikels([]);
      setIsFilterActive(false);
      return;
    }

    let result = [...artikels];

    if (filters.status !== undefined) {
      result = result.filter((artikel) => artikel.status === filters.status);
    }

    if (filters.kategori) {
      result = result.filter((artikel) => artikel.kategori === filters.kategori);
    }

    if (filters.searchValue) {
      const searchTerm = filters.searchValue.toLowerCase();
      result = result.filter((artikel) =>
        artikel.judul.toLowerCase().includes(searchTerm) ||
        artikel.penulis?.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredArtikels(result);
    setIsFilterActive(true);
    setPage(1);
  };

  const getFilesList = (fileString: string | undefined | null): string[] => {
    if (!fileString) return [];
    return fileString.split(',').map(f => f.trim()).filter(f => f);
  };

  const getFileName = (filePath: string): string => {
    return filePath.split('/').pop() || filePath;
  };

  const handleConfirmDelete = async () => {
    if (!artikelToDelete || !artikelToDelete.id) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/dashboard/artikels/${artikelToDelete.id}`, {
        method: 'DELETE',
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Gagal menghapus artikel');
      }

      setSuccessMessage('Artikel berhasil dihapus');
      handleCloseDeleteConfirm();

      await refetchArtikels();

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      setErrorMessage(error.message || 'Gagal menghapus artikel');
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatTanggal = (date: Date): string => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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

  const displayArtikels = isFilterActive ? filteredArtikels : artikels;

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

      {/* Filter Section */}
      <ArtikelFilter onFilter={handleFilter} kategoris={kategoris} />

      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Daftar Artikel</h2>
          {isFilterActive && (
            <p className="text-sm text-gray-600 mt-1">
              Menampilkan {displayArtikels.length} dari {artikels.length} artikel
            </p>
          )}
        </div>
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
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{ scrollBehavior: 'smooth' }}>
          <table className="w-full border-collapse min-w-max">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gradient-to-r from-blue-800 to-blue-900 border-b-2 border-blue-950">
                <th className="px-4 lg:px-6 py-3 sm:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Judul
                </th>
                <th className="px-4 lg:px-6 py-3 sm:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-4 lg:px-6 py-3 sm:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-4 lg:px-6 py-3 sm:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Penulis
                </th>
                <th className="px-4 lg:px-6 py-3 sm:py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                  Gambar
                </th>
                <th className="px-4 lg:px-6 py-3 sm:py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                  File
                </th>
                <th className="px-4 lg:px-6 py-3 sm:py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 lg:px-6 py-3 sm:py-4 text-center text-xs font-bold text-white uppercase tracking-wider sticky right-0 bg-gradient-to-r from-blue-800 to-blue-900">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayArtikels.length > 0 ? (
                displayArtikels.map((artikel, idx) => (
                  <tr
                    key={artikel.id}
                    className={`transition hover:bg-blue-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900 whitespace-normal">
                      <span className="break-words">{artikel.judul}</span>
                    </td>
                    <td className="px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                      {formatTanggal(artikel.tanggal)}
                    </td>
                    <td className="px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600">
                      {artikel.kategori || '-'}
                    </td>
                    <td className="px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600">
                      {artikel.penulis || '-'}
                    </td>
                    <td className="px-4 lg:px-6 py-3 sm:py-4 text-center">
                      {artikel.gambar ? (
                        <a
                          href={artikel.gambar}
                          download
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline transition text-xs font-medium"
                          title={`Download: ${artikel.gambar}`}
                        >
                          <ImageIcon className="w-4 h-4" />
                          <span className="hidden sm:inline">Gambar</span>
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-4 lg:px-6 py-3 sm:py-4 text-center">
                      {artikel.file ? (
                        <div className="space-y-1">
                          {getFilesList(artikel.file).map((filePath, idx) => (
                            <a
                              key={idx}
                              href={filePath}
                              download
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline transition text-xs font-medium"
                              title={`Download: ${getFileName(filePath)}`}
                            >
                              <Download className="w-3 h-3" />
                              <span className="line-clamp-1">{getFileName(filePath)}</span>
                            </a>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-4 lg:px-6 py-3 sm:py-4 text-sm text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          artikel.status === 1
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        <span
                          className={`inline-block w-2 h-2 rounded-full mr-1 ${
                            artikel.status === 1 ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        />
                        {artikel.status === 1 ? 'Aktif' : 'Non-Aktif'}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-3 sm:py-4 text-sm text-center sticky right-0 bg-inherit">
                      <div className="flex items-center justify-center gap-1 sm:gap-1.5">
                        <button
                          onClick={() => handleEditArtikel(artikel)}
                          className="inline-flex items-center justify-center gap-0.5 sm:gap-1 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white px-2.5 py-1.5 sm:py-2 rounded transition font-medium text-xs flex-shrink-0"
                          title="Edit"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => handleOpenDeleteConfirm(artikel)}
                          className="inline-flex items-center justify-center gap-0.5 sm:gap-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-2.5 py-1.5 sm:py-2 rounded transition font-medium text-xs flex-shrink-0"
                          title="Hapus"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span className="hidden sm:inline">Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 lg:px-6 py-8 sm:py-12 text-center">
                    <p className="text-gray-500 font-medium">Tidak ada data artikel</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && !isFilterActive && (
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

      {/* Artikel Form Modal */}
      <ArtikelFormModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSaveArtikel}
        editingArtikel={editingArtikel}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        title="Hapus Artikel"
        message={`Apakah Anda yakin ingin menghapus artikel "${artikelToDelete?.judul}"? Tindakan ini tidak dapat dibatalkan.`}
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
