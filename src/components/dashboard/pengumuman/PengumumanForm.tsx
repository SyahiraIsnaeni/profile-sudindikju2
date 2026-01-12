'use client';

import { useState, useRef } from 'react';
import { Upload, X, Save } from 'lucide-react';
import { Input } from '@/presentation/components/shared/Input';
import { RichTextToolbar } from '@/presentation/components/shared/RichTextToolbar';
import { useRouter } from 'next/navigation';

export const PengumumanForm = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [selectedGambar, setSelectedGambar] = useState<File | null>(null);
    const [previewGambar, setPreviewGambar] = useState<string | null>(null);

    // Default data suitable for "Pengumuman" / "Berita"
    const [formData, setFormData] = useState({
        judul: '',
        penulis: 'Admin',
        kategori: 'Berita', // Default to Berita for "Berita Terkini"
        tanggal: new Date(),
        status: 1,
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const gambarInputRef = useRef<HTMLInputElement>(null);
    const descriptionEditorRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGambarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedGambar(file);
            const reader = new FileReader();
            reader.onload = (event) => setPreviewGambar(event.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('judul', formData.judul);
            formDataToSend.append('penulis', formData.penulis);
            formDataToSend.append('kategori', formData.kategori);
            formDataToSend.append('tanggal', formData.tanggal.toISOString());
            formDataToSend.append('status', formData.status.toString());
            formDataToSend.append('deskripsi', descriptionEditorRef.current?.innerHTML || '');

            if (selectedGambar) {
                formDataToSend.append('gambar', selectedGambar);
            }

            // Using the existing API route for Artikels
            const res = await fetch('/api/dashboard/artikels/create', {
                method: 'POST',
                body: formDataToSend,
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || 'Gagal menyimpan pengumuman');
            }

            // Success
            alert('Pengumuman berhasil dibuat!');
            router.push('/dashboard'); // Redirect to dashboard
            router.refresh();

        } catch (error: any) {
            console.error(error);
            setErrors({ submit: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 p-2 rounded-lg"><Save size={20} /></span>
                Input Pengumuman / Berita
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Judul & Kategori */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Judul</label>
                        <Input
                            name="judul"
                            value={formData.judul}
                            onChange={handleInputChange}
                            placeholder="Judul Pengumuman..."
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Kategori</label>
                        <select
                            name="kategori"
                            value={formData.kategori}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="Berita">Berita</option>
                            <option value="Pengumuman">Pengumuman</option>
                            <option value="Program">Program</option>
                        </select>
                    </div>
                </div>

                {/* Gambar */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Gambar Banner</label>
                    <div className="flex items-center gap-4">
                        {previewGambar && (
                            <img src={previewGambar} className="h-20 w-20 object-cover rounded-lg border" alt="Preview" />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleGambarSelect}
                            className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
                        />
                    </div>
                </div>

                {/* Deskripsi */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Isi Pengumuman</label>
                    <div className="border border-slate-300 rounded-lg overflow-hidden min-h-[200px]">
                        <RichTextToolbar editorRef={descriptionEditorRef} />
                        <div
                            ref={descriptionEditorRef}
                            contentEditable
                            className="p-4 outline-none min-h-[150px]"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Menyimpan...' : 'Simpan Pengumuman'}
                    </button>
                </div>
            </form>
        </div>
    );
};
