'use client';

import { useState, useRef } from 'react';
import { GetProfileDTO } from '@/modules/dtos/profiles';
import { RichTextToolbar } from '@/presentation/components/shared/RichTextToolbar';

interface DeskripsiMottoTabProps {
    profile: GetProfileDTO | null;
    loading: boolean;
    onUpdate: (deskripsi?: string, motto?: string) => Promise<void>;
}

export function DeskripsiMottoTab({
    profile,
    loading,
    onUpdate,
}: DeskripsiMottoTabProps) {
    const [deskripsi, setDeskripsi] = useState(profile?.description || '');
    const [motto, setMotto] = useState(profile?.motto || '');
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    const deskripsiEditorRef = useRef<HTMLDivElement>(null);
    const mottoEditorRef = useRef<HTMLDivElement>(null);

    const handleSave = async () => {
        try {
            setIsSaving(true);
            setSaveMessage('');

            const deskripsiContent =
                deskripsiEditorRef.current?.innerHTML || deskripsi;
            const mottoContent = mottoEditorRef.current?.innerHTML || motto;

            await onUpdate(
                deskripsiContent || undefined,
                mottoContent || undefined
            );

            setSaveMessage('Deskripsi dan Motto berhasil disimpan');
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
            {/* Deskripsi */}
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                    Deskripsi
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <RichTextToolbar editorRef={deskripsiEditorRef} />
                    {/* Content Editor */}
                    <div
                        ref={deskripsiEditorRef}
                        contentEditable
                        suppressContentEditableWarning
                        dir="ltr"
                        className="w-full p-4 border-none outline-none resize-none overflow-auto"
                        style={{ 
                            minHeight: '160px', 
                            direction: 'ltr', 
                            textAlign: 'left'
                        }}
                        onInput={(e) =>
                            setDeskripsi((e.target as HTMLDivElement).innerHTML)
                        }
                        dangerouslySetInnerHTML={{ __html: deskripsi }}
                    />
                </div>
            </div>

            {/* Motto */}
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                    Motto
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <RichTextToolbar editorRef={mottoEditorRef} />
                    {/* Content Editor */}
                    <div
                        ref={mottoEditorRef}
                        contentEditable
                        suppressContentEditableWarning
                        dir="ltr"
                        className="w-full p-4 border-none outline-none resize-none overflow-auto"
                        style={{ 
                            minHeight: '160px', 
                            direction: 'ltr', 
                            textAlign: 'left'
                        }}
                        onInput={(e) =>
                            setMotto((e.target as HTMLDivElement).innerHTML)
                        }
                        dangerouslySetInnerHTML={{ __html: motto }}
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
