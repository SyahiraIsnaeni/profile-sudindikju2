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
import { useState, useEffect } from 'react';

interface RichTextToolbarProps {
    onCommand?: (command: string, value?: string) => void;
    editorRef?: React.RefObject<HTMLDivElement>;
}

export function RichTextToolbar({ onCommand, editorRef }: RichTextToolbarProps) {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showHighlightPicker, setShowHighlightPicker] = useState(false);
    const [textColor, setTextColor] = useState('#000000');
    const [highlightColor, setHighlightColor] = useState('#FFFF00');
    const [activeBold, setActiveBold] = useState(false);
    const [activeItalic, setActiveItalic] = useState(false);
    const [activeUnderline, setActiveUnderline] = useState(false);
    const [activeList, setActiveList] = useState(false);
    const [activeOrderedList, setActiveOrderedList] = useState(false);

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

    // Update active state ketika selection berubah
    useEffect(() => {
        const updateActiveState = () => {
            setActiveBold(document.queryCommandState('bold'));
            setActiveItalic(document.queryCommandState('italic'));
            setActiveUnderline(document.queryCommandState('underline'));
            setActiveList(document.queryCommandState('insertUnorderedList'));
            setActiveOrderedList(document.queryCommandState('insertOrderedList'));
        };

        const handleMouseUp = () => updateActiveState();
        const handleKeyUp = () => updateActiveState();

        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const handleTextColor = (color: string) => {
        document.execCommand('foreColor', false, color);
        setTextColor(color);
        setShowColorPicker(false);
    };

    const handleHighlightColor = (color: string) => {
        document.execCommand('backColor', false, color);
        setHighlightColor(color);
        setShowHighlightPicker(false);
    };

    const handleFontSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const size = e.target.value;
        if (size) {
            document.execCommand('fontSize', false, size);
        }
    };

    const handleFontFamily = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const font = e.target.value;
        if (font) {
            document.execCommand('fontName', false, font);
        }
    };

    return (
        <div className="flex items-center gap-2 bg-gray-100 p-3 border-b border-gray-300 flex-wrap">
            {/* Bold & Italic & Underline */}
            <button
                onClick={() => document.execCommand('bold')}
                className={`p-2 rounded transition ${
                    activeBold
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-gray-200'
                }`}
                title="Bold (Ctrl+B)"
            >
                <Bold size={18} />
            </button>
            <button
                onClick={() => document.execCommand('italic')}
                className={`p-2 rounded transition ${
                    activeItalic
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-gray-200'
                }`}
                title="Italic (Ctrl+I)"
            >
                <Italic size={18} />
            </button>
            <button
                onClick={() => document.execCommand('underline')}
                className={`p-2 rounded transition ${
                    activeUnderline
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-gray-200'
                }`}
                title="Underline (Ctrl+U)"
            >
                <Underline size={18} />
            </button>

            <div className="w-px h-6 bg-gray-300" />

            {/* Text Alignment */}
            <button
                onClick={() => document.execCommand('justifyLeft')}
                className="p-2 hover:bg-gray-200 rounded transition"
                title="Align Left"
            >
                <AlignLeft size={18} />
            </button>
            <button
                onClick={() => document.execCommand('justifyCenter')}
                className="p-2 hover:bg-gray-200 rounded transition"
                title="Align Center"
            >
                <AlignCenter size={18} />
            </button>
            <button
                onClick={() => document.execCommand('justifyRight')}
                className="p-2 hover:bg-gray-200 rounded transition"
                title="Align Right"
            >
                <AlignRight size={18} />
            </button>
            <button
                onClick={() => document.execCommand('justifyFull')}
                className="p-2 hover:bg-gray-200 rounded transition"
                title="Justify"
            >
                <Type size={18} />
            </button>

            <div className="w-px h-6 bg-gray-300" />

            {/* Numbering & Lists */}
            <button
                onClick={() => document.execCommand('insertOrderedList')}
                className={`p-2 rounded transition ${
                    activeOrderedList
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-gray-200'
                }`}
                title="Numbered List"
            >
                <ListOrdered size={18} />
            </button>
            <button
                onClick={() => document.execCommand('insertUnorderedList')}
                className={`p-2 rounded transition ${
                    activeList
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-gray-200'
                }`}
                title="Bullet List"
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
