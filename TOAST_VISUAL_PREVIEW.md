# Toast Design - Visual Preview

## 🎨 Design Showcase

### Success Toast
```
┌────────────────────────────────────────────────────────┐
│ ✓ Visi dan Misi berhasil disimpan                  [✕] │
│ (Emerald → Green gradient)                             │
└────────────────────────────────────────────────────────┘
```
- **Background**: Gradient from Emerald to Green
- **Border**: 4px Emerald left border
- **Icon**: Check mark (✓) 24px white
- **Shadow**: Deep shadow-2xl with backdrop blur

### Error Toast
```
┌────────────────────────────────────────────────────────┐
│ ⊗ Terjadi kesalahan saat menyimpan              [✕]    │
│ (Red → Rose gradient)                                  │
└────────────────────────────────────────────────────────┘
```
- **Background**: Gradient from Red to Rose
- **Border**: 4px Red left border
- **Icon**: X Circle (⊗) 24px white
- **Shadow**: Enhanced shadow with glass effect

### Warning Toast
```
┌────────────────────────────────────────────────────────┐
│ ! Pilih file terlebih dahulu                    [✕]    │
│ (Amber → Orange gradient)                              │
└────────────────────────────────────────────────────────┘
```
- **Background**: Gradient from Amber to Orange
- **Border**: 4px Amber left border
- **Icon**: Alert Circle (!) 24px white
- **Shadow**: Modern glass blur effect

### With Action Button
```
┌────────────────────────────────────────────────────────┐
│ ✓ Item berhasil dihapus                         [✕]    │
│   Undo                                                 │
│ (Emerald → Green gradient)                             │
└────────────────────────────────────────────────────────┘
```
- Main message on first line
- Optional action button on second line
- Underline style with hover effect
- Auto-closes after action or timer

## 🎬 Animations

### Entrance Animation
```
       Position: translateX(400px)
       Opacity: 0%
       ↓ (400ms cubic-bezier bounce)
       Position: translateX(0)
       Opacity: 100%
```
- Slides in from right with slight bounce
- Smooth and noticeable entrance
- Better than instant appearance

### Exit Animation
```
       Position: translateX(0)
       Opacity: 100%
       ↓ (300ms ease-in-out)
       Position: translateX(400px)
       Opacity: 0%
```
- Slides out to right smoothly
- Faster than entrance (300ms)
- Clean disappearance

## 🎯 Features Breakdown

### Visual Elements
```
┌─ TOAST CONTAINER ────────────────────────────┐
│                                              │
│  ┌─ ICON ─┐  ┌─ CONTENT ─────────────────┐ │
│  │   ✓    │  │ Message text goes here   │ │
│  │ (24px) │  │ [Optional Action Button] │ │
│  └────────┘  └──────────────────────────┘ │
│           [✕] Close Button                  │
│                                              │
└──────────────────────────────────────────────┘

Left Border: 4px colored accent
Rounded: 12px (rounded-xl)
Padding: 6 (px-6), 5 (py-5)
Gap: 4 (between icon & content)
```

### Color Palette

#### Success
- Background: `from-emerald-500 to-green-500`
- Border: `border-emerald-400`
- Text: White (text-white)

#### Error
- Background: `from-red-500 to-rose-500`
- Border: `border-red-400`
- Text: White (text-white)

#### Warning
- Background: `from-amber-500 to-orange-500`
- Border: `border-amber-400`
- Text: White (text-white)

### Responsive Behavior

#### Desktop (> 640px)
```
┌─────────────────────────────────────┐
│                                     │
│    Other content ...                │
│                                     │
│                ┌─────────────────┐  │
│                │ Toast Notification
│                └─────────────────┘  │
│                (top-right corner)   │
└─────────────────────────────────────┘
```
- Fixed position: top-6 right-6
- Max-width: 420px
- Maintains spacing from edges

#### Mobile (< 640px)
```
┌──────────────────────────────────┐
│ ┌─────────────────────────────┐  │
│ │ Toast Notification (full    │  │
│ │ width minus margins)        │  │
│ └─────────────────────────────┘  │
│ (16px margins on sides)          │
│                                  │
│    Other content ...             │
└──────────────────────────────────┘
```
- Left: 16px, Right: 16px
- Full width available space
- Better readability on small screens

## 📐 Spacing Details

### Padding
- Horizontal: px-6 (24px left/right)
- Vertical: py-5 (20px top/bottom)
- Icon margin: pt-0.5 (2px)
- Action button margin: mt-2 (8px)

### Gap
- Between icon & content: gap-4 (16px)
- Top position from viewport: top-6 (24px)
- Right position from viewport: right-6 (24px)
- Mobile horizontal: 16px from edges

## 🎪 Typography

### Message Text
- Size: text-sm (14px)
- Weight: font-semibold (600)
- Line-height: leading-snug
- Color: text-white

### Action Button
- Size: text-xs (12px)
- Weight: font-medium (500)
- Decoration: underline
- Hover: opacity-80

### Effects
- Font rendering: Antialiased
- Text smoothing: Optimized

## ✨ Modern Effects

### Backdrop Blur
```css
backdrop-blur-sm    /* Slight blur effect */
bg-opacity-95       /* 95% opacity (not fully opaque) */
shadow-2xl          /* Extra deep shadow */
```
Creates glass-morphism effect that's modern and elegant.

### Transitions
```css
hover:bg-white hover:bg-opacity-20
transition-colors duration-200     /* Close button hover */

transition-opacity                 /* Action button hover */
```
Smooth 200ms transitions for interactive elements.

## 🚀 Performance

- **CSS**: Minimal inline styles
- **Animation**: GPU-accelerated transforms
- **Memory**: Auto-cleanup on close
- **Bundle**: ~4KB minified

## 🔧 Customization Examples

### Longer Auto-Dismiss
```tsx
<Toast
  message="Message"
  duration={5000}  // 5 seconds
/>
```

### With Callback
```tsx
<Toast
  message="Saved"
  onClose={() => refreshData()}
/>
```

### With Action
```tsx
<Toast
  message="Deleted"
  action={{
    label: 'Undo',
    onClick: restoreData
  }}
/>
```

### All Features
```tsx
<Toast
  message="Operation completed"
  type="success"
  duration={4000}
  action={{
    label: 'View Details',
    onClick: handleAction
  }}
  onClose={() => cleanup()}
/>
```

---

**Designed**: Modern, clean, and professional aesthetic
**User Experience**: Smooth animations with clear visual feedback
**Accessibility**: High contrast, clear icons, proper labels
