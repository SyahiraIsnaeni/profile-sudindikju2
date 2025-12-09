'use client';

import { useState, useRef, useEffect } from 'react';
import { GetProfileDTO } from '@/modules/dtos/profiles';
import { RichTextToolbar } from '@/presentation/components/shared/RichTextToolbar';

interface VisiMisiTabProps {
    profile: GetProfileDTO | null;
    loading: boolean;
    onUpdate: (visi?: string, misi?: string) => Promise<void>;
}

export function VisiMisiTab({ profile, loading, onUpdate }: VisiMisiTabProps) {
    const [visi, setVisi] = useState(profile?.vision || '');
    const [misi, setMisi] = useState(profile?.mission || '');
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [isInitialized, setIsInitialized] = useState(false);

    const visiEditorRef = useRef<HTMLDivElement>(null);
    const misiEditorRef = useRef<HTMLDivElement>(null);

    // Initialize editor content on mount
    useEffect(() => {
        if (visiEditorRef.current && !isInitialized) {
            visiEditorRef.current.innerHTML = profile?.vision || '';
        }
        if (misiEditorRef.current && !isInitialized) {
            misiEditorRef.current.innerHTML = profile?.mission || '';
        }
        setIsInitialized(true);
    }, [profile, isInitialized]);

    const handleSave = async () => {
        try {
            setIsSaving(true);
            setSaveMessage('');

            const visiContent = visiEditorRef.current?.innerHTML || visi;
            const misiContent = misiEditorRef.current?.innerHTML || misi;

            await onUpdate(visiContent || undefined, misiContent || undefined);

            setSaveMessage('Visi dan Misi berhasil disimpan');
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
            {/* Visi */}
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                    Visi
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <RichTextToolbar editorRef={visiEditorRef} />
                    {/* Content Editor */}
                    <div
                        ref={visiEditorRef}
                        contentEditable
                        suppressContentEditableWarning
                        dir="ltr"
                        className="w-full p-4 border-none outline-none resize-none overflow-auto"
                        style={{ 
                            minHeight: '160px', 
                            direction: 'ltr', 
                            textAlign: 'left'
                        }}
                        onInput={(e) => setVisi((e.target as HTMLDivElement).innerHTML)}
                    />
                </div>
            </div>

            {/* Misi */}
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                    Misi
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <RichTextToolbar editorRef={misiEditorRef} />
                    {/* Content Editor */}
                    <div
                        ref={misiEditorRef}
                        contentEditable
                        suppressContentEditableWarning
                        dir="ltr"
                        className="w-full p-4 border-none outline-none resize-none overflow-auto"
                        style={{ 
                            minHeight: '160px', 
                            direction: 'ltr', 
                            textAlign: 'left'
                        }}
                        onInput={(e) => setMisi((e.target as HTMLDivElement).innerHTML)}
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
