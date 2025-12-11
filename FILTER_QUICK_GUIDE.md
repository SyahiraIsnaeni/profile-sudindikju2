# 🚀 Filter Quick Guide

## 📁 File Locations

```
src/presentation/components/masterdata/
├── UsersFilter.tsx          ← NEW (94 lines)
├── RolesFilter.tsx          ← NEW (71 lines)
├── UsersTab.tsx             ← MODIFIED
└── RolesTab.tsx             ← MODIFIED
```

---

## 🎯 Tab Pengguna (Users) - Filters

| Filter | Type | Values | Behavior |
|--------|------|--------|----------|
| **Status** | Dropdown | Semua, Aktif (1), Non-Aktif (0) | Single select |
| **Role** | Dropdown | Dynamic from DB | Single select |
| **Search By** | Dropdown | Nama, Email | Single select |
| **Kata Kunci** | Text Input | Any text | Free text entry |
| **Cari** | Button | - | Apply filters |
| **Hapus Filter** | Button | - | Reset all filters |

### Example Filter Combinations
```
✅ Aktif + Admin Role + (any search)
   → Users who are active AND have admin role

✅ Non-Aktif + (any role) + Email = "test@gmail.com"
   → Inactive users with specific email

✅ (any status) + (any role) + Name = "john"
   → Users with "john" in their name (case-insensitive)
```

---

## 🎯 Tab Role dan Hak Akses (Roles) - Filters

| Filter | Type | Values | Behavior |
|--------|------|--------|----------|
| **Status** | Dropdown | Semua, Aktif (1), Non-Aktif (0) | Single select |
| **Cari Nama Role** | Text Input | Any text | Free text entry |
| **Cari** | Button | - | Apply filters |
| **Hapus Filter** | Button | - | Reset all filters |

### Example Filter Combinations
```
✅ Aktif + (no search)
   → All active roles

✅ (any status) + "Super"
   → All roles with "super" in the name (case-insensitive)
```

---

## 🔍 How Each Filter Works

### Users Filter Logic

**Status = "1" (Aktif)**
```javascript
users.filter(u => u.status === 1)
```

**Role = "5" (Admin)**
```javascript
users.filter(u => u.role_id === 5)
```

**Search By Name with Keyword "john"**
```javascript
users.filter(u => u.name.toLowerCase().includes("john"))
```

**Search By Email with Keyword "gmail"**
```javascript
users.filter(u => u.email.toLowerCase().includes("gmail"))
```

**All Combined (AND Logic)**
```javascript
result = users
  .filter(u => u.status === 1)              // if status selected
  .filter(u => u.role_id === 5)             // if role selected
  .filter(u => u.name.toLowerCase().includes("john")) // if search active
```

---

### Roles Filter Logic

**Status = "1" (Aktif)**
```javascript
roles.filter(r => r.status === 1)
```

**Search "Super"**
```javascript
roles.filter(r => r.name.toLowerCase().includes("super"))
```

**Both Combined (AND Logic)**
```javascript
result = roles
  .filter(r => r.status === 1)           // if status selected
  .filter(r => r.name.toLowerCase().includes("super")) // if search
```

---

## 🎨 UI Components

### UsersFilter Component
```typescript
// Props
interface UsersFilterProps {
  roles: Role[];
  onFilter: (filters: {...}) => void;
}

// Handler Callback
onFilter({
  status?: number;      // 1 or 0
  role_id?: number;     // role id
  searchBy?: 'name' | 'email';
  searchValue?: string;
})
```

### RolesFilter Component
```typescript
// Props
interface RolesFilterProps {
  onFilter: (filters: {...}) => void;
}

// Handler Callback
onFilter({
  status?: number;      // 1 or 0
  searchValue?: string;
})
```

---

## 💻 Component Integration

### In UsersTab.tsx
```typescript
// State
const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
const [isFilterActive, setIsFilterActive] = useState(false);

// Handler
const handleFilter = (filters) => {
  // Apply logic and update state
  setFilteredUsers(result);
  setIsFilterActive(true);
};

// Render
<UsersFilter roles={roles} onFilter={handleFilter} />
<Table data={displayUsers} /> {/* Uses filtered or original */}
```

### In RolesTab.tsx
```typescript
// State
const [filteredRoles, setFilteredRoles] = useState<RoleWithPermissions[]>([]);
const [isFilterActive, setIsFilterActive] = useState(false);

// Handler
const handleFilter = (filters) => {
  // Apply logic and update state
  setFilteredRoles(result);
  setIsFilterActive(true);
};

// Render
<RolesFilter onFilter={handleFilter} />
<Table data={displayRoles} /> {/* Uses filtered or original */}
```

---

## 🎯 Usage Flow

### User Perspective
```
1. Navigate to Master Data → Tab Pengguna/Role
   ↓
2. See filter section at top
   ↓
3. Select filter criteria
   ↓
4. Click "Cari" button (or press Enter in search field)
   ↓
5. Table updates with filtered results
   ↓
6. See counter: "Menampilkan X dari Y"
   ↓
7. Click "Hapus Filter" to reset
   ↓
8. Back to original data
```

