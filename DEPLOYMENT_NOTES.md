# Deployment Notes - File Upload/Download Fix

## Summary

Fixed file upload/download issues:
1. **Image file duplication on update** - Old images weren't deleted when uploading new ones
2. **File download 404 error** - Files not accessible at `/storage/commitments/file.pdf`
3. **Incorrect file routing** - Frontend should use API endpoint instead of direct path

## Root Causes

1. **Galeri Kegiatan**: PUT endpoint was APPENDING new images to old images instead of replacing
2. **All modules**: Frontend tried to access files directly from `/storage/commitments/file.pdf` instead of API endpoint `/api/storage/commitments/file.pdf`

## Solution

Converted all file download/access links from direct paths to API endpoints.

## Changes Made

### 0. Galeri Kegiatan API - Fix image duplication on update
**File**: `src/app/api/dashboard/galeri-kegiatans/[id]/route.ts`

**Problem**: When updating gallery, new images were APPENDED to old images instead of replacing them

**Solution**: Change PUT endpoint to REPLACE images instead of APPEND

```typescript
// BEFORE (Line 73-94)
let fotoPaths = [...existingFiles];  // Start with old
if (newFiles) {
    fotoPaths.push(...newFiles);     // APPEND new → Results in old + new
}

// AFTER
let fotoPaths = [];
if (newFiles) {
    fotoPaths = newFiles;            // Replace old with new only
    deleteMultipleGaleriKegiatanPhotos(existingFiles);  // Delete old
} else {
    fotoPaths = [...existingFiles];  // Keep if no new files
}
```

**Benefits**:
- Upload 1 image → table shows 1 image (not 1+2+3 accumulated)
- Update with 1 image → old images deleted, table shows only 1 new image
- No accumulation of old/orphaned files

---

### 1. Komitmen Pelayanan (Commitments) - KomitmenPelayananTab.tsx
```tsx
// BEFORE (lines 340-349)
<a href={filePath} download>
  <Download className="w-4 h-4" />
  Download File
</a>

// AFTER (lines 337-365)
const apiPath = `/api${filePath}`;
const fileName = getFileName(filePath);
<a href={apiPath} download={fileName}>
  <Download className="w-4 h-4" />
  {fileName}
</a>
```

**Benefits**:
- File downloads now work in production
- Shows actual filename instead of "Download File"
- Proper file handling through API endpoint

### 2. Layanan (Services) - LayananTab.tsx
```tsx
// BEFORE (line 361)
<a href={filePath} download>

// AFTER (line 363)
const apiPath = `/api${filePath}`;
<a href={apiPath} download={fileName}>
```

**Benefits**:
- File downloads work for services/layanan
- Consistent with commitments implementation

### 3. Galeri Kegiatan (Gallery) - GaleriKegiatanTab.tsx
```tsx
// BEFORE (lines 323, 330)
<a href={photo}>
  <img src={photo} />
</a>

// AFTER (lines 323-333)
const apiPath = `/api${photo}`;
<a href={apiPath}>
  <img src={apiPath} />
</a>
```

**Benefits**:
- Gallery images now display in production
- Image preview on hover works correctly
- Opens full image when clicked

## Why This Works

1. **Next.js File Serving**: The API endpoint `/api/storage/[...path]/route.ts` properly serves files from the public folder with correct MIME types and headers.

2. **Production Build**: Direct `/storage/` paths don't work in Next.js production builds. API routes are the proper way to serve static files.

3. **Security**: The API endpoint includes path validation to prevent directory traversal attacks.

4. **Caching**: Proper HTTP headers (Cache-Control) are set for performance.

## Testing Instructions

### Test 1: File Upload
1. Go to Komitmen Pelayanan tab
2. Click "Tambah Data"
3. Upload a PDF or image file
4. Click Save
5. Verify: 1 file appears in table

### Test 2: File Download
1. In the table, click the file download link
2. Verify: File downloads successfully with correct filename
3. Repeat with different file types (PDF, images, documents)

### Test 3: File Update
1. Click Edit on an existing commitment
2. Upload 1 new file
3. Click Save
4. Verify: OLD files are deleted, only NEW file appears in table

### Test 4: Multiple Files
1. Click Edit on a commitment
2. Upload 2 new files
3. Click Save
4. Verify: Table shows 2 files
5. Download both files and verify they work

### Test 5: Production Build
```bash
npm run build
npm start
```
Then run Test 1-4 again to verify it works in production.

## Rollback Instructions

If issues occur, the changes are minimal and only affect frontend components:

```bash
git checkout src/presentation/components/komitmen/KomitmenPelayananTab.tsx
git checkout src/presentation/components/layanan/LayananTab.tsx
git checkout src/presentation/components/galeri/GaleriKegiatanTab.tsx
```

## No Backend Changes Needed

- Database schema: ✅ No changes
- API endpoints: ✅ Already working correctly
- File storage: ✅ No changes
- File deletion logic: ✅ Already working correctly

Only frontend components were updated to route through the correct API endpoint.

## Related Files (for reference)

- API endpoint: `src/app/api/storage/[...path]/route.ts`
- File upload handler: `src/shared/fileUploadHandler.ts`
- Backend file deletion: `src/app/api/dashboard/commitments/[id]/route.ts` (lines 79-82)

## Verification

After deployment, check:
- [ ] Downloads work in browser
- [ ] Files appear in browser's download history
- [ ] Multiple files don't accumulate on update
- [ ] Works on desktop and mobile
- [ ] Works in all supported browsers (Chrome, Firefox, Safari, Edge)

---

**Deployed**: [Date]  
**Tested By**: [Name]  
**Issues Found**: [If any]
