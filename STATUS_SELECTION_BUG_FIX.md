# Status Selection Bug Fix - Aktif/Non-Aktif

## Bug Report

**Issue**: Saat tambah/edit layanan publik dengan status **'Non-Aktif'**, yang tersimpan ke database malah **'Aktif'**

**Severity**: 🔴 **HIGH** - Affects all data entry with Non-Aktif status

**Modules Affected**:
- ✅ Layanan Publik (Services)
- ✅ Komitmen Pelayanan (Commitments)  
- ✅ Galeri Kegiatan (Gallery)

---

## Root Cause Analysis

### The Bug

Backend endpoints menggunakan **logical OR operator (`||`)** untuk parsing status:

```typescript
// BUGGY CODE (Layanan Create)
const status = parseInt(formData.get('status') as string) || 1;
```

### Why It's Broken

JavaScript treats `0` as **falsy**:

| User Selection | String Value | parseInt() | Falsy Check | Result |
|---|---|---|---|---|
| Aktif | "1" | 1 | 1 \|\| 1 = 1 | ✅ Correct |
| Non-Aktif | "0" | 0 | 0 \|\| 1 = 1 | ❌ **BUG!** |

**Masalahnya**: `0` dievaluasi sebagai falsy, jadi `0 || 1` selalu return `1` (Aktif)

---

## Solution

Replace falsy check dengan **explicit null/empty check**:

```typescript
// FIXED CODE
const statusStr = formData.get('status') as string;
const status = statusStr !== null && statusStr !== '' ? parseInt(statusStr) : 1;
```

**Why This Works**:
- `"0"` adalah string yang tidak null/tidak kosong → `parseInt("0")` = `0` ✅
- `"1"` adalah string yang tidak null/tidak kosong → `parseInt("1")` = `1` ✅
- Null/undefined/empty → fallback ke default `1` ✅

---

## Files Fixed (5 total)

| File | Lines | Module | Change |
|------|-------|--------|--------|
| `src/app/api/dashboard/layanans/create/route.ts` | 12-14 | Layanan | Fix POST status parsing |
| `src/app/api/dashboard/layanans/[id]/route.ts` | 52-54 | Layanan | Fix PUT status parsing |
| `src/app/api/dashboard/commitments/create/route.ts` | 12-14 | Komitmen | Fix POST status parsing |
| `src/app/api/dashboard/commitments/[id]/route.ts` | 52-54 | Komitmen | Fix PUT status parsing |
| `src/app/api/dashboard/galeri-kegiatans/create/route.ts` | 9-11 | Galeri | Fix POST status parsing |

---

## Before vs After

### Before ❌
```typescript
// Line 13 in Layanan create
const status = parseInt(formData.get('status') as string) || 1;

// When user selects "Non-Aktif" (value="0")
parseInt("0") // = 0
0 || 1        // = 1 (WRONG!)
// Result: Saved as Aktif ❌
```

### After ✅
```typescript
// Line 12-14 in Layanan create
const statusStr = formData.get('status') as string;
const status = statusStr !== null && statusStr !== '' ? parseInt(statusStr) : 1;

// When user selects "Non-Aktif" (value="0")
statusStr = "0"
"0" !== null && "0" !== '' // = true
parseInt("0")              // = 0
// Result: Saved as Non-Aktif ✅
```

---

## Testing Instructions

### Test 1: Create Layanan with Non-Aktif Status
```
1. Go to Layanan Publik menu
2. Click "Tambah Data"
3. Fill form:
   - Nama: "Test Layanan Non-Aktif"
   - Status: Select "Non-Aktif" (radio button)
4. Click "Simpan"
5. Check database/table

Expected: Status = 0 (Non-Aktif) ✅
Actual Before Fix: Status = 1 (Aktif) ❌
```

### Test 2: Edit Layanan to Non-Aktif Status
```
1. In Layanan table, click Edit on existing row
2. Change Status from Aktif to Non-Aktif
3. Click "Simpan"
4. Check table/database

Expected: Status updates to 0 ✅
```

### Test 3: Verify Aktif Status Still Works
```
1. Create new Layanan with Status = Aktif
2. Create new Komitmen with Status = Aktif
3. Create new Galeri with Status = Aktif

Expected: All save correctly with status = 1 ✅
```

### Test 4: Mixed Status Create/Edit
```
1. Create 3 items:
   - Item 1: Aktif
   - Item 2: Non-Aktif
   - Item 3: Aktif
2. Edit Item 2 from Non-Aktif → Aktif
3. Edit Item 3 from Aktif → Non-Aktif

Expected: Database shows correct status for all ✅
```

