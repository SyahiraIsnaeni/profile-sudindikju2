'use client';

import { useState, useEffect } from 'react';

interface Artikel {
  id: number;
  judul: string;
  deskripsi?: string | null;
  kategori?: string | null;
  gambar?: string | null;
  file?: string | null;
  penulis?: string | null;
  tanggal: Date;
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

export const useArtikel = () => {
  const [artikels, setArtikels] = useState<Artikel[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArtikels();
  }, [page, pageSize]);

  const fetchArtikels = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/dashboard/artikels?page=${page}&pageSize=${pageSize}`
      );
      if (!res.ok) throw new Error('Gagal mengambil data artikel');
      const data: PaginatedResponse<Artikel> = await res.json();
      setArtikels(data.data);
      setMeta(data.meta);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching artikels:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetchArtikels = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/dashboard/artikels?page=${page}&pageSize=${pageSize}`
      );
      if (!res.ok) throw new Error('Gagal mengambil data artikel');
      const data: PaginatedResponse<Artikel> = await res.json();
      setArtikels(data.data);
      setMeta(data.meta);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error refetching artikels:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    artikels,
    loading,
    error,
    page,
    setPage,
    pageSize,
    setPageSize,
    meta,
    refetchArtikels,
  };
};
