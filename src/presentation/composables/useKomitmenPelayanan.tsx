'use client';

import { useState, useEffect } from 'react';

interface Commitment {
  id: number;
  name: string;
  description?: string | null;
  file?: string | null;
  icon?: string | null;
  sort_order?: number | null;
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

export const useKomitmenPelayanan = () => {
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCommitments();
  }, [page, pageSize]);

  const fetchCommitments = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/dashboard/commitments?page=${page}&pageSize=${pageSize}`
      );
      if (!res.ok) throw new Error('Gagal mengambil data komitmen pelayanan');
      const data: PaginatedResponse<Commitment> = await res.json();
      setCommitments(data.data);
      setMeta(data.meta);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching commitments:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetchCommitments = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/dashboard/commitments?page=${page}&pageSize=${pageSize}`
      );
      if (!res.ok) throw new Error('Gagal mengambil data komitmen pelayanan');
      const data: PaginatedResponse<Commitment> = await res.json();
      setCommitments(data.data);
      setMeta(data.meta);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error refetching commitments:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    commitments,
    loading,
    error,
    page,
    setPage,
    pageSize,
    setPageSize,
    meta,
    refetchCommitments,
  };
};
