'use client';

import { useState, useEffect } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    status: number;
    role_id?: number | null;
    role?: {
        id: number;
        name: string;
    } | null;
    created_at: Date;
    updated_at: Date;
}

interface Role {
    id: number;
    name: string;
    status: number;
}

interface PaginationMeta {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    meta: PaginationMeta;
}

export const useMasterData = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [userPage, setUserPage] = useState(1);
    const [rolePage, setRolePage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [usersMeta, setUsersMeta] = useState<PaginationMeta | null>(null);
    const [rolesMeta, setRolesMeta] = useState<PaginationMeta | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, [userPage, pageSize]);

    useEffect(() => {
        fetchRoles();
    }, [rolePage, pageSize]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const offset = (userPage - 1) * pageSize;
            const res = await fetch(
                `/api/master-data/users?page=${userPage}&pageSize=${pageSize}&offset=${offset}`
            );
            if (!res.ok) throw new Error('Failed to fetch users');
            const data: PaginatedResponse<User> = await res.json();
            setUsers(data.data);
            setUsersMeta(data.meta);
            setError(null);
        } catch (err: any) {
            setError(err.message);
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            setLoading(true);
            const offset = (rolePage - 1) * pageSize;
            const res = await fetch(
                `/api/master-data/roles?page=${rolePage}&pageSize=${pageSize}&offset=${offset}`
            );
            if (!res.ok) throw new Error('Failed to fetch roles');
            const data: PaginatedResponse<Role> = await res.json();
            setRoles(data.data);
            setRolesMeta(data.meta);
            setError(null);
        } catch (err: any) {
            setError(err.message);
            console.error('Error fetching roles:', err);
        } finally {
            setLoading(false);
        }
    };

    const refetchUsers = async () => {
        try {
            setLoading(true);
            const offset = (userPage - 1) * pageSize;
            const res = await fetch(
                `/api/master-data/users?page=${userPage}&pageSize=${pageSize}&offset=${offset}`
            );
            if (!res.ok) throw new Error('Failed to fetch users');
            const data: PaginatedResponse<User> = await res.json();
            setUsers(data.data);
            setUsersMeta(data.meta);
            setError(null);
        } catch (err: any) {
            setError(err.message);
            console.error('Error refetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const refetchRoles = async () => {
        try {
            setLoading(true);
            const offset = (rolePage - 1) * pageSize;
            const res = await fetch(
                `/api/master-data/roles?page=${rolePage}&pageSize=${pageSize}&offset=${offset}`
            );
            if (!res.ok) throw new Error('Failed to fetch roles');
            const data: PaginatedResponse<Role> = await res.json();
            setRoles(data.data);
            setRolesMeta(data.meta);
            setError(null);
        } catch (err: any) {
            setError(err.message);
            console.error('Error refetching roles:', err);
        } finally {
            setLoading(false);
        }
    };

    return {
        users,
        roles,
        loading,
        error,
        userPage,
        setUserPage,
        rolePage,
        setRolePage,
        pageSize,
        setPageSize,
        usersMeta,
        rolesMeta,
        refetchUsers,
        refetchRoles,
    };
};