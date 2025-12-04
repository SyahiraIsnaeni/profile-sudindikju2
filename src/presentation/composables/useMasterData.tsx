'use client';

import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  status: number;
}

interface Role {
  id: number;
  name: string;
  status: number;
}

export const useMasterData = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const usersRes = await fetch('/api/master-data/users');
      if (!usersRes.ok) throw new Error('Failed to fetch users');
      const usersData = await usersRes.json();
      setUsers(usersData.data);

      const rolesRes = await fetch('/api/master-data/roles');
      if (!rolesRes.ok) throw new Error('Failed to fetch roles');
      const rolesData = await rolesRes.json();
      setRoles(rolesData.data);

      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching master data:', err);
    } finally {
      setLoading(false);
    }
  };

  return { users, roles, loading, error };
};