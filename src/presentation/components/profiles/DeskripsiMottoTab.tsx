'use client';

import { useState, useRef, useEffect } from 'react';
import { GetProfileDTO } from '@/modules/dtos/profiles';
import { RichTextToolbar } from '@/presentation/components/shared/RichTextToolbar';
import { Toast, type ToastType } from '@/presentation/components/shared/Toast';

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
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<ToastType>('success');
    const [showToast, setShowToast] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    const deskripsiEditorRef = useRef<HTMLDivElement>(null);
    const mottoEditorRef = useRef<HTMLDivElement>(null);

    // Initialize editor content on mount
    useEffect(() => {
        if (deskripsiEditorRef.current && !isInitialized) {
            deskripsiEditorRef.current.innerHTML = profile?.description || '';
        }
        if (mottoEditorRef.current && !isInitialized) {
            mottoEditorRef.current.innerHTML = profile?.motto || '';
        }
        setIsInitialized(true);
    }, [profile, isInitialized]);

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

            setToastMessage('Deskripsi dan Motto berhasil disimpan');
            setToastType('success');
            setShowToast(true);
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Gagal menyimpan';
            setToastMessage(errorMsg);
            setToastType('error');
            setShowToast(true);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            {showToast && (
                <Toast
                    message={toastMessage}
                    type={toastType}
                    duration={3000}
                    onClose={() => setShowToast(false)}
                />
            )}
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
            </div>
            </div>
            </>
            );
            }
