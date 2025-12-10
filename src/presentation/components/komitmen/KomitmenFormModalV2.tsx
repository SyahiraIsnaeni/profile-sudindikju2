'use client';

import { useEffect, useState, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import { Input } from '@/presentation/components/shared/Input';
import { IconPicker } from '@/presentation/components/shared/IconPickerV2';
import { RichTextToolbar } from '@/presentation/components/shared/RichTextToolbar';

export interface KomitmenFormData {
    name: string;
    description?: string | null;
    file?: File | string | null;
    icon?: string | null;
    sort_order?: number | null;
    status: number;
}

interface Commitment {
    id: number;
    name: string;
    description?: string | null;
    file?: string | null;
    icon?: string | null;
    sort_order?: number | null;
    status: number;
    created_at: Date;
    updated_at: Date;
}

interface KomitmenFormModalV2Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: KomitmenFormData, commitmentId?: number) => Promise<void>;
    editingCommitment?: Commitment | null;
}

export const KomitmenFormModalV2 = ({
    isOpen,
    onClose,
    onSubmit,
    editingCommitment,
}: KomitmenFormModalV2Props) => {
    const [formData, setFormData] = useState<KomitmenFormData>({
        name: '',
        description: null,
        file: null,
        icon: null,
        sort_order: null,
        status: 1,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
    const [usedSortOrders, setUsedSortOrders] = useState<number[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const descriptionEditorRef = useRef<HTMLDivElement>(null);

    // Fetch used sort orders
    useEffect(() => {
        const fetchUsedSortOrders = async () => {
            try {
                const res = await fetch('/api/dashboard/commitments?pageSize=1000');
                if (res.ok) {
                    const data = await res.json();
                    const orders = data.data
                        .filter((c: any) => c.sort_order && c.sort_order !== editingCommitment?.sort_order)
                        .map((c: any) => c.sort_order);
                    setUsedSortOrders(orders);
                }
            } catch (error) {
                console.error('Error fetching used sort orders:', error);
            }
        };

        if (isOpen) {
            fetchUsedSortOrders();
        }
    }, [isOpen, editingCommitment?.sort_order]);

    useEffect(() => {
        if (editingCommitment) {
            setFormData({
                name: editingCommitment.name,
                description: editingCommitment.description || null,
                file: editingCommitment.file || null,
                icon: editingCommitment.icon || null,
                sort_order: editingCommitment.sort_order || null,
                status: editingCommitment.status,
            });
            setFilePreview(editingCommitment.file || '');
            if (descriptionEditorRef.current) {
                descriptionEditorRef.current.innerHTML = editingCommitment.description || '';
            }
        } else {
            setFormData({
                name: '',
                description: null,
                file: null,
                icon: null,
                sort_order: null,
                status: 1,
            });
            setFilePreview('');
            if (descriptionEditorRef.current) {
                descriptionEditorRef.current.innerHTML = '';
            }
        }
        setSelectedFile(null);
        setErrors({});
    }, [editingCommitment, isOpen]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Nama komitmen wajib diisi';
        }

        if (!formData.description || formData.description.trim() === '') {
            newErrors.description = 'Deskripsi wajib diisi';
        }

        if (!formData.icon) {
            newErrors.icon = 'Icon wajib dipilih';
        }

        if (!formData.sort_order) {
            newErrors.sort_order = 'Nomor urutan wajib dipilih';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (name === 'sort_order') {
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
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('File harus berupa gambar');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Ukuran file maksimal 5MB');
            return;
        }

        setSelectedFile(file);
        setFormData((prev) => ({
            ...prev,
            file: file,
        }));

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setFilePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleIconSelect = (iconName: string) => {
        setFormData((prev) => ({
            ...prev,
            icon: iconName,
        }));
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setFormData((prev) => ({
            ...prev,
            file: null,
        }));
        setFilePreview('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(formData, editingCommitment?.id);
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
                            {editingCommitment ? 'Edit Komitmen Pelayanan' : 'Tambah Komitmen Pelayanan'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-blue-100 hover:text-white transition"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Form Body */}
                    <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-6">
                        {/* Nama Komitmen */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Nama Komitmen <span className="text-red-600">*</span>
                            </label>
                            <Input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Masukkan nama komitmen"
                                className={errors.name ? 'border-red-500' : ''}
                                disabled={isSubmitting}
                            />
                            {errors.name && (
                                <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                            )}
                        </div>

                        {/* Deskripsi dengan Rich Text Editor */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-900">
                                Deskripsi <span className="text-red-600">*</span>
                            </label>
                            <div className={`border rounded-lg overflow-hidden ${errors.description ? 'border-red-500' : 'border-gray-300'}`}>
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
                                            description: html,
                                        }));
                                        if (errors.description) {
                                            setErrors((prev) => {
                                                const newErrors = { ...prev };
                                                delete newErrors.description;
                                                return newErrors;
                                            });
                                        }
                                    }}
                                />
                            </div>
                            {errors.description && (
                                <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                            )}
                        </div>

                        {/* File Upload dengan Drag & Drop */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-900">
                                Upload File / Gambar
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition bg-gray-50">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="komitmen-file-input"
                                    disabled={isSubmitting}
                                />
                                <label
                                    htmlFor="komitmen-file-input"
                                    className="cursor-pointer flex flex-col items-center gap-2"
                                >
                                    <Upload className="text-gray-400 w-8 h-8" />
                                    <span className="text-gray-600 text-sm font-medium">
                                        Klik untuk pilih file atau drag & drop
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        (JPG, PNG, GIF - Maksimal 5MB)
                                    </span>
                                </label>
                            </div>

                            {selectedFile && (
                                <p className="text-sm text-blue-600">
                                    ✓ File dipilih: {selectedFile.name}
                                </p>
                            )}
                        </div>

                        {/* Preview File */}
                        {filePreview && (
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-900">
                                    Preview Gambar
                                </label>
                                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                                    <img
                                        src={filePreview}
                                        alt="Preview"
                                        className="max-w-full max-h-64 mx-auto rounded"
                                    />
                                </div>
                            </div>
                        )}

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
                                name="sort_order"
                                value={formData.sort_order || ''}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed ${errors.sort_order ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <option value="">-- Pilih Nomor Urutan --</option>
                                {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
                                    <option
                                        key={num}
                                        value={num}
                                        disabled={usedSortOrders.includes(num)}
                                    >
                                        {usedSortOrders.includes(num) ? `${num} (Sudah dipakai)` : num}
                                    </option>
                                ))}
                            </select>
                            {errors.sort_order && (
                                <p className="text-red-600 text-sm mt-1">{errors.sort_order}</p>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value={1}>Aktif</option>
                                <option value={0}>Non-Aktif</option>
                            </select>
                        </div>
                    </form>

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
                            {isSubmitting ? 'Menyimpan...' : editingCommitment ? 'Update' : 'Tambah'}
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
