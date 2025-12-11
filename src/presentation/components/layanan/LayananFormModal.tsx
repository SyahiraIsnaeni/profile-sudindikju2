'use client';

import { useEffect, useState, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import { Input } from '@/presentation/components/shared/Input';
import { IconPicker } from '@/presentation/components/shared/IconPickerV2';
import { RichTextToolbar } from '@/presentation/components/shared/RichTextToolbar';

export interface LayananFormData {
  nama: string;
  deskripsi?: string | null;
  file?: File[] | string | null;
  icon?: string | null;
  urutan?: number | null;
  status: number;
}

interface Layanan {
  id: number;
  nama: string;
  deskripsi?: string | null;
  file?: string | null;
  icon?: string | null;
  urutan?: number | null;
  status: number;
  created_at: Date;
  updated_at: Date;
}

interface LayananFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: LayananFormData, layananId?: number) => Promise<void>;
  editingLayanan?: Layanan | null;
}

export const LayananFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingLayanan,
}: LayananFormModalProps) => {
  const [formData, setFormData] = useState<LayananFormData>({
    nama: '',
    deskripsi: null,
    file: null,
    icon: null,
    urutan: null,
    status: 1,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [usedUrutans, setUsedUrutans] = useState<number[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const descriptionEditorRef = useRef<HTMLDivElement>(null);

  // Fetch used urutans
  useEffect(() => {
    const fetchUsedUrutans = async () => {
      try {
        const res = await fetch('/api/dashboard/layanans?pageSize=1000');
        if (res.ok) {
          const data = await res.json();
          const urutans = data.data
            .filter((l: any) => l.urutan && l.urutan !== editingLayanan?.urutan)
            .map((l: any) => l.urutan);
          setUsedUrutans(urutans);
        }
      } catch (error) {
        console.error('Error fetching used urutans:', error);
      }
    };

    if (isOpen) {
      fetchUsedUrutans();
    }
  }, [isOpen, editingLayanan?.urutan]);

  useEffect(() => {
    if (editingLayanan) {
      setFormData({
        nama: editingLayanan.nama,
        deskripsi: editingLayanan.deskripsi || null,
        file: editingLayanan.file || null,
        icon: editingLayanan.icon || null,
        urutan: editingLayanan.urutan || null,
        status: editingLayanan.status,
      });
      // Parse existing files (comma-separated)
      const files = editingLayanan.file
        ? editingLayanan.file.split(',').map(f => f.trim()).filter(f => f)
        : [];
      setExistingFiles(files);
      if (descriptionEditorRef.current) {
        descriptionEditorRef.current.innerHTML = editingLayanan.deskripsi || '';
      }
    } else {
      setFormData({
        nama: '',
        deskripsi: null,
        file: null,
        icon: null,
        urutan: null,
        status: 1,
      });
      setExistingFiles([]);
      if (descriptionEditorRef.current) {
        descriptionEditorRef.current.innerHTML = '';
      }
    }
    setSelectedFiles([]);
    setErrors({});
  }, [editingLayanan, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama layanan wajib diisi';
    }

    if (!formData.deskripsi || formData.deskripsi.trim() === '') {
      newErrors.deskripsi = 'Deskripsi wajib diisi';
    }

    if (!formData.icon) {
      newErrors.icon = 'Icon wajib dipilih';
    }

    if (!formData.urutan) {
      newErrors.urutan = 'Nomor urutan wajib dipilih';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'urutan') {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? parseInt(value) : null,
      }));
    } else if (name === 'status') {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value || null,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: File[] = [];
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        alert(`File "${file.name}" ukurannya melebihi 10MB`);
        continue;
      }

      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        alert(`File "${file.name}" tipe nya tidak didukung. Gunakan: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF, WEBP`);
        continue;
      }

      newFiles.push(file);
    }

    if (newFiles.length > 0) {
      const updatedFiles = [...selectedFiles, ...newFiles];
      setSelectedFiles(updatedFiles);
      setFormData((prev) => ({
        ...prev,
        file: updatedFiles,
      }));
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleIconSelect = (iconName: string) => {
    setFormData((prev) => ({
      ...prev,
      icon: iconName,
    }));
  };

  const handleRemoveFile = (index: number, isNewFile: boolean) => {
    if (isNewFile) {
      const updatedFiles = selectedFiles.filter((_, i) => i !== index);
      setSelectedFiles(updatedFiles);
      setFormData((prev) => ({
        ...prev,
        file: updatedFiles.length > 0 ? updatedFiles : null,
      }));
    } else {
      const updatedExistingFiles = existingFiles.filter((_, i) => i !== index);
      setExistingFiles(updatedExistingFiles);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData, editingLayanan?.id);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop with animation */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      />

      {/* Modal with animation */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
      >
        <div
          className={`bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col transition-all duration-300 transform ${isOpen ? 'scale-100' : 'scale-95'
            }`}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between border-b border-blue-800">
            <h2 className="text-xl font-bold text-white">
              {editingLayanan ? 'Edit Layanan Publik' : 'Tambah Layanan Publik'}
            </h2>
            <button
              onClick={onClose}
              className="text-blue-100 hover:text-white transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form Body - Wrapper */}
          <div className="overflow-y-auto flex-1 p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nama Layanan */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Nama Layanan <span className="text-red-600">*</span>
                </label>
                <Input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  placeholder="Masukkan nama layanan"
                  className={errors.nama ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                />
                {errors.nama && (
                  <p className="text-red-600 text-sm mt-1">{errors.nama}</p>
                )}
              </div>

              {/* Deskripsi dengan Rich Text Editor */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Deskripsi <span className="text-red-600">*</span>
                </label>
                <div className={`border rounded-lg overflow-hidden ${errors.deskripsi ? 'border-red-500' : 'border-gray-300'}`}>
                  <RichTextToolbar editorRef={descriptionEditorRef} />
                  {/* Content Editor */}
                  <div
                    ref={descriptionEditorRef}
                    contentEditable
                    suppressContentEditableWarning
                    dir="ltr"
                    className="w-full p-4 border-none outline-none resize-none overflow-auto"
                    style={{
                      minHeight: '120px',
                      direction: 'ltr',
                      textAlign: 'left'
                    }}
                    onInput={(e) => {
                      const html = (e.target as HTMLDivElement).innerHTML;
                      setFormData((prev) => ({
                        ...prev,
                        deskripsi: html,
                      }));
                      if (errors.deskripsi) {
                        setErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.deskripsi;
                          return newErrors;
                        });
                      }
                    }}
                  />
                </div>
                {errors.deskripsi && (
                  <p className="text-red-600 text-sm mt-1">{errors.deskripsi}</p>
                )}
              </div>

              {/* File Upload dengan Drag & Drop */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Upload File (Bisa lebih dari satu file)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition bg-gray-50">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp"
                    onChange={handleFileChange}
                    className="hidden"
                    id="layanan-file-input"
                    disabled={isSubmitting}
                    multiple
                  />
                  <label
                    htmlFor="layanan-file-input"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="text-gray-400 w-8 h-8" />
                    <span className="text-gray-600 text-sm font-medium">
                      Klik untuk pilih file atau drag & drop
                    </span>
                    <span className="text-xs text-gray-500">
                      (PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF, WEBP - Maksimal 10MB per file)
                    </span>
                  </label>
                </div>

                {/* Existing Files List */}
                {existingFiles.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      File yang ada
                    </label>
                    <div className="space-y-2">
                      {existingFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <span className="text-sm text-gray-700">{file.split('/').pop()}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(idx, false)}
                            disabled={isSubmitting}
                            className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition"
                            title="Hapus file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Files List */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      File baru ({selectedFiles.length})
                    </label>
                    <div className="space-y-2">
                      {selectedFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                          <div>
                            <p className="text-sm text-gray-700">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(idx, true)}
                            disabled={isSubmitting}
                            className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition"
                            title="Hapus file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Icon Picker */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Pilih Icon <span className="text-red-600">*</span>
                </label>
                <div className={`flex items-center gap-3 p-4 border rounded-lg transition ${errors.icon ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100'}`}>
                  <button
                    type="button"
                    onClick={() => setIsIconPickerOpen(true)}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Pilih Icon
                  </button>
                  {formData.icon && (
                    <div className="flex items-center gap-3">
                      <div className="w-px h-8 bg-gray-300" />
                      <span className="text-2xl" title={formData.icon}>{formData.icon}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            icon: null,
                          }));
                          if (errors.icon) {
                            setErrors((prev) => {
                              const newErrors = { ...prev };
                              delete newErrors.icon;
                              return newErrors;
                            });
                          }
                        }}
                        disabled={isSubmitting}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                        title="Hapus icon"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
                {errors.icon && (
                  <p className="text-red-600 text-sm mt-1">{errors.icon}</p>
                )}
              </div>

              {/* Urutan / Sort Order */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Nomor Urutan <span className="text-red-600">*</span>
                </label>
                <select
                  name="urutan"
                  value={formData.urutan || ''}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed ${errors.urutan ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">-- Pilih Nomor Urutan --</option>
                  {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
                    <option
                      key={num}
                      value={num}
                      disabled={usedUrutans.includes(num)}
                    >
                      {usedUrutans.includes(num) ? `${num} (Sudah dipakai)` : num}
                    </option>
                  ))}
                </select>
                {errors.urutan && (
                  <p className="text-red-600 text-sm mt-1">{errors.urutan}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Status
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      value="1"
                      checked={formData.status === 1}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">Aktif</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      value="0"
                      checked={formData.status === 0}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">Non-Aktif</span>
                  </label>
                </div>
              </div>
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 px-6 py-4 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Menyimpan...' : editingLayanan ? 'Update' : 'Tambah'}
            </button>
          </div>
        </div>
      </div>

      {/* Icon Picker Modal */}
      <IconPicker
        isOpen={isIconPickerOpen}
        onClose={() => setIsIconPickerOpen(false)}
        onSelect={handleIconSelect}
        selectedIcon={formData.icon || ''}
      />
    </>
  );
};
