'use client';

import { useEffect, useState, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import { Input } from '@/presentation/components/shared/Input';

export interface GaleriKegiatanFormData {
    judul: string;
    foto?: File[] | string | null;
    status: number;
}

interface GaleriKegiatan {
    id: number;
    judul: string;
    foto?: string | null;
    status: number;
    created_at: Date;
    updated_at: Date;
}

interface GaleriKegiatanFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: GaleriKegiatanFormData, galeriId?: number) => Promise<void>;
    editingGaleri?: GaleriKegiatan | null;
}

export const GaleriKegiatanFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    editingGaleri,
}: GaleriKegiatanFormModalProps) => {
    const [formData, setFormData] = useState<GaleriKegiatanFormData>({
        judul: '',
        foto: null,
        status: 1,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [existingFiles, setExistingFiles] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editingGaleri) {
            setFormData({
                judul: editingGaleri.judul,
                foto: editingGaleri.foto || null,
                status: editingGaleri.status,
            });
            // Parse existing files (comma-separated)
            const files = editingGaleri.foto
                ? editingGaleri.foto.split(',').map(f => f.trim()).filter(f => f)
                : [];
            setExistingFiles(files);
        } else {
            setFormData({
                judul: '',
                foto: null,
                status: 1,
            });
            setExistingFiles([]);
        }
        setSelectedFiles([]);
        setErrors({});
    }, [editingGaleri, isOpen]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.judul.trim()) {
            newErrors.judul = 'Judul kegiatan wajib diisi';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (name === 'status') {
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
                alert(`File "${file.name}" tipe nya tidak didukung. Gunakan: JPG, PNG, GIF, WEBP`);
                continue;
            }

            newFiles.push(file);
        }

        if (newFiles.length > 0) {
            const updatedFiles = [...selectedFiles, ...newFiles];
            setSelectedFiles(updatedFiles);
            setFormData((prev) => ({
                ...prev,
                foto: updatedFiles,
            }));
        }

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveFile = (index: number, isNewFile: boolean) => {
        if (isNewFile) {
            const updatedFiles = selectedFiles.filter((_, i) => i !== index);
            setSelectedFiles(updatedFiles);
            setFormData((prev) => ({
                ...prev,
                foto: updatedFiles.length > 0 ? updatedFiles : null,
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
            await onSubmit(formData, editingGaleri?.id);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
            >
                <div
                    className={`bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col transition-all duration-300 transform ${isOpen ? 'scale-100' : 'scale-95'
                        }`}
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between border-b border-blue-800">
                        <h2 className="text-xl font-bold text-white">
                            {editingGaleri ? 'Edit Galeri Kegiatan' : 'Tambah Galeri Kegiatan'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-blue-100 hover:text-white transition"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Form Body */}
                    <div className="overflow-y-auto flex-1 p-6 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Judul Kegiatan */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Judul Kegiatan <span className="text-red-600">*</span>
                                </label>
                                <Input
                                    type="text"
                                    name="judul"
                                    value={formData.judul}
                                    onChange={handleChange}
                                    placeholder="Masukkan judul kegiatan"
                                    className={errors.judul ? 'border-red-500' : ''}
                                    disabled={isSubmitting}
                                />
                                {errors.judul && (
                                    <p className="text-red-600 text-sm mt-1">{errors.judul}</p>
                                )}
                            </div>

                            {/* Foto Kegiatan */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-900">
                                    Foto Kegiatan (Bisa lebih dari satu)
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition bg-gray-50">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.gif,.webp"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="galeri-file-input"
                                        disabled={isSubmitting}
                                        multiple
                                    />
                                    <label
                                        htmlFor="galeri-file-input"
                                        className="cursor-pointer flex flex-col items-center gap-2"
                                    >
                                        <Upload className="text-gray-400 w-8 h-8" />
                                        <span className="text-gray-600 text-sm font-medium">
                                            Klik untuk pilih foto atau drag & drop
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            (JPG, PNG, GIF, WEBP - Maksimal 10MB per file)
                                        </span>
                                    </label>
                                </div>

                                {/* Existing Files List */}
                                {existingFiles.length > 0 && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-900">
                                            Foto yang ada
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {existingFiles.map((file, idx) => (
                                                <div key={idx} className="relative group">
                                                    <img
                                                        src={file}
                                                        alt={`Foto ${idx + 1}`}
                                                        className="w-full h-24 object-cover rounded-lg border border-blue-200"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveFile(idx, false)}
                                                        disabled={isSubmitting}
                                                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded transition opacity-0 group-hover:opacity-100"
                                                        title="Hapus foto"
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
                                            Foto baru ({selectedFiles.length})
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {selectedFiles.map((file, idx) => (
                                                <div key={idx} className="relative group">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={`Foto baru ${idx + 1}`}
                                                        className="w-full h-24 object-cover rounded-lg border border-green-200"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveFile(idx, true)}
                                                        disabled={isSubmitting}
                                                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded transition opacity-0 group-hover:opacity-100"
                                                        title="Hapus foto"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
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
                            {isSubmitting ? 'Menyimpan...' : editingGaleri ? 'Update' : 'Tambah'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
