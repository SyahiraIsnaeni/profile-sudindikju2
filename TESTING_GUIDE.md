# Testing Guide - File Upload/Download Fixes

## Quick Start Testing

### Scenario 1: Create New Gallery with Images
```
Step 1: Navigate to "Galeri Kegiatan" tab
Step 2: Click "Tambah Data" button
Step 3: Fill in:
   - Judul Kegiatan: "Event Tahunan 2025"
   - Status: Aktif
Step 4: Click file upload area
Step 5: Select 1-3 image files (JPG, PNG, GIF, WEBP)
Step 6: Verify preview shows selected images
Step 7: Click "Simpan"

Expected Result: ✅
- No error messages
- Table shows 1 new row
- Image count matches selected files (1, 2, or 3)
- Images display correctly in table
```

### Scenario 2: Download File
```
Step 1: In any table with files (Komitmen, Layanan, Galeri)
Step 2: Look for "Download File" or filename link
Step 3: Click the download link
Step 4: Wait for file to download

Expected Result: ✅
- File downloads to Downloads folder
- Filename is correct and readable
- File opens without corruption (image, PDF, etc.)
```

### Scenario 3: Update Gallery with New Images
```
Step 1: In Galeri Kegiatan table, find existing row
Step 2: Click "Edit" button (pencil icon)
Step 3: Modal opens showing:
   - Current judul
   - Existing photos (blue border preview)
   - Status
Step 4: Click file upload area
Step 5: Select 1 NEW image
Step 6: Verify:
   - Old photos section still shows (blue previews)
   - New photos section shows new image (green preview)
Step 7: Click "Simpan"

Expected Result: ✅
- Old images are DELETED
- Table shows ONLY 1 new image
- Image count is 1 (not 1+old count)
```

### Scenario 4: Update with Multiple Files
```
Step 1: Edit existing gallery entry
Step 2: Old images shown: 2 images
Step 3: Upload 3 new images
Step 4: Verify preview:
   - Foto yang ada (existing): 2 blue previews
   - Foto baru (new): 3 green previews
Step 5: Click "Simpan"

Expected Result: ✅
- Old 2 images DELETED
- Table shows ONLY 3 new images
- No accumulation/duplication
```

### Scenario 5: Update Without Changing Files
```
Step 1: Edit existing gallery entry
Step 2: Change only the "Judul" field
Step 3: Do NOT upload any new images
Step 4: Click "Simpan"

Expected Result: ✅
- Judul updated
- Images unchanged
- Same number of images in table
```

---

## Detailed Test Cases

### Test Case A: Image File Duplication
**Purpose**: Verify image duplication bug is fixed

**Setup**: 
- Create gallery with 1 image

**Procedure**:
1. Note initial image count: 1
2. Edit the gallery
3. Upload 1 new image
4. Save
5. Check image count in table
6. Repeat steps 2-4 three times
7. Check final image count

**Expected**: 
- After each update: count remains 1 (not 1, 2, 3, 4)
- Old images deleted each time

**Actual**: ___________
**Status**: ✅ PASS / ❌ FAIL

---

### Test Case B: File Download from Komitmen
**Purpose**: Verify downloads work in production

**Setup**:
- Create/edit commitment with PDF file

**Procedure**:
1. In Komitmen Pelayanan table, locate file link
2. Right-click → "Save link as..."
3. Note proposed filename
4. Accept and download
5. Check Downloads folder
6. Open file and verify contents

**Expected**:
- Download completes successfully
- Filename is meaningful (not random hash)
- File opens and is readable

**Actual**: ___________
**Status**: ✅ PASS / ❌ FAIL

---

### Test Case C: File Download from Layanan
**Purpose**: Verify downloads work for Services

**Setup**:
- Create/edit layanan with DOC/DOCX file

**Procedure**:
1. In Layanan table, locate file link
2. Click to download
3. Wait 2-3 seconds
4. Check Downloads folder
5. Verify file integrity

**Expected**:
- File downloads
- Filename correct
- File is complete and readable

**Actual**: ___________
**Status**: ✅ PASS / ❌ FAIL

---

