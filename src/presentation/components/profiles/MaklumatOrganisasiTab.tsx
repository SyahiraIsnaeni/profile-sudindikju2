'use client';

import { useState } from 'react';
import { GetProfileDTO } from '@/modules/dtos/profiles';
import { Upload, X } from 'lucide-react';

interface MaklumatOrganisasiTabProps {
  profile: GetProfileDTO | null;
  loading: boolean;
  onUpdate: (file: File) => Promise<void>;
}

export function MaklumatOrganisasiTab({
  profile,
  loading,
  onUpdate,
}: MaklumatOrganisasiTabProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(profile?.maklumat || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setSaveMessage('File harus berupa gambar');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSaveMessage('Ukuran file maksimal 5MB');
      return;
    }

    setSelectedFile(file);
    setSaveMessage('');

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      if (!selectedFile) {
        setSaveMessage('Pilih file terlebih dahulu');
        return;
      }

      setIsSaving(true);
      setSaveMessage('');

      await onUpdate(selectedFile);

      setSaveMessage('Maklumat organisasi berhasil disimpan');
      setSelectedFile(null);
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage(
        error instanceof Error ? error.message : 'Gagal menyimpan'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(profile?.maklumat || '');
    setSaveMessage('');
  };

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Upload Gambar Maklumat Organisasi
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="maklumat-file-input"
          />
          <label
            htmlFor="maklumat-file-input"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <Upload className="text-gray-400" size={32} />
            <span className="text-gray-600">
              Klik untuk pilih file atau drag & drop
            </span>
            <span className="text-xs text-gray-500">
              (JPG, PNG, GIF - Maksimal 5MB)
            </span>
          </label>
        </div>

        {selectedFile && (
          <p className="text-sm text-blue-600">
            File dipilih: {selectedFile.name}
          </p>
        )}
      </div>

      {/* Preview */}
      {preview && (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Preview Gambar
          </label>
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <img
              src={preview}
              alt="Preview"
              className="max-w-full max-h-96 mx-auto rounded"
            />
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center justify-between gap-3 pt-4">
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving || loading || !selectedFile}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </button>

          <button
            onClick={handleClear}
            disabled={isSaving || loading}
            className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            <X size={18} />
            Hapus
          </button>
        </div>

        {saveMessage && (
          <p
            className={`text-sm ${
              saveMessage.includes('berhasil')
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            {saveMessage}
          </p>
        )}
      </div>
    </div>
  );
}
