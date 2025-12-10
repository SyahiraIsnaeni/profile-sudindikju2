'use client';

import { useState, useMemo } from 'react';
import { X, Search } from 'lucide-react';
import * as Icons from 'lucide-react';

interface IconPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (iconName: string) => void;
    selectedIcon?: string;
}

// Extended list of icons (100+)
const ICON_LIST = [
    'CheckCircle',
    'FileText',
    'Shield',
    'Zap',
    'Target',
    'Award',
    'Heart',
    'Star',
    'Flame',
    'Rocket',
    'Briefcase',
    'Users',
    'Book',
    'Bell',
    'Mail',
    'Phone',
    'MapPin',
    'Cpu',
    'Lightbulb',
    'Lock',
    'Eye',
    'Smile',
    'ThumbsUp',
    'TrendingUp',
    'Wifi',
    'Globe',
    'PieChart',
    'BarChart3',
    'Layers',
    'GitBranch',
    'Code',
    'Monitor',
    'Smartphone',
    'Printer',
    'Save',
    'Download',
    'Upload',
    'Copy',
    'Edit',
    'Plus',
    'Minus',
    'Settings',
    'Gear',
    'Menu',
    'Home',
    'Search',
    'AlertCircle',
    'AlertTriangle',
    'Info',
    'HelpCircle',
    'CheckSquare',
    'Square',
    'Circle',
    'Triangle',
    'Hexagon',
    'Package',
    'Folder',
    'FolderOpen',
    'FileCheck',
    'FileX',
    'Trash2',
    'RotateCcw',
    'RefreshCw',
    'Repeat',
    'Share2',
    'Share',
    'Link',
    'ExternalLink',
    'Send',
    'Message',
    'MessageSquare',
    'MessageCircle',
    'Inbox',
    'Paperclip',
    'Calendar',
    'Clock',
    'Watch',
    'Timer',
    'Zzzz',
    'TrendingDown',
    'Activity',
    'BarChart',
    'BarChart2',
    'LineChart',
    'PieChart',
    'ScatterChart',
    'Database',
    'Server',
    'HardDrive',
    'Wifi',
    'Wifi1',
    'Wifi2',
    'WifiOff',
    'WifiAlert',
    'Battery',
    'Power',
    'Plug',
    'Sun',
    'Moon',
    'Cloud',
    'CloudRain',
    'CloudSnow',
    'Wind',
    'Droplet',
    'Eye',
    'EyeOff',
    'EyeOff2',
    'Glasses',
    'Navigation',
    'Compass',
    'Map',
    'Flag',
    'Bookmark',
    'Anchor',
    'Sliders',
    'Volume',
    'Volume1',
    'Volume2',
    'VolumeX',
    'Mic',
    'MicOff',
    'Video',
    'VideoOff',
    'SkipBack',
    'SkipForward',
    'Play',
    'Pause',
    'Square',
    'FastForward',
    'Rewind',
    'ChevronUp',
    'ChevronDown',
    'ChevronLeft',
    'ChevronRight',
    'ChevronsUp',
    'ChevronsDown',
    'ChevronsLeft',
    'ChevronsRight',
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUpLeft',
    'ArrowUpRight',
    'ArrowDownLeft',
    'ArrowDownRight',
    'Inbox',
    'Inbox2',
];

export const IconPicker = ({
    isOpen,
    onClose,
    onSelect,
    selectedIcon,
}: IconPickerProps) => {
    const [search, setSearch] = useState('');

    const filteredIcons = useMemo(() => {
        if (!search.trim()) {
            return ICON_LIST;
        }
        const searchLower = search.toLowerCase();
        return ICON_LIST.filter((icon) =>
            icon.toLowerCase().includes(searchLower)
        );
    }, [search]);

    const handleSelectIcon = (iconName: string) => {
        onSelect(iconName);
        onClose();
        setSearch('');
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop with animation */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 animate-in fade-in"
                onClick={onClose}
            />

            {/* Modal with animation */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 animate-in fade-in zoom-in-95">
                <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between border-b border-blue-800">
                        <h2 className="text-xl font-bold text-white">Pilih Icon</h2>
                        <button
                            onClick={onClose}
                            className="text-blue-100 hover:text-white transition"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari icon (cth: star, heart, fire, check)..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                autoFocus
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Menampilkan {filteredIcons.length} dari {ICON_LIST.length} icon
                        </p>
                    </div>

                    {/* Icons Grid */}
                    <div className="overflow-y-auto flex-1 px-6 py-4">
                        <div className="grid grid-cols-6 gap-3 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-14">
                            {filteredIcons.length > 0 ? (
                                filteredIcons.map((iconName) => {
                                    const IconComponent = (Icons as any)[iconName];
                                    if (!IconComponent) return null;

                                    const isSelected = selectedIcon === iconName;
                                    return (
                                        <button
                                            key={iconName}
                                            onClick={() => handleSelectIcon(iconName)}
                                            className={`p-3 rounded-lg transition flex items-center justify-center hover:scale-110 ${isSelected
                                                ? 'bg-blue-600 text-white ring-2 ring-blue-300 shadow-lg'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            title={iconName}
                                        >
                                            <IconComponent className="w-6 h-6" />
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="col-span-full text-center py-12 text-gray-500">
                                    <p className="font-medium">Tidak ada icon yang cocok</p>
                                    <p className="text-sm">Coba cari dengan kata kunci lain</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    {selectedIcon && (
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center gap-3">
                            <span className="text-lg">{selectedIcon}</span>
                            <p className="text-sm text-gray-600">
                                Terpilih: <span className="font-semibold text-gray-900">{selectedIcon}</span>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
