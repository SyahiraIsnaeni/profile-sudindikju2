'use client';

import { useState, useRef, useEffect } from 'react';
import { GetProfileDTO } from '@/modules/dtos/profiles';
import { RichTextToolbar } from '@/presentation/components/shared/RichTextToolbar';

interface TugasFungsiTabProps {
    profile: GetProfileDTO | null;
    loading: boolean;
    onUpdate: (tugas?: string, fungsi?: string) => Promise<void>;
}

export function TugasFungsiTab({ profile, loading, onUpdate }: TugasFungsiTabProps) {
    const [tugas, setTugas] = useState(profile?.task_org || '');
    const [fungsi, setFungsi] = useState(profile?.function_org || '');
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [isInitialized, setIsInitialized] = useState(false);

    const tugasEditorRef = useRef<HTMLDivElement>(null);
    const fungsiEditorRef = useRef<HTMLDivElement>(null);

    // Initialize editor content on mount
    useEffect(() => {
        if (tugasEditorRef.current && !isInitialized) {
            tugasEditorRef.current.innerHTML = profile?.task_org || '';
        }
        if (fungsiEditorRef.current && !isInitialized) {
            fungsiEditorRef.current.innerHTML = profile?.function_org || '';
        }
        setIsInitialized(true);
    }, [profile, isInitialized]);

    const handleSave = async () => {
        try {
            setIsSaving(true);
            setSaveMessage('');

            const tugasContent = tugasEditorRef.current?.innerHTML || tugas;
            const fungsiContent = fungsiEditorRef.current?.innerHTML || fungsi;

            await onUpdate(tugasContent || undefined, fungsiContent || undefined);

            setSaveMessage('Tugas dan Fungsi berhasil disimpan');
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (error) {
            setSaveMessage(
                error instanceof Error ? error.message : 'Gagal menyimpan'
            );
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Tugas */}
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                    Tugas
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <RichTextToolbar editorRef={tugasEditorRef} />
                    {/* Content Editor */}
                    <div
                        ref={tugasEditorRef}
                        contentEditable
                        suppressContentEditableWarning
                        dir="ltr"
                        className="w-full p-4 border-none outline-none resize-none overflow-auto"
                        style={{ 
                            minHeight: '160px', 
                            direction: 'ltr', 
                            textAlign: 'left'
                        }}
                        onInput={(e) => setTugas((e.target as HTMLDivElement).innerHTML)}
                    />
                </div>
            </div>

            {/* Fungsi */}
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                    Fungsi
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <RichTextToolbar editorRef={fungsiEditorRef} />
                    {/* Content Editor */}
                    <div
                        ref={fungsiEditorRef}
                        contentEditable
                        suppressContentEditableWarning
                        dir="ltr"
                        className="w-full p-4 border-none outline-none resize-none overflow-auto"
                        style={{ 
                            minHeight: '160px', 
                            direction: 'ltr', 
                            textAlign: 'left'
                        }}
                        onInput={(e) => setFungsi((e.target as HTMLDivElement).innerHTML)}
                    />
                </div>
            </div>

            {/* Save Button & Message */}
            <div className="flex items-center justify-between pt-4">
                <button
                    onClick={handleSave}
                    disabled={isSaving || loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                    {isSaving ? 'Menyimpan...' : 'Simpan'}
                </button>

                {saveMessage && (
                    <p
                        className={`text-sm ${saveMessage.includes('berhasil')
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