---

## 🔧 Technical Details

### Styling (Tailwind CSS)
```css
Filter Container:
  - bg-white rounded-lg shadow p-6
  - Grid responsive: grid-cols-1 md:grid-cols-2 lg:grid-cols-4

Input Fields:
  - px-4 py-2 border border-gray-300 rounded-lg
  - focus:ring-2 focus:ring-blue-500 focus:border-transparent

Buttons:
  - Primary: bg-blue-600 hover:bg-blue-700 active:bg-blue-800
  - Secondary: bg-gray-300 hover:bg-gray-400 active:bg-gray-500
  - Both: text-white px-6 py-2 rounded-lg transition font-medium text-sm
```

### Icons (Lucide React)
- Search: `<Search className="w-4 h-4" />`
- Clear: `<X className="w-4 h-4" />`

---

## ✨ Special Features

### Keyboard Support
```
Type in search input → Press Enter → Trigger filter
```

### Responsive Design
```
Mobile (< 640px):    1 column layout
Tablet (640-1024px): 2 columns
Desktop (> 1024px):  4 columns (Users) or 3 columns (Roles)
```

### Filter Counter
```
Only shows when filter is active:
"Menampilkan 5 dari 20 pengguna"
"Menampilkan 3 dari 8 role"
```

---

## 📊 Data Types

### Users Filter Object
```typescript
{
  status?: 0 | 1;              // Active/Inactive
  role_id?: number;            // Role ID
  searchBy?: 'name' | 'email'; // Search field type
  searchValue?: string;        // Keyword to search
}
```

### Roles Filter Object
```typescript
{
  status?: 0 | 1;     // Active/Inactive
  searchValue?: string; // Role name keyword
}
```

---

## 🔄 Data Flow Diagram

```
┌─────────────────┐
│   User Input    │
│  (Filters UI)   │
└────────┬────────┘
         │
         ↓
    ┌─────────────┐
    │ handleFilter│
    │  Function   │
    └─────┬───────┘
          │
     ┌────┴─────────────────┐
     │                      │
     ↓                      ↓
┌──────────────┐    ┌──────────────┐
│ Clear Filter │    │ Apply Filter │
│              │    │              │
│ setFiltered  │    │ Filter data  │
│ Users = []   │    │ setFiltered  │
│              │    │ Users = [...]│
└──────┬───────┘    └──────┬───────┘
       │                   │
       └───────┬───────────┘
               │
               ↓
        ┌─────────────┐
        │ displayUsers│
        │ or roles    │
        └──────┬──────┘
               │
               ↓
        ┌──────────────┐
        │ Table Render │
        │ (Updates)    │
        └──────────────┘
```

---

## 🧪 Test Cases

### Users Filter Tests
- [ ] Filter by Status = Aktif
- [ ] Filter by Status = Non-Aktif
- [ ] Filter by Role = Admin
- [ ] Filter by Name = "john"
- [ ] Filter by Email = "gmail"
- [ ] Combine Status + Role
- [ ] Combine Status + Search
- [ ] Combine Role + Search
- [ ] Combine all three
- [ ] Clear filter button
- [ ] Enter key trigger
- [ ] Case-insensitive search
- [ ] Partial match search
- [ ] Empty results display
- [ ] Counter display accuracy

### Roles Filter Tests
- [ ] Filter by Status = Aktif
- [ ] Filter by Status = Non-Aktif
- [ ] Filter by Role Name = "Super"
- [ ] Combine Status + Search
- [ ] Clear filter button
- [ ] Enter key trigger
- [ ] Case-insensitive search
- [ ] Partial match search
- [ ] Empty results display
- [ ] Counter display accuracy

---

## 🚨 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Filter not working | Check console for errors, ensure role data loaded |
| Case sensitivity | All searches are case-insensitive ✓ |
| Pagination conflicts | Page resets to 1 when filter applied |
| Empty results | Check filter criteria, try clearing all |
| Search by email not working | Make sure email contains search keyword |

---

## 📝 Notes

1. **Client-side filtering**: All operations happen in browser
2. **No API calls**: Uses data already loaded
3. **Instant feedback**: Filter applies immediately
4. **Case-insensitive**: Search works regardless of case
5. **AND logic**: All selected filters must match
6. **Page reset**: Filtering resets to page 1

---

## 🎓 Code Snippets

### Basic Filter Call
```javascript
handleFilter({
  status: 1,
  role_id: 5,
  searchBy: 'name',
  searchValue: 'john'
})
```

### Clear Filter Call
```javascript
handleFilter({})
```

### Conditional Display
```jsx
const displayUsers = isFilterActive ? filteredUsers : users;

<table>
  {displayUsers.length > 0 ? (
    displayUsers.map(user => <tr key={user.id}>...</tr>)
  ) : (
    <tr><td>No results</td></tr>
  )}
</table>
```

---

**Version**: 1.0
**Status**: ✅ Production Ready
**Last Updated**: December 2025
