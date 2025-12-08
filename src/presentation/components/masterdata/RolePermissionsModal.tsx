'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Permission {
    id: number;
    name: string;
    detail: string;
}

interface RolePermissionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    roleName: string;
    roleStatus: number;
    permissions: Permission[];
}

export const RolePermissionsModal = ({
    isOpen,
    onClose,
    roleName,
    roleStatus,
    permissions,
}: RolePermissionsModalProps) => {
    const [isAnimatingIn, setIsAnimatingIn] = useState(false);
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);
    const [shouldRender, setShouldRender] = useState(isOpen);

    // Handle open animation
    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            const timer = requestAnimationFrame(() => {
                setIsAnimatingIn(true);
            });
            return () => cancelAnimationFrame(timer);
        }
    }, [isOpen]);

    // Handle close animation
    const handleClose = () => {
        setIsAnimatingIn(false);
        setIsAnimatingOut(true);

        const timer = setTimeout(() => {
            setShouldRender(false);
            setIsAnimatingOut(false);
            onClose();
        }, 300);

        return () => clearTimeout(timer);
    };

    // Group permissions by name (menu)
    const groupedPermissions = permissions.reduce(
        (acc, perm) => {
            if (!acc[perm.name]) {
                acc[perm.name] = [];
            }
            acc[perm.name].push(perm);
            return acc;
        },
        {} as Record<string, Permission[]>
    );

    if (!shouldRender) return null;

    const totalPermissions = permissions.length;
    const statusLabel = roleStatus === 1 ? 'Aktif' : 'Non-Aktif';
    const statusColor = roleStatus === 1 ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100';

    return (
        <>
            <style>{`
        @keyframes backdropFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes backdropFadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.85) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes modalSlideOut {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.85) translateY(-20px);
          }
        }

        .backdrop-animate {
          animation: ${isAnimatingOut ? 'backdropFadeOut' : 'backdropFadeIn'} 0.3s ease-out forwards;
        }

        .modal-animate {
          animation: ${isAnimatingOut ? 'modalSlideOut' : 'modalSlideIn'} 0.3s ease-out forwards;
        }
      `}</style>

            <div className="backdrop-animate fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                <div className="modal-animate bg-white rounded-lg shadow-2xl flex flex-col border-l-4 border-blue-600 max-w-3xl w-full mx-4 max-h-[80vh]">
                    {/* Title Bar */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between">
                        <div className="flex-1">
                            <h2 className="text-lg font-bold">Detail Hak Akses</h2>
                        </div>

                        <button
                            type="button"
                            onClick={handleClose}
                            className="p-2 hover:bg-red-500 rounded-lg transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50">
                        {/* Role Info Section */}
                        <div className="bg-white p-4 rounded-lg mb-6 border-l-4 border-blue-600">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase mb-1">
                                        Nama Role
                                    </p>
                                    <p className="text-lg font-bold text-gray-900">{roleName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase mb-1">
                                        Status
                                    </p>
                                    <span
                                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${statusColor}`}
                                    >
                                        {statusLabel}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Permission Section */}
                        <div>
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                                    Daftar Permission
                                    <span className="text-gray-500 font-normal ml-2">
                                        ({totalPermissions} permission)
                                    </span>
                                </h3>
                            </div>

                            {permissions.length === 0 ? (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700 text-sm">
                                    Tidak ada permission yang ditetapkan untuk role ini.
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-4">
                                    {Object.entries(groupedPermissions).map(([menuName, perms]) => {
                                        return (
                                            <div
                                                key={menuName}
                                                className="border border-gray-200 rounded-lg bg-white overflow-hidden"
                                            >
                                                {/* Menu Header */}
                                                <div className="p-3 border-b border-gray-200 bg-blue-50">
                                                    <h4 className="text-xs font-bold text-gray-900 line-clamp-1">
                                                        {menuName}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {perms.length} permission
                                                    </p>
                                                </div>

                                                {/* Permission Items */}
                                                <div className="p-3 space-y-2 bg-white">
                                                    {perms.map((perm) => (
                                                        <div
                                                            key={perm.id}
                                                            className="flex items-center justify-between gap-2 p-2 rounded hover:bg-blue-50 transition"
                                                        >
                                                            <p className="text-xs text-gray-700 font-medium flex-1">
                                                                {perm.detail}
                                                            </p>
                                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-800 flex-shrink-0">
                                                                Active
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex gap-3 p-6 border-t border-gray-200 bg-white rounded-b-lg">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm transition"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
