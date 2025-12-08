import { useState, useCallback, useEffect } from 'react';

interface Permission {
  id: number;
  name: string;
  detail: string;
}

interface GroupedPermissions {
  [key: string]: Permission[];
}

interface RoleFormData {
  name: string;
  status: number;
  permission_ids: number[];
}

export const useRoleManagement = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [groupedPermissions, setGroupedPermissions] =
    useState<GroupedPermissions>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch permissions
  const fetchPermissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        '/api/master-data/permissions?format=flat'
      );
      if (!response.ok) {
        throw new Error('Gagal mengambil data permissions');
      }
      const data = await response.json();
      if (data.success) {
        setPermissions(data.data);
        
        // Group permissions by name
        const grouped: GroupedPermissions = {};
        data.data.forEach((perm: Permission) => {
          if (!grouped[perm.name]) {
            grouped[perm.name] = [];
          }
          grouped[perm.name].push(perm);
        });
        setGroupedPermissions(grouped);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create role
  const createRole = useCallback(async (formData: RoleFormData) => {
    try {
      const response = await fetch('/api/master-data/roles/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal membuat role');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      throw err;
    }
  }, []);

  // Update role
  const updateRole = useCallback(
    async (roleId: number, formData: RoleFormData) => {
      try {
        const response = await fetch(
          `/api/master-data/roles/${roleId}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Gagal update role');
        }

        const data = await response.json();
        return data;
      } catch (err: any) {
        throw err;
      }
    },
    []
  );

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  return {
    permissions,
    groupedPermissions,
    loading,
    error,
    fetchPermissions,
    createRole,
    updateRole,
  };
};