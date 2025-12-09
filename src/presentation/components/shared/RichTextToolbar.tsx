'use client';

import {
    Bold,
    Italic,
    Underline,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Type,
    List,
    ListOrdered,
    Highlighter,
    Palette,
} from 'lucide-react';
import { useState } from 'react';

interface RichTextToolbarProps {
    onCommand?: (command: string, value?: string) => void;
    editorRef?: React.RefObject<HTMLDivElement | null>;
}

export function RichTextToolbar({ onCommand, editorRef }: RichTextToolbarProps) {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showHighlightPicker, setShowHighlightPicker] = useState(false);
    const [textColor, setTextColor] = useState('#000000');
    const [highlightColor, setHighlightColor] = useState('#FFFF00');

    const textColors = [
        { name: 'Hitam', value: '#000000' },
        { name: 'Biru', value: '#0000FF' },
        { name: 'Merah', value: '#FF0000' },
        { name: 'Hijau', value: '#008000' },
        { name: 'Ungu', value: '#800080' },
        { name: 'Orange', value: '#FFA500' },
        { name: 'Coklat', value: '#8B4513' },
        { name: 'Biru Muda', value: '#1E90FF' },
    ];

    const highlightColors = [
        { name: 'Kuning', value: '#FFFF00' },
        { name: 'Hijau Muda', value: '#90EE90' },
        { name: 'Merah Muda', value: '#FFB6C6' },
        { name: 'Biru Muda', value: '#ADD8E6' },
        { name: 'Orange Muda', value: '#FFD700' },
        { name: 'Ungu Muda', value: '#DDA0DD' },
        { name: 'Cyan', value: '#00FFFF' },
    ];

    /**
     * Execute command dengan proper selection handling
     * Save selection sebelum button loses focus, restore saat execute
     * Ini memastikan command bekerja dengan baik bahkan setelah button click
     */
    const executeCommand = (command: string, value?: string) => {
        // Focus editor terlebih dahulu
        if (editorRef?.current) {
            editorRef.current.focus();
        }

        // Simpan selection saat ini
        const selection = window.getSelection();
        let savedRange = null;

        if (selection && selection.rangeCount > 0) {
            savedRange = selection.getRangeAt(0).cloneRange();
        }

        // Jika tidak ada selection dan command memerlukan selection, buat range di akhir editor
        if (!savedRange && editorRef?.current && !['insertOrderedList', 'insertUnorderedList'].includes(command)) {
            savedRange = document.createRange();
            savedRange.selectNodeContents(editorRef.current);
            savedRange.collapse(false); // Collapse ke akhir
        }

        // Restore selection jika ada
        if (savedRange && selection) {
            try {
                selection.removeAllRanges();
                selection.addRange(savedRange);
            } catch (e) {
                console.warn('[RichTextToolbar] Failed to restore selection:', e);
            }
        }

        // Execute command
        try {
            document.execCommand(command, false, value);
        } catch (e) {
            console.error(`[RichTextToolbar] Command '${command}' failed:`, e);
        }
    };

    const handleTextColor = (color: string) => {
        setShowColorPicker(false);
        setTextColor(color);
        executeCommand('foreColor', color);
    };

    const handleHighlightColor = (color: string) => {
        setShowHighlightPicker(false);
        setHighlightColor(color);
        executeCommand('backColor', color);
    };

    const handleFontSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const size = e.target.value;
        if (size) {
            executeCommand('fontSize', size);
        }
    };

    const handleFontFamily = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const font = e.target.value;
        if (font) {
            executeCommand('fontName', font);
        }
    };

    return (
        <div className="flex items-center gap-2 bg-gray-100 p-3 border-b border-gray-300 flex-wrap">
            {/* Bold & Italic & Underline */}
            <button
                onClick={() => executeCommand('bold')}
                className="p-2 rounded transition hover:bg-gray-200"
                title="Bold (Ctrl+B)"
            >
                <Bold size={18} />
            </button>
            <button
                onClick={() => executeCommand('italic')}
                className="p-2 rounded transition hover:bg-gray-200"
                title="Italic (Ctrl+I)"
            >
                <Italic size={18} />
            </button>
            <button
                onClick={() => executeCommand('underline')}
                className="p-2 rounded transition hover:bg-gray-200"
                title="Underline (Ctrl+U)"
            >
                <Underline size={18} />
            </button>

            <div className="w-px h-6 bg-gray-300" />

            {/* Text Alignment */}
            <button
                onClick={() => executeCommand('justifyLeft')}
                className="p-2 hover:bg-gray-200 rounded transition"
                title="Align Left"
            >
                <AlignLeft size={18} />
            </button>
            <button
                onClick={() => executeCommand('justifyCenter')}
                className="p-2 hover:bg-gray-200 rounded transition"
                title="Align Center"
            >
                <AlignCenter size={18} />
            </button>
            <button
                onClick={() => executeCommand('justifyRight')}
                className="p-2 hover:bg-gray-200 rounded transition"
                title="Align Right"
            >
                <AlignRight size={18} />
            </button>
            <button
                onClick={() => executeCommand('justifyFull')}
                className="p-2 hover:bg-gray-200 rounded transition"
                title="Justify"
            >
                <Type size={18} />
            </button>

            <div className="w-px h-6 bg-gray-300" />

            {/* Numbering & Lists */}
            <button
                onClick={() => executeCommand('insertOrderedList')}
                className="p-2 rounded transition hover:bg-gray-200"
                title="Numbered List (1, 2, 3...)"
            >
                <ListOrdered size={18} />
            </button>
            <button
                onClick={() => executeCommand('insertUnorderedList')}
                className="p-2 rounded transition hover:bg-gray-200"
                title="Bullet List (•)"
            >
                <List size={18} />
            </button>

            <div className="w-px h-6 bg-gray-300" />

            {/* Text Color Picker */}
            <div className="relative">
                <button
                    onClick={() => {
                        setShowColorPicker(!showColorPicker);
                        setShowHighlightPicker(false);
                    }}
                    className="p-2 hover:bg-gray-200 rounded transition flex items-center gap-1"
                    title="Text Color"
                >
                    <Palette size={18} />
                    <div
                        className="w-4 h-4 rounded border border-gray-600"
                        style={{ backgroundColor: textColor }}
                    />
                </button>
                {showColorPicker && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg p-3 shadow-lg z-10 grid grid-cols-8 gap-2" style={{ width: '280px' }}>
                        {textColors.map((color) => (
                            <button
                                key={color.value}
                                onClick={() => handleTextColor(color.value)}
                                title={color.name}
                                className="w-10 h-10 rounded border-2 border-gray-300 hover:border-gray-600 transition"
                                style={{ backgroundColor: color.value }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Highlight Color Picker */}
            <div className="relative">
                <button
                    onClick={() => {
                        setShowHighlightPicker(!showHighlightPicker);
                        setShowColorPicker(false);
                    }}
                    className="p-2 hover:bg-gray-200 rounded transition flex items-center gap-1"
                    title="Highlight Color"
                >
                    <Highlighter size={18} />
                    <div
                        className="w-4 h-4 rounded border border-gray-600"
                        style={{ backgroundColor: highlightColor }}
                    />
                </button>
                {showHighlightPicker && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg p-3 shadow-lg z-10 grid grid-cols-7 gap-2" style={{ width: '280px' }}>
                        {highlightColors.map((color) => (
                            <button
                                key={color.value}
                                onClick={() => handleHighlightColor(color.value)}
                                title={color.name}
                                className="w-10 h-10 rounded border-2 border-gray-300 hover:border-gray-600 transition"
                                style={{ backgroundColor: color.value }}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="w-px h-6 bg-gray-300" />

            {/* Font Size */}
            <select
                onChange={handleFontSize}
                className="px-3 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50"
                title="Font Size"
            >
                <option value="">Ukuran</option>
                <option value="1">8px</option>
                <option value="2">10px</option>
                <option value="3">12px</option>
                <option value="4">14px</option>
                <option value="5">18px</option>
                <option value="6">24px</option>
                <option value="7">32px</option>
            </select>

            {/* Font Family */}
            <select
                onChange={handleFontFamily}
                className="px-3 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50"
                title="Font Family"
            >
                <option value="">Font</option>
                <option value="Arial">Arial</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Verdana">Verdana</option>
            </select>
        </div>
    );
}