---

## Detailed Before/After Comparison

### Layanan CREATE endpoint
```diff
- const status = parseInt(formData.get('status') as string) || 1;
+ const statusStr = formData.get('status') as string;
+ const status = statusStr !== null && statusStr !== '' ? parseInt(statusStr) : 1;
```

### Layanan PUT endpoint
```diff
- const status = formData.get('status') ? parseInt(formData.get('status') as string) : undefined;
+ const statusStr = formData.get('status') as string | null | undefined;
+ const status = statusStr !== null && statusStr !== undefined && statusStr !== '' ? parseInt(statusStr) : undefined;
```

### Komitmen CREATE endpoint
```diff
- const status = parseInt(formData.get('status') as string) || 1;
+ const statusStr = formData.get('status') as string;
+ const status = statusStr !== null && statusStr !== '' ? parseInt(statusStr) : 1;
```

### Komitmen PUT endpoint
```diff
- const status = formData.get('status') ? parseInt(formData.get('status') as string) : undefined;
+ const statusStr = formData.get('status') as string | null | undefined;
+ const status = statusStr !== null && statusStr !== undefined && statusStr !== '' ? parseInt(statusStr) : undefined;
```

### Galeri CREATE endpoint
```diff
- const status = parseInt(formData.get('status') as string) || 1;
+ const statusStr = formData.get('status') as string;
+ const status = statusStr !== null && statusStr !== '' ? parseInt(statusStr) : 1;
```

---

## JavaScript Falsy Values Reference

For future reference, these values are **falsy** in JavaScript:
- `false`
- `0` ⚠️ **This is why the bug exists**
- `""` (empty string)
- `null`
- `undefined`
- `NaN`

When using `||` operator with these values, the OR chain continues:
```javascript
0 || 1        // = 1 (falsy, so uses next value)
false || 1    // = 1 (falsy, so uses next value)
null || 1     // = 1 (falsy, so uses next value)
1 || 1        // = 1 (truthy, so uses this value)
```

**Best Practice**: Use explicit checks instead:
```javascript
// ❌ BAD
const value = parseInt(str) || 0;

// ✅ GOOD
const value = str ? parseInt(str) : 0;

// ✅ BETTER (for explicit null/undefined/empty)
const value = str !== null && str !== '' ? parseInt(str) : 0;
```

---

## Impact Analysis

### What This Bug Affected

**Before Fix**:
- Any user creating/editing item with "Non-Aktif" status would get "Aktif" saved
- Data integrity issue: recorded status ≠ intended status
- Users would need to manually edit items to correct status

**After Fix**:
- Status selection works correctly for all values (0 and 1)
- Data saved matches user selection
- No need for manual corrections

### Backward Compatibility

- ✅ **Backward Compatible**: Old data unaffected
- ✅ **No Migration Needed**: No schema changes
- ✅ **No API Changes**: Endpoints work the same way
- ✅ **Easy Rollback**: Single git revert if needed

---

## Deployment Checklist

- [ ] Review all 5 file changes
- [ ] Run tests from "Testing Instructions" above
- [ ] Verify no other `parseInt(...) || 1` patterns exist
- [ ] Build: `npm run build`
- [ ] Test in production build: `npm start`
- [ ] Commit changes
- [ ] Deploy to production
- [ ] Test all modules with Non-Aktif status

---

## Files Modified Summary

```
5 files changed:
- src/app/api/dashboard/layanans/create/route.ts
- src/app/api/dashboard/layanans/[id]/route.ts
- src/app/api/dashboard/commitments/create/route.ts
- src/app/api/dashboard/commitments/[id]/route.ts
- src/app/api/dashboard/galeri-kegiatans/create/route.ts

~15 lines modified (all focused on status parsing fix)
```

---

## Sign-off

| Role | Name | Date | Status |
|------|------|------|--------|
| Developer | | | ✅ Fixed |
| Tester | | | ⬜ Test |
| Reviewer | | | ⬜ Review |
| Approved | | | ⬜ Deploy |

---

**Status**: ✅ **READY FOR TESTING & DEPLOYMENT**

---

## Related Files

- [QUICK_FIX_SUMMARY.md](./QUICK_FIX_SUMMARY.md) - Other fixes summary
- [FIXES.md](./FIXES.md) - File upload/download fixes
- [README.md](./README.md) - Project documentation
