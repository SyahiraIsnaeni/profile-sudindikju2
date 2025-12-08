'use client';

import { useState, useEffect, useRef } from 'react';
import { X, GripVertical, Maximize2, Minimize2 } from 'lucide-react';

interface Permission {
  id: number;
  name: string;
  detail: string;
}

interface RoleFormData {
  name: string;
  status: number;
  permission_ids: number[];
}

interface EditData {
  id: number;
  name: string;
  status: number;
  permissions?: Array<{
    id: number;
    name: string;
    detail: string;
  }>;
}

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  permissions: Permission[];
  onSubmit: (data: RoleFormData) => Promise<void>;
  editData?: EditData;
}

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

export const RoleFormModal = ({
  isOpen,
  onClose,
  permissions,
  onSubmit,
  editData,
}: RoleFormModalProps) => {
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    status: 1,
    permission_ids: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Draggable & Resizable states
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [size, setSize] = useState<Size>({ width: 1000, height: 700 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  
  // Animation state
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);

  const modalRef = useRef<HTMLDivElement>(null);

  // Initialize form with edit data
  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name,
        status: editData.status,
        permission_ids: editData.permissions?.map((p) => p.id) || [],
      });
    } else {
      setFormData({
        name: '',
        status: 1,
        permission_ids: [],
      });
    }
    setError(null);
  }, [editData, isOpen]);

  // Handle open animation
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timer = requestAnimationFrame(() => {
        setIsAnimatingIn(true);
      });
      const centerX = Math.max(0, (window.innerWidth - 1000) / 2);
      const centerY = Math.max(0, (window.innerHeight - 700) / 2);
      setPosition({ x: centerX, y: centerY });
      setSize({ width: 1000, height: 700 });
      setIsMaximized(false);
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

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) {
      return;
    }
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  // Handle drag move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, e.clientX - dragOffset.x);
        const newY = Math.max(0, e.clientY - dragOffset.y);
        setPosition({ x: newX, y: newY });
      }

      if (isResizing && modalRef.current) {
        const deltaX = e.clientX - (position.x + size.width);
        const deltaY = e.clientY - (position.y + size.height);

        setSize({
          width: Math.max(600, size.width + deltaX),
          height: Math.max(400, size.height + deltaY),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, position, size, dragOffset]);

  // Handle maximize/restore
  const handleMaximize = () => {
    if (isMaximized) {
      const centerX = Math.max(0, (window.innerWidth - 1000) / 2);
      const centerY = Math.max(0, (window.innerHeight - 700) / 2);
      setPosition({ x: centerX, y: centerY });
      setSize({ width: 1000, height: 700 });
    } else {
      setPosition({ x: 0, y: 0 });
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    setIsMaximized(!isMaximized);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      name: e.target.value,
    }));
    setError(null);
  };

  const handleStatusChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      status: checked ? 1 : 0,
    }));
  };

  const handlePermissionToggle = (permissionId: number) => {
    setFormData((prev) => ({
      ...prev,
      permission_ids: prev.permission_ids.includes(permissionId)
        ? prev.permission_ids.filter((id) => id !== permissionId)
        : [...prev.permission_ids, permissionId],
    }));
  };

  const handleSelectAllInGroup = (groupName: string, perms: Permission[]) => {
    const groupIds = perms.map((p) => p.id);
    const allSelected = groupIds.every((id) =>
      formData.permission_ids.includes(id)
    );

    setFormData((prev) => ({
      ...prev,
      permission_ids: allSelected
        ? prev.permission_ids.filter((id) => !groupIds.includes(id))
        : [...new Set([...prev.permission_ids, ...groupIds])],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Nama role tidak boleh kosong');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Validasi data sebelum submit
      if (!Array.isArray(formData.permission_ids)) {
        throw new Error('Data permission tidak valid');
      }

      console.log('Submitting form data:', formData);

      await onSubmit(formData);
      
      // Close modal setelah berhasil
      setTimeout(() => {
        handleClose();
      }, 300);
    } catch (err: any) {
      console.error('Error details:', err);
      
      // Better error handling untuk JSON parse error
      if (err.message && err.message.includes('Unexpected token')) {
        setError('Server error: Respon tidak valid. Cek console untuk detail.');
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Gagal menyimpan data. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!shouldRender) return null;

  const isEditing = !!editData;
  const totalPermissions = permissions.length;
  const selectedPermissions = formData.permission_ids.length;

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
        <div
          ref={modalRef}
          className="modal-animate bg-white rounded-lg shadow-2xl flex flex-col border-l-4 border-blue-600"
          style={{
            position: 'fixed',
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: `${size.width}px`,
            height: `${size.height}px`,
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        >
          {/* Title Bar - Draggable */}
          <div
            onMouseDown={handleDragStart}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between cursor-move hover:from-blue-700 hover:to-blue-800 transition rounded-t-lg"
          >
            <div className="flex items-center gap-3 flex-1">
              <GripVertical className="w-5 h-5 text-blue-200 flex-shrink-0" />
              <h2 className="text-lg font-bold">
                {isEditing ? 'Edit Role' : 'Tambah Role'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleMaximize}
                className="p-2 hover:bg-blue-500 rounded-lg transition"
                title={isMaximized ? 'Restore' : 'Maximize'}
              >
                {isMaximized ? (
                  <Minimize2 className="w-5 h-5" />
                ) : (
                  <Maximize2 className="w-5 h-5" />
                )}
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="p-2 hover:bg-red-500 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700 text-sm flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold mb-1">Error:</p>
                    <p>{error}</p>
                    <p className="text-xs text-red-600 mt-2">
                      Cek browser console (F12) untuk detail error lengkap
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="text-red-600 hover:text-red-700 flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Header Section */}
              <div className="space-y-4 pb-6 border-b border-gray-200 bg-white p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Nama Role <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={handleNameChange}
                    required
                    placeholder="Contoh: Admin, Manager, Staff"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Status
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(!formData.status)}
                      className={`relative inline-flex h-7 w-12 rounded-full transition-colors ${
                        formData.status === 1 ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform mt-0.5 ${
                          formData.status === 1 ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                    <span className="text-sm font-medium text-gray-700">
                      {formData.status === 1 ? 'Aktif' : 'Non-Aktif'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Permission Section */}
              <div className="bg-white p-4 rounded-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Pilih Permission
                    <span className="text-gray-500 font-normal ml-2">
                      ({selectedPermissions} dari {totalPermissions} dipilih)
                    </span>
                  </h3>
                </div>

                {permissions.length === 0 ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700 text-sm">
                    Tidak ada permission yang tersedia.
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-4">
                    {Object.entries(groupedPermissions).map(([menuName, perms]) => {
                      const menuIds = perms.map((p) => p.id);
                      const menuAllSelected = menuIds.every((id) =>
                        formData.permission_ids.includes(id)
                      );

                      return (
                        <div
                          key={menuName}
                          className="border border-gray-200 rounded-lg bg-white overflow-hidden hover:shadow-md transition"
                        >
                          <div className="p-3 border-b border-gray-200 bg-blue-50">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={menuAllSelected}
                                onChange={() =>
                                  handleSelectAllInGroup(menuName, perms)
                                }
                                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 accent-blue-600"
                              />
                              <span className="text-xs font-bold text-gray-900 flex-1 line-clamp-1">
                                {menuName}
                              </span>
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                {menuIds.filter((id) =>
                                  formData.permission_ids.includes(id)
                                ).length}/{perms.length}
                              </span>
                            </label>
                          </div>

                          <div className="p-3 space-y-2 bg-white">
                            {perms.map((perm) => (
                              <label
                                key={perm.id}
                                className="flex items-start gap-2 cursor-pointer hover:bg-blue-50 p-2 rounded transition group"
                              >
                                <input
                                  type="checkbox"
                                  checked={formData.permission_ids.includes(perm.id)}
                                  onChange={() => handlePermissionToggle(perm.id)}
                                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 accent-blue-600 mt-0.5 flex-shrink-0"
                                />
                                <span className="text-xs text-gray-700 group-hover:text-gray-900 flex-1 line-clamp-2">
                                  {perm.detail}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 p-6 border-t border-gray-200 bg-white rounded-b-lg">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm transition"
            >
              Batal
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading || !formData.name.trim()}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition"
            >
              {loading
                ? isEditing
                  ? 'Mengupdate...'
                  : 'Menyimpan...'
                : isEditing
                ? 'Update Role'
                : 'Simpan Role'}
            </button>
          </div>

          {/* Resize Handle */}
          <div
            onMouseDown={() => setIsResizing(true)}
            className="absolute bottom-0 right-0 w-6 h-6 bg-blue-600 hover:bg-blue-700 cursor-se-resize rounded-tl-lg transition"
            title="Drag to resize"
          />
        </div>
      </div>
    </>
  );
};
