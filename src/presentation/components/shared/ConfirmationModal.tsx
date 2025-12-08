'use client';

import { Modal } from '@/presentation/components/shared/Modal';
import { AlertCircle } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void | Promise<void>;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    isDangerous?: boolean;
    isLoading?: boolean;
}

export const ConfirmationModal = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Konfirmasi',
    cancelText = 'Batal',
    isDangerous = false,
    isLoading = false,
}: ConfirmationModalProps) => {
    const handleConfirm = async () => {
        await onConfirm();
    };

    return (
        <Modal isOpen={isOpen} title={title} onClose={onCancel} size="sm">
            <div className="space-y-4">
                {/* Icon & Message */}
                <div className="flex gap-3">
                    <div className={`flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full ${isDangerous ? 'bg-red-100' : 'bg-yellow-100'}`}>
                        <AlertCircle className={`h-6 w-6 ${isDangerous ? 'text-red-600' : 'text-yellow-600'}`} />
                    </div>
                    <div>
                        <p className="text-gray-700 text-sm">{message}</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={`flex-1 px-4 py-2 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-medium ${isDangerous
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {isLoading ? 'Memproses...' : confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
