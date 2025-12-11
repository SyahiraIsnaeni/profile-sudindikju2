'use client';

import { useState, useEffect } from 'react';

interface Layanan {
  id: number;
  nama: string;
  deskripsi?: string | null;
  file?: string | null;
  icon?: string | null;
  urutan?: number | null;
  status: number;
  created_at: Date;
  updated_at: Date;
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

export const useLayananPublik = () => {
  const [layanans, setLayanans] = useState<Layanan[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLayanans();
  }, [page, pageSize]);

  const fetchLayanans = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/dashboard/layanans?page=${page}&pageSize=${pageSize}`
      );
      if (!res.ok) throw new Error('Gagal mengambil data layanan publik');
      const data: PaginatedResponse<Layanan> = await res.json();
      setLayanans(data.data);
      setMeta(data.meta);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching layanans:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetchLayanans = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/dashboard/layanans?page=${page}&pageSize=${pageSize}`
      );
      if (!res.ok) throw new Error('Gagal mengambil data layanan publik');
      const data: PaginatedResponse<Layanan> = await res.json();
      setLayanans(data.data);
      setMeta(data.meta);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error refetching layanans:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    layanans,
    loading,
    error,
    page,
    setPage,
    pageSize,
    setPageSize,
    meta,
    refetchLayanans,
  };
};
