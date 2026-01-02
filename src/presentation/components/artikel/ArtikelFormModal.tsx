'use client';

import { useEffect, useState, useRef } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import { Input } from '@/presentation/components/shared/Input';
import { RichTextToolbar } from '@/presentation/components/shared/RichTextToolbar';

export interface ArtikelFormData {
    judul: string;
    deskripsi?: string | null;
    kategori?: string | null;
    gambar?: File | null;
    file?: File[] | string | null;
    penulis?: string | null;
    tanggal: Date;
    status: number;
}

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

interface ArtikelFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: ArtikelFormData, artikelId?: number, remainingExistingFiles?: string[], existingGambar?: string) => Promise<void>;
    editingArtikel?: Artikel | null;
}

const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'text/csv',
];

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export const ArtikelFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    editingArtikel,
}: ArtikelFormModalProps) => {
    const [formData, setFormData] = useState<ArtikelFormData>({
        judul: '',
        deskripsi: null,
        kategori: null,
        gambar: null,
        file: null,
        penulis: null,
        tanggal: new Date(),
        status: 1,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [existingFiles, setExistingFiles] = useState<string[]>([]);
    const [selectedGambar, setSelectedGambar] = useState<File | null>(null);
    const [existingGambar, setExistingGambar] = useState<string | null>(null);
    const [previewGambar, setPreviewGambar] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const gambarInputRef = useRef<HTMLInputElement>(null);
    const descriptionEditorRef = useRef<HTMLDivElement>(null);

    // Get available kategoris
    const [kategoris, setKategoris] = useState<string[]>([]);

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

        if (isOpen) {
            fetchKategoris();
        }
    }, [isOpen]);

    useEffect(() => {
        if (editingArtikel) {
            setFormData({
                judul: editingArtikel.judul,
                deskripsi: editingArtikel.deskripsi || null,
                kategori: editingArtikel.kategori || null,
                gambar: null,
                file: null,
                penulis: editingArtikel.penulis || null,
                tanggal: new Date(editingArtikel.tanggal),
                status: editingArtikel.status,
            });

            // Parse existing files
            const files = editingArtikel.file
                ? editingArtikel.file.split(',').map(f => f.trim()).filter(f => f)
                : [];
            setExistingFiles(files);
            setSelectedFiles([]);

            // Set existing gambar
            if (editingArtikel.gambar) {
                setExistingGambar(editingArtikel.gambar);
                setPreviewGambar(editingArtikel.gambar);
            }

            if (descriptionEditorRef.current) {
                descriptionEditorRef.current.innerHTML = editingArtikel.deskripsi || '';
            }
        } else {
            resetForm();
        }
    }, [editingArtikel, isOpen]);

    const resetForm = () => {
        setFormData({
            judul: '',
            deskripsi: null,
            kategori: null,
            gambar: null,
            file: null,
            penulis: null,
            tanggal: new Date(),
            status: 1,
        });
        setSelectedFiles([]);
        setExistingFiles([]);
        setSelectedGambar(null);
        setExistingGambar(null);
        setPreviewGambar(null);
        setErrors({});
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (gambarInputRef.current) gambarInputRef.current.value = '';
        if (descriptionEditorRef.current) descriptionEditorRef.current.innerHTML = '';
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'tanggal') {
            setFormData(prev => ({
                ...prev,
                [name]: new Date(value),
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value || null,
            }));
        }

        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            status: parseInt(e.target.value),
        }));
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).filter(file => {
                if (!ALLOWED_FILE_TYPES.includes(file.type)) {
                    setErrors(prev => ({
                        ...prev,
                        file: `File ${file.name} tidak diizinkan. Format yang didukung: PDF, Word, Excel, Image, CSV`,
                    }));
                    return false;
                }
                return true;
            });

            if (newFiles.length > 0) {
                setSelectedFiles(prev => [...prev, ...newFiles]);
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.file;
                    return newErrors;
                });
            }
        }
    };

    const handleGambarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
                setErrors(prev => ({
                    ...prev,
                    gambar: 'Format gambar tidak didukung. Gunakan JPEG, PNG, GIF, atau WebP',
                }));
                return;
            }

            setSelectedGambar(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreviewGambar(event.target?.result as string);
            };
            reader.readAsDataURL(file);

            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.gambar;
                return newErrors;
            });
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingFile = (filePath: string) => {
        setExistingFiles(prev => prev.filter(f => f !== filePath));
    };

    const removeGambar = () => {
        setSelectedGambar(null);
        setPreviewGambar(null);
        setExistingGambar(null);
        if (gambarInputRef.current) gambarInputRef.current.value = '';
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.judul.trim()) {
            newErrors.judul = 'Judul artikel harus diisi';
        }

        if (!formData.penulis?.trim()) {
            newErrors.penulis = 'Penulis harus diisi';
        }

        if (!formData.kategori?.trim()) {
            newErrors.kategori = 'Kategori harus dipilih';
        }

        if (descriptionEditorRef.current && !descriptionEditorRef.current.textContent?.trim()) {
            newErrors.deskripsi = 'Deskripsi harus diisi';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const descriptionContent = descriptionEditorRef.current?.innerHTML || '';
            const submitData: ArtikelFormData = {
                ...formData,
                deskripsi: descriptionContent,
                file: selectedFiles.length > 0 ? selectedFiles : null,
                gambar: selectedGambar || null,
            };

            const remainingFiles = existingFiles;
            const remainingGambar = existingGambar || '';

            await onSubmit(submitData, editingArtikel?.id, remainingFiles, remainingGambar);
            resetForm();
        } catch (error: any) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formatDateDisplay = (date: Date): string => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const getMaxDate = (): string => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const parseDateInput = (value: string): Date | null => {
        // Parse DD/MM/YYYY format
        const parts = value.split('/');
        if (parts.length !== 3) return null;
        
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        
        if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
        
        const date = new Date(year, month - 1, day);
        if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
            return null; // Invalid date
        }
        return date;
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
                            {editingArtikel ? 'Edit Artikel' : 'Tambah Artikel'}
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
                            {/* Judul */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Judul Artikel <span className="text-red-600">*</span>
                                </label>
                                <Input
                                    type="text"
                                    name="judul"
                                    value={formData.judul}
                                    onChange={handleInputChange}
                                    placeholder="Masukkan judul artikel"
                                    className={errors.judul ? 'border-red-500' : ''}
                                    disabled={isSubmitting}
                                />
                                {errors.judul && (
                                    <p className="text-red-600 text-sm mt-1">{errors.judul}</p>
                                )}
                            </div>

                            {/* Penulis */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Penulis <span className="text-red-600">*</span>
                                </label>
                                <Input
                                    type="text"
                                    name="penulis"
                                    value={formData.penulis || ''}
                                    onChange={handleInputChange}
                                    placeholder="Masukkan nama penulis"
                                    className={errors.penulis ? 'border-red-500' : ''}
                                    disabled={isSubmitting}
                                />
                                {errors.penulis && (
                                    <p className="text-red-600 text-sm mt-1">{errors.penulis}</p>
                                )}
                            </div>

                            {/* Kategori */}
                             <div>
                                 <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                     Kategori <span className="text-red-600">*</span>
                                 </label>
                                 <select
                                     name="kategori"
                                     value={formData.kategori || ''}
                                     onChange={handleInputChange}
                                     disabled={isSubmitting}
                                     className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed bg-white bg-no-repeat bg-right bg-[length:20px] pr-8 sm:pr-10 ${errors.kategori ? 'border-red-500' : 'border-gray-300'
                                         }`}
                                     style={{
                                         backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                                     }}
                                 >
                                     <option value="">-- Pilih Kategori --</option>
                                     <option value="Pendidikan Umum">Pendidikan Umum</option>
                                     <option value="Berita">Berita</option>
                                     <option value="Program">Program</option>
                                     <option value="Panduan">Panduan</option>
                                     <option value="Lainnya">Lainnya</option>
                                 </select>
                                 {errors.kategori && (
                                     <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.kategori}</p>
                                 )}
                             </div>

                            {/* Tanggal */}
                             <div>
                                 <label className="block text-sm font-semibold text-gray-900 mb-2">
                                     Tanggal Artikel <span className="text-gray-500 text-xs font-normal">(DD/MM/YYYY)</span>
                                 </label>
                                 <div className="relative">
                                     <input
                                         type="text"
                                         name="tanggal"
                                         value={formatDateDisplay(formData.tanggal)}
                                         placeholder="DD/MM/YYYY"
                                         onChange={(e) => {
                                             const value = e.target.value;
                                             const parsedDate = parseDateInput(value);
                                             if (parsedDate) {
                                                 const today = new Date();
                                                 if (parsedDate <= today) {
                                                     setFormData(prev => ({
                                                         ...prev,
                                                         tanggal: parsedDate,
                                                     }));
                                                 }
                                             }
                                         }}
                                         disabled={isSubmitting}
                                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                                     />
                                     <input
                                         type="date"
                                         name="tanggal-picker"
                                         value={formatDate(formData.tanggal)}
                                         onChange={(e) => {
                                             const value = e.target.value;
                                             setFormData(prev => ({
                                                 ...prev,
                                                 tanggal: new Date(value),
                                             }));
                                         }}
                                         max={getMaxDate()}
                                         disabled={isSubmitting}
                                         className="absolute inset-0 w-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                     />
                                 </div>
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

                            {/* Gambar Thumbnail */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-900">
                                    Gambar Thumbnail
                                </label>
                                <div className="space-y-4">
                                    {previewGambar && (
                                        <div className="relative w-full max-w-xs">
                                            <img
                                                src={previewGambar}
                                                alt="Preview"
                                                className="w-full h-auto rounded-lg border border-gray-300"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeGambar}
                                                disabled={isSubmitting}
                                                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded transition disabled:opacity-50"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                    <input
                                        ref={gambarInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleGambarSelect}
                                        disabled={isSubmitting}
                                        className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100 transition
                      disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                    {errors.gambar && <p className="text-red-600 text-sm">{errors.gambar}</p>}
                                </div>
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
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp,.csv"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        id="artikel-file-input"
                                        disabled={isSubmitting}
                                        multiple
                                    />
                                    <label
                                        htmlFor="artikel-file-input"
                                        className="cursor-pointer flex flex-col items-center gap-2"
                                    >
                                        <Upload className="text-gray-400 w-8 h-8" />
                                        <span className="text-gray-600 text-sm font-medium">
                                            Klik untuk pilih file atau drag & drop
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            (PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF, WEBP, CSV - Maksimal 10MB per file)
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
                                                        onClick={() => removeExistingFile(file)}
                                                        disabled={isSubmitting}
                                                        className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition disabled:opacity-50"
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
                                                        onClick={() => removeFile(idx)}
                                                        disabled={isSubmitting}
                                                        className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition disabled:opacity-50"
                                                        title="Hapus file"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {errors.file && <p className="text-red-600 text-sm mt-1">{errors.file}</p>}
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
                                            onChange={handleStatusChange}
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
                                            onChange={handleStatusChange}
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
                            {isSubmitting ? 'Menyimpan...' : editingArtikel ? 'Update' : 'Tambah'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