### Test Case D: Gallery Image Display
**Purpose**: Verify images display in production

**Setup**:
- Create gallery with 2-3 images

**Procedure**:
1. View Galeri Kegiatan table
2. Hover over image thumbnails
3. Click on image thumbnail
4. Verify full image opens in new tab
5. Go back to table
6. Click another image
7. Verify it opens

**Expected**:
- All thumbnails display (not broken image icon)
- Full image opens correctly
- Images are readable and clear

**Actual**: ___________
**Status**: ✅ PASS / ❌ FAIL

---

### Test Case E: Production Build Testing
**Purpose**: Verify fixes work in production (not just dev)

**Procedure**:
1. Open terminal
2. Run: `npm run build`
3. Wait for build to complete (should show "compiled successfully")
4. Run: `npm start`
5. Open browser to http://localhost:3000
6. Run Test Cases A-D above in production mode

**Expected**:
- Build succeeds without errors
- App starts on port 3000
- All tests A-D pass with production build

**Actual**: ___________
**Status**: ✅ PASS / ❌ FAIL

---

## Browser Compatibility Testing

Test on these browsers:

| Browser | Version | Image Upload | File Download | Status |
|---------|---------|-------------|---------------|--------|
| Chrome | Latest | ⬜ | ⬜ | |
| Firefox | Latest | ⬜ | ⬜ | |
| Safari | Latest | ⬜ | ⬜ | |
| Edge | Latest | ⬜ | ⬜ | |

Legend: ✅ Pass | ❌ Fail | ⬜ Not Tested

---

## Mobile Testing

**Device**: iPhone/Android
**Browser**: Safari/Chrome Mobile

| Action | Expected | Actual | Status |
|--------|----------|--------|--------|
| Upload image | File picker opens | | ✅/❌ |
| Download file | File saves to downloads | | ✅/❌ |
| Image preview | Thumbnail displays | | ✅/❌ |
| Click download | Download starts | | ✅/❌ |

---

## Edge Cases

### Edge Case 1: Very Large Image (10MB)
```
Upload 10MB image → Should show error message
Expected: "Ukuran foto maksimal 10MB"
Status: ✅ PASS / ❌ FAIL
```

### Edge Case 2: Wrong File Type (.txt instead of .jpg)
```
Upload .txt file → Should show error message
Expected: "Tipe foto tidak didukung"
Status: ✅ PASS / ❌ FAIL
```

### Edge Case 3: No Files Selected
```
Click upload but cancel file picker → Form should not submit
Expected: Error message or button disabled
Status: ✅ PASS / ❌ FAIL
```

### Edge Case 4: Rapid Successive Updates
```
Edit gallery 3 times rapidly → Should not duplicate or lose data
Expected: Each update replaces previous, no data loss
Status: ✅ PASS / ❌ FAIL
```

### Edge Case 5: Upload Then Delete File
```
Upload image → Delete from disk manually → Try to download
Expected: File not found error (graceful handling)
Status: ✅ PASS / ❌ FAIL
```

---

## Performance Testing

### Upload Performance
```
Upload 5 images (~2MB each) → Measure time
Expected: < 5 seconds
Actual: _______ seconds
Status: ✅ PASS / ❌ FAIL
```

### Download Performance
```
Download 1 file (5MB) → Measure time
Expected: < 2 seconds
Actual: _______ seconds
Status: ✅ PASS / ❌ FAIL
```

### Page Load
```
Load Galeri Kegiatan page with 100 images
Expected: < 2 seconds
Actual: _______ seconds
Status: ✅ PASS / ❌ FAIL
```

---

## Sign-off

| Role | Name | Date | Status |
|------|------|------|--------|
| Developer | | | |
| QA Tester | | | |
| Reviewer | | | |
| Approved | | | ✅ READY / ❌ NOT READY |

---

## Known Issues (if any)

1. _________________
2. _________________
3. _________________

---

## Notes

_________________________________________________________________

_________________________________________________________________

_________________________________________________________________

---

**Test Date**: __________  
**Environment**: Development / Staging / Production  
**Browser**: ________________  
**Tester**: ________________
